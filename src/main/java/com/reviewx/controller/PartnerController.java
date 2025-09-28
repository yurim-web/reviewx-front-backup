package com.reviewx.controller;

import com.reviewx.dto.auth.UserResponse;
import com.reviewx.security.SecurityUtils;
import com.reviewx.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/partner")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('PARTNER')")
public class PartnerController {

    private final UserService userService;

    /**
     * 파트너 대시보드
     */
    @GetMapping("/dashboard")
    public String partnerDashboard(Model model) {
        UserResponse currentUser = userService.getCurrentUser();
        model.addAttribute("currentUser", currentUser);
        log.debug("Partner {} accessing dashboard", currentUser.getId());
        return "partner/dashboard";
    }

    /**
     * 내 캠페인 관리 페이지
     */
    @GetMapping("/campaigns")
    public String myCampaigns(@PageableDefault(size = 20) Pageable pageable,
                             @RequestParam(required = false) String status,
                             @RequestParam(required = false) String type,
                             Model model) {
        Long partnerId = SecurityUtils.getCurrentUserId();
        log.debug("Partner {} accessing campaign management", partnerId);

        model.addAttribute("status", status);
        model.addAttribute("type", type);
        return "partner/campaigns";
    }

    /**
     * 캠페인 생성 페이지
     */
    @GetMapping("/campaigns/new")
    public String createCampaignPage(Model model) {
        log.debug("Partner {} accessing campaign creation page", SecurityUtils.getCurrentUserId());
        return "partner/campaign-create";
    }

    /**
     * 캠페인 상세 관리 페이지
     */
    @GetMapping("/campaigns/{id}")
    public String campaignDetail(@PathVariable Long id, Model model) {
        Long partnerId = SecurityUtils.getCurrentUserId();
        log.debug("Partner {} accessing campaign {} detail", partnerId, id);

        model.addAttribute("campaignId", id);
        return "partner/campaign-detail";
    }

    /**
     * 캠페인 참여자 관리 페이지
     */
    @GetMapping("/campaigns/{id}/participants")
    public String campaignParticipants(@PathVariable Long id,
                                     @RequestParam(required = false) String status,
                                     Model model) {
        Long partnerId = SecurityUtils.getCurrentUserId();
        log.debug("Partner {} accessing participants for campaign {}", partnerId, id);

        model.addAttribute("campaignId", id);
        model.addAttribute("status", status);
        return "partner/campaign-participants";
    }

    /**
     * 리뷰 승인 관리 페이지
     */
    @GetMapping("/reviews")
    public String reviewManagement(@PageableDefault(size = 20) Pageable pageable,
                                 @RequestParam(required = false) String status,
                                 @RequestParam(required = false) Long campaignId,
                                 Model model) {
        Long partnerId = SecurityUtils.getCurrentUserId();
        log.debug("Partner {} accessing review management", partnerId);

        model.addAttribute("status", status);
        model.addAttribute("campaignId", campaignId);
        return "partner/reviews";
    }

    /**
     * 포인트 관리 페이지
     */
    @GetMapping("/points")
    public String pointManagement(Model model) {
        Long partnerId = SecurityUtils.getCurrentUserId();
        log.debug("Partner {} accessing point management", partnerId);

        UserResponse currentUser = userService.getCurrentUser();
        model.addAttribute("currentUser", currentUser);
        return "partner/points";
    }

    /**
     * 포인트 충전 페이지
     */
    @GetMapping("/points/charge")
    public String pointCharge(Model model) {
        log.debug("Partner {} accessing point charge page", SecurityUtils.getCurrentUserId());
        return "partner/point-charge";
    }

    /**
     * 가이드 관리 페이지
     */
    @GetMapping("/guides")
    public String guideManagement(Model model) {
        Long partnerId = SecurityUtils.getCurrentUserId();
        log.debug("Partner {} accessing guide management", partnerId);
        return "partner/guides";
    }

    /**
     * 1:1 문의 관리 페이지
     */
    @GetMapping("/inquiries")
    public String inquiryManagement(@PageableDefault(size = 20) Pageable pageable,
                                  @RequestParam(required = false) String status,
                                  Model model) {
        Long partnerId = SecurityUtils.getCurrentUserId();
        log.debug("Partner {} accessing inquiry management", partnerId);

        model.addAttribute("status", status);
        return "partner/inquiries";
    }

    /**
     * 통계 및 리포트 페이지
     */
    @GetMapping("/reports")
    public String reportManagement(@RequestParam(required = false) String period,
                                 @RequestParam(required = false) String type,
                                 Model model) {
        Long partnerId = SecurityUtils.getCurrentUserId();
        log.debug("Partner {} accessing reports", partnerId);

        model.addAttribute("period", period);
        model.addAttribute("type", type);
        return "partner/reports";
    }
}