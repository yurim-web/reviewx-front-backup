/* ========================================
   계정 찾기 모달 통합 관리 컴포넌트
   ======================================== */

/**
 * FindAccountModals
 *
 * 목적: 계정 찾기 흐름에서 발생하는 모든 모달(결과·SNS 로그인)을 한 곳에서 관리
 *
 * 사용 페이지:
 * - src/components/common/find_account/page/FindAccountPage.tsx
 * - /user/find-account (사용자 계정 찾기)
 */

"use client";

import AccountFoundModal from "./AccountFoundModal";
import SNSLoginModal from "./SNSLoginModal";
import type { AccountInfo } from "../types";

interface FindAccountModalsProps {
  /** 현재 활성화된 탭 */
  activeTab: "id" | "password";
  /** 아이디 찾기 결과 모달 표시 여부 */
  isResultModalOpen: boolean;
  /** SNS 로그인 유도 모달 표시 여부 */
  isPhoneAccountModalOpen: boolean;
  /** 아이디 찾기 결과 데이터 */
  foundAccountInfo: AccountInfo | null;
  /** 결과 모달 닫기 핸들러 */
  onCloseResultModal: () => void;
  /** SNS 모달 닫기 핸들러 */
  onClosePhoneAccountModal: () => void;
  /** 로그인 핸들러 */
  onLogin: () => void;
  /** 비밀번호 찾기 탭으로 전환 핸들러 */
  onSwitchToPasswordTab: () => void;
  /** 카카오 로그인 핸들러 */
  onKakaoLogin: () => void;
  /** 네이버 로그인 핸들러 */
  onNaverLogin?: () => void;
  /** 소셜 로그인 타입 (카카오 또는 네이버) */
  socialType?: "kakao" | "naver";
}

export default function FindAccountModals({
  activeTab,
  isResultModalOpen,
  isPhoneAccountModalOpen,
  foundAccountInfo,
  onCloseResultModal,
  onClosePhoneAccountModal,
  onLogin,
  onSwitchToPasswordTab,
  onKakaoLogin,
  onNaverLogin,
  socialType = "kakao",
}: FindAccountModalsProps) {
  return (
    <>
      <AccountFoundModal
        isOpen={isResultModalOpen && activeTab === "id"}
        onClose={onCloseResultModal}
        accountInfo={foundAccountInfo}
        onLogin={onLogin}
        onFindPassword={onSwitchToPasswordTab}
      />

      <SNSLoginModal
        isOpen={isPhoneAccountModalOpen}
        onClose={onClosePhoneAccountModal}
        socialType={socialType}
        onKakaoLogin={onKakaoLogin}
        onNaverLogin={onNaverLogin}
      />
    </>
  );
}
