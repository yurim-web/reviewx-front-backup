package com.reviewx.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long id;

    @Column(name = "role_code", unique = true, nullable = false, length = 50)
    private String roleCode; // REVIEWER, PARTNER, ADMIN, SUPER_ADMIN

    @Column(name = "role_name", nullable = false, length = 100)
    private String roleName; // 참여자, 파트너, 일반관리자, 최고관리자

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 연관관계
    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL)
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL)
    private List<RolePermission> rolePermissions = new ArrayList<>();

    // 편의 메서드
    public boolean isReviewer() {
        return "REVIEWER".equals(this.roleCode);
    }

    public boolean isPartner() {
        return "PARTNER".equals(this.roleCode);
    }

    public boolean isAdmin() {
        return "ADMIN".equals(this.roleCode);
    }

    public boolean isSuperAdmin() {
        return "SUPER_ADMIN".equals(this.roleCode);
    }

    public boolean hasManagementAuthority() {
        return isAdmin() || isSuperAdmin();
    }

    public static Role createReviewer() {
        Role role = new Role();
        role.roleCode = "REVIEWER";
        role.roleName = "참여자";
        role.description = "캠페인에 참여하여 리뷰를 작성하는 일반 사용자";
        return role;
    }

    public static Role createPartner() {
        Role role = new Role();
        role.roleCode = "PARTNER";
        role.roleName = "파트너";
        role.description = "캠페인을 등록하고 관리하는 파트너 사용자";
        return role;
    }

    public static Role createAdmin() {
        Role role = new Role();
        role.roleCode = "ADMIN";
        role.roleName = "일반관리자";
        role.description = "캠페인 운영 관리, 참여자 검수, 정산 승인을 담당하는 관리자";
        return role;
    }

    public static Role createSuperAdmin() {
        Role role = new Role();
        role.roleCode = "SUPER_ADMIN";
        role.roleName = "최고관리자";
        role.description = "시스템 전체를 관리하고 정책을 수립하는 최고 권한자";
        return role;
    }
}