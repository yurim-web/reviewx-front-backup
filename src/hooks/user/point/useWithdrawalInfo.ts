/* ========================================
   출금 신청 정보 커스텀 훅
   ======================================== */

/**
 * useWithdrawalInfo
 *
 * 목적: 출금 신청 페이지의 유저 정보 로드, 금액 계산, 유효성 검증 로직을 관리합니다.
 *
 * 사용 페이지:
 * - /user/point/withdrawal_request (포인트 출금 신청)
 */

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchReviewerPoint, postWithdrawalRequest } from "@/lib/api/point";
import { pointSummary } from "@/data/user/point/pointData";

interface LocalUserAccount {
  id?: string;
  email?: string;
  account_holder?: string;
  name?: string;
  bank?: string;
  account_number?: string;
  ssn_front?: string;
  ssn_back?: string;
  available_points?: number;
  pending_points?: number;
  last_withdrawal_date?: string;
  point_history?: {
    id: string;
    type: string;
    amount: number;
    description: string;
    date: string;
    status: string;
    balance: number;
  }[];
}

export interface WithdrawalUserInfo {
  name: string;
  bank: string;
  accountNumber: string;
  residentNumber: string;
  availablePoints: number;
  lastWithdrawalDate: Date | null;
}

export interface UseWithdrawalInfoReturn {
  userInfo: WithdrawalUserInfo;
  calculateNetAmount: (amount: number) => number;
  getDaysSinceLastWithdrawal: () => number | null;
  canWithdraw: () => boolean;
  isAccountInfoValid: () => boolean;
  submitWithdrawal: (amount: number, netAmount: number) => void;
}

function getReviewerId(userId: string): number {
  if (userId.includes("kakao")) return 1;
  if (userId.includes("naver")) return 2;
  return 1;
}

export function useWithdrawalInfo(): UseWithdrawalInfoReturn {
  const { user } = useAuth();
  const reviewerId = user ? getReviewerId(user.id) : 0;

  // 포인트 잔액 (API)
  const { data: reviewerData } = useQuery({
    queryKey: ["reviewerPoint", reviewerId],
    queryFn: () => fetchReviewerPoint(reviewerId),
    enabled: reviewerId > 0,
    staleTime: 30_000,
  });

  const [userInfo, setUserInfo] = useState<WithdrawalUserInfo>({
    name: "",
    bank: "",
    accountNumber: "",
    residentNumber: "",
    availablePoints: 0,
    lastWithdrawalDate: null,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      try {
        const storedAccounts = localStorage.getItem("user_accounts");
        if (storedAccounts) {
          const accounts: LocalUserAccount[] = JSON.parse(storedAccounts);
          const userAccount = accounts.find((a) => a.id === user.id || a.email === user.email);
          if (userAccount) {
            setUserInfo({
              name: userAccount.account_holder ?? userAccount.name ?? "",
              bank: userAccount.bank ?? "",
              accountNumber: userAccount.account_number ?? "",
              residentNumber:
                userAccount.ssn_front && userAccount.ssn_back
                  ? `${userAccount.ssn_front}-${userAccount.ssn_back}`
                  : "",
              // availablePoints는 useEffect 밖에서 API 데이터로 덮어씀
              availablePoints: userAccount.available_points ?? 0,
              lastWithdrawalDate: userAccount.last_withdrawal_date
                ? new Date(userAccount.last_withdrawal_date)
                : null,
            });
          }
        }
      } catch {
        // localStorage 읽기 실패 시 무시
      }
    }
  }, [user]);

  const calculateNetAmount = (amount: number): number => Math.floor(amount * 0.967);

  const getDaysSinceLastWithdrawal = (): number | null => {
    if (!userInfo.lastWithdrawalDate) return null;
    const today = new Date();
    const lastDate = new Date(userInfo.lastWithdrawalDate);
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    return Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const canWithdraw = (): boolean => {
    const daysSince = getDaysSinceLastWithdrawal();
    return daysSince === null || daysSince >= 7;
  };

  const isAccountInfoValid = (): boolean =>
    userInfo.name.trim() !== "" &&
    userInfo.bank.trim() !== "" &&
    userInfo.accountNumber.trim() !== "" &&
    userInfo.residentNumber.trim() !== "";

  const submitWithdrawal = (amount: number, netAmount: number): void => {
    if (typeof window === "undefined" || !user) return;

    const now = new Date();
    const requestId = `withdrawal_${user.id}_${now.getTime()}`;

    // user_accounts 업데이트
    const storedAccounts = localStorage.getItem("user_accounts");
    if (storedAccounts) {
      const accounts: LocalUserAccount[] = JSON.parse(storedAccounts);
      const accountIndex = accounts.findIndex((a) => a.id === user.id || a.email === user.email);
      if (accountIndex !== -1) {
        const account = accounts[accountIndex];
        account.pending_points = (account.pending_points ?? 0) + amount;
        if (!account.point_history) account.point_history = [];
        account.point_history.unshift({
          id: requestId,
          type: "withdrawal_pending",
          amount: -amount,
          description: "출금 신청 대기중",
          date: now.toISOString().split("T")[0],
          status: "pending",
          balance: account.available_points ?? 0,
        });
        account.last_withdrawal_date = now.toISOString();
        accounts[accountIndex] = account;
        localStorage.setItem("user_accounts", JSON.stringify(accounts));
      }
    }

    // withdrawal_requests 추가
    const storedRequests = localStorage.getItem("withdrawal_requests");
    const requests = storedRequests ? JSON.parse(storedRequests) : [];
    requests.unshift({
      id: requestId,
      user_id: user.id,
      user_name: userInfo.name,
      user_number: user.id.includes("kakao") ? "000001" : "000002",
      requested_amount: amount,
      net_amount: netAmount,
      tax_amount: amount - netAmount,
      bank: userInfo.bank,
      account_number: userInfo.accountNumber,
      account_holder: userInfo.name,
      status: "pending",
      request_date: now.toISOString(),
      processed_date: null,
    });
    localStorage.setItem("withdrawal_requests", JSON.stringify(requests));

    // mock API에 출금 신청 데이터 저장 (best-effort)
    postWithdrawalRequest({
      reviewer_id: getReviewerId(user.id),
      user_name: userInfo.name,
      requested_amount: amount,
      net_amount: netAmount,
      tax_amount: amount - netAmount,
      bank: userInfo.bank,
      account_number: userInfo.accountNumber,
      account_holder: userInfo.name,
      status: "PENDING",
      request_date: now.toISOString(),
      processed_date: null,
    }).catch(() => {});

    // notifications 추가
    const storedNotifications = localStorage.getItem("notifications");
    const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    notifications.unshift({
      id: `notif_${requestId}_${now.getTime()}`,
      user_id: user.id,
      type: "withdrawal_requested",
      title: "포인트 출금 신청",
      message: "포인트 출금 신청이 접수되었습니다.",
      is_read: false,
      created_at: now.toISOString(),
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
  };

  // API 잔액 우선, 없으면 정적 fallback
  const availablePoints = reviewerData?.current_points ?? pointSummary.available_points;

  return {
    userInfo: { ...userInfo, availablePoints },
    calculateNetAmount,
    getDaysSinceLastWithdrawal,
    canWithdraw,
    isAccountInfoValid,
    submitWithdrawal,
  };
}
