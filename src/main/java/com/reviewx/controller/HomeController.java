package com.reviewx.controller;

import com.reviewx.dto.auth.UserResponse;
import com.reviewx.security.SecurityUtils;
import com.reviewx.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
@Slf4j
public class HomeController {

    private final UserService userService;

    /**
     * 홈페이지 (메인)
     */
    @GetMapping({"/", "/home"})
    public String home(Model model) {
        if (SecurityUtils.isAuthenticated()) {
            try {
                UserResponse currentUser = userService.getCurrentUser();
                model.addAttribute("currentUser", currentUser);

                // 역할별로 다른 페이지로 리다이렉트
                if (currentUser.getRoleCode() != null) {
                    switch (currentUser.getRoleCode()) {
                        case "SUPER_ADMIN":
                            return "redirect:/super-admin/dashboard";
                        case "ADMIN":
                            return "redirect:/admin/dashboard";
                        case "PARTNER":
                            return "redirect:/partner/dashboard";
                        case "REVIEWER":
                            return "redirect:/campaigns";
                    }
                }
            } catch (Exception e) {
                log.debug("Error getting current user info", e);
            }
        }

        return "home";
    }

    /**
     * 캠페인 목록 페이지 (참여자용)
     */
    @GetMapping("/campaigns")
    public String campaigns(Model model) {
        if (SecurityUtils.isAuthenticated() && SecurityUtils.isReviewer()) {
            UserResponse currentUser = userService.getCurrentUser();
            model.addAttribute("currentUser", currentUser);
        }
        return "campaigns/list";
    }

    /**
     * 접근 거부 페이지
     */
    @GetMapping("/error/403")
    public String accessDenied(Model model) {
        if (SecurityUtils.isAuthenticated()) {
            try {
                UserResponse currentUser = userService.getCurrentUser();
                model.addAttribute("currentUser", currentUser);
            } catch (Exception e) {
                log.debug("Error getting current user info for 403 page", e);
            }
        }
        return "error/403";
    }

    /**
     * 404 에러 페이지
     */
    @GetMapping("/error/404")
    public String notFound() {
        return "error/404";
    }

    /**
     * 500 에러 페이지
     */
    @GetMapping("/error/500")
    public String internalError() {
        return "error/500";
    }
}