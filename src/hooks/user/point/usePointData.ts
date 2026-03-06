/* ========================================
   포인트 데이터 커스텀 훅
   ======================================== */

/**
 * usePointData
 *
 * 목적: 포인트 잔액·내역을 API에서 조회하고, 계좌 정보는 localStorage에서 로드합니다.
 *
 * 사용 페이지:
 * - /user/point/all (전체 포인트 내역)
 * - /user/point/earned (적립 포인트 내역)
 * - /user/point/withdrawn (출금 포인트 내역)
 */

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type { PointHistory } from "@/types/domain/user";
import { pointHistoryData, pendingPointListData, pointSummary } from "@/data/user/point/pointData";
import type { StoredUserAccount } from "@/lib/auth/types";
import { fetchReviewerPoint, fetchPointHistory } from "@/lib/api/point";
import type { PointHistoryApiItem } from "@/types/api/point";

// ========================================
// 유틸: 사용자 ID → 리뷰어 ID (mock 전용)
// 실제 백엔드 전환 시 JWT 기반으로 교체
// ========================================

function getReviewerId(userId: string): number {
  if (userId.includes("kakao")) return 1;
  if (userId.includes("naver")) return 2;
  return 1;
}

// ========================================
// 어댑터: API 응답 → 도메인 PointHistory 타입
// ========================================

function adaptHistoryItem(item: PointHistoryApiItem): PointHistory {
  const date = item.date.slice(0, 10); // ISO → "YYYY-MM-DD"

  if (item.type === "EARNED") {
    return {
      id: String(item.id),
      type: "earned",
      amount: item.amount,
      description: item.description,
      date,
      status: item.status === "FAILED" ? "failed" : "earned",
      balance: item.balance,
      rejection_reason: item.rejection_reason,
    };
  }

  // WITHDRAWAL
  const type = item.status === "PENDING" ? "withdrawal_pending" : "withdrawn";
  const status =
    item.status === "COMPLETED" ? "completed" : item.status === "FAILED" ? "failed" : "pending";

  return {
    id: String(item.id),
    type,
    amount: item.amount,
    description: item.description,
    date,
    status,
    balance: item.balance,
    rejection_reason: item.rejection_reason,
  };
}

// ========================================
// 타입 정의
// ========================================

export interface PointInfo {
  available_points: number;
  pending_points: number;
  current_points: number;
}

export interface AccountInfo {
  name: string;
  bank: string;
  accountNumber: string;
  residentNumber: string;
}

export interface UsePointDataReturn {
  pointInfo: PointInfo;
  accountInfo: AccountInfo;
  userPointHistory: PointHistory[];
  pendingPointList: typeof pendingPointListData;
  isAccountInfoValid: () => boolean;
}

// ========================================
// 훅
// ========================================

export function usePointData(): UsePointDataReturn {
  const { user } = useAuth();
  const reviewerId = user ? getReviewerId(user.id) : 0;

  // 포인트 잔액 (API)
  const { data: reviewerData } = useQuery({
    queryKey: ["reviewerPoint", reviewerId],
    queryFn: () => fetchReviewerPoint(reviewerId),
    enabled: reviewerId > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  // 포인트 거래 내역 (API)
  const { data: apiHistory } = useQuery({
    queryKey: ["pointHistory", reviewerId],
    queryFn: () => fetchPointHistory(reviewerId),
    enabled: reviewerId > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    select: (data) => data.map(adaptHistoryItem),
  });

  // 계좌 정보 (localStorage — 은행 계좌는 내 정보 수정에서 별도 관리)
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    name: "",
    bank: "",
    accountNumber: "",
    residentNumber: "",
  });

  useEffect(() => {
    if (typeof window === "undefined" || !user) return;
    try {
      const storedAccounts = localStorage.getItem("user_accounts");
      if (storedAccounts) {
        const accounts: StoredUserAccount[] = JSON.parse(storedAccounts);
        const userAccount = accounts.find((a) => a.id === user.id || a.email === user.email);
        if (userAccount) {
          setAccountInfo({
            name: userAccount.account_holder ?? userAccount.name ?? "",
            bank: userAccount.bank ?? "",
            accountNumber: userAccount.account_number ?? "",
            residentNumber:
              userAccount.ssn_front && userAccount.ssn_back
                ? `${userAccount.ssn_front}-${userAccount.ssn_back}`
                : "",
          });
        }
      }
    } catch {
      // localStorage 읽기 실패 시 기본값 유지
    }
  }, [user]);

  const pointInfo: PointInfo = {
    available_points: reviewerData?.current_points ?? pointSummary.available_points,
    current_points: reviewerData?.current_points ?? pointSummary.available_points,
    pending_points: 0,
  };

  const isAccountInfoValid = () =>
    accountInfo.name.trim() !== "" &&
    accountInfo.bank.trim() !== "" &&
    accountInfo.accountNumber.trim() !== "" &&
    accountInfo.residentNumber.trim() !== "";

  return {
    pointInfo,
    accountInfo,
    // API 로딩 중(undefined)이면 정적 데이터 표시, API 성공 시 API 데이터 사용
    userPointHistory: apiHistory ?? pointHistoryData,
    pendingPointList: pendingPointListData,
    isAccountInfoValid,
  };
}
