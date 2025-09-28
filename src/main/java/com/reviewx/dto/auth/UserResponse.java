package com.reviewx.dto.auth;

import com.reviewx.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class UserResponse {

    private Long id;
    private String email;
    private String name;
    private String nickname;
    private String phone;
    private LocalDateTime birthDate;
    private User.Gender gender;
    private String address;
    private String detailAddress;
    private String zipCode;
    private String profileImageUrl;
    private User.UserStatus status;
    private String roleCode;
    private String roleName;
    private Integer pointBalance;
    private Integer pendingWithdrawal;
    private Integer totalCampaigns;
    private Integer completedCampaigns;
    private Integer rejectedCount;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    // User 엔티티로부터 DTO 생성
    public static UserResponse from(User user) {
        UserResponse response = new UserResponse();
        response.id = user.getId();
        response.email = user.getEmail();
        response.name = user.getName();
        response.nickname = user.getNickname();
        response.phone = user.getPhone();
        response.birthDate = user.getBirthDate();
        response.gender = user.getGender();
        response.address = user.getAddress();
        response.detailAddress = user.getDetailAddress();
        response.zipCode = user.getZipCode();
        response.profileImageUrl = user.getProfileImageUrl();
        response.status = user.getStatus();
        response.roleCode = user.getRoleCode();
        response.roleName = user.getRoleName();
        response.pointBalance = user.getPointBalance();
        response.pendingWithdrawal = user.getPendingWithdrawal();
        response.totalCampaigns = user.getTotalCampaigns();
        response.completedCampaigns = user.getCompletedCampaigns();
        response.rejectedCount = user.getRejectedCount();
        response.createdAt = user.getCreatedAt();
        response.lastLoginAt = user.getLastLoginAt();
        return response;
    }
}