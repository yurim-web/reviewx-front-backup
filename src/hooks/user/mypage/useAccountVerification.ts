/* ========================================
   계좌 인증 상태 커스텀 훅
   ======================================== */

/**
 * useAccountVerification
 *
 * 목적: 계좌번호 입력 → 예금주 조회 → 인증 완료 상태 관리 로직을 캡슐화합니다.
 *
 * 사용 페이지:
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 */

import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "userAccountVerification";

interface StoredAccount {
  bank?: string;
  account_number?: string;
  account_holder?: string;
}

interface StoredVerification {
  bank: string;
  accountNumber: string;
  accountHolder: string;
  queriedAccountHolder: string;
  accountHolderAtQueryTime: string;
}

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

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const verificationData: StoredVerification = JSON.parse(stored);
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

interface UseAccountVerificationParams {
  accountHolder: string;
  bank: string;
  accountNumber: string;
  onAccountHolderChange: (value: string) => void;
  onVerificationStatusChange?: (isVerified: boolean) => void;
  initialVerified?: boolean;
}

export interface UseAccountVerificationReturn {
  queriedAccountHolder: string | null;
  isLoading: boolean;
  accountQueryError: string | null;
  isAccountHolderVerified: boolean;
  accountHolderMismatchError: string | undefined;
  handleAccountHolderQuery: () => Promise<void>;
}

export function useAccountVerification({
  accountHolder,
  bank,
  accountNumber,
  onAccountHolderChange,
  onVerificationStatusChange,
  initialVerified = false,
}: UseAccountVerificationParams): UseAccountVerificationReturn {
  const [queriedAccountHolder, setQueriedAccountHolder] = useState<string | null>(null);
  const [accountHolderAtQueryTime, setAccountHolderAtQueryTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accountQueryError, setAccountQueryError] = useState<string | null>(null);
  const isInitialMount = useRef(true);
  const isFromQueryRef = useRef(false);

  // 초기 마운트 시 인증 상태 복원
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    if (queriedAccountHolder && accountHolderAtQueryTime) {
      return;
    }

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

    const stored = getStoredVerification(bank, accountNumber, accountHolder);
    if (stored) {
      setQueriedAccountHolder(stored.queriedAccountHolder);
      setAccountHolderAtQueryTime(stored.accountHolderAtQueryTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountHolder, bank, accountNumber, initialVerified]);

  // 은행 또는 계좌번호 변경 시 조회 정보 초기화
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

  // 예금주 입력값 변경 시 인증 상태 초기화
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

  const isAccountHolderVerified: boolean = !!(
    queriedAccountHolder &&
    accountHolderAtQueryTime &&
    queriedAccountHolder.trim().toLowerCase() === accountHolderAtQueryTime.trim().toLowerCase()
  );

  // 인증 상태 변경 시 부모에 알림
  useEffect(() => {
    if (onVerificationStatusChange) {
      onVerificationStatusChange(isAccountHolderVerified);
    }
  }, [isAccountHolderVerified, onVerificationStatusChange]);

  // 인증 완료 시 localStorage 저장, 해제 시 삭제
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
          const verificationData: StoredVerification = {
            bank: bank.trim(),
            accountNumber: String(accountNumber).trim(),
            accountHolder: accountHolder.trim(),
            queriedAccountHolder: queriedAccountHolder.trim(),
            accountHolderAtQueryTime: accountHolderAtQueryTime!.trim(),
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

  const handleAccountHolderQuery = async (): Promise<void> => {
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

  const accountHolderMismatchError =
    queriedAccountHolder && accountHolderAtQueryTime && !isAccountHolderVerified
      ? "입력하신 정보와 예금주 정보가 일치하지 않습니다."
      : undefined;

  return {
    queriedAccountHolder,
    isLoading,
    accountQueryError,
    isAccountHolderVerified,
    accountHolderMismatchError,
    handleAccountHolderQuery,
  };
}
