package com.reviewx.config;

import com.reviewx.entity.Permission;
import com.reviewx.entity.Role;
import com.reviewx.entity.RolePermission;
import com.reviewx.entity.User;
import com.reviewx.repository.PermissionRepository;
import com.reviewx.repository.RoleRepository;
import com.reviewx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        initializeRoles();
        initializePermissions();
        initializeSuperAdmin();
    }

    /**
     * 기본 역할 데이터 초기화
     */
    private void initializeRoles() {
        if (roleRepository.findByRoleCode("REVIEWER").isEmpty()) {
            Role reviewerRole = Role.createReviewer();
            roleRepository.save(reviewerRole);
            log.info("Created REVIEWER role");
        }

        if (roleRepository.findByRoleCode("PARTNER").isEmpty()) {
            Role partnerRole = Role.createPartner();
            roleRepository.save(partnerRole);
            log.info("Created PARTNER role");
        }

        if (roleRepository.findByRoleCode("ADMIN").isEmpty()) {
            Role adminRole = Role.createAdmin();
            roleRepository.save(adminRole);
            log.info("Created ADMIN role");
        }

        if (roleRepository.findByRoleCode("SUPER_ADMIN").isEmpty()) {
            Role superAdminRole = Role.createSuperAdmin();
            roleRepository.save(superAdminRole);
            log.info("Created SUPER_ADMIN role");
        }
    }

    /**
     * 기본 권한 데이터 초기화
     */
    private void initializePermissions() {
        createPermissionIfNotExists("CAMPAIGN_READ", "캠페인 조회", "campaign", "READ", "캠페인 정보를 조회할 수 있습니다.");
        createPermissionIfNotExists("CAMPAIGN_WRITE", "캠페인 작성", "campaign", "WRITE", "캠페인을 등록하고 수정할 수 있습니다.");
        createPermissionIfNotExists("CAMPAIGN_MANAGE", "캠페인 관리", "campaign", "MANAGE", "모든 캠페인을 관리할 수 있습니다.");

        createPermissionIfNotExists("REVIEW_READ", "리뷰 조회", "review", "READ", "리뷰를 조회할 수 있습니다.");
        createPermissionIfNotExists("REVIEW_WRITE", "리뷰 작성", "review", "WRITE", "리뷰를 작성할 수 있습니다.");
        createPermissionIfNotExists("REVIEW_APPROVE", "리뷰 승인", "review", "APPROVE", "리뷰를 승인하거나 반려할 수 있습니다.");

        createPermissionIfNotExists("USER_READ", "사용자 조회", "user", "READ", "사용자 정보를 조회할 수 있습니다.");
        createPermissionIfNotExists("USER_MANAGE", "사용자 관리", "user", "MANAGE", "사용자를 관리할 수 있습니다.");

        createPermissionIfNotExists("SETTLEMENT_READ", "정산 조회", "settlement", "READ", "정산 정보를 조회할 수 있습니다.");
        createPermissionIfNotExists("SETTLEMENT_APPROVE", "정산 승인", "settlement", "APPROVE", "정산을 승인할 수 있습니다.");

        createPermissionIfNotExists("SYSTEM_MANAGE", "시스템 관리", "system", "MANAGE", "시스템을 관리할 수 있습니다.");
    }

    /**
     * 권한이 존재하지 않으면 생성
     */
    private void createPermissionIfNotExists(String code, String name, String resource, String action, String description) {
        if (permissionRepository.findByPermissionCode(code).isEmpty()) {
            Permission permission = Permission.create(code, name, resource, action, description);
            permissionRepository.save(permission);
            log.info("Created permission: {}", code);
        }
    }

    /**
     * 초기 슈퍼 관리자 계정 생성
     */
    private void initializeSuperAdmin() {
        String superAdminEmail = "superadmin@reviewx.com";

        if (userRepository.findByEmail(superAdminEmail).isEmpty()) {
            Role superAdminRole = roleRepository.findByRoleCode("SUPER_ADMIN")
                    .orElseThrow(() -> new RuntimeException("SUPER_ADMIN role not found"));

            User superAdmin = new User();
            superAdmin.setEmail(superAdminEmail);
            superAdmin.setPassword(passwordEncoder.encode("admin123!"));
            superAdmin.setName("시스템 관리자");
            superAdmin.setNickname("SuperAdmin");
            superAdmin.setPhone("010-0000-0000");
            superAdmin.setProvider(User.LoginProvider.LOCAL);
            superAdmin.setStatus(User.UserStatus.ACTIVE);
            superAdmin.setRole(superAdminRole);

            userRepository.save(superAdmin);
            log.info("Created super admin account: {}", superAdminEmail);
            log.info("Super admin password: admin123!");
        }
    }
}