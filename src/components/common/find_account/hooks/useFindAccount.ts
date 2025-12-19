/**
 * 계정 찾기 관련 로직을 관리하는 커스텀 훅
 *
 * 사용처:
 * - src/components/common/FindAccountPage.tsx
 */

import { useState } from "react";
import type { AccountInfo, AccountStatus } from "../types";
import { TEST_PHONE_NUMBERS } from "@/data/signup/testVerificationData";

/** 내부에서 사용할 공통 키: 전화번호 문자열에서 하이픈(-)을 제거한 값 */
const normalizePhone = (phone: string) => phone.replace(/-/g, "");

/** 테스트용 임시 계정 데이터 - 실제 구현 시 API 응답으로 교체
 *
 *  - 키 값은 테스트 휴대폰 번호 상수(TEST_PHONE_NUMBERS)를 normalizePhone으로
 *    가공한 값입니다. (숫자만 있는 문자열)
 *  - 이렇게 하면 화면에서는 하이픈 포함 번호(예: 010-1111-1111)를 사용하더라도,
 *    로직에서는 항상 동일한 키로 비교할 수 있습니다.
 */
const TEMP_ACCOUNT_DATA: Record<string, AccountInfo> = {
  [normalizePhone(TEST_PHONE_NUMBERS.EXISTING_NAVER)]: {
    email: "gdhong@naver.com",
    signupDate: "2025. 06. 01",
  },
  [normalizePhone(TEST_PHONE_NUMBERS.NORMAL)]: {
    email: "test@example.com",
    signupDate: "2024. 12. 15",
  },
};

/** 테스트용 휴대폰 번호별 계정 상태 데이터 - 실제 구현 시 API 응답으로 교체
 *
 *  - 값은 AccountStatus 타입으로, 계정 상태별로 어떤 모달을 띄울지 결정합니다.
 *  - 키 값은 TEST_PHONE_NUMBERS 상수를 normalizePhone으로 가공한 값입니다.
 */
const TEMP_PHONE_STATUS_DATA: Record<string, AccountStatus> = {
  [normalizePhone(TEST_PHONE_NUMBERS.EXISTING_NAVER)]: "sns_only", // 네이버로만 가입된 계정 (SNS 로그인 모달 표시)
  [normalizePhone(TEST_PHONE_NUMBERS.NORMAL)]: "found", // 일반 테스트 계정
  [normalizePhone(TEST_PHONE_NUMBERS.EXISTING_KAKAO)]: "sns_only", // 카카오로만 가입된 계정
  [normalizePhone(TEST_PHONE_NUMBERS.DUPLICATE)]: "blocked", // 예시: 정지/탈퇴 혹은 중복 계정 처리
};

/** 테스트용 휴대폰 번호별 소셜 로그인 타입 데이터 - 실제 구현 시 API 응답으로 교체
 *
 *  - SNS로만 가입된 계정의 경우, 어떤 소셜 로그인 버튼을 표시할지 결정합니다.
 *  - 키 값은 TEST_PHONE_NUMBERS 상수를 normalizePhone으로 가공한 값입니다.
 */
const TEMP_SOCIAL_TYPE_DATA: Record<string, "kakao" | "naver"> = {
  [normalizePhone(TEST_PHONE_NUMBERS.EXISTING_NAVER)]: "naver", // 네이버 로그인 버튼 표시
  [normalizePhone(TEST_PHONE_NUMBERS.EXISTING_KAKAO)]: "kakao", // 카카오 로그인 버튼 표시
};

interface UseFindAccountReturn {
  email: string;
  emailError: string | undefined;
  foundAccountInfo: AccountInfo | null;
  isResultModalOpen: boolean;
  isPhoneAccountModalOpen: boolean;
  isAccountNotFoundModalOpen: boolean;
  isBlockedAccountModalOpen: boolean;
  accountNotFoundError: string | undefined; // 계정 없음 인라인 에러 메시지
  socialType: "kakao" | "naver"; // SNS 로그인 모달에 표시할 소셜 타입
  setEmail: (value: string) => void;
  setEmailError: (value: string | undefined) => void;
  setIsResultModalOpen: (value: boolean) => void;
  setIsPhoneAccountModalOpen: (value: boolean) => void;
  setIsAccountNotFoundModalOpen: (value: boolean) => void;
  setIsBlockedAccountModalOpen: (value: boolean) => void;
  setAccountNotFoundError: (value: string | undefined) => void;
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
  // 계정 없음 인라인 에러 메시지 (인증 완료 후 바로 표시)
  const [accountNotFoundError, setAccountNotFoundError] = useState<
    string | undefined
  >(undefined);
  // SNS 로그인 모달에 표시할 소셜 타입 (카카오 또는 네이버)
  const [socialType, setSocialType] = useState<"kakao" | "naver">("kakao");

  /** 계정 상태에 따라 모달을 표시하는 헬퍼 함수 */
  const processAccountStatus = (
    status: AccountStatus,
    normalizedPhone: string,
    activeTab: "id" | "password"
  ) => {
    // ✅ 계정을 찾았을 때
    if (status === "found") {
      if (activeTab === "id") {
        const accountInfo = TEMP_ACCOUNT_DATA[normalizedPhone];
        if (accountInfo) {
          setFoundAccountInfo(accountInfo);
          setIsResultModalOpen(true);
        }
      } else {
        console.log("비밀번호 찾기 다음 단계로 진행");
        // TODO: router.push("/reset-password");
      }
      return;
    }

    // ❌ 계정을 찾지 못했을 때 (인라인 에러 메시지 표시)
    if (status === "not_found") {
      setAccountNotFoundError(
        "입력하신 정보와 일치하는 계정을 찾을 수 없습니다."
      );
      return;
    }

    // 🚫 정지/탈퇴된 계정일 때
    if (status === "blocked") {
      setIsBlockedAccountModalOpen(true);
      return;
    }

    // 🔐 SNS로만 가입된 계정일 때
    if (status === "sns_only") {
      // SNS로만 가입된 계정인 경우, 소셜 타입을 설정하고 모달 표시
      const socialTypeForPhone =
        TEMP_SOCIAL_TYPE_DATA[normalizedPhone] || "kakao";
      setSocialType(socialTypeForPhone);
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
      // TODO: router.push("/reset-password");
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
    const normalizedPhone = normalizePhone(phone);
    const accountStatus = TEMP_PHONE_STATUS_DATA[normalizedPhone];

    // 계정이 없으면 인라인 에러 표시
    if (!accountStatus || accountStatus === "not_found") {
      setAccountNotFoundError(
        "입력하신 정보와 일치하는 계정을 찾을 수 없습니다."
      );
      return;
    }

    // 계정이 있으면 에러 초기화하고 계정 상태 처리
    setAccountNotFoundError(undefined);
    processAccountStatus(accountStatus, normalizedPhone, activeTab);
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
    setAccountNotFoundError(undefined);
    setSocialType("kakao"); // 기본값으로 초기화
  };

  return {
    email,
    emailError,
    foundAccountInfo,
    isResultModalOpen,
    isPhoneAccountModalOpen,
    isAccountNotFoundModalOpen,
    isBlockedAccountModalOpen,
    accountNotFoundError,
    socialType,
    setEmail,
    setEmailError,
    setIsResultModalOpen,
    setIsPhoneAccountModalOpen,
    setIsAccountNotFoundModalOpen,
    setIsBlockedAccountModalOpen,
    setAccountNotFoundError,
    processAccountStatus,
    handleNext,
    resetAccountState,
  };
}
