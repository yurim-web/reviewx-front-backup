/* ========================================
   계정 찾기 폼 상태 및 로직 관리 훅
   ======================================== */

/**
 * useFindAccount
 *
 * 목적: 아이디/비밀번호 찾기 폼 상태 및 로직 관리
 *
 * 사용 페이지:
 * - /user/find-account (사용자 계정 찾기)
 * - /partner/find-account (파트너 계정 찾기)
 */

import { useState } from "react";
import type { AccountInfo, AccountStatus } from "@/components/common/find_account/types";
import {
  findAccountByPhoneWithTypes,
  type UnifiedAccount,
  type AccountType,
} from "@/data/login/unifiedAccountData";

// ================================================================================================
// 🔧 유틸리티 함수 (Utility Functions)
// ================================================================================================

/**
 * 전화번호 정규화 함수
 *
 * 기능: 전화번호 문자열에서 하이픈(-)을 제거하여 숫자만 반환
 * 사용 목적: 화면에서는 하이픈 포함 번호를 사용하더라도, 로직에서는 항상 동일한 키로 비교하기 위함
 *
 * @param phone - 하이픈이 포함될 수 있는 전화번호 문자열 (예: "010-1111-1111")
 * @returns 하이픈이 제거된 전화번호 문자열 (예: "01011111111")
 */
const normalizePhone = (phone: string) => phone.replace(/-/g, "");

// ================================================================================================
// 📦 통합 계정 데이터 사용 (Unified Account Data)
// ================================================================================================

/**
 * 통합 계정 데이터에서 계정 상태 결정
 *
 * 기능: UnifiedAccount 정보를 기반으로 AccountStatus 결정
 *
 * @param account - 통합 계정 데이터
 * @returns AccountStatus
 */
const getAccountStatus = (account: UnifiedAccount): AccountStatus => {
  // 정지/탈퇴된 계정
  if (account.isBanned) {
    return "blocked";
  }

  // 유저 계정이고 SNS 타입이 있으면 SNS 전용 계정
  if (account.userType === "user" && account.snsType) {
    return "sns_only";
  }

  // 그 외는 찾은 계정
  return "found";
};

/**
 * 계정 타입별 우선순위 (같은 전화번호가 여러 계정 타입에 있을 경우)
 * partner > admin_ga > admin_sa > user
 */
const _ACCOUNT_TYPE_PRIORITY: Record<AccountType, number> = {
  partner: 4,
  admin_ga: 3,
  admin_sa: 2,
  user: 1,
};

/**
 * 통합 계정 데이터에서 계정 정보 추출 (AccountInfo 형식으로 변환)
 *
 * @param account - 통합 계정 데이터
 * @returns AccountInfo
 */
const toAccountInfo = (account: UnifiedAccount): AccountInfo => {
  return {
    email: account.email,
    signupDate: account.signupDate,
  };
};

// ================================================================================================
// 📝 타입 정의 (Type Definitions)
// ================================================================================================

/**
 * useFindAccount 훅의 반환 타입 인터페이스
 *
 * 기능: 훅에서 반환하는 모든 상태와 함수의 타입을 정의
 * 사용 목적: TypeScript 타입 안정성 보장 및 IDE 자동완성 지원
 */
interface UseFindAccountReturn {
  email: string;
  emailError: string | undefined;
  foundAccountInfo: AccountInfo | null;
  isResultModalOpen: boolean;
  isPhoneAccountModalOpen: boolean;
  accountNotFoundError: string | undefined; // 계정 없음 인라인 에러 메시지
  blockedAccountError: string | undefined; // 정지/탈퇴 계정 인라인 에러 메시지
  socialType: "kakao" | "naver"; // SNS 로그인 모달에 표시할 소셜 타입
  setEmail: (value: string) => void;
  setEmailError: (value: string | undefined) => void;
  setIsResultModalOpen: (value: boolean) => void;
  setIsPhoneAccountModalOpen: (value: boolean) => void;
  setAccountNotFoundError: (value: string | undefined) => void;
  setBlockedAccountError: (value: string | undefined) => void;
  processAccountStatus: (account: UnifiedAccount | undefined, activeTab: "id" | "password") => void;
  handleNext: (
    isVerified: boolean,
    activeTab: "id" | "password",
    phone: string
  ) => Promise<boolean>; // 성공 여부 반환 (true: 성공, false: 실패)
  resetAccountState: () => void;
}

interface UseFindAccountOptions {
  /** 조회를 허용할 계정 타입들 (예: ["user"] 또는 ["partner"]) */
  allowedAccountTypes?: AccountType[];
  /**
   * SNS 전용(유저 계정찾기)처럼 특정 테스트 번호만 “계정 있음”으로 처리할 때 사용
   * - 지정 시, 이 목록에 없는 번호는 무조건 "없는 계정" 처리
   */
  snsOnlyPhoneWhitelist?: string[];
}

// ================================================================================================
// 🎣 useFindAccount 커스텀 훅 (Custom Hook)
// ================================================================================================

