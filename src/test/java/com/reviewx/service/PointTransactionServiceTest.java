package com.reviewx.service;

import com.reviewx.entity.*;
import com.reviewx.exception.PointTransactionException;
import com.reviewx.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("포인트 거래 서비스 테스트")
class PointTransactionServiceTest {

    @Mock
    private PointTransactionRepository pointTransactionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private PointTransactionService pointTransactionService;

    private User reviewer;
    private User partner;
    private Campaign campaign;
    private Review review;

    @BeforeEach
    void setUp() {
        // 테스트 사용자 생성 (리뷰어)
        reviewer = new User();
        reviewer.setId(1L);
        reviewer.setEmail("reviewer@test.com");
        reviewer.setName("테스트 리뷰어");
        reviewer.setPointBalance(10000);

        // 테스트 사용자 생성 (파트너)
        partner = new User();
        partner.setId(2L);
        partner.setEmail("partner@test.com");
        partner.setName("테스트 파트너");
        partner.setPointBalance(50000);

        // 테스트 캠페인 생성
        campaign = new Campaign();
        campaign.setId(1L);
        campaign.setTitle("테스트 캠페인");
        campaign.setPartner(partner);

        // 테스트 리뷰 생성
        review = new Review();
        review.setId(1L);
        review.setTitle("테스트 리뷰");
        review.setCampaign(campaign);
        review.setReviewer(reviewer);
    }

    @Test
    @DisplayName("포인트 충전 성공 테스트")
    void chargePoints_Success() {
        // given
        Integer amount = 10000;
        PointTransaction.PaymentMethod method = PointTransaction.PaymentMethod.CREDIT_CARD;
        String paymentKey = "test_payment_key";
        String orderId = "test_order_id";

        given(userRepository.findById(partner.getId())).willReturn(Optional.of(partner));
        given(pointTransactionRepository.findByPaymentKeyOrOrderId(paymentKey, orderId))
            .willReturn(Optional.empty());

        PointTransaction expectedTransaction = PointTransaction.charge(partner, amount, method, paymentKey, orderId);
        given(pointTransactionRepository.save(any(PointTransaction.class))).willReturn(expectedTransaction);
        given(userRepository.save(any(User.class))).willReturn(partner);

        // when
        PointTransaction result = pointTransactionService.chargePoints(
            partner.getId(), amount, method, paymentKey, orderId);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getTransactionType()).isEqualTo(PointTransaction.TransactionType.CHARGE);
        assertThat(result.getAmount()).isEqualTo(amount);
        assertThat(partner.getPointBalance()).isEqualTo(60000); // 50000 + 10000

