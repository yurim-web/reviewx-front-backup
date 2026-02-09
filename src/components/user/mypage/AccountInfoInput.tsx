/* ========================================
   💳 계좌 정보 입력 컴포넌트
   ======================================== */

/**
 * 계좌 정보 입력 컴포넌트
 *
 * 목적: 본인 명의 계좌 정보(예금주, 은행, 계좌번호)를 입력할 수 있는 컴포넌트입니다.
 *
 * 주요 기능:
 * - 예금주 입력
 * - 예금주 조회 (은행, 계좌번호로 조회)
 * - 은행 선택 (드롭다운)
 * - 계좌번호 입력
 * - 예금주 일치 여부 확인 및 안내 문구 표시
 *
 * 사용 위치:
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 *
 * 학습 포인트:
 * - useState: 컴포넌트 내부 상태 관리 (조회된 예금주, 로딩 상태)
 * - 조건부 렌더링: 조회된 예금주와 입력된 예금주 일치 여부에 따라 안내 문구 표시/숨김
 * - 비동기 함수: 예금주 조회 API 호출 (async/await)
 * - InputWithButton: 입력 필드와 버튼을 나란히 배치하는 재사용 컴포넌트
 */

"use client";

import { useState, useEffect, useRef } from "react";

// localStorage 키 상수
const STORAGE_KEY = "userAccountVerification";
import layoutStyles from "@/styles/user/mypage/edit_profile/layout.module.css";
import inputStyles from "@/styles/user/mypage/edit_profile/inputs.module.css";
import verificationStyles from "@/styles/user/mypage/edit_profile/verification.module.css";
import { CustomDropdown } from "@/components/partner/campaign_create_form/common/selectors/CustomDropdown";
import InputWithButton from "@/components/common/mypage/InputWithButton";
import ErrorText from "@/components/common/error_text/ErrorText";
import Image from "next/image";

interface AccountInfoInputProps {
  /** 예금주 */
  accountHolder: string;
  /** 은행 */
  bank: string;
  /** 계좌번호 */
  accountNumber: string;
  /** 예금주 변경 핸들러 */
  onAccountHolderChange: (value: string) => void;
  /** 은행 변경 핸들러 */
  onBankChange: (value: string) => void;
  /** 계좌번호 변경 핸들러 */
  onAccountNumberChange: (value: string) => void;
  /** 은행 옵션 목록 */
  bankOptions: string[];
  /** 인증 완료 상태 변경 핸들러 (부모 컴포넌트에 인증 완료 여부 전달) */
  onVerificationStatusChange?: (isVerified: boolean) => void;
  /** 초기 인증 완료 상태 (서버에서 받아온 데이터가 있으면 true) */
  initialVerified?: boolean;
}

/**
 * 계좌 정보 입력 컴포넌트
 *
 * React 컴포넌트 기본 구조:
 * - 함수형 컴포넌트: 화살표 함수로 정의
 * - Props 받기: 부모 컴포넌트에서 전달받은 데이터와 핸들러 함수들
 * - State 관리: 조회된 예금주 정보와 로딩 상태를 내부에서 관리
 */
