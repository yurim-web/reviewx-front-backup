package com.reviewx.service;

import com.reviewx.entity.User;
import com.reviewx.entity.Withdrawal;
import com.reviewx.exception.BusinessException;
import com.reviewx.exception.ErrorCode;
import com.reviewx.repository.UserRepository;
import com.reviewx.repository.WithdrawalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("출금 서비스 테스트")
class WithdrawalServiceTest {

    @Mock
    private WithdrawalRepository withdrawalRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PointTransactionService pointTransactionService;

    @InjectMocks
    private WithdrawalService withdrawalService;

    private User reviewer;

    @BeforeEach
    void setUp() {
        // 테스트 사용자 생성
        reviewer = new User();
        reviewer.setId(1L);
        reviewer.setEmail("reviewer@test.com");
        reviewer.setName("테스트 리뷰어");
        reviewer.setPointBalance(20000);
        reviewer.setBankName("국민은행");
        reviewer.setAccountNumber("123456789");
        reviewer.setAccountHolder("테스트 사용자");
    }

    @Test
    @DisplayName("출금 신청 성공 테스트")
    void requestWithdrawal_Success() {
        // given
        Integer amount = 10000;
        String bankName = "국민은행";
        String accountNumber = "123456789";
        String accountHolder = "테스트 사용자";

        given(userRepository.findById(reviewer.getId())).willReturn(Optional.of(reviewer));
        given(withdrawalRepository.findPendingWithdrawalsByUser(reviewer))
            .willReturn(Collections.emptyList()); // 대기 중인 출금 없음
        given(withdrawalRepository.countRecentWithdrawalsByUser(eq(reviewer), any(LocalDateTime.class)))
            .willReturn(0L); // 오늘 출금 횟수 0

        Withdrawal expectedWithdrawal = new Withdrawal(reviewer, amount);
        given(withdrawalRepository.save(any(Withdrawal.class))).willReturn(expectedWithdrawal);
        given(userRepository.save(any(User.class))).willReturn(reviewer);

        // when
        Withdrawal result = withdrawalService.requestWithdrawal(
            reviewer.getId(), amount, bankName, accountNumber, accountHolder);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getRequestedAmount()).isEqualTo(amount);
        assertThat(result.getStatus()).isEqualTo(Withdrawal.WithdrawalStatus.PENDING);

