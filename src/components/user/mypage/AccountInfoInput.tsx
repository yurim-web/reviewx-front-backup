/* ========================================
   계좌 정보 입력 컴포넌트
   ======================================== */

/**
 * AccountInfoInput
 *
 * 목적: 본인 명의 계좌 정보(은행, 계좌번호, 예금주)를 입력하고 예금주를 조회하는 컴포넌트
 *
 * 사용 페이지:
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 */

"use client";

import { useState, useEffect, useRef } from "react";
import layoutStyles from "@/styles/user/mypage/edit_profile/edit_profile_layout.module.css";
import inputStyles from "@/styles/user/mypage/edit_profile/inputs.module.css";
import verificationStyles from "@/styles/user/mypage/edit_profile/verification.module.css";
import { CustomDropdown } from "@/components/partner/campaign_create_form/common/selectors/CustomDropdown";
import InputWithButton from "@/components/common/mypage/InputWithButton";
import ErrorText from "@/components/common/error_text/ErrorText";
import Image from "next/image";

const STORAGE_KEY = "userAccountVerification";

interface AccountInfoInputProps {
  accountHolder: string;
  bank: string;
  accountNumber: string;
  onAccountHolderChange: (value: string) => void;
  onBankChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  bankOptions: string[];
  onVerificationStatusChange?: (isVerified: boolean) => void;
  initialVerified?: boolean;
}

interface StoredAccount {
  bank?: string;
  account_number?: string;
  account_holder?: string;
}

/**
 * localStorage에서 인증 완료된 계좌 정보를 조회하는 헬퍼
 *
 * 우선순위:
 * 1. user_accounts에 일치하는 계좌가 있으면 반환
 * 2. STORAGE_KEY에 저장된 인증 정보가 일치하면 반환
 * 3. 일치하는 정보 없으면 null 반환
 */