export default function AccountInfoInput({
  accountHolder,
  bank,
  accountNumber,
  onAccountHolderChange,
  onBankChange,
  onAccountNumberChange,
  bankOptions,
  onVerificationStatusChange,
  initialVerified = false,
}: AccountInfoInputProps) {
  /**
   * useState 훅 사용
   *
   * 목적: 컴포넌트 내부 상태를 관리합니다.
   * - queriedAccountHolder: 은행, 계좌번호로 조회한 예금주 이름
   * - accountHolderAtQueryTime: 조회 시점의 입력된 예금주 값 (조회할 때의 입력값 저장)
   * - isLoading: 예금주 조회 API 호출 중인지 여부
   *
   * useState 동작 방식:
   * 1. 초기값 설정: useState(null) → queriedAccountHolder는 처음에 null
   * 2. 상태 업데이트: setQueriedAccountHolder('홍길동') 호출 시 상태 변경
   * 3. 리렌더링: 상태가 변경되면 컴포넌트가 자동으로 다시 렌더링됨
   *
   * accountHolderAtQueryTime이 필요한 이유:
   * - 조회 시점의 입력값을 저장하여, 조회 후 입력값이 변경되어도 인증 완료 상태 유지
   * - 조회할 때만 인증 완료 여부를 확인하기 위함
   */
  /**
   * 초기 로드 시 인증 완료 상태 초기값 설정
   *
   * 목적: 컴포넌트 최초 마운트 시 계좌 정보 초기 상태 설정
   *
   * useState 초기값 함수:
   * - 컴포넌트가 마운트될 때 한 번만 실행됨
   * - initialVerified가 true이고 계좌 정보가 모두 있으면: 서버에서 받아온 데이터 (인증 완료 상태)
   * - initialVerified가 false이거나 계좌 정보가 없으면: 최초 등록 상태 (인증 완료 아님)
   *
   * 구분:
   * - initialVerified === true: 서버에서 받아온 계좌 정보 → 인증 완료 상태로 초기화
   * - initialVerified === false: 최초 등록 또는 계좌 정보 없음 → null로 초기화
   */
  const [queriedAccountHolder, setQueriedAccountHolder] = useState<
    string | null
  >(null);

  const [accountHolderAtQueryTime, setAccountHolderAtQueryTime] = useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);
  // 계좌 정보 조회 실패 에러 메시지 상태
  const [accountQueryError, setAccountQueryError] = useState<string | null>(
    null,
  );
  // 초기 로드 여부를 추적하는 ref (초기 로드 시에만 인증 완료 상태 자동 설정)
  const isInitialMount = useRef(true);
  // 예금주 조회로 인한 변경인지 추적 (조회 성공 시 리셋 방지)
  const isFromQueryRef = useRef(false);

  /**
   * useEffect: 초기 마운트 시 initialVerified prop 또는 localStorage에서 인증 완료 상태 복원
   *
   * 목적:
   * - initialVerified가 true이고 계좌 정보가 모두 있으면 서버에서 받아온 데이터로 인증 완료 상태 설정
   * - localStorage에 저장된 인증 완료 정보가 있으면 복원
   *
   * 작동 방식:
   * - 컴포넌트 마운트 시 한 번만 실행 (isInitialMount.current가 true일 때)
   * - 1순위: user_accounts에 계좌 정보가 있으면 자동 인증
   * - 2순위: initialVerified가 true이고 계좌 정보가 모두 있으면 서버 데이터 사용
   * - 3순위: localStorage에 저장된 인증 정보가 있고 현재 계좌 정보와 일치하면 복원
   */
  useEffect(() => {
    // 초기 마운트 시 한 번만 실행
    if (isInitialMount.current) {
      isInitialMount.current = false; // 초기 마운트 완료 표시
    }

    // 이미 인증되어 있으면 다시 체크하지 않음
    if (queriedAccountHolder && accountHolderAtQueryTime) {
      console.log("✅ [계좌 인증 - 초기] 이미 인증 완료 상태");
      return;
    }

    // 1순위: initialVerified가 true이고 계좌 정보가 모두 있으면 서버에서 받아온 데이터 사용
    if (
      initialVerified &&
      accountHolder?.trim() &&
      bank?.trim() &&
      accountNumber &&
      String(accountNumber).trim()
    ) {
      // 서버에서 받아온 계좌 정보 → 인증 완료 상태
      console.log(
        "✅ [계좌 인증 - 초기] initialVerified가 true - 인증 완료 상태로 설정",
      );
      setQueriedAccountHolder(accountHolder.trim());
      setAccountHolderAtQueryTime(accountHolder.trim());
      return; // 서버 데이터가 있으면 localStorage 확인 생략
    }

    // 2순위: user_accounts에서 계좌 정보 확인 (가장 우선)
    // 계좌 정보가 모두 있을 때만 확인
    if (typeof window !== "undefined") {
      try {
        const accountHolderValue = accountHolder?.trim() || "";
        const bankValue = bank?.trim() || "";
        const accountNumberValue = String(accountNumber || "").trim();

        // 계좌 정보가 모두 있으면 user_accounts에서 확인
        if (accountHolderValue && bankValue && accountNumberValue) {
          const userAccounts = localStorage.getItem("user_accounts");
          if (userAccounts) {
            const accounts = JSON.parse(userAccounts);
            // 현재 계좌 정보와 일치하는 계정 찾기
            const matchingAccount = accounts.find((acc: any) => {
              const match =
                acc.bank === bankValue &&
                acc.account_number === accountNumberValue &&
                acc.account_holder === accountHolderValue;
              return match;
            });

            if (matchingAccount) {
              console.log(
                "✅ [계좌 인증 - 초기] user_accounts에서 계좌 정보 확인 - 인증 완료 상태로 설정",
              );
              setQueriedAccountHolder(accountHolderValue);
              setAccountHolderAtQueryTime(accountHolderValue);
              return; // user_accounts에서 찾았으면 더 이상 확인 불필요
            }
          }
        }
      } catch (error) {
        console.error("❌ [계좌 인증 - 초기] user_accounts 읽기 실패:", error);
      }
    }

    // 3순위: localStorage에서 인증 완료 정보 복원
    // 계좌 정보가 모두 입력되어 있을 때만 복원 시도
    if (
      typeof window !== "undefined" &&
      bank?.trim() &&
      accountNumber &&
      String(accountNumber).trim() &&
      accountHolder?.trim()
    ) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const verificationData = JSON.parse(stored);
          console.log("localStorage에서 복원 시도:", verificationData);
          console.log("현재 계좌 정보:", {
            bank: bank.trim(),
            accountNumber: String(accountNumber || "").trim(),
            accountHolder: accountHolder.trim(),
          });

          // 저장된 계좌 정보와 현재 입력된 계좌 정보가 일치하는지 확인
          if (
            verificationData.bank === bank.trim() &&
            verificationData.accountNumber ===
              String(accountNumber || "").trim() &&
            verificationData.accountHolder === accountHolder.trim()
          ) {
            // 계좌 정보가 일치하면 인증 완료 상태 복원
            console.log("계좌 정보 일치 - 인증 완료 상태 복원");
            setQueriedAccountHolder(verificationData.queriedAccountHolder);
            setAccountHolderAtQueryTime(
              verificationData.accountHolderAtQueryTime ||
                verificationData.accountHolder,
            );
          } else {
            // 계좌 정보가 일치하지 않으면 localStorage에서 삭제
            console.log(
              "계좌 정보 불일치 - localStorage 유지 (다른 계좌일 수 있음)",
            );
            // 일치하지 않아도 삭제하지 않음 (사용자가 다른 계좌를 입력했을 수도 있음)
          }
        } else {
          console.log("localStorage에 저장된 데이터 없음");
        }
      } catch (error) {
        console.error("localStorage 읽기 실패:", error);
        // 에러 발생 시 localStorage에서 삭제하여 깨진 데이터 제거
        localStorage.removeItem(STORAGE_KEY);
      }
    } else {
      console.log("계좌 정보가 비어있어 복원 불가");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountHolder, bank, accountNumber, initialVerified]); // 계좌 정보나 initialVerified가 변경되면 실행

  /**
   * useEffect: 계좌 정보가 변경되면 localStorage 또는 user_accounts에서 인증 완료 정보 복원 확인
   *
   * 목적: 부모 컴포넌트에서 localStorage를 통해 계좌 정보를 복원한 후, 인증 완료 상태도 복원합니다.
   *
   * 작동 방식:
   * - bank, accountNumber, accountHolder가 모두 입력되어 있고
   * - queriedAccountHolder가 없을 때 (아직 인증 완료 상태가 아닐 때)
   * - localStorage에서 인증 완료 정보 확인 및 복원
   * - user_accounts에서 계좌 정보가 있으면 자동으로 인증 완료 상태로 설정
   */
  useEffect(() => {
    // 계좌 정보가 모두 입력되어 있고, 아직 인증 완료 상태가 아닐 때
    if (
      typeof window !== "undefined" &&
      bank?.trim() &&
      accountNumber &&
      String(accountNumber).trim() &&
      accountHolder?.trim() &&
      !queriedAccountHolder
    ) {
      try {
        // 먼저 user_accounts에서 확인
        const userAccounts = localStorage.getItem("user_accounts");
        if (userAccounts) {
          const accounts = JSON.parse(userAccounts);
          const accountHolderValue = accountHolder.trim();
          const bankValue = bank.trim();
          const accountNumberValue = String(accountNumber).trim();

          // 현재 계좌 정보와 일치하는 계정이 있는지 확인
          const matchingAccount = accounts.find(
            (acc: any) =>
              acc.bank === bankValue &&
              acc.account_number === accountNumberValue &&
              acc.account_holder === accountHolderValue,
          );

          if (matchingAccount) {
            // user_accounts에 계좌 정보가 있으면 자동으로 인증 완료 상태로 설정
            console.log(
              "📦 [계좌 인증] user_accounts에서 계좌 정보 확인 - 인증 완료 상태로 설정",
            );
            setQueriedAccountHolder(accountHolderValue);
            setAccountHolderAtQueryTime(accountHolderValue);
            return;
          }
        }

        // user_accounts에 없으면 localStorage의 STORAGE_KEY에서 확인
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const verificationData = JSON.parse(stored);
          // 저장된 계좌 정보와 현재 입력된 계좌 정보가 일치하는지 확인
          if (
            verificationData.bank === bank.trim() &&
            verificationData.accountNumber ===
              String(accountNumber || "").trim() &&
            verificationData.accountHolder === accountHolder.trim()
          ) {
            // 계좌 정보가 일치하면 인증 완료 상태 복원
            console.log("계좌 정보 변경 감지 - 인증 완료 상태 복원");
            setQueriedAccountHolder(verificationData.queriedAccountHolder);
            setAccountHolderAtQueryTime(
              verificationData.accountHolderAtQueryTime ||
                verificationData.accountHolder,
            );
          }
        }
      } catch (error) {
        console.error("localStorage 읽기 실패:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank, accountNumber, accountHolder, queriedAccountHolder]); // 계좌 정보가 변경될 때마다 실행

  /**
   * useEffect 훅 사용
   *
   * 목적: 은행이나 계좌번호가 변경되면 조회된 예금주 정보를 초기화합니다.
   *
   * useEffect 동작 방식:
   * - 첫 번째 인자: 실행할 함수 (은행 또는 계좌번호 변경 시 실행)
   * - 두 번째 인자: 의존성 배열 [bank, accountNumber]
   *   - bank나 accountNumber가 변경되면 함수가 실행됨
   *   - 빈 배열 []이면 컴포넌트 마운트 시에만 실행
   *
   * 왜 초기화가 필요한가?
   * - 사용자가 은행이나 계좌번호를 변경하면 이전 조회 결과는 더 이상 유효하지 않음
   * - 새로운 계좌 정보로 다시 조회해야 하므로 이전 결과를 지워야 함
   *
   * 주의: 초기 로드 시에는 실행되지 않도록 함 (isInitialMount.current로 체크)
   */
  useEffect(() => {
    // 초기 로드가 아닐 때만 실행 (사용자가 실제로 값을 변경한 경우)
    if (!isInitialMount.current) {
      // 은행이나 계좌번호가 변경되면 조회된 예금주 정보 초기화
      setQueriedAccountHolder(null);
      setAccountHolderAtQueryTime(null);
      onAccountHolderChange(""); // 예금주 입력란도 초기화 (조회를 통해 다시 입력)
      // 에러 메시지도 초기화
      setAccountQueryError(null);
      // localStorage에서도 삭제 (계좌 정보가 변경되었으므로 이전 인증 정보 무효)
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
          console.error("localStorage 삭제 실패:", error);
        }
      }
    }
  }, [bank, accountNumber]);

  /**
   * useEffect 훅 사용: 예금주 입력값 변경 감지
   *
   * 목적: 예금주 입력값이 변경되면 인증 완료 상태를 초기화합니다.
   *
   * 작동 방식:
   * - accountHolder가 변경되면 실행
   * - 조회된 예금주 정보와 조회 시점 입력값 초기화
   * - 인증 완료 상태 해제 (버튼이 "인증 완료"에서 "예금주 조회"로 변경)
   *
   * 왜 초기화가 필요한가?
   * - 사용자가 예금주를 변경하면 이전 조회 결과는 더 이상 유효하지 않음
   * - 다시 조회해야 하므로 인증 완료 상태를 해제해야 함
   *
   * 주의: 초기 로드 시에는 실행되지 않도록 함 (isInitialMount.current로 체크)
   */
  useEffect(() => {
    // 예금주 조회로 인한 변경이면 리셋하지 않음
    if (isFromQueryRef.current) {
      isFromQueryRef.current = false;
      return;
    }
    // 초기 로드가 아닐 때만 실행 (은행/계좌번호 변경으로 인한 초기화 등)
    if (!isInitialMount.current) {
      // 예금주 입력값이 변경되면 조회된 예금주 정보 초기화
      setQueriedAccountHolder(null);
      setAccountHolderAtQueryTime(null);
      // localStorage에서도 삭제 (예금주가 변경되었으므로 이전 인증 정보 무효)
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
          console.error("localStorage 삭제 실패:", error);
        }
      }
    }
  }, [accountHolder]);

  /**
   * 예금주 조회 함수
   *
   * 기능: 은행과 계좌번호를 입력받아 예금주를 조회합니다.
   *
   * 비동기 처리 (async/await):
   * - async: 함수가 비동기 함수임을 선언
   * - await: API 호출이 완료될 때까지 기다림
   * - try/catch: 에러 발생 시 처리
   *
   * 작동 순서:
   * 1. 은행과 계좌번호 입력 여부 확인
   * 2. 로딩 상태 true로 설정 (버튼 비활성화 등에 사용)
   * 3. API 호출하여 예금주 조회
   * 4. 조회 결과를 queriedAccountHolder에 저장
   * 5. 로딩 상태 false로 설정
   * 6. 에러 발생 시 콘솔에 에러 출력
   *
   * TODO: 실제 API 엔드포인트로 변경 필요
   * 예: const response = await fetch('/api/account/holder', {
   *       method: 'POST',
   *       body: JSON.stringify({ bank, accountNumber })
   *     });
   */
  const handleAccountHolderQuery = async () => {
    // 은행과 계좌번호가 모두 입력되었는지 확인
    // accountNumber는 type="number"이므로 문자열로 변환하여 확인
    const bankValue = bank?.trim() || "";
    const accountNumberValue = String(accountNumber || "").trim();

    if (!bankValue || !accountNumberValue) {
      alert("은행과 계좌번호를 모두 입력해주세요.");
      return;
    }

    // 이전 에러 메시지 초기화
    setAccountQueryError(null);

    // 로딩 상태 시작
    setIsLoading(true);

    try {
      // TODO: 실제 API 호출로 변경 필요
      // 임시: 1초 후 예금주 반환 (테스트용)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 테스트용 계좌 정보: 특정 은행과 계좌번호 조합에 대해서만 "홍길동" 반환
      const TEST_BANK = "우리은행";
      const TEST_ACCOUNT_NUMBER = "1234567890123";
      const TEST_ACCOUNT_HOLDER = "홍길동";

      // 입력된 은행과 계좌번호가 테스트 데이터와 일치하는지 확인
      const isTestAccount =
        bankValue === TEST_BANK && accountNumberValue === TEST_ACCOUNT_NUMBER;

      let mockQueriedAccountHolder: string;

      if (isTestAccount) {
        // 테스트 계좌 정보와 일치하면 "홍길동" 반환
        mockQueriedAccountHolder = TEST_ACCOUNT_HOLDER;
      } else {
        // 일치하지 않으면 에러 처리 (실제 API에서는 계좌 정보가 없거나 에러 반환)
        setAccountQueryError(
          "입력하신 정보와 예금주 정보가 일치하지 않습니다.",
        );
        setIsLoading(false);
        return;
      }

      // 조회된 예금주 저장 및 입력 필드에 자동 입력
      isFromQueryRef.current = true;
      setQueriedAccountHolder(mockQueriedAccountHolder);
      onAccountHolderChange(mockQueriedAccountHolder);
      setAccountHolderAtQueryTime(mockQueriedAccountHolder);

      // 조회 성공 시 에러 메시지 초기화
      setAccountQueryError(null);
    } catch (error) {
      console.error("예금주 조회 실패:", error);
      alert("예금주 조회에 실패했습니다. 다시 시도해주세요.");
    } finally {
      // 로딩 상태 종료 (성공/실패 관계없이 실행됨)
      setIsLoading(false);
    }
  };

  /**
   * 예금주 인증 완료 여부 확인
   *
   * 기능: 조회된 예금주와 조회 시점의 입력된 예금주가 일치하는지 확인합니다.
   *
   * 인증 완료 조건:
   * - 조회한 예금주가 있고 (queriedAccountHolder)
   * - 조회 시점의 입력된 예금주가 있고 (accountHolderAtQueryTime)
   * - 둘이 일치할 때 인증 완료
   *
   * 중요한 점:
   * - 조회 시점의 입력값(accountHolderAtQueryTime)과 비교
   * - 현재 입력값(accountHolder)과 비교하지 않음
   * - 조회 후 입력값이 변경되어도 인증 완료 상태 유지
   *
   * 논리 연산자 (&&):
   * - queriedAccountHolder && accountHolderAtQueryTime: 둘 다 truthy 값인지 확인
   * - .trim(): 앞뒤 공백 제거
   * - .toLowerCase(): 대소문자 구분 없이 비교
   * - === : 정확히 일치하는지 확인
   */
  const isAccountHolderVerified: boolean = !!(
    queriedAccountHolder &&
    accountHolderAtQueryTime &&
    queriedAccountHolder.trim().toLowerCase() ===
      accountHolderAtQueryTime.trim().toLowerCase()
  );

  /**
   * useEffect: 인증 완료 상태 변경 시 부모 컴포넌트에 알림
   *
   * 목적: 부모 컴포넌트에서 저장하기 버튼 활성화 여부를 판단하기 위해 인증 완료 상태를 전달합니다.
   *
   * 작동 방식:
   * - isAccountHolderVerified가 변경될 때마다 부모 컴포넌트에 알림
   */
  useEffect(() => {
    // 부모 컴포넌트에 인증 완료 상태 전달
    if (onVerificationStatusChange) {
      onVerificationStatusChange(isAccountHolderVerified);
    }
  }, [isAccountHolderVerified, onVerificationStatusChange]);

  /**
   * useEffect: 인증 완료 시 localStorage에 저장
   *
   * 목적: 인증 완료 시 계좌 정보를 localStorage에 저장하여 다음 로드 시 복원합니다.
   *
   * 작동 방식:
   * - queriedAccountHolder와 accountHolderAtQueryTime이 변경될 때마다 실행
   * - 인증 완료 상태이면 localStorage에 저장
   * - 인증 완료 해제 시 localStorage에서 삭제
   */
  useEffect(() => {
    // localStorage 저장/삭제
    if (typeof window !== "undefined") {
      try {
        // 인증 완료 상태 확인
        const isVerified =
          queriedAccountHolder &&
          accountHolderAtQueryTime &&
          queriedAccountHolder.trim().toLowerCase() ===
            accountHolderAtQueryTime.trim().toLowerCase();

        if (
          isVerified &&
          queriedAccountHolder &&
          bank?.trim() &&
          accountNumber &&
          accountHolder?.trim()
        ) {
          // 인증 완료 시 localStorage에 저장
          const verificationData = {
            bank: bank.trim(),
            accountNumber: String(accountNumber).trim(),
            accountHolder: accountHolder.trim(),
            queriedAccountHolder: queriedAccountHolder.trim(),
            accountHolderAtQueryTime: accountHolderAtQueryTime.trim(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(verificationData));
          console.log("인증 완료 정보 저장:", verificationData);
        } else {
          // 인증 완료 해제 시 localStorage에서 삭제
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error("localStorage 저장/삭제 실패:", error);
      }
    }
  }, [
    queriedAccountHolder,
    accountHolderAtQueryTime,
    bank,
    accountNumber,
    accountHolder,
  ]);

  /**
   * 예금주 일치 여부 확인
   *
   * 기능: 조회된 예금주와 조회 시점의 입력된 예금주가 일치하지 않을 때 에러 메시지를 반환합니다.
   *
   * 에러 메시지 표시 조건:
   * - 조회한 예금주가 있고 (queriedAccountHolder)
   * - 조회 시점의 입력된 예금주가 있고 (accountHolderAtQueryTime)
   * - 둘이 일치하지 않을 때만 에러 메시지 표시
   *
   * 작동 방식:
   * 1. queriedAccountHolder가 null이면: 아직 조회하지 않음 → 에러 없음
   * 2. queriedAccountHolder가 있고 일치하면: 에러 없음 (인증 완료)
   * 3. queriedAccountHolder가 있고 불일치하면: 에러 메시지 표시
   */
  const accountHolderMismatchError =
    queriedAccountHolder && accountHolderAtQueryTime && !isAccountHolderVerified
      ? "입력하신 정보와 예금주 정보가 일치하지 않습니다."
      : undefined;

  return (
    <>
      {/* 은행 */}
      <article className={layoutStyles.field_article}>
        <label className={inputStyles.field_label} htmlFor="bank">
          은행
        </label>
        <CustomDropdown
          value={bank}
          options={bankOptions}
          onChange={onBankChange}
          placeholder="은행 선택"
        />
      </article>

      {/* 계좌번호 */}
      <article className={layoutStyles.field_article}>
        <label className={inputStyles.field_label} htmlFor="accountNumber">
          계좌번호
        </label>
        <input
          type="number"
          id="accountNumber"
          name="accountNumber"
          className={inputStyles.input_field}
          value={accountNumber}
          onChange={(e) => onAccountNumberChange(e.target.value)}
          placeholder="- 제외"
        />
      </article>

      {/* 예금주 */}
      <article className={layoutStyles.field_article}>
        <label className={inputStyles.field_label} htmlFor="accountHolder">
          예금주
        </label>

        <InputWithButton
          input={
            <div className={verificationStyles.phone_input_container}>
              <input
                type="text"
                id="accountHolder"
                name="accountHolder"
                className={`${inputStyles.input_field} ${verificationStyles.account_holder_input} ${
                  isAccountHolderVerified
                    ? verificationStyles.account_holder_input_verified
                    : ""
                }`}
                value={accountHolder}
                readOnly
                placeholder=""
              />
              {isAccountHolderVerified && (
                <div className={verificationStyles.account_holder_check_icon}>
                  <Image
                    src="/images/icons/sign_ok.svg"
                    alt="인증 완료"
                    width={16}
                    height={16}
                  />
                </div>
              )}
            </div>
          }
          button={
            <button
              type="button"
              className={`${verificationStyles.postal_button} ${
                isAccountHolderVerified
                  ? verificationStyles.postal_button_verified
                  : ""
              }`}
              onClick={handleAccountHolderQuery}
              disabled={
                isLoading ||
                isAccountHolderVerified ||
                !bank ||
                bank.trim().length === 0 ||
                !accountNumber ||
                String(accountNumber).trim().length === 0
              }
            >
              {isLoading
                ? "조회 중..."
                : isAccountHolderVerified
                  ? "인증 완료"
                  : "예금주 조회"}
            </button>
          }
        />

        {/* 디폴트 안내 문구: 조회하지 않았고 에러도 없을 때만 표시 */}
        {!queriedAccountHolder &&
          !accountQueryError &&
          !accountHolderMismatchError && (
            <p className={inputStyles.field_helper_text}>
              입력하신 정보와 예금주 정보가 반드시 일치해야 출금이 가능합니다.
            </p>
          )}

        {/* 에러 메시지: 계좌 정보 조회 실패 또는 입력된 예금주와 조회된 예금주가 일치하지 않을 때 표시 */}
        <ErrorText message={accountQueryError || accountHolderMismatchError} />
      </article>
    </>
  );
}
