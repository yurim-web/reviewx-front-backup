package com.reviewx.service;

import com.reviewx.entity.Permission;
import com.reviewx.entity.User;
import com.reviewx.repository.PermissionRepository;
import com.reviewx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 소프트 삭제된 사용자나 비활성 사용자는 로그인 불가
        if (user.getDeletedAt() != null || !user.isActive()) {
            throw new UsernameNotFoundException("User is not active: " + email);
        }

        return new CustomUserPrincipal(user, getAuthorities(user));
    }

    /**
     * 사용자의 권한 목록을 조회하여 GrantedAuthority 컬렉션으로 반환
     */
    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        // 역할(Role) 기반 권한 추가
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().getRoleCode()));

        // 세부 권한(Permission) 추가
        List<Permission> permissions = permissionRepository.findByRoleId(user.getRole().getId());
        for (Permission permission : permissions) {
            authorities.add(new SimpleGrantedAuthority(permission.getPermissionCode()));
        }

        log.debug("User {} has authorities: {}", user.getEmail(), authorities);
        return authorities;
    }

    /**
     * 사용자 정의 UserDetails 구현체
     */
    public static class CustomUserPrincipal implements UserDetails {
        private final User user;
        private final Collection<? extends GrantedAuthority> authorities;

        public CustomUserPrincipal(User user, Collection<? extends GrantedAuthority> authorities) {
            this.user = user;
            this.authorities = authorities;
        }

        // 사용자 정보 접근 메서드
        public User getUser() {
            return user;
        }

        public Long getUserId() {
            return user.getId();
        }

        public String getRoleCode() {
            return user.getRoleCode();
        }

        public boolean isReviewer() {
            return user.isReviewer();
        }

        public boolean isPartner() {
            return user.isPartner();
        }

        public boolean isAdmin() {
            return user.isAdmin();
        }

        public boolean isSuperAdmin() {
            return user.isSuperAdmin();
        }

        // UserDetails 인터페이스 구현
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return authorities;
        }

        @Override
        public String getPassword() {
            return user.getPassword();
        }

        @Override
        public String getUsername() {
            return user.getEmail();
        }

        @Override
        public boolean isAccountNonExpired() {
            return true; // 계정 만료 로직은 별도 구현 가능
        }

        @Override
        public boolean isAccountNonLocked() {
            return user.getStatus() != User.UserStatus.SUSPENDED &&
                   user.getStatus() != User.UserStatus.BLACKLISTED;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true; // 자격증명 만료 로직은 별도 구현 가능
        }

        @Override
        public boolean isEnabled() {
            return user.getStatus() == User.UserStatus.ACTIVE && user.getDeletedAt() == null;
        }
    }
}