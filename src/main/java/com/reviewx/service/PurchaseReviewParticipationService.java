package com.reviewx.service;

import com.reviewx.dto.campaign.ParticipationDetailResponse;
import com.reviewx.dto.campaign.ParticipationRequest;
import com.reviewx.entity.Campaign;
import com.reviewx.entity.CampaignParticipation;
import com.reviewx.entity.User;
import com.reviewx.repository.CampaignParticipationRepository;
import com.reviewx.repository.CampaignRepository;
import com.reviewx.repository.ReviewRepository;
import com.reviewx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 구매평 캠페인 참여 관리 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PurchaseReviewParticipationService {

    private final CampaignRepository campaignRepository;
    private final CampaignParticipationRepository participationRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    /**
     * 구매평 캠페인 참여 신청 (참여자)
     */
    @Transactional
    @PreAuthorize("hasRole('REVIEWER')")
    public ParticipationDetailResponse applyForCampaign(Long campaignId, ParticipationRequest request,
                                                       Authentication auth) {
        log.info("Applying for purchase review campaign: campaignId={}, user={}", campaignId, auth.getName());

        // 사용자 조회
        User reviewer = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        // 캠페인 조회 및 유효성 검증
        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new IllegalArgumentException("캠페인을 찾을 수 없습니다"));

        if (!campaign.getCampaignType().equals(Campaign.CampaignType.PURCHASE_REVIEW)) {
            throw new IllegalArgumentException("구매평 캠페인이 아닙니다");
        }

        // 참여 가능성 검증
        validateCampaignApplication(campaign, reviewer);

        // 중복 신청 확인
        if (participationRepository.existsByCampaignAndReviewer(campaign, reviewer)) {
            throw new IllegalStateException("이미 신청한 캠페인입니다");
        }

        // 참여 신청 생성 (생성자가 자동으로 리뷰어 정보를 스냅샷으로 저장)
        CampaignParticipation participation = new CampaignParticipation(campaign, reviewer);
        participation.setApplicationMessage(request.getApplicationMessage());
        participation.setApplicationReason(request.getApplicationReason());

        participation = participationRepository.save(participation);

        // 캠페인 신청자 수 증가
        campaign.incrementAppliedCount();
        campaignRepository.save(campaign);

        log.info("Successfully applied for purchase review campaign: participationId={}", participation.getId());

        return new ParticipationDetailResponse(participation);
    }

    /**
     * 구매평 캠페인 참여 신청 취소 (참여자)
     */
    @Transactional
    @PreAuthorize("hasRole('REVIEWER')")
    public void cancelApplication(Long campaignId, Authentication auth) {
        log.info("Cancelling purchase review campaign application: campaignId={}, user={}", campaignId, auth.getName());

        User reviewer = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        CampaignParticipation participation = participationRepository
            .findPurchaseReviewParticipationByCampaignIdAndReviewer(campaignId, reviewer)
            .orElseThrow(() -> new IllegalArgumentException("참여 신청을 찾을 수 없습니다"));

        // 취소 가능한 상태 확인
        if (!participation.getStatus().equals(CampaignParticipation.ParticipationStatus.APPLIED)) {
            throw new IllegalStateException("신청 상태에서만 취소할 수 있습니다");
        }

        // 취소 처리
        participation.cancel();
        participationRepository.save(participation);

        // 캠페인 신청자 수 감소
        Campaign campaign = participation.getCampaign();
        campaign.decrementAppliedCount();
        campaignRepository.save(campaign);

        log.info("Successfully cancelled purchase review campaign application: participationId={}",
                participation.getId());
    }

    /**
     * 구매평 캠페인 참여자 선발 (파트너)
     */
    @Transactional
    @PreAuthorize("hasRole('PARTNER')")
    public void selectParticipant(Long participationId, Authentication auth) {
        log.info("Selecting purchase review campaign participant: participationId={}, partner={}",
                participationId, auth.getName());

        User partner = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다"));

        CampaignParticipation participation = participationRepository.findById(participationId)
            .orElseThrow(() -> new IllegalArgumentException("참여 신청을 찾을 수 없습니다"));

        // 권한 확인
        if (!participation.getCampaign().getPartner().equals(partner)) {
            throw new IllegalArgumentException("해당 캠페인의 파트너만 선발할 수 있습니다");
        }

        // 구매평 캠페인 확인
        if (!participation.getCampaign().getCampaignType().equals(Campaign.CampaignType.PURCHASE_REVIEW)) {
            throw new IllegalArgumentException("구매평 캠페인이 아닙니다");
        }

        // 선발 가능한 상태 확인
        if (!participation.getStatus().equals(CampaignParticipation.ParticipationStatus.APPLIED)) {
            throw new IllegalStateException("신청 상태에서만 선발할 수 있습니다");
        }

        Campaign campaign = participation.getCampaign();

        // 모집 인원 초과 확인
        if (campaign.getSelectedCount() >= campaign.getRecruitCount()) {
            throw new IllegalStateException("이미 모집 인원이 모두 선발되었습니다");
        }

        // 선발 처리
        participation.select(partner, "선발됨");
        participationRepository.save(participation);

        // 캠페인 선발자 수 증가
        campaign.incrementSelectedCount();
        campaignRepository.save(campaign);

        log.info("Successfully selected purchase review campaign participant: participationId={}",
                participationId);
    }

    /**
     * 구매평 캠페인 참여자 선발 취소 (파트너)
     */
    @Transactional
    @PreAuthorize("hasRole('PARTNER')")
    public void unselectParticipant(Long participationId, Authentication auth) {
        log.info("Unselecting purchase review campaign participant: participationId={}, partner={}",
                participationId, auth.getName());

        User partner = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다"));

        CampaignParticipation participation = participationRepository.findById(participationId)
            .orElseThrow(() -> new IllegalArgumentException("참여 신청을 찾을 수 없습니다"));

        // 권한 확인
        if (!participation.getCampaign().getPartner().equals(partner)) {
            throw new IllegalArgumentException("해당 캠페인의 파트너만 선발 취소할 수 있습니다");
        }

        // 선발 취소 가능한 상태 확인
        if (!participation.getStatus().equals(CampaignParticipation.ParticipationStatus.SELECTED)) {
            throw new IllegalStateException("선발된 상태에서만 선발 취소할 수 있습니다");
        }

        // 이미 리뷰가 작성된 경우 선발 취소 불가 (리뷰 테이블에서 확인)
        if (reviewRepository.findPurchaseReviewByCampaignAndReviewer(
                participation.getCampaign(),
                participation.getReviewer()).isPresent()) {
            throw new IllegalStateException("리뷰가 작성된 참여자는 선발 취소할 수 없습니다");
        }

        // 선발 취소 처리 (SELECTED → APPLIED 상태로 변경)
        participation.reject(partner, "선발 취소됨");
        participationRepository.save(participation);

        // 캠페인 선발자 수 감소
        Campaign campaign = participation.getCampaign();
        campaign.decrementSelectedCount();
        campaignRepository.save(campaign);

        log.info("Successfully unselected purchase review campaign participant: participationId={}",
                participationId);
    }

    /**
     * 참여자의 구매평 캠페인 목록 조회
     */
    @PreAuthorize("hasRole('REVIEWER')")
    public Page<ParticipationDetailResponse> getMyParticipations(Authentication auth, Pageable pageable) {
        User reviewer = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        Page<CampaignParticipation> participations = participationRepository
            .findPurchaseReviewParticipationsByReviewer(reviewer, pageable);

        return participations.map(ParticipationDetailResponse::new);
    }

    /**
     * 파트너의 구매평 캠페인 참여 신청 목록 조회
     */
    @PreAuthorize("hasRole('PARTNER')")
    public Page<ParticipationDetailResponse> getPartnerParticipations(Authentication auth, Pageable pageable) {
        User partner = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다"));

        Page<CampaignParticipation> participations = participationRepository
            .findPurchaseReviewParticipationsByPartner(partner, pageable);

        return participations.map(ParticipationDetailResponse::new);
    }

    /**
     * 파트너의 검토 대기중인 구매평 캠페인 참여 신청 목록
     */
    @PreAuthorize("hasRole('PARTNER')")
    public List<ParticipationDetailResponse> getPendingParticipations(Authentication auth) {
        User partner = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다"));

        List<CampaignParticipation> participations = participationRepository
            .findPendingPurchaseReviewParticipationsByPartner(partner);

        return participations.stream()
            .map(ParticipationDetailResponse::new)
            .toList();
    }

    /**
     * 특정 구매평 캠페인의 참여 신청 목록 조회 (파트너)
     */
    @PreAuthorize("hasRole('PARTNER')")
    public List<ParticipationDetailResponse> getCampaignParticipations(Long campaignId, Authentication auth) {
        User partner = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다"));

        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new IllegalArgumentException("캠페인을 찾을 수 없습니다"));

        // 권한 확인
        if (!campaign.getPartner().equals(partner)) {
            throw new IllegalArgumentException("해당 캠페인의 파트너만 조회할 수 있습니다");
        }

        // 구매평 캠페인 확인
        if (!campaign.getCampaignType().equals(Campaign.CampaignType.PURCHASE_REVIEW)) {
            throw new IllegalArgumentException("구매평 캠페인이 아닙니다");
        }

        List<CampaignParticipation> participations = participationRepository.findByCampaign(campaign);

        return participations.stream()
            .map(ParticipationDetailResponse::new)
            .toList();
    }

    /**
     * 리뷰 작성 가능한 구매평 캠페인 참여 목록 조회 (참여자)
     */
    @PreAuthorize("hasRole('REVIEWER')")
    public List<ParticipationDetailResponse> getEligibleForReview(Authentication auth) {
        User reviewer = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        List<CampaignParticipation> participations = participationRepository
            .findEligiblePurchaseReviewParticipationsByReviewer(reviewer);

        return participations.stream()
            .map(ParticipationDetailResponse::new)
            .toList();
    }

    /**
     * 참여 신청 상세 조회
     */
    public ParticipationDetailResponse getParticipationDetail(Long participationId, Authentication auth) {
        CampaignParticipation participation = participationRepository.findById(participationId)
            .orElseThrow(() -> new IllegalArgumentException("참여 신청을 찾을 수 없습니다"));

        // 구매평 캠페인 확인
        if (!participation.getCampaign().getCampaignType().equals(Campaign.CampaignType.PURCHASE_REVIEW)) {
            throw new IllegalArgumentException("구매평 캠페인이 아닙니다");
        }

        // 권한 확인 (참여자 본인 또는 캠페인 파트너)
        String username = auth.getName();
        boolean isReviewer = participation.getReviewer().getEmail().equals(username);
        boolean isPartner = participation.getCampaign().getPartner().getEmail().equals(username);

        if (!isReviewer && !isPartner) {
            throw new IllegalArgumentException("해당 참여 신청을 조회할 권한이 없습니다");
        }

        return new ParticipationDetailResponse(participation);
    }

    // === Private Helper Methods ===

    private void validateCampaignApplication(Campaign campaign, User reviewer) {
        // 캠페인 상태 확인
        if (!campaign.canApply()) {
            throw new IllegalStateException("현재 참여 신청할 수 없는 캠페인입니다");
        }

        // 삭제된 캠페인 확인
        if (campaign.getDeletedAt() != null) {
            throw new IllegalStateException("삭제된 캠페인입니다");
        }

        // 신청 기간 확인
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(campaign.getApplicationStartDate())) {
            throw new IllegalStateException("아직 신청 기간이 아닙니다");
        }
        if (now.isAfter(campaign.getApplicationEndDate())) {
            throw new IllegalStateException("신청 기간이 종료되었습니다");
        }

        // 모집 인원 확인
        if (campaign.isRecruitmentFull()) {
            throw new IllegalStateException("모집 인원이 마감되었습니다");
        }

        // 파트너 본인 신청 방지
        if (campaign.getPartner().equals(reviewer)) {
            throw new IllegalStateException("본인이 등록한 캠페인에는 참여할 수 없습니다");
        }
    }
}