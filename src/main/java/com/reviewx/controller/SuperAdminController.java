package com.reviewx.controller;

import com.reviewx.dto.auth.UserResponse;
import com.reviewx.security.SecurityUtils;
import com.reviewx.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/super-admin")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    private final UserService userService;

    /**
     * 최고관리자 대시보드
     */
    @GetMapping("/dashboard")
    public String superAdminDashboard(Model model) {
        UserResponse currentUser = userService.getCurrentUser();
        model.addAttribute("currentUser", currentUser);
        return "super-admin/dashboard";
    }

    /**
     * 시스템 관리 페이지
     */
    @GetMapping("/system")
    public String systemManagement(Model model) {
        log.debug("Super admin accessing system management page");
        return "super-admin/system";
    }

    /**
     * 역할 및 권한 관리 페이지
     */
    @GetMapping("/roles")
    public String roleManagement(Model model) {
        log.debug("Super admin accessing role management page");
        return "super-admin/roles";
    }

    /**
     * 사용자 역할 변경
     */
    @PostMapping("/users/{id}/role")
    @ResponseBody
    public ResponseEntity<String> changeUserRole(@PathVariable Long id,
                                                @RequestParam String roleCode) {
        try {
            userService.changeUserRole(id, roleCode);
            log.info("User role changed: userId={}, newRole={}, superAdminId={}",
                    id, roleCode, SecurityUtils.getCurrentUserId());
            return ResponseEntity.ok("사용자 역할이 변경되었습니다.");
        } catch (Exception e) {
            log.error("Error changing user role", e);
            return ResponseEntity.badRequest().body("역할 변경에 실패했습니다.");
        }
    }

    /**
     * 플랫폼 정책 관리 페이지
     */
    @GetMapping("/policies")
    public String policyManagement(Model model) {
        log.debug("Super admin accessing policy management page");
        return "super-admin/policies";
    }

    /**
     * 전체 데이터 분석 페이지
     */
    @GetMapping("/analytics")
    public String dataAnalytics(Model model) {
        log.debug("Super admin accessing data analytics page");
        return "super-admin/analytics";
    }

    /**
     * 백업 및 복구 페이지
     */
    @GetMapping("/backup")
    public String backupManagement(Model model) {
        log.debug("Super admin accessing backup management page");
        return "super-admin/backup";
    }
}