package com.reviewx.controller;

import com.reviewx.dto.auth.UserResponse;
import com.reviewx.entity.User;
import com.reviewx.security.SecurityUtils;
import com.reviewx.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
public class AdminController {

    private final UserService userService;

    /**
     * 관리자 대시보드
     */
    @GetMapping("/dashboard")
    public String adminDashboard(Model model) {
        UserResponse currentUser = userService.getCurrentUser();
        model.addAttribute("currentUser", currentUser);
        return "admin/dashboard";
    }

    /**
     * 사용자 관리 페이지
     */
    @GetMapping("/users")
    public String userManagement(@PageableDefault(size = 20) Pageable pageable,
                                @RequestParam(required = false) String roleCode,
                                @RequestParam(required = false) String status,
                                @RequestParam(required = false) String keyword,
                                Model model) {
        log.debug("Admin accessing user management page");

        model.addAttribute("roleCode", roleCode);
        model.addAttribute("status", status);
        model.addAttribute("keyword", keyword);

        return "admin/users";
    }

    /**
     * 사용자 상세 정보
     */
    @GetMapping("/users/{id}")
    public String userDetail(@PathVariable Long id, Model model) {
        // 실제로는 UserService에서 사용자 정보를 조회해야 함
        model.addAttribute("userId", id);
        return "admin/user-detail";
    }

    /**
     * 사용자 상태 변경
     */
    @PostMapping("/users/{id}/status")
    @ResponseBody
    public ResponseEntity<String> changeUserStatus(@PathVariable Long id,
                                                  @RequestParam User.UserStatus status) {
        try {
            userService.changeUserStatus(id, status);
            log.info("User status changed: userId={}, newStatus={}, adminId={}",
                    id, status, SecurityUtils.getCurrentUserId());
            return ResponseEntity.ok("사용자 상태가 변경되었습니다.");
        } catch (Exception e) {
            log.error("Error changing user status", e);
            return ResponseEntity.badRequest().body("상태 변경에 실패했습니다.");
        }
    }

    /**
     * 캠페인 관리 페이지
     */
    @GetMapping("/campaigns")
    public String campaignManagement(@PageableDefault(size = 20) Pageable pageable,
                                   @RequestParam(required = false) String type,
                                   @RequestParam(required = false) String status,
                                   Model model) {
        log.debug("Admin accessing campaign management page");

        model.addAttribute("type", type);
        model.addAttribute("status", status);

        return "admin/campaigns";
    }

    /**
     * 리뷰 승인 관리 페이지
     */
    @GetMapping("/reviews")
    public String reviewManagement(@PageableDefault(size = 20) Pageable pageable,
                                 @RequestParam(required = false) String status,
                                 @RequestParam(required = false) String campaignType,
                                 Model model) {
        log.debug("Admin accessing review management page");

        model.addAttribute("status", status);
        model.addAttribute("campaignType", campaignType);

        return "admin/reviews";
    }

    /**
     * 정산 관리 페이지
     */
    @GetMapping("/settlements")
    public String settlementManagement(@PageableDefault(size = 20) Pageable pageable,
                                     @RequestParam(required = false) String status,
                                     @RequestParam(required = false) String dateFrom,
                                     @RequestParam(required = false) String dateTo,
                                     Model model) {
        log.debug("Admin accessing settlement management page");

        model.addAttribute("status", status);
        model.addAttribute("dateFrom", dateFrom);
        model.addAttribute("dateTo", dateTo);

        return "admin/settlements";
    }

    /**
     * 시스템 통계 페이지
     */
    @GetMapping("/statistics")
    public String systemStatistics(Model model) {
        log.debug("Admin accessing statistics page");
        return "admin/statistics";
    }
}