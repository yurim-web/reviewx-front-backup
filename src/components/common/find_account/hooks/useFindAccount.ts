/**
 * 계정 찾기 관련 로직을 관리하는 커스텀 훅
 *
 * 사용처:
 * - src/components/common/FindAccountPage.tsx
 */

import { useState } from "react";
import type { AccountInfo, AccountStatus } from "../types";

/** 테스트용 임시 계정 데이터 - 실제 구현 시 API 응답으로 교체 */
const TEMP_ACCOUNT_DATA: Record<string, AccountInfo> = {
  "01000000000": {
    email: "gdhong@naver.com",
    signupDate: "2025. 06. 01",
  },
  "01012345678": {
    email: "test@example.com",
    signupDate: "2024. 12. 15",
  },
};

/** 테스트용 휴대폰 번호별 계정 상태 데이터 - 실제 구현 시 API 응답으로 교체 */
const TEMP_PHONE_STATUS_DATA: Record<string, AccountStatus> = {
  "01000000000": "found",
  "01012345678": "found",
  "01011111111": "not_found",
  "01022222222": "blocked",
  "01033333333": "sns_only",
};

interface UseFindAccountReturn {
  email: string;
  emailError: string | undefined;
  foundAccountInfo: AccountInfo | null;
  isResultModalOpen: boolean;
  isPhoneAccountModalOpen: boolean;
  isAccountNotFoundModalOpen: boolean;
  isBlockedAccountModalOpen: boolean;
  setEmail: (value: string) => void;
  setEmailError: (value: string | undefined) => void;
  setIsResultModalOpen: (value: boolean) => void;
  setIsPhoneAccountModalOpen: (value: boolean) => void;
  setIsAccountNotFoundModalOpen: (value: boolean) => void;
  setIsBlockedAccountModalOpen: (value: boolean) => void;
  processAccountStatus: (
    status: AccountStatus,
    normalizedPhone: string,
    activeTab: "id" | "password"
  ) => void;
  handleNext: (
    isVerified: boolean,
    activeTab: "id" | "password",
    phone: string
  ) => Promise<void>;
  resetAccountState: () => void;
}

export function useFindAccount(): UseFindAccountReturn {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [foundAccountInfo, setFoundAccountInfo] = useState<AccountInfo | null>(
    null
  );
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [isPhoneAccountModalOpen, setIsPhoneAccountModalOpen] =
    useState<boolean>(false);
  const [isAccountNotFoundModalOpen, setIsAccountNotFoundModalOpen] =
    useState<boolean>(false);
  const [isBlockedAccountModalOpen, setIsBlockedAccountModalOpen] =
    useState<boolean>(false);

  /** 계정 상태에 따라 모달을 표시하는 헬퍼 함수 */
  const processAccountStatus = (
    status: AccountStatus,
    normalizedPhone: string,
    activeTab: "id" | "password"
  ) => {
    if (status === "found") {
      if (activeTab === "id") {
        const accountInfo = TEMP_ACCOUNT_DATA[normalizedPhone];
        if (accountInfo) {
          setFoundAccountInfo(accountInfo);
          setIsResultModalOpen(true);
        }
      } else {
        console.log("비밀번호 찾기 다음 단계로 진행");
        // TODO: router.push("/find-account/reset-password");
      }
      return;
    }

    if (status === "not_found") {
      setIsAccountNotFoundModalOpen(true);
      return;
    }

    if (status === "blocked") {
      setIsBlockedAccountModalOpen(true);
      return;
    }

    if (status === "sns_only") {
      setIsPhoneAccountModalOpen(true);
      return;
    }

    // 기본값: 등록되지 않은 번호일 때
    if (activeTab === "id") {
      const defaultAccountInfo: AccountInfo = {
        email: "user@example.com",
        signupDate: "2024. 01. 01",
      };
      setFoundAccountInfo(defaultAccountInfo);
      setIsResultModalOpen(true);
    } else {
      console.log("비밀번호 찾기 다음 단계로 진행");
      // TODO: router.push("/find-account/reset-password");
    }
  };

  /** 다음 버튼 클릭 핸들러 - 실제 구현 시 API를 호출하여 계정을 조회하고 모달 표시 */
  const handleNext = async (
    isVerified: boolean,
    activeTab: "id" | "password",
    phone: string
  ) => {
    if (!isVerified) {
      alert("휴대폰 인증을 완료해주세요.");
      return;
    }

    if (activeTab === "password" && !email) {
      setEmailError("아이디(이메일)를 입력해주세요.");
      return;
    }

    // ⚠️ 실제 API 연결 시 사용할 코드
    // try {
    //   const response = await findAccountAPI({
    //     phone,
    //     email: activeTab === "password" ? email : undefined,
    //     type: activeTab,
    //   });
    //   if (response.success) {
    //     processAccountStatus(response.data.status, phone.replace(/-/g, ""), activeTab);
    //   }
    // } catch (error) {
    //   console.error("계정 조회 오류:", error);
    //   alert("계정 조회 중 오류가 발생했습니다.");
    // }

    // 🧪 테스트용 코드 - 실제 API 연결 시 전체 삭제 필요
    const normalizedPhone = phone.replace(/-/g, "");
    const accountStatus = TEMP_PHONE_STATUS_DATA[normalizedPhone];
    processAccountStatus(
      accountStatus || "not_found",
      normalizedPhone,
      activeTab
    );
  };

  /** 계정 관련 상태 초기화 */
  const resetAccountState = () => {
    setEmail("");
    setEmailError(undefined);
    setFoundAccountInfo(null);
    setIsResultModalOpen(false);
    setIsPhoneAccountModalOpen(false);
    setIsAccountNotFoundModalOpen(false);
    setIsBlockedAccountModalOpen(false);
  };

  return {
    email,
    emailError,
    foundAccountInfo,
    isResultModalOpen,
    isPhoneAccountModalOpen,
    isAccountNotFoundModalOpen,
    isBlockedAccountModalOpen,
    setEmail,
    setEmailError,
    setIsResultModalOpen,
    setIsPhoneAccountModalOpen,
    setIsAccountNotFoundModalOpen,
    setIsBlockedAccountModalOpen,
    processAccountStatus,
    handleNext,
    resetAccountState,
  };
}
