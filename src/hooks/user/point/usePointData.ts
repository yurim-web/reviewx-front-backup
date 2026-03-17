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
import { fetchReviewerPoint, fetchPointHistory, fetchPendingPoints } from "@/lib/api/point";
import type { PointHistoryApiItem } from "@/types/api/point";
import { useReviewerProfile } from "@/hooks/user/mypage/useReviewerProfile";

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
  const typeUpper = item.type?.toUpperCase();
  const statusUpper = item.status?.toUpperCase();

  if (typeUpper === "EARNED") {
    return {
      id: String(item.id),
      type: "earned",
      amount: item.amount ?? 0,
      description: item.description ?? "",
      date,
      status: statusUpper === "FAILED" ? "failed" : "earned",
      balance: item.balance ?? 0,
      rejection_reason: item.rejection_reason,
    };
  }

  // WITHDRAWAL
  const type = statusUpper === "PENDING" ? "withdrawal_pending" : "withdrawn";
  const status =
    statusUpper === "COMPLETED" ? "completed" : statusUpper === "FAILED" ? "failed" : "pending";

  return {
    id: String(item.id),
    type,
    amount: item.amount ?? 0,
    description: item.description ?? "",
    date,
    status,
    balance: item.balance ?? 0,
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
  pendingPointList: { id: string; description: string; date: string; amount: number }[];
  isAccountInfoValid: () => boolean;
  isLoading: boolean;
  isError: boolean;
}

// ========================================
// 훅
// ========================================

export function usePointData(): UsePointDataReturn {
  const { user } = useAuth();
  const reviewerId = user ? getReviewerId(user.id) : 0;
  const { data: profile } = useReviewerProfile(user?.id);

  // 포인트 잔액 (API)
  const { data: reviewerData } = useQuery({
    queryKey: ["reviewerPoint", reviewerId],
    queryFn: () => fetchReviewerPoint(reviewerId),
    enabled: reviewerId > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  // 포인트 거래 내역 (API)
  const {
    data: apiHistory,
    isLoading: historyLoading,
    isError,
  } = useQuery({
    queryKey: ["pointHistory", reviewerId],
    queryFn: () => fetchPointHistory(),
    enabled: reviewerId > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    select: (data) => data.map(adaptHistoryItem),
  });

  // 적립 예정 포인트 (API)
  const { data: apiPendingList } = useQuery({
    queryKey: ["pendingPoints", reviewerId],
    queryFn: () => fetchPendingPoints(),
    enabled: reviewerId > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    select: (data) =>
      data.map((item) => ({
        id: String(item.id),
        description: item.description,
        date: item.date.slice(0, 10),
        amount: item.amount,
      })),
  });

  // 계좌 정보 (서버 프로필에서 로드)
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    name: "",
    bank: "",
    accountNumber: "",
    residentNumber: "",
  });

  useEffect(() => {
    if (!user || !profile) return;
    setAccountInfo({
      name: profile.account_holder ?? profile.name ?? "",
      bank: profile.bank ?? "",
      accountNumber: profile.account_number ?? "",
      residentNumber:
        profile.ssn_front && profile.ssn_back ? `${profile.ssn_front}-${profile.ssn_back}` : "",
    });
  }, [user, profile]);

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
    userPointHistory: apiHistory ?? pointHistoryData,
    pendingPointList: apiPendingList ?? pendingPointListData,
    isAccountInfoValid,
    isLoading: reviewerId > 0 && historyLoading,
    isError,
  };
}