/**
 * 계정 찾기 관련 로직을 관리하는 커스텀 훅
 *
 * 주요 기능:
 * - 계정 찾기 상태 관리 (이메일, 에러, 찾은 계정 정보 등)
 * - 모달 표시 상태 관리 (결과 모달, SNS 로그인 모달, 계정 없음 모달 등)
 * - 계정 조회 및 상태 처리 로직
 * - 계정 관련 상태 초기화
 */
export function useFindAccount(options: UseFindAccountOptions = {}): UseFindAccountReturn {
  // ============================================================================================
  // 📊 상태 관리 (State Management)
  // ============================================================================================

  /** 비밀번호 찾기 탭에서 사용하는 이메일 입력값 */
  const [email, setEmail] = useState<string>("");

  /** 이메일 입력 에러 메시지 */
  const [emailError, setEmailError] = useState<string | undefined>();

  /** 찾은 계정 정보 (이메일, 가입일) */
  const [foundAccountInfo, setFoundAccountInfo] = useState<AccountInfo | null>(null);

  /** 아이디 찾기 결과 모달 표시 여부 */
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);

  /** SNS 로그인 유도 모달 표시 여부 */
  const [isPhoneAccountModalOpen, setIsPhoneAccountModalOpen] = useState<boolean>(false);

  /** 계정 없음 인라인 에러 메시지 (인증 완료 후 바로 표시) */
  const [accountNotFoundError, setAccountNotFoundError] = useState<string | undefined>(undefined);

  /** 정지/탈퇴 계정 인라인 에러 메시지 */
  const [blockedAccountError, setBlockedAccountError] = useState<string | undefined>(undefined);

  /** SNS 로그인 모달에 표시할 소셜 타입 (카카오 또는 네이버) */
  const [socialType, setSocialType] = useState<"kakao" | "naver">("kakao");

  /**
   * 계정 상태에 따라 모달을 표시하는 헬퍼 함수
   *
   * 기능: 통합 계정 데이터를 기반으로 적절한 모달을 표시하거나 에러 메시지를 설정
   *
   * 처리 로직:
   * - "found": 계정을 찾았을 때 → 아이디 찾기 결과 모달 표시 또는 비밀번호 찾기 다음 단계로 진행
   * - "not_found": 계정을 찾지 못했을 때 → 인라인 에러 메시지 표시
   * - "blocked": 정지/탈퇴된 계정일 때 → 인라인 에러 메시지 표시
   * - "sns_only": SNS로만 가입된 계정일 때 → SNS 로그인 유도 모달 표시
   *
   * @param account - 통합 계정 데이터 (없으면 undefined)
   * @param activeTab - 현재 활성화된 탭 ("id" | "password")
   * @returns 성공 여부 (true: 성공, false: 실패/에러)
   */
  const processAccountStatus = (
    account: UnifiedAccount | undefined,
    activeTab: "id" | "password"
  ): boolean => {
    // ❌ 계정을 찾지 못했을 때 (인라인 에러 메시지 표시)
    if (!account) {
      setAccountNotFoundError("입력하신 정보와 일치하는 계정을 찾을 수 없습니다.");
      return false;
    }

    // 통합 계정 데이터에서 계정 상태 결정
    const status = getAccountStatus(account);

    // 디버깅: 계정 상태 확인
    // 🚫 정지/탈퇴된 계정일 때 (인라인 에러 메시지 표시)
    if (status === "blocked") {
      setBlockedAccountError("정지되었거나 탈퇴된 계정입니다.");
      return false;
    }

    // 🔐 SNS로만 가입된 계정일 때
    // 주의: SNS 로그인 유도 모달은 /user/find-account 페이지에서만 표시됩니다.
    // 공통 컴포넌트 FindAccountPage에서는 모달이 표시되지 않습니다.
    if (status === "sns_only") {
      // SNS로만 가입된 계정인 경우, 소셜 타입을 설정하고 모달 표시
      // (/user/find-account 페이지에서만 실제로 모달이 표시됨)
      setSocialType(account.snsType || "kakao");
      setIsPhoneAccountModalOpen(true);
      return false; // SNS 계정은 비밀번호 찾기 불가
    }

    // ✅ 계정을 찾았을 때
    if (status === "found") {
      if (activeTab === "id") {
        const accountInfo = toAccountInfo(account);
        setFoundAccountInfo(accountInfo);
        setIsResultModalOpen(true);
        return true; // 아이디 찾기 성공
      }
      // 비밀번호 찾기 탭인 경우: FindAccountPage에서 router.push("/reset-password") 처리
      return true; // 비밀번호 찾기 성공 (에러 없음)
    }

    return false;
  };

  // ============================================================================================
  // 🔘 다음 버튼 클릭 핸들러 (Next Button Click Handler)
  // ============================================================================================

  /**
   * 다음 버튼 클릭 핸들러
   *
   * 기능: 인증 완료 후 "다음" 버튼을 클릭했을 때 계정을 조회하고 결과에 따라 모달 표시
   *
   * 처리 흐름:
   * 1. 인증 완료 여부 확인 → 미완료 시 alert 표시 후 종료
   * 2. 비밀번호 찾기 탭인 경우 이메일 입력 여부 확인 → 미입력 시 에러 메시지 설정 후 종료
   * 3. 테스트용 목업 데이터로 계정 상태 조회 (실제 구현 시 API 호출로 교체)
   * 4. 계정이 없으면 인라인 에러 메시지 표시
   * 5. 계정이 있으면 에러 초기화 후 processAccountStatus 함수 호출하여 상태 처리
   *
   * 주의: 실제 구현 시 주석 처리된 API 호출 코드를 활성화하고 테스트용 코드는 삭제 필요
   *
   * @param isVerified - 휴대폰 인증 완료 여부
   * @param activeTab - 현재 활성화된 탭 ("id" | "password")
   * @param phone - 입력된 휴대폰 번호 (하이픈 포함 가능)
   */
  const handleNext = async (
    isVerified: boolean,
    activeTab: "id" | "password",
    phone: string
  ): Promise<boolean> => {
    if (!isVerified) {
      alert("휴대폰 인증을 완료해주세요.");
      return false;
    }

    if (activeTab === "password" && !email) {
      setEmailError("아이디(이메일)를 입력해주세요.");
      return false;
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
    //     return true;
    //   }
    //   return false;
    // } catch (_error) {
    //    //   alert("계정 조회 중 오류가 발생했습니다.");
    //   return false;
    // }

    // 🧪 테스트용 코드 - 실제 API 연결 시 전체 삭제 필요
    // 통합 계정 데이터에서 전화번호로 계정 찾기
    const normalized_input_phone = normalizePhone(phone);
    const normalized_whitelist = (options.snsOnlyPhoneWhitelist || []).map(normalizePhone);

    const is_phone_whitelisted =
      normalized_whitelist.length === 0 || normalized_whitelist.includes(normalized_input_phone);

    const foundAccount = is_phone_whitelisted
      ? findAccountByPhoneWithTypes(phone, options.allowedAccountTypes)
      : undefined;

    // 디버깅: 계정 조회 결과 확인
    // 에러 초기화
    setAccountNotFoundError(undefined);
    setBlockedAccountError(undefined);

    // 계정 상태 처리 및 성공 여부 확인
    const success = processAccountStatus(foundAccount, activeTab);

    // 비밀번호 찾기 탭인 경우: 이메일 에러도 확인
    if (activeTab === "password") {
      // 이메일 에러가 있으면 실패
      if (emailError) {
        return false;
      }
      // processAccountStatus가 성공했고 이메일 에러가 없으면 성공
      return success;
    }

    // 아이디 찾기 탭인 경우: processAccountStatus 결과 반환
    return success;
  };

  // ============================================================================================
  // 🔄 상태 초기화 함수 (State Reset Function)
  // ============================================================================================

  /**
   * 계정 관련 상태 초기화 함수
   *
   * 기능: 계정 찾기와 관련된 모든 상태를 초기값으로 리셋
   *
   * 초기화 대상:
   * - 이메일 입력값 및 에러
   * - 찾은 계정 정보
   * - 모든 모달 표시 상태 (결과 모달, SNS 모달)
   * - 계정 없음 인라인 에러 메시지
   * - 정지/탈퇴 계정 인라인 에러 메시지
   * - 소셜 타입 (기본값 "kakao"로 초기화)
   *
   * 사용 시점: 휴대폰 번호가 변경되거나 계정 찾기 프로세스를 처음부터 다시 시작할 때
   */
  const resetAccountState = () => {
    setEmail("");
    setEmailError(undefined);
    setFoundAccountInfo(null);
    setIsResultModalOpen(false);
    setIsPhoneAccountModalOpen(false);
    setAccountNotFoundError(undefined);
    setBlockedAccountError(undefined);
    setSocialType("kakao"); // 기본값으로 초기화
  };

  // ============================================================================================
  // 📤 반환값 (Return Values)
  // ============================================================================================

  /**
   * 훅에서 사용 가능한 모든 상태와 함수를 반환
   *
   * 반환 항목:
   * - 상태값: email, emailError, foundAccountInfo, 모달 표시 상태들, accountNotFoundError, blockedAccountError, socialType
   * - 상태 설정 함수들: setEmail, setEmailError, setIsResultModalOpen 등
   * - 핸들러 함수들: processAccountStatus, handleNext, resetAccountState
   */
  return {
    email,
    emailError,
    foundAccountInfo,
    isResultModalOpen,
    isPhoneAccountModalOpen,
    accountNotFoundError,
    blockedAccountError,
    socialType,
    setEmail,
    setEmailError,
    setIsResultModalOpen,
    setIsPhoneAccountModalOpen,
    setAccountNotFoundError,
    setBlockedAccountError,
    processAccountStatus,
    handleNext,
    resetAccountState,
  };
}
