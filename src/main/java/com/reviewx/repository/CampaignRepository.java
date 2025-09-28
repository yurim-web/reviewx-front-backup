package com.reviewx.repository;

import com.reviewx.entity.Campaign;
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
public interface CampaignRepository extends JpaRepository<Campaign, Long> {

    // 체험단 캠페인 전용 조회 메서드들
    
    // 활성 체험단 캠페인 목록 (리뷰어용)
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'EXPERIENCE' " +
           "AND c.status = 'RECRUITING' " +
           "AND c.deletedAt IS NULL " +
           "AND c.applicationEndDate > :now " +
           "ORDER BY c.createdAt DESC")
    Page<Campaign> findActiveExperienceCampaigns(@Param("now") LocalDateTime now, Pageable pageable);

    // 특정 파트너의 체험단 캠페인 목록
    @Query("SELECT c FROM Campaign c WHERE c.partner = :partner " +
           "AND c.campaignType = 'EXPERIENCE' " +
           "AND c.deletedAt IS NULL " +
           "ORDER BY c.createdAt DESC")
    Page<Campaign> findExperienceCampaignsByPartner(@Param("partner") User partner, Pageable pageable);

    // 특정 상태의 체험단 캠페인 조회
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'EXPERIENCE' " +
           "AND c.status = :status " +
           "AND c.deletedAt IS NULL " +
           "ORDER BY c.createdAt DESC")
    List<Campaign> findExperienceCampaignsByStatus(@Param("status") Campaign.CampaignStatus status);

    // 파트너와 상태로 체험단 캠페인 조회
    @Query("SELECT c FROM Campaign c WHERE c.partner = :partner " +
           "AND c.campaignType = 'EXPERIENCE' " +
           "AND c.status = :status " +
           "AND c.deletedAt IS NULL " +
           "ORDER BY c.createdAt DESC")
    List<Campaign> findExperienceCampaignsByPartnerAndStatus(
            @Param("partner") User partner, 
            @Param("status") Campaign.CampaignStatus status);

    // 위치 기반 체험단 캠페인 검색 (주소 포함)
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'EXPERIENCE' " +
           "AND c.status = 'RECRUITING' " +
           "AND c.deletedAt IS NULL " +
           "AND c.applicationEndDate > :now " +
           "AND (c.visitAddress LIKE %:location% OR c.shopName LIKE %:location%) " +
           "ORDER BY c.createdAt DESC")
    Page<Campaign> findExperienceCampaignsByLocation(
            @Param("location") String location, 
            @Param("now") LocalDateTime now, 
            Pageable pageable);

    // 포인트 범위로 체험단 캠페인 검색
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'EXPERIENCE' " +
           "AND c.status = 'RECRUITING' " +
           "AND c.deletedAt IS NULL " +
           "AND c.applicationEndDate > :now " +
           "AND c.rewardPoint BETWEEN :minPoint AND :maxPoint " +
           "ORDER BY c.rewardPoint DESC, c.createdAt DESC")
    Page<Campaign> findExperienceCampaignsByPointRange(
            @Param("minPoint") Integer minPoint, 
            @Param("maxPoint") Integer maxPoint, 
            @Param("now") LocalDateTime now, 
            Pageable pageable);

    // 신청 가능한 체험단 캠페인 (모집 인원 미달)
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'EXPERIENCE' " +
           "AND c.status = 'RECRUITING' " +
           "AND c.deletedAt IS NULL " +
           "AND c.applicationEndDate > :now " +
           "AND c.appliedCount < c.recruitCount " +
           "ORDER BY c.applicationEndDate ASC")
    Page<Campaign> findAvailableExperienceCampaigns(@Param("now") LocalDateTime now, Pageable pageable);

    // 마감 임박 체험단 캠페인 (24시간 이내)
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'EXPERIENCE' " +
           "AND c.status = 'RECRUITING' " +
           "AND c.deletedAt IS NULL " +
           "AND c.applicationEndDate BETWEEN :now AND :tomorrow " +
           "AND c.appliedCount < c.recruitCount " +
           "ORDER BY c.applicationEndDate ASC")
    List<Campaign> findExperienceCampaignsEndingSoon(
            @Param("now") LocalDateTime now, 
            @Param("tomorrow") LocalDateTime tomorrow);

    // 체험단 캠페인 상세 조회 (참여자 수 포함)
    @Query("SELECT c FROM Campaign c WHERE c.id = :campaignId " +
           "AND c.campaignType = 'EXPERIENCE' " +
           "AND c.deletedAt IS NULL")
    Optional<Campaign> findExperienceCampaignById(@Param("campaignId") Long campaignId);

    // 파트너의 체험단 캠페인 통계
    @Query("SELECT COUNT(c) FROM Campaign c WHERE c.partner = :partner " +
           "AND c.campaignType = 'EXPERIENCE' " +
           "AND c.deletedAt IS NULL")
    Long countExperienceCampaignsByPartner(@Param("partner") User partner);

    @Query("SELECT COUNT(c) FROM Campaign c WHERE c.partner = :partner " +
           "AND c.campaignType = 'EXPERIENCE' " +
           "AND c.status = :status " +
           "AND c.deletedAt IS NULL")
    Long countExperienceCampaignsByPartnerAndStatus(
            @Param("partner") User partner, 
            @Param("status") Campaign.CampaignStatus status);

    // 리뷰 기간 중인 체험단 캠페인 (자동화를 위한 배치 처리용)
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'EXPERIENCE' " +
           "AND c.status = 'REVIEW_PERIOD' " +
           "AND c.reviewEndDate < :now " +
           "AND c.deletedAt IS NULL")
    List<Campaign> findExpiredExperienceCampaigns(@Param("now") LocalDateTime now);

    // 모집 시작 예정인 체험단 캠페인
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'EXPERIENCE' " +
           "AND c.status = 'APPROVED' " +
           "AND c.applicationStartDate <= :now " +
           "AND c.deletedAt IS NULL")
    List<Campaign> findExperienceCampaignsToStartRecruitment(@Param("now") LocalDateTime now);

    // === 구매평 캠페인 전용 조회 메서드들 ===

    // 파트너별 구매평 캠페인 목록
    Page<Campaign> findByPartnerAndCampaignTypeAndDeletedAtIsNull(
            User partner, Campaign.CampaignType campaignType, Pageable pageable);

    // 파트너와 ID로 구매평 캠페인 조회
    Optional<Campaign> findByIdAndPartnerAndCampaignTypeAndDeletedAtIsNull(
            Long id, User partner, Campaign.CampaignType campaignType);

    // 캠페인 유형별 목록
    Page<Campaign> findByCampaignTypeAndDeletedAtIsNull(
            Campaign.CampaignType campaignType, Pageable pageable);

    // 참여 가능한 구매평 캠페인 목록
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'PURCHASE_REVIEW' " +
           "AND c.status = 'RECRUITING' " +
           "AND c.deletedAt IS NULL " +
           "AND c.applicationEndDate > :now " +
           "AND c.appliedCount < c.recruitCount " +
           "ORDER BY c.createdAt DESC")
    Page<Campaign> findAvailablePurchaseReviewCampaigns(Pageable pageable);

    // 구매평 캠페인 검색 (제품명, 쇼핑몰명으로)
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'PURCHASE_REVIEW' " +
           "AND c.status = 'RECRUITING' " +
           "AND c.deletedAt IS NULL " +
           "AND c.applicationEndDate > :now " +
           "AND (LOWER(c.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.shopName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY c.createdAt DESC")
    Page<Campaign> searchAvailablePurchaseReviewCampaigns(
            @Param("keyword") String keyword, Pageable pageable);

    // 리뷰 플랫폼별 구매평 캠페인 조회
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'PURCHASE_REVIEW' " +
           "AND c.status = 'RECRUITING' " +
           "AND c.deletedAt IS NULL " +
           "AND c.applicationEndDate > :now " +
           "AND c.reviewPlatform = :platform " +
           "ORDER BY c.createdAt DESC")
    Page<Campaign> findPurchaseReviewCampaignsByPlatform(
            @Param("platform") Campaign.ReviewPlatform platform, Pageable pageable);

    // 리뷰 형식별 구매평 캠페인 조회
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'PURCHASE_REVIEW' " +
           "AND c.status = 'RECRUITING' " +
           "AND c.deletedAt IS NULL " +
           "AND c.applicationEndDate > :now " +
           "AND c.reviewFormat = :format " +
           "ORDER BY c.createdAt DESC")
    Page<Campaign> findPurchaseReviewCampaignsByFormat(
            @Param("format") Campaign.ReviewFormat format, Pageable pageable);

    // 리워드 포인트 범위로 구매평 캠페인 검색
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'PURCHASE_REVIEW' " +
           "AND c.status = 'RECRUITING' " +
           "AND c.deletedAt IS NULL " +
           "AND c.applicationEndDate > :now " +
           "AND c.rewardPoint BETWEEN :minPoint AND :maxPoint " +
           "ORDER BY c.rewardPoint DESC, c.createdAt DESC")
    Page<Campaign> findPurchaseReviewCampaignsByPointRange(
            @Param("minPoint") Integer minPoint,
            @Param("maxPoint") Integer maxPoint,
            Pageable pageable);

    // 관리자 검토 대기중인 구매평 캠페인
    @Query("SELECT c FROM Campaign c WHERE c.campaignType = 'PURCHASE_REVIEW' " +
           "AND c.status = 'PENDING_REVIEW' " +
           "AND c.deletedAt IS NULL " +
           "ORDER BY c.updatedAt ASC")
    Page<Campaign> findPendingReviewPurchaseReviewCampaigns(Pageable pageable);

    // 파트너의 구매평 캠페인 통계
    @Query("SELECT COUNT(c) FROM Campaign c WHERE c.partner = :partner " +
           "AND c.campaignType = 'PURCHASE_REVIEW' " +
           "AND c.deletedAt IS NULL")
    Long countPurchaseReviewCampaignsByPartner(@Param("partner") User partner);

    @Query("SELECT COUNT(c) FROM Campaign c WHERE c.partner = :partner " +
           "AND c.campaignType = 'PURCHASE_REVIEW' " +
           "AND c.status = :status " +
           "AND c.deletedAt IS NULL")
    Long countPurchaseReviewCampaignsByPartnerAndStatus(
            @Param("partner") User partner,
            @Param("status") Campaign.CampaignStatus status);

    // 구매평 캠페인 ID와 파트너로 조회 (권한 확인용)
    @Query("SELECT c FROM Campaign c WHERE c.id = :campaignId " +
           "AND c.partner = :partner " +
           "AND c.campaignType = 'PURCHASE_REVIEW' " +
           "AND c.deletedAt IS NULL")
    Optional<Campaign> findPurchaseReviewCampaignByIdAndPartner(
            @Param("campaignId") Long campaignId,
            @Param("partner") User partner);
}