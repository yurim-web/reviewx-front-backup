/* ========================================
   출금 신청 정보 커스텀 훅
   ======================================== */

/**
 * useWithdrawalInfo
 *
 * 목적: 출금 신청 페이지의 유저 정보 로드, 금액 계산, 유효성 검증,
 *       출금 신청 뮤테이션 로직을 관리합니다.
 *
 * 사용 페이지:
 * - /user/point/withdrawal_request (포인트 출금 신청)
 *
 * API:
 * - 34번: GET /user/point/withdrawal_request (진입 데이터)
 * - 35번: POST /user/point/withdrawal_request (출금 신청)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchWithdrawalInfo, submitWithdrawalRequest } from "@/lib/api/withdrawal";
import type { WithdrawalResponse, WithdrawalErrorResponse } from "@/types/api/withdrawal";
import type { AxiosError } from "axios";

// ========================================
// 타입 정의
// ========================================

export interface WithdrawalUserInfo {
  name: string;
  bank: string;
  accountNumber: string;
  availablePoints: number;
  minAmount: number;
  maxAmount: number;
}

export interface UseWithdrawalInfoReturn {
  userInfo: WithdrawalUserInfo;
  calculateNetAmount: (amount: number) => number;
  isAccountInfoValid: () => boolean;
  isLoading: boolean;
  isError: boolean;
  /** useMutation 반환값 */
  withdrawalMutation: ReturnType<
    typeof useMutation<WithdrawalResponse, AxiosError<WithdrawalErrorResponse>, number>
  >;
}

// ========================================
// 훅
// ========================================

export function useWithdrawalInfo(): UseWithdrawalInfoReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 34번 API: 출금 페이지 진입 데이터 조회
  const {
    data: infoData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["withdrawalInfo"],
    queryFn: fetchWithdrawalInfo,
    staleTime: 1000 * 60, // 1분 캐시
    enabled: !!user,
  });

  // 35번 API: 출금 신청 뮤테이션
  const withdrawalMutation = useMutation<
    WithdrawalResponse,
    AxiosError<WithdrawalErrorResponse>,
    number
  >({
    mutationFn: (requestedAmount: number) => submitWithdrawalRequest({ requestedAmount }),
    onSuccess: () => {
      // 포인트 내역 + 출금 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["userPoint"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawalInfo"] });
    },
  });

  // 백엔드 응답에서 정보 추출
  const bankAccount = infoData?.bankAccount;
  const policy = infoData?.withdrawalPolicy;

  const userInfo: WithdrawalUserInfo = {
    name: bankAccount?.accountHolder ?? "",
    bank: bankAccount?.bankName ?? "",
    accountNumber: bankAccount?.accountNumber ?? "",
    availablePoints: infoData?.balancePoint ?? 0,
    minAmount: policy?.minAmount ?? 10000,
    maxAmount: policy?.maxAmount ?? 500000,
  };

  const calculateNetAmount = (amount: number): number => Math.floor(amount * 0.967); // 3.3% 공제

  const isAccountInfoValid = (): boolean => bankAccount !== null && bankAccount !== undefined;

  return {
    userInfo,
    calculateNetAmount,
    isAccountInfoValid,
    isLoading: !!user && isLoading,
    isError,
    withdrawalMutation,
  };
}
