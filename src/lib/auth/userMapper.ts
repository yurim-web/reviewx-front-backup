/* ========================================
   UnifiedAccount → AuthUser 변환 유틸리티
   ======================================== */

/**
 * auth/userMapper
 *
 * 목적: UnifiedAccount 객체를 AuthUser 객체로 변환하는 함수 제공
 *       역할별 추가 정보(채널, 사업자 등)를 LocalStorage에서 병합합니다.
 *
 * 사용 페이지:
 * - src/lib/auth.ts (인증 메인 모듈)
 */

import { AuthUser, UserRole } from "@/types/auth";
import { type UnifiedAccount } from "@/data/login/unifiedAccountData";
import { StoredUserAccount, StoredPartnerAccount } from "./types";

// ========================================
// 리뷰어 기본 닉네임 매핑
// ========================================

const DEFAULT_NICKNAME_MAP: Record<string, string> = {
  user_kakao_001: "홍길동님별명",
  user_naver_001: "은지블로그",
};

// ========================================
// 리뷰어 정보 보강
// ========================================

function enrichReviewerInfo(authUser: AuthUser, account: UnifiedAccount): void {
  if (typeof window === "undefined") {
    authUser.grade = "gold";
    authUser.channels = [];
    return;
  }
  try {
    const storedAccounts = localStorage.getItem("user_accounts");
    if (storedAccounts) {
      const accounts = JSON.parse(storedAccounts);
      const userAccount = (accounts as StoredUserAccount[]).find(
        (a) => a.id === account.id || a.email === account.email
      );
      if (userAccount) {
        let nickname = userAccount.nickname || "";
        if (!nickname || nickname === userAccount.name) {
          nickname = DEFAULT_NICKNAME_MAP[userAccount.id || account.id] || "";
          if (nickname) {
            const accountIndex = (accounts as StoredUserAccount[]).findIndex(
              (a) => a.id === userAccount.id || a.email === userAccount.email
            );
            if (accountIndex >= 0) {
              accounts[accountIndex] = { ...accounts[accountIndex], nickname };
              localStorage.setItem("user_accounts", JSON.stringify(accounts));
            }
          }
        }
        authUser.id = String(userAccount.id || account.id);
        authUser.name = userAccount.name || account.name;
        authUser.nickname = nickname;
        authUser.phone = userAccount.phone;
        authUser.email = userAccount.email || account.email;
        authUser.address = userAccount.address;
        authUser.detail_address = userAccount.detail_address;
        authUser.postal_code = userAccount.postal_code;
        authUser.profile_image = userAccount.profile_image ?? undefined;
        authUser.channels = (userAccount.channels || []) as unknown as AuthUser["channels"];
        authUser.grade = (userAccount.grade || "gold") as AuthUser["grade"];
      } else {
        authUser.id = account.id;
        authUser.name = account.name;
        authUser.nickname = (account as UnifiedAccount & { nickname?: string }).nickname || "";
        authUser.phone = account.phone;
        authUser.grade = account.grade || "gold";
        authUser.channels = account.channels || [];
      }
    } else {
      authUser.id = account.id;
      authUser.name = account.name;
      authUser.nickname = (account as UnifiedAccount & { nickname?: string }).nickname || "";
      authUser.phone = account.phone;
      authUser.grade = account.grade || "gold";
      authUser.channels = account.channels || [];
    }
  } catch (_error) {
    authUser.grade = "gold";
    authUser.channels = [];
  }
}

// ========================================
// 파트너 정보 보강
// ========================================

function enrichPartnerInfo(authUser: AuthUser, account: UnifiedAccount): void {
  if (account.id) authUser.id = account.id;

  if (typeof window === "undefined") {
    authUser.business_name = account.business_name || "테스트 사업자";
    authUser.business_number = account.business_number || "123-45-67890";
    authUser.approval_status = account.approval_status || "approved";
    return;
  }
  try {
    const storedAccounts = localStorage.getItem("partner_accounts");
    if (storedAccounts) {
      const accounts = JSON.parse(storedAccounts);
      const partnerAccount = (accounts as StoredPartnerAccount[]).find(
        (a) => a.email === account.email
      );
      if (partnerAccount) {
        authUser.id = partnerAccount.id || authUser.id;
        authUser.name = partnerAccount.name || partnerAccount.representative_name || account.name;
        authUser.phone = partnerAccount.phone;
        authUser.business_name = partnerAccount.business_name;
        authUser.business_number = partnerAccount.business_number;
        authUser.approval_status = (partnerAccount.approval_status ||
          "approved") as AuthUser["approval_status"];
        authUser.representative_name = partnerAccount.representative_name;
        authUser.address = partnerAccount.address;
        authUser.detail_address = partnerAccount.detail_address;
        authUser.postal_code = partnerAccount.postal_code;
        authUser.contact_phone = partnerAccount.contact_phone;
        authUser.business_type = partnerAccount.business_type;
      } else {
        authUser.business_name = account.business_name || "테스트 사업자";
        authUser.business_number = account.business_number || "123-45-67890";
        authUser.approval_status = account.approval_status || "approved";
      }
    } else {
      authUser.business_name = account.business_name || "테스트 사업자";
      authUser.business_number = account.business_number || "123-45-67890";
      authUser.approval_status = account.approval_status || "approved";
    }
  } catch (_error) {
    authUser.business_name = account.business_name || "테스트 사업자";
    authUser.business_number = account.business_number || "123-45-67890";
    authUser.approval_status = account.approval_status || "approved";
  }
}

// ========================================
// 메인 변환 함수
// ========================================

export function mapToAuthUser(account: UnifiedAccount): AuthUser {
  let role: UserRole;
  switch (account.userType) {
    case "admin_sa":
      role = "manager_sa";
      break;
    case "admin_ga":
      role = "manager_ga";
      break;
    case "partner":
      role = "partner";
      break;
    case "user":
      role = "user";
      break;
    default:
      throw new Error("Unknown user type");
  }

  const authUser: AuthUser = {
    id: account.id || account.email,
    email: account.email,
    name: account.name || account.email.split("@")[0],
    role,
  };

  if (role === "user") {
    enrichReviewerInfo(authUser, account);
  } else if (role === "partner") {
    enrichPartnerInfo(authUser, account);
  } else if (role.startsWith("manager")) {
    authUser.admin_level = role === "manager_sa" ? "SA" : "GA";
    authUser.permissions = ["all"];
  }

  return authUser;
}