function getStoredVerification(
  bank: string,
  accountNumber: string,
  accountHolder: string
): { queriedAccountHolder: string; accountHolderAtQueryTime: string } | null {
  if (typeof window === "undefined") return null;
  if (!bank?.trim() || !accountNumber || !String(accountNumber).trim() || !accountHolder?.trim()) {
    return null;
  }

  const bankValue = bank.trim();
  const accountNumberValue = String(accountNumber).trim();
  const accountHolderValue = accountHolder.trim();

  try {
    // 1순위: user_accounts에서 일치하는 계좌 확인
    const userAccounts = localStorage.getItem("user_accounts");
    if (userAccounts) {
      const accounts: StoredAccount[] = JSON.parse(userAccounts);
      const match = accounts.find(
        (acc) =>
          acc.bank === bankValue &&
          acc.account_number === accountNumberValue &&
          acc.account_holder === accountHolderValue
      );
      if (match) {
        return {
          queriedAccountHolder: accountHolderValue,
          accountHolderAtQueryTime: accountHolderValue,
        };
      }
    }

    // 2순위: localStorage STORAGE_KEY에 저장된 인증 정보 확인
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const verificationData = JSON.parse(stored);
      if (
        verificationData.bank === bankValue &&
        verificationData.accountNumber === accountNumberValue &&
        verificationData.accountHolder === accountHolderValue
      ) {
        return {
          queriedAccountHolder: verificationData.queriedAccountHolder,
          accountHolderAtQueryTime:
            verificationData.accountHolderAtQueryTime || verificationData.accountHolder,
        };
      }
    }
  } catch (_error) {
    // 읽기 실패 시 null 반환
  }

  return null;
}

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
  const [queriedAccountHolder, setQueriedAccountHolder] = useState<string | null>(null);
  const [accountHolderAtQueryTime, setAccountHolderAtQueryTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accountQueryError, setAccountQueryError] = useState<string | null>(null);
  const isInitialMount = useRef(true);
  const isFromQueryRef = useRef(false);

  /**
   * useEffect: 초기 마운트 시 initialVerified prop 또는 localStorage에서 인증 완료 상태 복원
   *
   * 우선순위:
   * 1. initialVerified === true + 계좌 정보 있음 → 서버 데이터로 인증 완료
   * 2. getStoredVerification()으로 user_accounts/localStorage에서 복원
   */
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    if (queriedAccountHolder && accountHolderAtQueryTime) {
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
      setQueriedAccountHolder(accountHolder.trim());
      setAccountHolderAtQueryTime(accountHolder.trim());
      return;
    }

    // 2순위: localStorage에서 인증 완료 정보 복원
    const stored = getStoredVerification(bank, accountNumber, accountHolder);
    if (stored) {
      setQueriedAccountHolder(stored.queriedAccountHolder);
      setAccountHolderAtQueryTime(stored.accountHolderAtQueryTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountHolder, bank, accountNumber, initialVerified]);

  /**
   * useEffect: 은행 또는 계좌번호가 변경되면 조회된 예금주 정보 초기화
   */
  useEffect(() => {
    if (!isInitialMount.current) {
      setQueriedAccountHolder(null);
      setAccountHolderAtQueryTime(null);
      onAccountHolderChange("");
      setAccountQueryError(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_error) {
          // 삭제 실패 시 무시
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank, accountNumber]);

  /**
   * useEffect: 예금주 입력값이 변경되면 인증 완료 상태 초기화
   */
  useEffect(() => {
    if (isFromQueryRef.current) {
      isFromQueryRef.current = false;
      return;
    }
    if (!isInitialMount.current) {
      setQueriedAccountHolder(null);
      setAccountHolderAtQueryTime(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_error) {
          // 삭제 실패 시 무시
        }
      }
    }
  }, [accountHolder]);

  /**
   * 예금주 조회 함수
   * TODO: 실제 API 엔드포인트로 변경 필요
   */
  const handleAccountHolderQuery = async () => {
    const bankValue = bank?.trim() || "";
    const accountNumberValue = String(accountNumber || "").trim();

    if (!bankValue || !accountNumberValue) {
      alert("은행과 계좌번호를 모두 입력해주세요.");
      return;
    }

    setAccountQueryError(null);
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const TEST_BANK = "우리은행";
      const TEST_ACCOUNT_NUMBER = "1234567890123";
      const TEST_ACCOUNT_HOLDER = "홍길동";

      const isTestAccount = bankValue === TEST_BANK && accountNumberValue === TEST_ACCOUNT_NUMBER;

      if (!isTestAccount) {
        setAccountQueryError("입력하신 정보와 예금주 정보가 일치하지 않습니다.");
        setIsLoading(false);
        return;
      }

      isFromQueryRef.current = true;
      setQueriedAccountHolder(TEST_ACCOUNT_HOLDER);
      onAccountHolderChange(TEST_ACCOUNT_HOLDER);
      setAccountHolderAtQueryTime(TEST_ACCOUNT_HOLDER);
      setAccountQueryError(null);
    } catch (_error) {
      alert("예금주 조회에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const isAccountHolderVerified: boolean = !!(
    queriedAccountHolder &&
    accountHolderAtQueryTime &&
    queriedAccountHolder.trim().toLowerCase() === accountHolderAtQueryTime.trim().toLowerCase()
  );

  /**
   * useEffect: 인증 완료 상태 변경 시 부모 컴포넌트에 알림
   */
  useEffect(() => {
    if (onVerificationStatusChange) {
      onVerificationStatusChange(isAccountHolderVerified);
    }
  }, [isAccountHolderVerified, onVerificationStatusChange]);

  /**
   * useEffect: 인증 완료 시 localStorage에 저장, 해제 시 삭제
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
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
          const verificationData = {
            bank: bank.trim(),
            accountNumber: String(accountNumber).trim(),
            accountHolder: accountHolder.trim(),
            queriedAccountHolder: queriedAccountHolder.trim(),
            accountHolderAtQueryTime: accountHolderAtQueryTime.trim(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(verificationData));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (_error) {
        // 저장/삭제 실패 시 무시
      }
    }
  }, [queriedAccountHolder, accountHolderAtQueryTime, bank, accountNumber, accountHolder]);

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
                  isAccountHolderVerified ? verificationStyles.account_holder_input_verified : ""
                }`}
                value={accountHolder}
                readOnly
                placeholder=""
              />
              {isAccountHolderVerified && (
                <div className={verificationStyles.account_holder_check_icon}>
                  <Image src="/images/icons/sign_ok.svg" alt="인증 완료" width={16} height={16} />
                </div>
              )}
            </div>
          }
          button={
            <button
              type="button"
              className={`${verificationStyles.postal_button} ${
                isAccountHolderVerified ? verificationStyles.postal_button_verified : ""
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
              {isLoading ? "조회 중..." : isAccountHolderVerified ? "인증 완료" : "예금주 조회"}
            </button>
          }
        />

        {!queriedAccountHolder && !accountQueryError && !accountHolderMismatchError && (
          <p className={inputStyles.field_helper_text}>
            입력하신 정보와 예금주 정보가 반드시 일치해야 출금이 가능합니다.
          </p>
        )}

        <ErrorText message={accountQueryError || accountHolderMismatchError} />
      </article>
    </>
  );
}
