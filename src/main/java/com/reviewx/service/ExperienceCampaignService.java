package com.reviewx.service;

import com.reviewx.entity.Campaign;
import com.reviewx.entity.CampaignParticipation;
import com.reviewx.entity.PointTransaction;
import com.reviewx.entity.User;
import com.reviewx.repository.CampaignRepository;
import com.reviewx.repository.CampaignParticipationRepository;
import com.reviewx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExperienceCampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignParticipationRepository participationRepository;
    private final UserRepository userRepository;
    private final PointTransactionService pointTransactionService;

    /**
     * 체험단 캠페인 등록 (파트너)
     */
    @Transactional
    public Campaign createExperienceCampaign(Campaign campaign, Long partnerId) {
        log.info("Creating experience campaign: {} by partner: {}", campaign.getTitle(), partnerId);
        
        // 파트너 조회 및 권한 검증
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다: " + partnerId));
        
        if (!partner.isPartner()) {
            throw new IllegalArgumentException("파트너만 캠페인을 등록할 수 있습니다.");
        }
        
        if (!partner.isActive()) {
            throw new IllegalArgumentException("비활성 사용자는 캠페인을 등록할 수 없습니다.");
        }

        // 체험단 캠페인 설정
        campaign.setPartner(partner);
        campaign.setCampaignType(Campaign.CampaignType.EXPERIENCE);
        campaign.setReviewPlatform(Campaign.ReviewPlatform.NAVER_PLACE);
        campaign.setStatus(Campaign.CampaignStatus.DRAFT);
        
        // 총 예산 계산
        int totalBudget = campaign.getRewardPoint() * campaign.getRecruitCount();
        campaign.setTotalBudget(totalBudget);
        
        // 플랫폼 수수료 계산 (10%)
        int platformFee = (int) Math.ceil(totalBudget * 0.1);
        campaign.setPlatformFee(platformFee);
        campaign.setFinalCost(totalBudget + platformFee);

        // 체험단 필수 필드 검증
        validateExperienceCampaign(campaign);
        
        Campaign savedCampaign = campaignRepository.save(campaign);
        log.info("Experience campaign created successfully: {}", savedCampaign.getId());
        
        return savedCampaign;
    }

    /**
     * 체험단 캠페인 결제 및 활성화 (파트너)
     */
    @Transactional
    public Campaign activateExperienceCampaign(Long campaignId, Long partnerId) {
        log.info("Activating experience campaign: {} by partner: {}", campaignId, partnerId);
        
        // 캠페인 조회 및 권한 검증
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("캠페인을 찾을 수 없습니다: " + campaignId));
        
        if (!campaign.getPartner().getId().equals(partnerId)) {
            throw new IllegalArgumentException("본인의 캠페인만 활성화할 수 있습니다.");
        }
        
        if (campaign.getStatus() != Campaign.CampaignStatus.DRAFT) {
            throw new IllegalArgumentException("초안 상태의 캠페인만 활성화할 수 있습니다.");
        }
        
        // 포인트 결제 처리
        try {
            PointTransaction transaction = pointTransactionService.deductCampaignCost(
                partnerId, campaignId, campaign.getFinalCost());
            
            // 캠페인 상태를 활성화로 변경
            campaign.setStatus(Campaign.CampaignStatus.RECRUITING);
            Campaign activatedCampaign = campaignRepository.save(campaign);
            
            log.info("Experience campaign activated successfully: {}, transaction: {}", 
                campaignId, transaction.getId());
            
            return activatedCampaign;
            
        } catch (Exception e) {
            log.error("Failed to activate campaign due to payment failure: {}", campaignId, e);
            throw new IllegalArgumentException("캠페인 활성화에 실패했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 체험단 캠페인 취소 및 환불 (파트너)
     */
    @Transactional
    public Campaign cancelExperienceCampaign(Long campaignId, Long partnerId, String reason) {
        log.info("Cancelling experience campaign: {} by partner: {}, reason: {}", campaignId, partnerId, reason);
        
        // 캠페인 조회 및 권한 검증
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("캠페인을 찾을 수 없습니다: " + campaignId));
        
        if (!campaign.getPartner().getId().equals(partnerId)) {
            throw new IllegalArgumentException("본인의 캠페인만 취소할 수 있습니다.");
        }
        
        if (!campaign.canBeCancelled()) {
            throw new IllegalArgumentException("취소할 수 없는 캠페인 상태입니다: " + campaign.getStatus());
        }
        
        // 환불 처리 (선발된 참여자가 있는 경우에만 부분 환불)
        try {
            int refundAmount = calculateRefundAmount(campaign);
            
            if (refundAmount > 0) {
                PointTransaction refundTransaction = pointTransactionService.refundCampaign(
                    partnerId, campaignId, refundAmount, reason);
                
                log.info("Campaign refund processed: {} points, transaction: {}", 
                    refundAmount, refundTransaction.getId());
            }
            
            // 캠페인 상태를 취소로 변경
            campaign.setStatus(Campaign.CampaignStatus.CANCELLED);
            Campaign cancelledCampaign = campaignRepository.save(campaign);
            
            log.info("Experience campaign cancelled successfully: {}", campaignId);
            
            return cancelledCampaign;
            
        } catch (Exception e) {
            log.error("Failed to cancel campaign: {}", campaignId, e);
            throw new IllegalArgumentException("캠페인 취소에 실패했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 활성 체험단 캠페인 목록 조회 (리뷰어)
     */
    public Page<Campaign> getActiveExperienceCampaigns(Pageable pageable) {
        log.debug("Fetching active experience campaigns, page: {}", pageable.getPageNumber());
        return campaignRepository.findActiveExperienceCampaigns(LocalDateTime.now(), pageable);
    }

    /**
     * 체험단 캠페인 상세 조회
     */
    public Campaign getExperienceCampaignById(Long campaignId) {
        log.debug("Fetching experience campaign details: {}", campaignId);
        
        Campaign campaign = campaignRepository.findExperienceCampaignById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("체험단 캠페인을 찾을 수 없습니다: " + campaignId));
        
        return campaign;
    }

    /**
     * 체험단 캠페인 참여 신청 (리뷰어)
     */
    @Transactional
    public CampaignParticipation participateInCampaign(Long campaignId, Long reviewerId, String applicationMessage) {
        log.info("Reviewer {} applying for campaign {}", reviewerId, campaignId);
        
        // 리뷰어 조회 및 권한 검증
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰어를 찾을 수 없습니다: " + reviewerId));
        
        if (!reviewer.isReviewer()) {
            throw new IllegalArgumentException("리뷰어만 캠페인에 참여할 수 있습니다.");
        }
        
        if (!reviewer.isActive()) {
            throw new IllegalArgumentException("비활성 사용자는 캠페인에 참여할 수 없습니다.");
        }

        // 캠페인 조회 및 참여 가능 여부 검증
        Campaign campaign = getExperienceCampaignById(campaignId);
        
        if (!campaign.canApply()) {
            throw new IllegalArgumentException("신청할 수 없는 캠페인입니다.");
        }

        // 중복 신청 확인
        if (participationRepository.existsByCampaignAndReviewer(campaign, reviewer)) {
            throw new IllegalArgumentException("이미 신청한 캠페인입니다.");
        }

        // 참여 신청 생성
        CampaignParticipation participation = new CampaignParticipation(campaign, reviewer);
        participation.setApplicationMessage(applicationMessage);
        
        // 신청자 수 증가
        campaign.incrementAppliedCount();
        
        CampaignParticipation savedParticipation = participationRepository.save(participation);
        campaignRepository.save(campaign);
        
        log.info("Campaign participation created: {}", savedParticipation.getId());
        
        return savedParticipation;
    }

    /**
     * 캠페인 참여자 선발 (파트너)
     */
    @Transactional
    public void selectParticipant(Long participationId, Long partnerId, String selectionNote) {
        log.info("Partner {} selecting participant {}", partnerId, participationId);
        
        // 파트너 조회 및 권한 검증
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다: " + partnerId));

        // 참여 신청 조회
        CampaignParticipation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new IllegalArgumentException("참여 신청을 찾을 수 없습니다: " + participationId));

        // 권한 검증 (본인의 캠페인만 관리 가능)
        if (!participation.getCampaign().getPartner().getId().equals(partnerId)) {
            throw new IllegalArgumentException("본인의 캠페인만 관리할 수 있습니다.");
        }

        if (!participation.canBeSelected()) {
            throw new IllegalArgumentException("선발할 수 없는 참여 신청입니다.");
        }

        // 모집 인원 초과 확인
        Campaign campaign = participation.getCampaign();
        if (campaign.getSelectedCount() >= campaign.getRecruitCount()) {
            throw new IllegalArgumentException("모집 인원을 초과했습니다.");
        }

        // 선발 처리
        participation.select(partner, selectionNote);
        campaign.incrementSelectedCount();
        
        participationRepository.save(participation);
        campaignRepository.save(campaign);
        
        // 모집 완료 시 상태 변경
        if (campaign.getSelectedCount() >= campaign.getRecruitCount()) {
            campaign.setStatus(Campaign.CampaignStatus.IN_PROGRESS);
            campaignRepository.save(campaign);
        }
        
        log.info("Participant selected successfully: {}", participationId);
    }

    /**
     * 캠페인 참여자 반려 (파트너)
     */
    @Transactional
    public void rejectParticipant(Long participationId, Long partnerId, String rejectionReason) {
        log.info("Partner {} rejecting participant {}", partnerId, participationId);
        
        // 파트너 조회
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다: " + partnerId));

        // 참여 신청 조회
        CampaignParticipation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new IllegalArgumentException("참여 신청을 찾을 수 없습니다: " + participationId));

        // 권한 검증
        if (!participation.getCampaign().getPartner().getId().equals(partnerId)) {
            throw new IllegalArgumentException("본인의 캠페인만 관리할 수 있습니다.");
        }

        if (!participation.canBeRejected()) {
            throw new IllegalArgumentException("반려할 수 없는 참여 신청입니다.");
        }

        // 반려 처리
        participation.reject(partner, rejectionReason);
        participation.getCampaign().decrementAppliedCount();
        
        participationRepository.save(participation);
        campaignRepository.save(participation.getCampaign());
        
        log.info("Participant rejected successfully: {}", participationId);
    }

    /**
     * 파트너의 캠페인 목록 조회
     */
    public Page<Campaign> getPartnerCampaigns(Long partnerId, Pageable pageable) {
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다: " + partnerId));
        
        return campaignRepository.findExperienceCampaignsByPartner(partner, pageable);
    }

    /**
     * 캠페인 참여자 목록 조회 (파트너)
     */
    public List<CampaignParticipation> getCampaignParticipants(Long campaignId, Long partnerId) {
        // 캠페인 조회 및 권한 검증
        Campaign campaign = getExperienceCampaignById(campaignId);
        
        if (!campaign.getPartner().getId().equals(partnerId)) {
            throw new IllegalArgumentException("본인의 캠페인만 조회할 수 있습니다.");
        }

        return participationRepository.findByCampaign(campaign);
    }

    /**
     * 리뷰어의 참여 캠페인 목록 조회
     */
    public Page<CampaignParticipation> getReviewerParticipations(Long reviewerId, Pageable pageable) {
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰어를 찾을 수 없습니다: " + reviewerId));
        
        return participationRepository.findExperienceParticipationsByReviewer(reviewer, pageable);
    }

    /**
     * 위치 기반 캠페인 검색
     */
    public Page<Campaign> searchCampaignsByLocation(String location, Pageable pageable) {
        log.debug("Searching campaigns by location: {}", location);
        return campaignRepository.findExperienceCampaignsByLocation(location, LocalDateTime.now(), pageable);
    }

    /**
     * 포인트 범위로 캠페인 검색
     */
    public Page<Campaign> searchCampaignsByPointRange(Integer minPoint, Integer maxPoint, Pageable pageable) {
        log.debug("Searching campaigns by point range: {} - {}", minPoint, maxPoint);
        return campaignRepository.findExperienceCampaignsByPointRange(minPoint, maxPoint, LocalDateTime.now(), pageable);
    }

    /**
     * 체험단 캠페인 검증
     */
    private void validateExperienceCampaign(Campaign campaign) {
        if (campaign.getVisitAddress() == null || campaign.getVisitAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("방문 주소는 필수입니다.");
        }
        
        if (campaign.getShopName() == null || campaign.getShopName().trim().isEmpty()) {
            throw new IllegalArgumentException("매장명은 필수입니다.");
        }
        
        if (campaign.getRewardPoint() == null || campaign.getRewardPoint() <= 0) {
            throw new IllegalArgumentException("리워드 포인트는 0보다 커야 합니다.");
        }
        
        if (campaign.getRecruitCount() == null || campaign.getRecruitCount() <= 0) {
            throw new IllegalArgumentException("모집 인원은 0보다 커야 합니다.");
        }
        
        if (campaign.getApplicationStartDate() == null) {
            throw new IllegalArgumentException("신청 시작일은 필수입니다.");
        }
        
        if (campaign.getApplicationEndDate() == null) {
            throw new IllegalArgumentException("신청 마감일은 필수입니다.");
        }
        
        if (campaign.getReviewEndDate() == null) {
            throw new IllegalArgumentException("리뷰 마감일은 필수입니다.");
        }
        
        if (campaign.getApplicationEndDate().isBefore(campaign.getApplicationStartDate())) {
            throw new IllegalArgumentException("신청 마감일은 시작일보다 늦어야 합니다.");
        }
        
        if (campaign.getReviewEndDate().isBefore(campaign.getApplicationEndDate())) {
            throw new IllegalArgumentException("리뷰 마감일은 신청 마감일보다 늦어야 합니다.");
        }
    }

    /**
     * 캠페인 환불 금액 계산
     */
    private int calculateRefundAmount(Campaign campaign) {
        int totalCost = campaign.getFinalCost();
        int selectedCount = campaign.getSelectedCount();
        int totalRecruitCount = campaign.getRecruitCount();
        
        if (selectedCount == 0) {
            // 선발된 참여자가 없으면 전액 환불
            return totalCost;
        } else if (selectedCount < totalRecruitCount) {
            // 부분 선발된 경우, 선발되지 않은 인원에 대해서만 환불
            int unselectedCount = totalRecruitCount - selectedCount;
            int rewardPerPerson = campaign.getRewardPoint();
            int platformFeePerPerson = campaign.getPlatformFee() / totalRecruitCount;
            
            return unselectedCount * (rewardPerPerson + platformFeePerPerson);
        } else {
            // 모든 인원이 선발된 경우 환불 없음
            return 0;
        }
    }
}