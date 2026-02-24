/**
 * 계정 찾기 모달 관리 컴포넌트
 *
 * 목적:
 * - 아이디/비밀번호 찾기 흐름에서 발생하는 모든 모달을 한 곳에서 관리합니다.
 * - 개별 모달(아이디 찾기 결과, SNS 로그인 유도)을
 *   부모 페이지에서 쉽게 제어할 수 있도록 props로 상태와 핸들러를 전달받습니다.
 *
 * 사용 페이지:
 * - 공용 계정찾기 페이지: src/components/common/find_account/page/FindAccountPage.tsx
 *   - /find-account, /partner/find-account 경로에서 사용
 * - 사용자 계정찾기 페이지: src/app/user/find-account/page.tsx
 *   - /user/find-account 경로에서 사용
 *
 *
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
