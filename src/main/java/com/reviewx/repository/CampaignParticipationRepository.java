package com.reviewx.repository;

import com.reviewx.entity.Campaign;
import com.reviewx.entity.CampaignParticipation;
import com.reviewx.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignParticipationRepository extends JpaRepository<CampaignParticipation, Long> {

    // 특정 캠페인의 참여 신청 목록
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.campaign = :campaign " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.createdAt ASC")
    List<CampaignParticipation> findByCampaign(@Param("campaign") Campaign campaign);

    // 특정 캠페인의 특정 상태 참여자 목록
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.campaign = :campaign " +
           "AND cp.status = :status " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.createdAt ASC")
    List<CampaignParticipation> findByCampaignAndStatus(
            @Param("campaign") Campaign campaign, 
            @Param("status") CampaignParticipation.ParticipationStatus status);

    // 특정 리뷰어의 참여 신청 목록
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.reviewer = :reviewer " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.createdAt DESC")
    Page<CampaignParticipation> findByReviewer(@Param("reviewer") User reviewer, Pageable pageable);

    // 특정 리뷰어의 체험단 캠페인 참여 목록
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.reviewer = :reviewer " +
           "AND cp.campaign.campaignType = 'EXPERIENCE' " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.createdAt DESC")
    Page<CampaignParticipation> findExperienceParticipationsByReviewer(
            @Param("reviewer") User reviewer, Pageable pageable);

    // 특정 리뷰어가 특정 캠페인에 참여했는지 확인
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.campaign = :campaign " +
           "AND cp.reviewer = :reviewer " +
           "AND cp.cancelledAt IS NULL")
    Optional<CampaignParticipation> findByCampaignAndReviewer(
            @Param("campaign") Campaign campaign, 
            @Param("reviewer") User reviewer);

    // 특정 캠페인에 이미 참여 신청했는지 확인
    @Query("SELECT COUNT(cp) > 0 FROM CampaignParticipation cp WHERE cp.campaign = :campaign " +
           "AND cp.reviewer = :reviewer " +
           "AND cp.cancelledAt IS NULL")
    boolean existsByCampaignAndReviewer(@Param("campaign") Campaign campaign, @Param("reviewer") User reviewer);

    // 특정 캠페인의 선발된 참여자 목록
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.campaign = :campaign " +
           "AND cp.status = 'SELECTED' " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.selectedAt ASC")
    List<CampaignParticipation> findSelectedParticipantsByCampaign(@Param("campaign") Campaign campaign);

    // 파트너가 관리하는 캠페인의 참여 신청 목록
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.campaign.partner = :partner " +
           "AND cp.campaign.campaignType = 'EXPERIENCE' " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.createdAt DESC")
    Page<CampaignParticipation> findExperienceParticipationsByPartner(
            @Param("partner") User partner, Pageable pageable);

    // 파트너의 특정 캠페인 참여 신청 목록
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.campaign = :campaign " +
           "AND cp.campaign.partner = :partner " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.createdAt ASC")
    List<CampaignParticipation> findParticipationsByCampaignAndPartner(
            @Param("campaign") Campaign campaign, 
            @Param("partner") User partner);

    // 파트너 검토 대기 중인 참여 신청 목록
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.campaign.partner = :partner " +
           "AND cp.campaign.campaignType = 'EXPERIENCE' " +
           "AND cp.status = 'APPLIED' " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.createdAt ASC")
    List<CampaignParticipation> findPendingParticipationsByPartner(@Param("partner") User partner);

    // 캠페인별 참여 통계
    @Query("SELECT COUNT(cp) FROM CampaignParticipation cp WHERE cp.campaign = :campaign " +
           "AND cp.cancelledAt IS NULL")
    Long countParticipationsByCampaign(@Param("campaign") Campaign campaign);

    @Query("SELECT COUNT(cp) FROM CampaignParticipation cp WHERE cp.campaign = :campaign " +
           "AND cp.status = :status " +
           "AND cp.cancelledAt IS NULL")
    Long countParticipationsByCampaignAndStatus(
            @Param("campaign") Campaign campaign, 
            @Param("status") CampaignParticipation.ParticipationStatus status);

    // 리뷰어별 참여 통계
    @Query("SELECT COUNT(cp) FROM CampaignParticipation cp WHERE cp.reviewer = :reviewer " +
           "AND cp.campaign.campaignType = 'EXPERIENCE' " +
           "AND cp.cancelledAt IS NULL")
    Long countExperienceParticipationsByReviewer(@Param("reviewer") User reviewer);

    @Query("SELECT COUNT(cp) FROM CampaignParticipation cp WHERE cp.reviewer = :reviewer " +
           "AND cp.campaign.campaignType = 'EXPERIENCE' " +
           "AND cp.status = :status " +
           "AND cp.cancelledAt IS NULL")
    Long countExperienceParticipationsByReviewerAndStatus(
            @Param("reviewer") User reviewer, 
            @Param("status") CampaignParticipation.ParticipationStatus status);

    // 리뷰 작성 가능한 참여 목록 (선발되었고 리뷰 기간인 경우)
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.reviewer = :reviewer " +
           "AND cp.status = 'SELECTED' " +
           "AND cp.campaign.status = 'REVIEW_PERIOD' " +
           "AND cp.campaign.campaignType = 'EXPERIENCE' " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.campaign.reviewEndDate ASC")
    List<CampaignParticipation> findEligibleForReviewByReviewer(@Param("reviewer") User reviewer);

    // === 구매평 캠페인 참여 관련 메서드들 ===

    // 특정 리뷰어의 구매평 캠페인 참여 목록
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.reviewer = :reviewer " +
           "AND cp.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.createdAt DESC")
    Page<CampaignParticipation> findPurchaseReviewParticipationsByReviewer(
            @Param("reviewer") User reviewer, Pageable pageable);

    // 파트너가 관리하는 구매평 캠페인의 참여 신청 목록
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.campaign.partner = :partner " +
           "AND cp.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.createdAt DESC")
    Page<CampaignParticipation> findPurchaseReviewParticipationsByPartner(
            @Param("partner") User partner, Pageable pageable);

    // 구매평 캠페인의 파트너 검토 대기 중인 참여 신청 목록
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.campaign.partner = :partner " +
           "AND cp.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND cp.status = 'APPLIED' " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.createdAt ASC")
    List<CampaignParticipation> findPendingPurchaseReviewParticipationsByPartner(@Param("partner") User partner);

    // 구매평 캠페인에서 리뷰 작성 가능한 참여 목록
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.reviewer = :reviewer " +
           "AND cp.status = 'SELECTED' " +
           "AND cp.campaign.status IN ('REVIEW_PERIOD', 'IN_PROGRESS') " +
           "AND cp.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND cp.cancelledAt IS NULL " +
           "ORDER BY cp.campaign.reviewEndDate ASC")
    List<CampaignParticipation> findEligiblePurchaseReviewParticipationsByReviewer(@Param("reviewer") User reviewer);

    // 리뷰어별 구매평 캠페인 참여 통계
    @Query("SELECT COUNT(cp) FROM CampaignParticipation cp WHERE cp.reviewer = :reviewer " +
           "AND cp.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND cp.cancelledAt IS NULL")
    Long countPurchaseReviewParticipationsByReviewer(@Param("reviewer") User reviewer);

    @Query("SELECT COUNT(cp) FROM CampaignParticipation cp WHERE cp.reviewer = :reviewer " +
           "AND cp.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND cp.status = :status " +
           "AND cp.cancelledAt IS NULL")
    Long countPurchaseReviewParticipationsByReviewerAndStatus(
            @Param("reviewer") User reviewer,
            @Param("status") CampaignParticipation.ParticipationStatus status);

    // 특정 구매평 캠페인의 상태별 참여자 수
    @Query("SELECT COUNT(cp) FROM CampaignParticipation cp WHERE cp.campaign = :campaign " +
           "AND cp.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND cp.status = :status " +
           "AND cp.cancelledAt IS NULL")
    Long countPurchaseReviewParticipationsByCampaignAndStatus(
            @Param("campaign") Campaign campaign,
            @Param("status") CampaignParticipation.ParticipationStatus status);

    // 구매평 캠페인 ID와 리뷰어로 참여 조회
    @Query("SELECT cp FROM CampaignParticipation cp WHERE cp.campaign.id = :campaignId " +
           "AND cp.reviewer = :reviewer " +
           "AND cp.campaign.campaignType = 'PURCHASE_REVIEW' " +
           "AND cp.cancelledAt IS NULL")
    Optional<CampaignParticipation> findPurchaseReviewParticipationByCampaignIdAndReviewer(
            @Param("campaignId") Long campaignId,
            @Param("reviewer") User reviewer);
}