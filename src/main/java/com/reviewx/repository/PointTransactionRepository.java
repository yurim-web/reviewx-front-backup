package com.reviewx.repository;

import com.reviewx.entity.PointTransaction;
import com.reviewx.entity.User;
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
public interface PointTransactionRepository extends JpaRepository<PointTransaction, Long> {

    // 사용자별 포인트 거래 내역 조회
    @Query("SELECT pt FROM PointTransaction pt " +
           "WHERE pt.user = :user " +
           "AND pt.status = 'COMPLETED' " +
           "ORDER BY pt.createdAt DESC")
    Page<PointTransaction> findByUser(@Param("user") User user, Pageable pageable);

    // 사용자별 특정 거래 유형 조회
    @Query("SELECT pt FROM PointTransaction pt " +
           "WHERE pt.user = :user " +
           "AND pt.transactionType = :transactionType " +
           "AND pt.status = 'COMPLETED' " +
           "ORDER BY pt.createdAt DESC")
    List<PointTransaction> findByUserAndTransactionType(
        @Param("user") User user, 
        @Param("transactionType") PointTransaction.TransactionType transactionType);

    // 캠페인 관련 거래 조회
    @Query("SELECT pt FROM PointTransaction pt " +
           "WHERE pt.relatedCampaign.id = :campaignId " +
           "AND pt.status = 'COMPLETED' " +
           "ORDER BY pt.createdAt DESC")
    List<PointTransaction> findByCampaignId(@Param("campaignId") Long campaignId);

    // 리뷰 관련 거래 조회
    @Query("SELECT pt FROM PointTransaction pt " +
           "WHERE pt.relatedReview.id = :reviewId " +
           "AND pt.status = 'COMPLETED' " +
           "ORDER BY pt.createdAt DESC")
    Optional<PointTransaction> findByReviewId(@Param("reviewId") Long reviewId);

    // 특정 기간 거래 조회
    @Query("SELECT pt FROM PointTransaction pt " +
           "WHERE pt.user = :user " +
           "AND pt.createdAt >= :startDate " +
           "AND pt.createdAt <= :endDate " +
           "AND pt.status = 'COMPLETED' " +
           "ORDER BY pt.createdAt DESC")
    List<PointTransaction> findByUserAndDateRange(
        @Param("user") User user,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate);

    // 사용자 포인트 잔액 검증
    @Query("SELECT COALESCE(SUM(CASE WHEN pt.transactionType IN " +
           "('CHARGE', 'REVIEW_REWARD', 'CAMPAIGN_REFUND', 'WITHDRAWAL_CANCEL', 'ADMIN_ADJUSTMENT', 'BONUS', 'REFUND') " +
           "THEN pt.amount ELSE -pt.amount END), 0) " +
           "FROM PointTransaction pt " +
           "WHERE pt.user = :user " +
           "AND pt.status = 'COMPLETED'")
    Integer calculateUserPointBalance(@Param("user") User user);

    // 거래 상태별 조회
    @Query("SELECT pt FROM PointTransaction pt " +
           "WHERE pt.status = :status " +
           "ORDER BY pt.createdAt DESC")
    List<PointTransaction> findByStatus(@Param("status") PointTransaction.TransactionStatus status);

    // 결제 관련 거래 조회
    @Query("SELECT pt FROM PointTransaction pt " +
           "WHERE pt.paymentKey = :paymentKey " +
           "OR pt.orderId = :orderId")
    Optional<PointTransaction> findByPaymentKeyOrOrderId(
        @Param("paymentKey") String paymentKey,
        @Param("orderId") String orderId);

    // 관리자별 처리 거래 조회
    @Query("SELECT pt FROM PointTransaction pt " +
           "WHERE pt.processedByAdmin = :admin " +
           "ORDER BY pt.processedAt DESC")
    List<PointTransaction> findByProcessedByAdmin(@Param("admin") User admin);

    // 대기 중인 거래 조회 (타임아웃된 것들)
    @Query("SELECT pt FROM PointTransaction pt " +
           "WHERE pt.status IN ('PENDING', 'PROCESSING') " +
           "AND pt.createdAt < :timeoutDate " +
           "ORDER BY pt.createdAt ASC")
    List<PointTransaction> findTimeoutTransactions(@Param("timeoutDate") LocalDateTime timeoutDate);

    // 특정 참조 ID로 거래 조회
    Optional<PointTransaction> findByReferenceId(String referenceId);

    // 사용자의 최근 거래 조회
    @Query("SELECT pt FROM PointTransaction pt " +
           "WHERE pt.user = :user " +
           "AND pt.status = 'COMPLETED' " +
           "ORDER BY pt.createdAt DESC")
    List<PointTransaction> findRecentTransactionsByUser(@Param("user") User user, Pageable pageable);

    // 일일 거래 통계
    @Query("SELECT DATE(pt.createdAt) as transactionDate, " +
           "pt.transactionType, " +
           "COUNT(pt.id) as transactionCount, " +
           "SUM(pt.amount) as totalAmount " +
           "FROM PointTransaction pt " +
           "WHERE pt.status = 'COMPLETED' " +
           "AND pt.createdAt >= :startDate " +
           "AND pt.createdAt <= :endDate " +
           "GROUP BY DATE(pt.createdAt), pt.transactionType " +
           "ORDER BY transactionDate DESC")
    List<Object[]> findDailyTransactionStats(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate);

    // 사용자의 총 적립/사용 포인트 통계
    @Query("SELECT " +
           "COALESCE(SUM(CASE WHEN pt.transactionType IN " +
           "('CHARGE', 'REVIEW_REWARD', 'CAMPAIGN_REFUND', 'WITHDRAWAL_CANCEL', 'ADMIN_ADJUSTMENT', 'BONUS', 'REFUND') " +
           "THEN pt.amount ELSE 0 END), 0) as totalEarned, " +
           "COALESCE(SUM(CASE WHEN pt.transactionType IN " +
           "('CAMPAIGN_PAYMENT', 'WITHDRAWAL', 'PENALTY') " +
           "THEN pt.amount ELSE 0 END), 0) as totalSpent " +
           "FROM PointTransaction pt " +
           "WHERE pt.user = :user " +
           "AND pt.status = 'COMPLETED'")
    Object[] findUserPointStats(@Param("user") User user);

    // 월별 거래 통계
    @Query("SELECT " +
           "YEAR(pt.createdAt) as year, " +
           "MONTH(pt.createdAt) as month, " +
           "pt.transactionType, " +
           "COUNT(pt.id) as count, " +
           "SUM(pt.amount) as amount " +
           "FROM PointTransaction pt " +
           "WHERE pt.status = 'COMPLETED' " +
           "AND pt.createdAt >= :startDate " +
           "GROUP BY YEAR(pt.createdAt), MONTH(pt.createdAt), pt.transactionType " +
           "ORDER BY year DESC, month DESC")
    List<Object[]> findMonthlyTransactionStats(@Param("startDate") LocalDateTime startDate);
}