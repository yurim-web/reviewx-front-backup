package com.reviewx.security;

import com.reviewx.entity.User;
import com.reviewx.service.CustomUserDetailsService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class SecurityUtils {

    /**
     * 현재 인증된 사용자의 이메일을 반환
     */
    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return authentication.getName();
    }

    /**
     * 현재 인증된 사용자의 ID를 반환
     */
    public static Long getCurrentUserId() {
        CustomUserDetailsService.CustomUserPrincipal principal = getCurrentUserPrincipal();
        return principal != null ? principal.getUserId() : null;
    }

    /**
     * 현재 인증된 사용자의 UserPrincipal을 반환
     */
    public static CustomUserDetailsService.CustomUserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetailsService.CustomUserPrincipal) {
            return (CustomUserDetailsService.CustomUserPrincipal) principal;
        }
        return null;
    }

    /**
     * 현재 사용자가 특정 역할을 가지고 있는지 확인
     */
    public static boolean hasRole(String roleCode) {
        CustomUserDetailsService.CustomUserPrincipal principal = getCurrentUserPrincipal();
        if (principal == null) {
            return false;
        }
        return principal.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_" + roleCode));
    }

    /**
     * 현재 사용자가 특정 권한을 가지고 있는지 확인
     */
    public static boolean hasPermission(String permissionCode) {
        CustomUserDetailsService.CustomUserPrincipal principal = getCurrentUserPrincipal();
        if (principal == null) {
            return false;
        }
        return principal.getAuthorities().contains(new SimpleGrantedAuthority(permissionCode));
    }

    /**
     * 현재 사용자가 참여자인지 확인
     */
    public static boolean isReviewer() {
        return hasRole("REVIEWER");
    }

    /**
     * 현재 사용자가 파트너인지 확인
     */
    public static boolean isPartner() {
        return hasRole("PARTNER");
    }

    /**
     * 현재 사용자가 일반관리자인지 확인
     */
    public static boolean isAdmin() {
        return hasRole("ADMIN");
    }

    /**
     * 현재 사용자가 최고관리자인지 확인
     */
    public static boolean isSuperAdmin() {
        return hasRole("SUPER_ADMIN");
    }

    /**
     * 현재 사용자가 관리권한을 가지고 있는지 확인 (일반관리자 또는 최고관리자)
     */
    public static boolean hasManagementAuthority() {
        return isAdmin() || isSuperAdmin();
    }

    /**
     * 현재 사용자가 특정 사용자의 데이터에 접근할 권한이 있는지 확인
     * 본인 데이터 또는 관리권한이 있는 경우
     */
    public static boolean canAccessUserData(Long userId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return false;
        }
        return currentUserId.equals(userId) || hasManagementAuthority();
    }

    /**
     * 현재 사용자가 파트너 데이터에 접근할 권한이 있는지 확인
     * 본인이 파트너이거나 관리권한이 있는 경우
     */
    public static boolean canAccessPartnerData(Long partnerId) {
        if (hasManagementAuthority()) {
            return true;
        }
        if (isPartner()) {
            Long currentUserId = getCurrentUserId();
            return currentUserId != null && currentUserId.equals(partnerId);
        }
        return false;
    }

    /**
     * 현재 사용자 정보 반환
     */
    public static User getCurrentUser() {
        CustomUserDetailsService.CustomUserPrincipal principal = getCurrentUserPrincipal();
        return principal != null ? principal.getUser() : null;
    }

    /**
     * 인증된 사용자인지 확인
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() &&
               !"anonymousUser".equals(authentication.getPrincipal());
    }
}