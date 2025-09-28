package com.reviewx.repository;

import com.reviewx.entity.User;
import com.reviewx.entity.Withdrawal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {

    /**
     * 사용자별 출금 내역 조회 (페이징)
     */
    Page<Withdrawal> findByUserOrderByRequestedAtDesc(User user, Pageable pageable);

    /**
     * 사용자별 특정 상태의 출금 내역 조회
     */
    List<Withdrawal> findByUserAndStatus(User user, Withdrawal.WithdrawalStatus status);

    /**
     * 특정 상태의 출금 내역 조회 (관리자용)
     */
    Page<Withdrawal> findByStatusOrderByRequestedAtDesc(Withdrawal.WithdrawalStatus status, Pageable pageable);

    /**
     * 모든 출금 내역 조회 (관리자용)
     */
    Page<Withdrawal> findAllByOrderByRequestedAtDesc(Pageable pageable);

    /**
     * 기간별 출금 내역 조회
     */
    @Query("SELECT w FROM Withdrawal w WHERE w.requestedAt >= :startDate AND w.requestedAt < :endDate ORDER BY w.requestedAt DESC")
    List<Withdrawal> findByRequestedAtBetween(@Param("startDate") LocalDateTime startDate,
                                            @Param("endDate") LocalDateTime endDate);

    /**
     * 사용자의 처리 대기 중인 출금 내역 조회
     */
    @Query("SELECT w FROM Withdrawal w WHERE w.user = :user AND w.status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED') ORDER BY w.requestedAt DESC")
    List<Withdrawal> findPendingWithdrawalsByUser(@Param("user") User user);

    /**
     * 자동 처리 가능한 출금 내역 조회
     */
    @Query("SELECT w FROM Withdrawal w WHERE w.autoProcessEligible = true AND w.status = 'APPROVED' AND w.scheduledProcessDate <= :currentTime")
    List<Withdrawal> findAutoProcessEligibleWithdrawals(@Param("currentTime") LocalDateTime currentTime);

    /**
     * 출금 번호로 조회
     */
    Optional<Withdrawal> findByWithdrawalNumber(String withdrawalNumber);

    /**
     * 사용자별 출금 통계 - 총 출금 금액
     */
    @Query("SELECT COALESCE(SUM(w.withdrawalAmount), 0) FROM Withdrawal w WHERE w.user = :user AND w.status = 'COMPLETED'")
    Integer getTotalWithdrawnAmountByUser(@Param("user") User user);

    /**
     * 사용자별 출금 통계 - 출금 횟수
     */
    @Query("SELECT COUNT(w) FROM Withdrawal w WHERE w.user = :user AND w.status = 'COMPLETED'")
    Long getWithdrawalCountByUser(@Param("user") User user);

    /**
     * 사용자별 대기 중인 출금 총액
     */
    @Query("SELECT COALESCE(SUM(w.requestedAmount), 0) FROM Withdrawal w WHERE w.user = :user AND w.status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'PROCESSING')")
    Integer getPendingWithdrawalAmountByUser(@Param("user") User user);

    /**
     * 관리자용 - 상태별 출금 통계
     */
    @Query("SELECT w.status, COUNT(w), COALESCE(SUM(w.requestedAmount), 0) FROM Withdrawal w GROUP BY w.status")
    List<Object[]> getWithdrawalStatsByStatus();

    /**
     * 관리자용 - 기간별 출금 통계
     */
    @Query("SELECT DATE(w.requestedAt), COUNT(w), COALESCE(SUM(w.requestedAmount), 0), COALESCE(SUM(w.withdrawalAmount), 0) " +
           "FROM Withdrawal w WHERE w.requestedAt >= :startDate AND w.requestedAt < :endDate " +
           "GROUP BY DATE(w.requestedAt) ORDER BY DATE(w.requestedAt) DESC")
    List<Object[]> getWithdrawalStatsByDate(@Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);

    /**
     * 처리 지연 출금 내역 조회 (3일 이상 지연)
     */
    @Query("SELECT w FROM Withdrawal w WHERE w.status IN ('PENDING', 'UNDER_REVIEW') " +
           "AND w.requestedAt <= :delayThreshold ORDER BY w.requestedAt ASC")
    List<Withdrawal> findDelayedWithdrawals(@Param("delayThreshold") LocalDateTime delayThreshold);

    /**
     * 복합 검색 쿼리 (관리자용)
     */
    @Query("SELECT w FROM Withdrawal w WHERE " +
           "(:status IS NULL OR w.status = :status) AND " +
           "(:startDate IS NULL OR w.requestedAt >= :startDate) AND " +
           "(:endDate IS NULL OR w.requestedAt < :endDate) AND " +
           "(:minAmount IS NULL OR w.requestedAmount >= :minAmount) AND " +
           "(:maxAmount IS NULL OR w.requestedAmount <= :maxAmount) AND " +
           "(:keyword IS NULL OR LOWER(w.withdrawalNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(w.accountNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(w.accountHolder) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY w.requestedAt DESC")
    Page<Withdrawal> findWithdrawalsWithFilters(@Param("status") Withdrawal.WithdrawalStatus status,
                                               @Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate,
                                               @Param("minAmount") Integer minAmount,
                                               @Param("maxAmount") Integer maxAmount,
                                               @Param("keyword") String keyword,
                                               Pageable pageable);

    /**
     * 사용자별 복합 검색 쿼리
     */
    @Query("SELECT w FROM Withdrawal w WHERE w.user = :user AND " +
           "(:status IS NULL OR w.status = :status) AND " +
           "(:startDate IS NULL OR w.requestedAt >= :startDate) AND " +
           "(:endDate IS NULL OR w.requestedAt < :endDate) AND " +
           "(:keyword IS NULL OR LOWER(w.withdrawalNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY w.requestedAt DESC")
    Page<Withdrawal> findUserWithdrawalsWithFilters(@Param("user") User user,
                                                   @Param("status") Withdrawal.WithdrawalStatus status,
                                                   @Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate,
                                                   @Param("keyword") String keyword,
                                                   Pageable pageable);

    /**
     * 계좌 정보로 출금 내역 검색 (중복 계좌 체크용)
     */
    List<Withdrawal> findByAccountNumberAndAccountHolder(String accountNumber, String accountHolder);

    /**
     * 최근 N일간 사용자별 출금 횟수 조회 (일일 출금 제한 체크용)
     */
    @Query("SELECT COUNT(w) FROM Withdrawal w WHERE w.user = :user AND w.requestedAt >= :fromDate")
    Long countRecentWithdrawalsByUser(@Param("user") User user, @Param("fromDate") LocalDateTime fromDate);
}