package com.reviewx.service;

import com.reviewx.dto.auth.PasswordChangeRequest;
import com.reviewx.dto.auth.RegisterRequest;
import com.reviewx.dto.auth.UserResponse;
import com.reviewx.entity.Role;
import com.reviewx.entity.User;
import com.reviewx.exception.BusinessException;
import com.reviewx.exception.ErrorCode;
import com.reviewx.repository.RoleRepository;
import com.reviewx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 회원가입
     */
    public UserResponse registerUser(RegisterRequest request) {
        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // 닉네임 중복 확인
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new BusinessException(ErrorCode.NICKNAME_ALREADY_EXISTS);
        }

        // 기본 역할(REVIEWER) 조회
        Role reviewerRole = roleRepository.findByRoleCodeAndIsActive("REVIEWER")
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));

        // 사용자 엔티티 생성
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setNickname(request.getNickname());
        user.setPhone(request.getPhone());
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setDetailAddress(request.getDetailAddress());
        user.setZipCode(request.getZipCode());
        user.setProvider(User.LoginProvider.LOCAL);
        user.setStatus(User.UserStatus.ACTIVE);
        user.setRole(reviewerRole);

        User savedUser = userRepository.save(user);
        log.info("새 사용자 등록: {} ({})", savedUser.getName(), savedUser.getEmail());

        return UserResponse.from(savedUser);
    }

    /**
     * 현재 로그인된 사용자 정보 조회
     */
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        User user = getCurrentUserEntity();
        return UserResponse.from(user);
    }

    /**
     * 현재 로그인된 사용자 엔티티 조회
     */
    @Transactional(readOnly = true)
    public User getCurrentUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException(ErrorCode.USER_NOT_AUTHENTICATED);
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    /**
     * 사용자 정보 수정
     */
    public UserResponse updateUser(Long userId, RegisterRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 현재 사용자가 본인 정보를 수정하는지 확인
        User currentUser = getCurrentUserEntity();
        if (!currentUser.getId().equals(userId) && !currentUser.hasManagementAuthority()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        // 이메일 변경 시 중복 확인
        if (!user.getEmail().equals(request.getEmail()) &&
            userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // 닉네임 변경 시 중복 확인
        if (!user.getNickname().equals(request.getNickname()) &&
            userRepository.existsByNickname(request.getNickname())) {
            throw new BusinessException(ErrorCode.NICKNAME_ALREADY_EXISTS);
        }

        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setNickname(request.getNickname());
        user.setPhone(request.getPhone());
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setDetailAddress(request.getDetailAddress());
        user.setZipCode(request.getZipCode());

        User savedUser = userRepository.save(user);
        log.info("사용자 정보 수정: {} ({})", savedUser.getName(), savedUser.getEmail());

        return UserResponse.from(savedUser);
    }

    /**
     * 비밀번호 변경
     */
    public void changePassword(PasswordChangeRequest request) {
        if (!request.isNewPasswordMatching()) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        User user = getCurrentUserEntity();

        // 소셜 로그인 사용자는 비밀번호 변경 불가
        if (user.isSocialUser()) {
            throw new BusinessException(ErrorCode.SOCIAL_USER_PASSWORD_CHANGE_NOT_ALLOWED);
        }

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CURRENT_PASSWORD);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("비밀번호 변경: {}", user.getEmail());
    }

    /**
     * 마지막 로그인 시간 업데이트
     */
    public void updateLastLoginTime(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.updateLastLogin();
            userRepository.save(user);
        }
    }

    /**
     * 사용자 상태 변경 (관리자용)
     */
    public void changeUserStatus(Long userId, User.UserStatus status) {
        User currentUser = getCurrentUserEntity();
        if (!currentUser.hasManagementAuthority()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.setStatus(status);
        userRepository.save(user);

        log.info("사용자 상태 변경: {} -> {}", user.getEmail(), status);
    }

    /**
     * 사용자 역할 변경 (최고관리자용)
     */
    public void changeUserRole(Long userId, String roleCode) {
        User currentUser = getCurrentUserEntity();
        if (!currentUser.isSuperAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Role newRole = roleRepository.findByRoleCodeAndIsActive(roleCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));

        String oldRoleCode = user.getRoleCode();
        user.setRole(newRole);
        userRepository.save(user);

        log.info("사용자 역할 변경: {} {} -> {}", user.getEmail(), oldRoleCode, roleCode);
    }

    /**
     * 계정 소프트 삭제
     */
    public void deleteAccount() {
        User user = getCurrentUserEntity();
        user.softDelete();
        userRepository.save(user);

        log.info("계정 소프트 삭제: {}", user.getEmail());
    }

    /**
     * 이메일 중복 확인
     */
    @Transactional(readOnly = true)
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * 닉네임 중복 확인
     */
    @Transactional(readOnly = true)
    public boolean isNicknameExists(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
}