        verify(userRepository).save(partner);
        verify(pointTransactionRepository).save(any(PointTransaction.class));
    }

    @Test
    @DisplayName("리뷰 보상 지급 성공 테스트")
    void payReviewReward_Success() {
        // given
        Integer rewardAmount = 5000;

        given(userRepository.findById(reviewer.getId())).willReturn(Optional.of(reviewer));
        given(reviewRepository.findById(review.getId())).willReturn(Optional.of(review));
        given(pointTransactionRepository.findByReviewId(review.getId())).willReturn(Optional.empty());

        PointTransaction expectedTransaction = PointTransaction.reviewReward(reviewer, review, rewardAmount);
        given(pointTransactionRepository.save(any(PointTransaction.class))).willReturn(expectedTransaction);
        given(userRepository.save(any(User.class))).willReturn(reviewer);

        // when
        PointTransaction result = pointTransactionService.payReviewReward(
            reviewer.getId(), review.getId(), rewardAmount);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getTransactionType()).isEqualTo(PointTransaction.TransactionType.REVIEW_REWARD);
        assertThat(result.getAmount()).isEqualTo(rewardAmount);
        assertThat(reviewer.getPointBalance()).isEqualTo(15000); // 10000 + 5000

        verify(userRepository).save(reviewer);
        verify(pointTransactionRepository).save(any(PointTransaction.class));
    }

    @Test
    @DisplayName("출금 신청 성공 테스트")
    void requestWithdrawal_Success() {
        // given
        Integer withdrawalAmount = 8000;

        given(userRepository.findById(reviewer.getId())).willReturn(Optional.of(reviewer));

        PointTransaction expectedTransaction = PointTransaction.withdrawal(reviewer, withdrawalAmount);
        expectedTransaction.setStatus(PointTransaction.TransactionStatus.PENDING);
        given(pointTransactionRepository.save(any(PointTransaction.class))).willReturn(expectedTransaction);
        given(userRepository.save(any(User.class))).willReturn(reviewer);

        // when
        PointTransaction result = pointTransactionService.requestWithdrawal(
            reviewer.getId(), withdrawalAmount);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getTransactionType()).isEqualTo(PointTransaction.TransactionType.WITHDRAWAL);
        assertThat(result.getAmount()).isEqualTo(withdrawalAmount);
        assertThat(result.getStatus()).isEqualTo(PointTransaction.TransactionStatus.PENDING);
        assertThat(reviewer.getPointBalance()).isEqualTo(2000); // 10000 - 8000
        assertThat(reviewer.getPendingWithdrawal()).isEqualTo(8000);

        verify(userRepository).save(reviewer);
        verify(pointTransactionRepository).save(any(PointTransaction.class));
    }

    @Test
    @DisplayName("잔액 부족 시 출금 신청 실패 테스트")
    void requestWithdrawal_InsufficientBalance() {
        // given
        Integer withdrawalAmount = 15000; // 잔액보다 많은 금액

        given(userRepository.findById(reviewer.getId())).willReturn(Optional.of(reviewer));

        // when & then
        assertThatThrownBy(() ->
            pointTransactionService.requestWithdrawal(reviewer.getId(), withdrawalAmount))
            .isInstanceOf(PointTransactionException.class);

        // 원래 잔액 유지
        assertThat(reviewer.getPointBalance()).isEqualTo(10000);
        assertThat(reviewer.getPendingWithdrawal()).isEqualTo(0);

        verify(userRepository, never()).save(any(User.class));
        verify(pointTransactionRepository, never()).save(any(PointTransaction.class));
    }

    @Test
    @DisplayName("중복 결제 시도 시 실패 테스트")
    void chargePoints_DuplicatePayment() {
        // given
        Integer amount = 10000;
        PointTransaction.PaymentMethod method = PointTransaction.PaymentMethod.CREDIT_CARD;
        String paymentKey = "duplicate_payment_key";
        String orderId = "duplicate_order_id";

        given(userRepository.findById(partner.getId())).willReturn(Optional.of(partner));

        PointTransaction existingTransaction = new PointTransaction();
        given(pointTransactionRepository.findByPaymentKeyOrOrderId(paymentKey, orderId))
            .willReturn(Optional.of(existingTransaction));

        // when & then
        assertThatThrownBy(() ->
            pointTransactionService.chargePoints(partner.getId(), amount, method, paymentKey, orderId))
            .isInstanceOf(PointTransactionException.class);

        verify(userRepository, never()).save(any(User.class));
        verify(pointTransactionRepository, never()).save(any(PointTransaction.class));
    }

    @Test
    @DisplayName("중복 리뷰 보상 시도 시 실패 테스트")
    void payReviewReward_DuplicateReward() {
        // given
        Integer rewardAmount = 5000;

        given(userRepository.findById(reviewer.getId())).willReturn(Optional.of(reviewer));
        given(reviewRepository.findById(review.getId())).willReturn(Optional.of(review));

        PointTransaction existingReward = new PointTransaction();
        given(pointTransactionRepository.findByReviewId(review.getId()))
            .willReturn(Optional.of(existingReward));

        // when & then
        assertThatThrownBy(() ->
            pointTransactionService.payReviewReward(reviewer.getId(), review.getId(), rewardAmount))
            .isInstanceOf(PointTransactionException.class);

        verify(userRepository, never()).save(any(User.class));
        verify(pointTransactionRepository, never()).save(any(PointTransaction.class));
    }
}