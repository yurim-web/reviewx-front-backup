package com.reviewx.controller;

import com.reviewx.dto.campaign.*;
import com.reviewx.dto.ErrorResponse;
import com.reviewx.entity.Campaign;
import com.reviewx.entity.CampaignParticipation;
import com.reviewx.security.SecurityUtils;
import com.reviewx.service.ExperienceCampaignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class ExperienceCampaignController {

    private final ExperienceCampaignService experienceCampaignService;

    /**
     * 체험단 캠페인 등록 (파트너)
     * POST /api/campaigns
     */
    @PostMapping
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<CampaignDetailResponse> createCampaign(
            @RequestBody CampaignCreateRequest request) {

        Long partnerId = SecurityUtils.getCurrentUserId();
        log.info("Creating experience campaign by partner: {}", partnerId);

        try {
            Campaign campaign = request.toEntity();
            Campaign createdCampaign = experienceCampaignService.createExperienceCampaign(campaign, partnerId);
            
            CampaignDetailResponse response = CampaignDetailResponse.from(createdCampaign);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for campaign creation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error creating campaign", e);
            throw new RuntimeException("캠페인 생성 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 활성 체험단 캠페인 목록 조회 (리뷰어)
     * GET /api/campaigns
     */
    @GetMapping
    @PreAuthorize("hasRole('REVIEWER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<CampaignListResponse>> getCampaigns(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minPoint,
            @RequestParam(required = false) Integer maxPoint) {
        
        log.debug("Fetching active campaigns with filters - location: {}, pointRange: {}-{}", 
                location, minPoint, maxPoint);
        
        Page<Campaign> campaigns;
        
        if (location != null && !location.trim().isEmpty()) {
            campaigns = experienceCampaignService.searchCampaignsByLocation(location, pageable);
        } else if (minPoint != null && maxPoint != null) {
            campaigns = experienceCampaignService.searchCampaignsByPointRange(minPoint, maxPoint, pageable);
        } else {
            campaigns = experienceCampaignService.getActiveExperienceCampaigns(pageable);
        }
        
        Page<CampaignListResponse> response = campaigns.map(CampaignListResponse::from);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 체험단 캠페인 상세 조회
     * GET /api/campaigns/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CampaignDetailResponse> getCampaignDetail(@PathVariable Long id) {
        
        log.debug("Fetching campaign details: {}", id);
        
        try {
            Campaign campaign = experienceCampaignService.getExperienceCampaignById(id);
            CampaignDetailResponse response = CampaignDetailResponse.from(campaign);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("Campaign not found: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 체험단 캠페인 참여 신청 (리뷰어)
     * POST /api/campaigns/{id}/participate
     */
    @PostMapping("/{id}/participate")
    @PreAuthorize("hasRole('REVIEWER')")
    public ResponseEntity<ParticipationResponse> participateInCampaign(
            @PathVariable Long id,
            @RequestBody ParticipationRequest request) {

        Long reviewerId = SecurityUtils.getCurrentUserId();
        log.info("Reviewer {} participating in campaign {}", reviewerId, id);
        
        try {
            CampaignParticipation participation = experienceCampaignService.participateInCampaign(
                    id, reviewerId, request.getApplicationMessage());
            
            ParticipationResponse response = ParticipationResponse.from(participation);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid participation request: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error during campaign participation", e);
            throw new RuntimeException("캠페인 참여 신청 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 파트너의 캠페인 목록 조회
     * GET /api/campaigns/my
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<Page<CampaignListResponse>> getMyCampaigns(
            @PageableDefault(size = 20) Pageable pageable) {

        Long partnerId = SecurityUtils.getCurrentUserId();
        log.debug("Fetching campaigns for partner: {}", partnerId);
        
        Page<Campaign> campaigns = experienceCampaignService.getPartnerCampaigns(partnerId, pageable);
        Page<CampaignListResponse> response = campaigns.map(CampaignListResponse::from);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 캠페인 참여자 목록 조회 (파트너)
     * GET /api/campaigns/{id}/participants
     */
    @GetMapping("/{id}/participants")
    @PreAuthorize("hasRole('PARTNER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<ParticipationDetailResponse>> getCampaignParticipants(
            @PathVariable Long id) {

        Long partnerId = SecurityUtils.getCurrentUserId();
        log.debug("Fetching participants for campaign {} by partner {}", id, partnerId);
        
        try {
            List<CampaignParticipation> participants = experienceCampaignService
                    .getCampaignParticipants(id, partnerId);
            
            List<ParticipationDetailResponse> response = participants.stream()
                    .map(ParticipationDetailResponse::from)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for participants: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * 캠페인 참여자 선발 (파트너)
     * POST /api/campaigns/participants/{participationId}/select
     */
    @PostMapping("/participants/{participationId}/select")
    @PreAuthorize("hasRole('PARTNER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> selectParticipant(
            @PathVariable Long participationId,
            @RequestBody SelectionRequest request) {

        Long partnerId = SecurityUtils.getCurrentUserId();
        log.info("Partner {} selecting participant {}", partnerId, participationId);
        
        try {
            experienceCampaignService.selectParticipant(participationId, partnerId, request.getNote());
            return ResponseEntity.ok().build();
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid selection request: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error selecting participant", e);
            throw new RuntimeException("참여자 선발 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 캠페인 참여자 반려 (파트너)
     * POST /api/campaigns/participants/{participationId}/reject
     */
    @PostMapping("/participants/{participationId}/reject")
    @PreAuthorize("hasRole('PARTNER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> rejectParticipant(
            @PathVariable Long participationId,
            @RequestBody RejectionRequest request) {

        Long partnerId = SecurityUtils.getCurrentUserId();
        log.info("Partner {} rejecting participant {}", partnerId, participationId);
        
        try {
            experienceCampaignService.rejectParticipant(participationId, partnerId, request.getReason());
            return ResponseEntity.ok().build();
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid rejection request: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error rejecting participant", e);
            throw new RuntimeException("참여자 반려 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 리뷰어의 참여 캠페인 목록 조회
     * GET /api/campaigns/participations
     */
    @GetMapping("/participations")
    @PreAuthorize("hasRole('REVIEWER')")
    public ResponseEntity<Page<ParticipationDetailResponse>> getMyParticipations(
            @PageableDefault(size = 20) Pageable pageable) {

        Long reviewerId = SecurityUtils.getCurrentUserId();
        log.debug("Fetching participations for reviewer: {}", reviewerId);
        
        Page<CampaignParticipation> participations = experienceCampaignService
                .getReviewerParticipations(reviewerId, pageable);
        
        Page<ParticipationDetailResponse> response = participations.map(ParticipationDetailResponse::from);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 글로벌 예외 처리
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
        log.warn("Bad request: {}", e.getMessage());
        return ResponseEntity.badRequest()
                .body(new ErrorResponse("INVALID_REQUEST", e.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        log.error("Internal server error", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("INTERNAL_ERROR", "서버 내부 오류가 발생했습니다."));
    }
}