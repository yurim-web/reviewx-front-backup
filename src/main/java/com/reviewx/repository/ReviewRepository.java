package com.reviewx.repository;

import com.reviewx.entity.Campaign;
import com.reviewx.entity.Review;
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
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 체험단 캠페인 리뷰 전용 조회 메서드들

    // 특정 캠페인의 리뷰 목록
    @Query("SELECT r FROM Review r WHERE r.campaign = :campaign " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt DESC")
    List<Review> findByCampaign(@Param("campaign") Campaign campaign);

    // 특정 캠페인의 특정 상태 리뷰 목록
    @Query("SELECT r FROM Review r WHERE r.campaign = :campaign " +
           "AND r.status = :status " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt DESC")
    List<Review> findByCampaignAndStatus(
            @Param("campaign") Campaign campaign, 
            @Param("status") Review.ReviewStatus status);

    // 특정 리뷰어의 체험단 리뷰 목록
    @Query("SELECT r FROM Review r WHERE r.reviewer = :reviewer " +
           "AND r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.createdAt DESC")
    Page<Review> findExperienceReviewsByReviewer(@Param("reviewer") User reviewer, Pageable pageable);

    // 특정 파트너의 체험단 리뷰 목록 (검토 대상)
    @Query("SELECT r FROM Review r WHERE r.partner = :partner " +
           "AND r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt DESC")
    Page<Review> findExperienceReviewsByPartner(@Param("partner") User partner, Pageable pageable);

    // 특정 리뷰어가 특정 캠페인에 작성한 리뷰
    @Query("SELECT r FROM Review r WHERE r.campaign = :campaign " +
           "AND r.reviewer = :reviewer " +
           "AND r.deletedAt IS NULL")
    Optional<Review> findByCampaignAndReviewer(
            @Param("campaign") Campaign campaign, 
            @Param("reviewer") User reviewer);

    // 파트너 검토 대기 중인 체험단 리뷰 목록
    @Query("SELECT r FROM Review r WHERE r.partner = :partner " +
           "AND r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.status = 'SUBMITTED' " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt ASC")
    List<Review> findPendingExperienceReviewsByPartner(@Param("partner") User partner);

    // 관리자 검토 대기 중인 체험단 리뷰 목록
    @Query("SELECT r FROM Review r WHERE r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.status = 'ADMIN_REVIEW' " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt ASC")
    List<Review> findPendingExperienceReviewsForAdmin();

    // 승인된 체험단 리뷰 목록 (포인트 지급 대상)
    @Query("SELECT r FROM Review r WHERE r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.status = 'APPROVED' " +
           "AND r.pointPaid = false " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.partnerReviewedAt ASC")
    List<Review> findApprovedExperienceReviewsForPayment();

    // 특정 캠페인의 리뷰 통계
    @Query("SELECT COUNT(r) FROM Review r WHERE r.campaign = :campaign " +
           "AND r.deletedAt IS NULL")
    Long countReviewsByCampaign(@Param("campaign") Campaign campaign);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.campaign = :campaign " +
           "AND r.status = :status " +
           "AND r.deletedAt IS NULL")
    Long countReviewsByCampaignAndStatus(
            @Param("campaign") Campaign campaign, 
            @Param("status") Review.ReviewStatus status);

    // 파트너별 체험단 리뷰 통계
    @Query("SELECT COUNT(r) FROM Review r WHERE r.partner = :partner " +
           "AND r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.deletedAt IS NULL")
    Long countExperienceReviewsByPartner(@Param("partner") User partner);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.partner = :partner " +
           "AND r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.status = :status " +
           "AND r.deletedAt IS NULL")
    Long countExperienceReviewsByPartnerAndStatus(
            @Param("partner") User partner, 
            @Param("status") Review.ReviewStatus status);

    // 리뷰어별 체험단 리뷰 통계
    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewer = :reviewer " +
           "AND r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.deletedAt IS NULL")
    Long countExperienceReviewsByReviewer(@Param("reviewer") User reviewer);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewer = :reviewer " +
           "AND r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.status = :status " +
           "AND r.deletedAt IS NULL")
    Long countExperienceReviewsByReviewerAndStatus(
            @Param("reviewer") User reviewer, 
            @Param("status") Review.ReviewStatus status);

    // 특정 날짜 범위의 체험단 리뷰 목록
    @Query("SELECT r FROM Review r WHERE r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.submittedAt BETWEEN :startDate AND :endDate " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt DESC")
    List<Review> findExperienceReviewsByDateRange(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);

    // 방문 확인이 필요한 체험단 리뷰
    @Query("SELECT r FROM Review r WHERE r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.visitConfirmed = false " +
           "AND r.status IN ('SUBMITTED', 'PARTNER_APPROVED') " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt ASC")
    List<Review> findExperienceReviewsNeedingVisitConfirmation();

    // 품질 점수별 체험단 리뷰 조회
    @Query("SELECT r FROM Review r WHERE r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.qualityScore >= :minScore " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.qualityScore DESC, r.submittedAt DESC")
    List<Review> findHighQualityExperienceReviews(@Param("minScore") Double minScore);

    // 장기간 미검토 체험단 리뷰 (자동 에스컬레이션용)
    @Query("SELECT r FROM Review r WHERE r.campaign.campaignType = 'EXPERIENCE' " +
           "AND r.status = 'SUBMITTED' " +
           "AND r.submittedAt < :thresholdDate " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt ASC")
    List<Review> findOverdueExperienceReviews(@Param("thresholdDate") LocalDateTime thresholdDate);

    // === 구매평 리뷰 전용 조회 메서드들 ===

    // 특정 리뷰어의 구매평 리뷰 목록
    @Query("SELECT r FROM Review r WHERE r.reviewer = :reviewer " +
           "AND r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.createdAt DESC")
    Page<Review> findPurchaseReviewsByReviewer(@Param("reviewer") User reviewer, Pageable pageable);

    // 특정 파트너의 구매평 리뷰 목록 (검토 대상)
    @Query("SELECT r FROM Review r WHERE r.partner = :partner " +
           "AND r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt DESC")
    Page<Review> findPurchaseReviewsByPartner(@Param("partner") User partner, Pageable pageable);

    // 파트너 검토 대기 중인 구매평 리뷰 목록
    @Query("SELECT r FROM Review r WHERE r.partner = :partner " +
           "AND r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.status = 'SUBMITTED' " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt ASC")
    List<Review> findPendingPurchaseReviewsByPartner(@Param("partner") User partner);

    // 관리자 검토 대기 중인 구매평 리뷰 목록
    @Query("SELECT r FROM Review r WHERE r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.status = 'ADMIN_REVIEW' " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt ASC")
    List<Review> findPendingPurchaseReviewsForAdmin();

    // 승인된 구매평 리뷰 목록 (포인트 지급 대상)
    @Query("SELECT r FROM Review r WHERE r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.status = 'APPROVED' " +
           "AND r.pointPaid = false " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.partnerReviewedAt ASC")
    List<Review> findApprovedPurchaseReviewsForPayment();

    // 특정 리뷰어가 특정 구매평 캠페인에 작성한 리뷰
    @Query("SELECT r FROM Review r WHERE r.campaign = :campaign " +
           "AND r.reviewer = :reviewer " +
           "AND r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.deletedAt IS NULL")
    Optional<Review> findPurchaseReviewByCampaignAndReviewer(
            @Param("campaign") Campaign campaign,
            @Param("reviewer") User reviewer);

    // 파트너별 구매평 리뷰 통계
    @Query("SELECT COUNT(r) FROM Review r WHERE r.partner = :partner " +
           "AND r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.deletedAt IS NULL")
    Long countPurchaseReviewsByPartner(@Param("partner") User partner);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.partner = :partner " +
           "AND r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.status = :status " +
           "AND r.deletedAt IS NULL")
    Long countPurchaseReviewsByPartnerAndStatus(
            @Param("partner") User partner,
            @Param("status") Review.ReviewStatus status);

    // 리뷰어별 구매평 리뷰 통계
    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewer = :reviewer " +
           "AND r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.deletedAt IS NULL")
    Long countPurchaseReviewsByReviewer(@Param("reviewer") User reviewer);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewer = :reviewer " +
           "AND r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.status = :status " +
           "AND r.deletedAt IS NULL")
    Long countPurchaseReviewsByReviewerAndStatus(
            @Param("reviewer") User reviewer,
            @Param("status") Review.ReviewStatus status);

    // 구매 확인이 필요한 구매평 리뷰
    @Query("SELECT r FROM Review r WHERE r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.purchaseConfirmed = false " +
           "AND r.status IN ('SUBMITTED', 'PARTNER_APPROVED') " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt ASC")
    List<Review> findPurchaseReviewsNeedingPurchaseConfirmation();

    // 특정 날짜 범위의 구매평 리뷰 목록
    @Query("SELECT r FROM Review r WHERE r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.submittedAt BETWEEN :startDate AND :endDate " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt DESC")
    List<Review> findPurchaseReviewsByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // 장기간 미검토 구매평 리뷰 (자동 에스컬레이션용)
    @Query("SELECT r FROM Review r WHERE r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.status = 'SUBMITTED' " +
           "AND r.submittedAt < :thresholdDate " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt ASC")
    List<Review> findOverduePurchaseReviews(@Param("thresholdDate") LocalDateTime thresholdDate);

    // 특정 캠페인의 구매평 리뷰 목록 (파트너가 본인 캠페인 조회용)
    @Query("SELECT r FROM Review r WHERE r.campaign = :campaign " +
           "AND r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.submittedAt DESC")
    List<Review> findPurchaseReviewsByCampaign(@Param("campaign") Campaign campaign);

    // 품질 점수별 구매평 리뷰 조회
    @Query("SELECT r FROM Review r WHERE r.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND r.qualityScore >= :minScore " +
           "AND r.deletedAt IS NULL " +
           "ORDER BY r.qualityScore DESC, r.submittedAt DESC")
    List<Review> findHighQualityPurchaseReviews(@Param("minScore") Double minScore);
}