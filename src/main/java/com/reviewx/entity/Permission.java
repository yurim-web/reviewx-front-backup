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
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id")
    private Long id;

    @Column(name = "permission_code", unique = true, nullable = false, length = 100)
    private String permissionCode; // CAMPAIGN_CREATE, REVIEW_APPROVE, USER_MANAGE 등

    @Column(name = "permission_name", nullable = false, length = 200)
    private String permissionName; // 캠페인 생성, 리뷰 승인, 사용자 관리 등

    @Column(name = "resource", length = 100)
    private String resource; // controller/page name (campaign, review, user 등)

    @Column(name = "action", length = 50)
    private String action; // READ, WRITE, DELETE, APPROVE, MANAGE 등

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
    @OneToMany(mappedBy = "permission", cascade = CascadeType.ALL)
    private List<RolePermission> rolePermissions = new ArrayList<>();

    // 편의 메서드
    public String getFullPermissionCode() {
        return this.resource + "_" + this.action;
    }

    public boolean isReadPermission() {
        return "READ".equals(this.action);
    }

    public boolean isWritePermission() {
        return "WRITE".equals(this.action);
    }

    public boolean isManagePermission() {
        return "MANAGE".equals(this.action);
    }

    // 정적 팩토리 메서드
    public static Permission create(String permissionCode, String permissionName, 
                                   String resource, String action, String description) {
        Permission permission = new Permission();
        permission.permissionCode = permissionCode;
        permission.permissionName = permissionName;
        permission.resource = resource;
        permission.action = action;
        permission.description = description;
        return permission;
    }
}