        verify(withdrawalRepository).save(any(Withdrawal.class));
        verify(pointTransactionService).requestWithdrawal(reviewer.getId(), amount);
    }

    @Test
    @DisplayName("최소 출금 금액 미달 시 실패 테스트")
    void requestWithdrawal_BelowMinimumAmount() {
        // given
        Integer amount = 3000; // 최소 금액 5000보다 작음
        String bankName = "국민은행";
        String accountNumber = "123456789";
        String accountHolder = "테스트 사용자";

        given(userRepository.findById(reviewer.getId())).willReturn(Optional.of(reviewer));

        // when & then
        assertThatThrownBy(() ->
            withdrawalService.requestWithdrawal(reviewer.getId(), amount, bankName, accountNumber, accountHolder))
            .isInstanceOf(BusinessException.class)
            .hasMessageContaining("최소 출금 금액");

        verify(withdrawalRepository, never()).save(any(Withdrawal.class));
        verify(pointTransactionService, never()).requestWithdrawal(anyLong(), anyInt());
    }

    @Test
    @DisplayName("잔액 부족 시 출금 신청 실패 테스트")
    void requestWithdrawal_InsufficientBalance() {
        // given
        Integer amount = 30000; // 잔액 20000보다 많음
        String bankName = "국민은행";
        String accountNumber = "123456789";
        String accountHolder = "테스트 사용자";

        given(userRepository.findById(reviewer.getId())).willReturn(Optional.of(reviewer));
        given(withdrawalRepository.findPendingWithdrawalsByUser(reviewer))
            .willReturn(Collections.emptyList());
        given(withdrawalRepository.countRecentWithdrawalsByUser(eq(reviewer), any(LocalDateTime.class)))
            .willReturn(0L);

        // when & then
        assertThatThrownBy(() ->
            withdrawalService.requestWithdrawal(reviewer.getId(), amount, bankName, accountNumber, accountHolder))
            .isInstanceOf(BusinessException.class)
            .hasMessageContaining("보유 포인트가 부족");

        verify(withdrawalRepository, never()).save(any(Withdrawal.class));
        verify(pointTransactionService, never()).requestWithdrawal(anyLong(), anyInt());
    }

    @Test
    @DisplayName("이미 처리 중인 출금이 있을 때 실패 테스트")
    void requestWithdrawal_PendingWithdrawalExists() {
        // given
        Integer amount = 10000;
        String bankName = "국민은행";
        String accountNumber = "123456789";
        String accountHolder = "테스트 사용자";

        given(userRepository.findById(reviewer.getId())).willReturn(Optional.of(reviewer));

        // 이미 처리 중인 출금이 있음
        Withdrawal pendingWithdrawal = new Withdrawal(reviewer, 5000);
        given(withdrawalRepository.findPendingWithdrawalsByUser(reviewer))
            .willReturn(Collections.singletonList(pendingWithdrawal));

        // when & then
        assertThatThrownBy(() ->
            withdrawalService.requestWithdrawal(reviewer.getId(), amount, bankName, accountNumber, accountHolder))
            .isInstanceOf(BusinessException.class)
            .hasMessageContaining("처리 중인 출금 신청");

        verify(withdrawalRepository, never()).save(any(Withdrawal.class));
        verify(pointTransactionService, never()).requestWithdrawal(anyLong(), anyInt());
    }

    @Test
    @DisplayName("일일 출금 한도 초과 시 실패 테스트")
    void requestWithdrawal_DailyLimitExceeded() {
        // given
        Integer amount = 10000;
        String bankName = "국민은행";
        String accountNumber = "123456789";
        String accountHolder = "테스트 사용자";

        given(userRepository.findById(reviewer.getId())).willReturn(Optional.of(reviewer));
        given(withdrawalRepository.findPendingWithdrawalsByUser(reviewer))
            .willReturn(Collections.emptyList());
        given(withdrawalRepository.countRecentWithdrawalsByUser(eq(reviewer), any(LocalDateTime.class)))
            .willReturn(3L); // 일일 한도 3회 초과

        // when & then
        assertThatThrownBy(() ->
            withdrawalService.requestWithdrawal(reviewer.getId(), amount, bankName, accountNumber, accountHolder))
            .isInstanceOf(BusinessException.class)
            .hasMessageContaining("일일 출금 신청 한도");

        verify(withdrawalRepository, never()).save(any(Withdrawal.class));
        verify(pointTransactionService, never()).requestWithdrawal(anyLong(), anyInt());
    }

    @Test
    @DisplayName("출금 취소 성공 테스트")
    void cancelWithdrawal_Success() {
        // given
        Withdrawal withdrawal = new Withdrawal(reviewer, 10000);
        withdrawal.setId(1L);
        withdrawal.setStatus(Withdrawal.WithdrawalStatus.PENDING);

        given(withdrawalRepository.findById(1L)).willReturn(Optional.of(withdrawal));
        given(withdrawalRepository.save(any(Withdrawal.class))).willReturn(withdrawal);

        // when
        Withdrawal result = withdrawalService.cancelWithdrawal(1L, reviewer.getId());

        // then
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(Withdrawal.WithdrawalStatus.CANCELLED);

        verify(withdrawalRepository).save(withdrawal);
        verify(pointTransactionService).cancelWithdrawal(anyLong(), eq(reviewer.getId()), anyString());
    }

    @Test
    @DisplayName("다른 사용자의 출금 취소 시도 시 실패 테스트")
    void cancelWithdrawal_UnauthorizedUser() {
        // given
        User otherUser = new User();
        otherUser.setId(2L);

        Withdrawal withdrawal = new Withdrawal(reviewer, 10000);
        withdrawal.setId(1L);

        given(withdrawalRepository.findById(1L)).willReturn(Optional.of(withdrawal));

        // when & then
        assertThatThrownBy(() ->
            withdrawalService.cancelWithdrawal(1L, otherUser.getId()))
            .isInstanceOf(BusinessException.class)
            .hasMessageContaining("본인의 출금");

        verify(withdrawalRepository, never()).save(any(Withdrawal.class));
        verify(pointTransactionService, never()).cancelWithdrawal(anyLong(), anyLong(), anyString());
    }

    @Test
    @DisplayName("취소 불가능한 상태의 출금 취소 시도 시 실패 테스트")
    void cancelWithdrawal_NotCancellable() {
        // given
        Withdrawal withdrawal = new Withdrawal(reviewer, 10000);
        withdrawal.setId(1L);
        withdrawal.setStatus(Withdrawal.WithdrawalStatus.COMPLETED); // 완료된 상태

        given(withdrawalRepository.findById(1L)).willReturn(Optional.of(withdrawal));

        // when & then
        assertThatThrownBy(() ->
            withdrawalService.cancelWithdrawal(1L, reviewer.getId()))
            .isInstanceOf(BusinessException.class)
            .hasMessageContaining("취소할 수 없는 상태");

        verify(withdrawalRepository, never()).save(any(Withdrawal.class));
        verify(pointTransactionService, never()).cancelWithdrawal(anyLong(), anyLong(), anyString());
    }
}