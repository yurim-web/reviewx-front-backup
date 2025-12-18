/**
 * 계정 찾기 모달 관리 컴포넌트
 *
 * 목적:
 * - 아이디/비밀번호 찾기 흐름에서 발생하는 모든 모달을 한 곳에서 관리합니다.
 * - 개별 모달(아이디 찾기 결과, SNS 로그인 유도, 계정 없음, 정지/탈퇴 계정)을
 *   부모 페이지에서 쉽게 제어할 수 있도록 props로 상태와 핸들러를 전달받습니다.
 *
 * 사용처:
 * - 공용 계정찾기 페이지: src/components/common/FindAccountPage.tsx
 *   - /find-account, /partner/find-account 경로에서 사용
 * - 사용자 계정찾기 페이지: src/app/user/find-account/page.tsx
 *   - /user/find-account 경로에서 사용
 *

 */

"use client";

import AccountFoundModal from "./modal/AccountFoundModal";
import SNSLoginModal from "./modal/SNSLoginModal";
import AccountNotFoundModal from "./modal/AccountNotFoundModal";
import BlockedAccountModal from "./modal/BlockedAccountModal";
import type { AccountInfo } from "./types";

interface FindAccountModalsProps {
  /** 현재 활성화된 탭 */
  activeTab: "id" | "password";
  /** 아이디 찾기 결과 모달 표시 여부 */
  isResultModalOpen: boolean;
  /** SNS 로그인 유도 모달 표시 여부 */
  isPhoneAccountModalOpen: boolean;
  /** 계정을 찾을 수 없을 때 모달 표시 여부 */
  isAccountNotFoundModalOpen: boolean;
  /** 정지/탈퇴된 계정 모달 표시 여부 */
  isBlockedAccountModalOpen: boolean;
  /** 아이디 찾기 결과 데이터 */
  foundAccountInfo: AccountInfo | null;
  /** 결과 모달 닫기 핸들러 */
  onCloseResultModal: () => void;
  /** SNS 모달 닫기 핸들러 */
  onClosePhoneAccountModal: () => void;
  /** 계정 없음 모달 닫기 핸들러 */
  onCloseAccountNotFoundModal: () => void;
  /** 차단 계정 모달 닫기 핸들러 */
  onCloseBlockedAccountModal: () => void;
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
  isAccountNotFoundModalOpen,
  isBlockedAccountModalOpen,
  foundAccountInfo,
  onCloseResultModal,
  onClosePhoneAccountModal,
  onCloseAccountNotFoundModal,
  onCloseBlockedAccountModal,
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

      <AccountNotFoundModal
        isOpen={isAccountNotFoundModalOpen}
        onClose={onCloseAccountNotFoundModal}
      />

      <BlockedAccountModal
        isOpen={isBlockedAccountModalOpen}
        onClose={onCloseBlockedAccountModal}
      />
    </>
  );
}
