/* ========================================
   포인트 데이터 커스텀 훅
   ======================================== */

/**
 * usePointData
 *
 * 목적: 리뷰어 포인트 잔액·내역을 실제 API에서 조회하고,
 *       계좌 정보는 프로필에서 로드합니다.
 *       커서 기반 무한 스크롤을 지원합니다.
 *
 * 사용 페이지:
 * - /user/point/all (전체 포인트 내역)
 * - /user/point/earned (적립 포인트 내역)
 * - /user/point/withdrawn (출금 포인트 내역)
 *
 * API: 33번 GET /user/point
 */

import { useState, useEffect, useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type { PointHistory, PointTab } from "@/types/domain/user";
import { pendingPointListData } from "@/data/user/point/pointData";
import { fetchUserPoint } from "@/lib/api/userPoint";
import type { UserPointTransactionItem, PointTransactionTypeParam } from "@/types/api/userPoint";
import { fetchPendingPoints } from "@/lib/api/point";
import { fetchReviewerEdit } from "@/lib/api/reviewer";

// ========================================
// 어댑터: 백엔드 응답 → 도메인 PointHistory 타입
// ========================================

const TYPE_DESCRIPTION: Record<string, { positive: string; negative: string }> = {
  PAYOUT: { positive: "포인트 적립", negative: "적립 취소" },
  WITHDRAW: { positive: "포인트 환입", negative: "포인트 출금" },
  CHARGE: { positive: "포인트 충전", negative: "충전 취소" },
  REFUND: { positive: "포인트 환불", negative: "환불 취소" },
};

function adaptItem(item: UserPointTransactionItem): PointHistory {
  const date = item.createdAt.slice(0, 10); // ISO → "YYYY-MM-DD"
  const desc = TYPE_DESCRIPTION[item.type] ?? { positive: "포인트 변동", negative: "포인트 변동" };

  if (item.type === "PAYOUT") {
    return {
      id: String(item.pointTransactionId),
      type: "earned",
      amount: item.amount,
      description: item.amount >= 0 ? desc.positive : desc.negative,
      date,
      status: item.amount >= 0 ? "earned" : "failed",
      balance: item.balanceAfter,
    };
  }

  if (item.type === "WITHDRAW") {
    // 양수 amount → 출금 취소/환입, 음수 → 출금 완료
    return {
      id: String(item.pointTransactionId),
      type: "withdrawn",
      amount: item.amount,
      description: item.amount >= 0 ? desc.positive : desc.negative,
      date,
      status: item.amount >= 0 ? ("earned" as const) : ("completed" as const),
      balance: item.balanceAfter,
    };
  }

  // CHARGE, REFUND — 리뷰어에서는 일반적으로 나타나지 않음
  return {
    id: String(item.pointTransactionId),
    type: "earned",
    amount: item.amount,
    description: item.amount >= 0 ? desc.positive : desc.negative,
    date,
    status: item.amount >= 0 ? "earned" : "failed",
    balance: item.balanceAfter,
  };
}

// ========================================
// 탭 → API 파라미터 매핑
// ========================================

function getTransactionType(tab: PointTab): PointTransactionTypeParam | undefined {
  if (tab === "earned") return "PAYOUT";
  if (tab === "withdrawn") return "WITHDRAW";
  return undefined; // 전체 탭: 파라미터 없이 호출
}

// ========================================
// 정적 fallback 데이터 (API 미연결 시)
// ========================================

const STATIC_POINT_HISTORY: PointHistory[] = [
  {
    id: "ph1",
    type: "earned",
    amount: 15000,
    description: "포인트 적립",
    date: "2026-07-08",
    status: "earned",
    balance: 45000,
  },
  {
    id: "ph2",
    type: "earned",
    amount: 12000,
    description: "포인트 적립",
    date: "2026-07-05",
    status: "earned",
    balance: 30000,
  },
  {
    id: "ph3",
    type: "withdrawn",
    amount: -10000,
    description: "포인트 출금",
    date: "2026-07-01",
    status: "completed",
    balance: 18000,
  },
  {
    id: "ph4",
    type: "earned",
    amount: 18000,
    description: "포인트 적립",
    date: "2026-06-25",
    status: "earned",
    balance: 28000,
  },
  {
    id: "ph5",
    type: "withdrawn",
    amount: -8000,
    description: "포인트 출금",
    date: "2026-06-15",
    status: "completed",
    balance: 10000,
  },
];

const STATIC_POINT_INFO = {
  available_points: 45000,
  current_points: 45000,
  pending_points: 0,
};

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
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

// ========================================
// 훅
// ========================================

export function usePointData(pointTab: PointTab = "all"): UsePointDataReturn {
  const { user } = useAuth();
  const { data: editData } = useQuery({
    queryKey: ["reviewerEdit"],
    queryFn: fetchReviewerEdit,
    enabled: !!user,
    staleTime: 30_000,
  });
  const transactionType = getTransactionType(pointTab);

  // 포인트 내역 (실제 API — useInfiniteQuery, 커서 기반)
  const {
    data: pointData,
    isLoading: historyLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["userPoint", transactionType],
    queryFn: ({ pageParam }) =>
      fetchUserPoint({
        point_transaction_type: transactionType,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 5,
    enabled: !!user,
  });

  // 적립 예정 포인트 (아직 별도 실제 API 없음 — mock fallback)
  const { data: apiPendingList } = useQuery({
    queryKey: ["pendingPoints"],
    queryFn: () => fetchPendingPoints(),
    enabled: !!user,
    staleTime: 30_000,
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
    if (!user || !editData) return;
    setAccountInfo({
      name: editData.bankAccount?.accountHolder ?? editData.user?.name ?? "",
      bank: editData.bankAccount?.bankName ?? "",
      accountNumber: editData.bankAccount?.accountNumber ?? "",
      residentNumber: "",
    });
  }, [user, editData]);

  // 페이지 데이터 평탄화
  const balance = pointData?.pages[0]?.balance ?? 0;
  const userPointHistory = useMemo(() => {
    const history = pointData?.pages.flatMap((page) => page.items.map(adaptItem)) ?? [];
    if (history.length > 0) return history;
    // 탭별 필터링
    if (pointTab === "earned") return STATIC_POINT_HISTORY.filter((h) => h.type === "earned");
    if (pointTab === "withdrawn") return STATIC_POINT_HISTORY.filter((h) => h.type === "withdrawn");
    return STATIC_POINT_HISTORY;
  }, [pointData, pointTab]);

  const pointInfo: PointInfo = pointData
    ? { available_points: balance, current_points: balance, pending_points: 0 }
    : STATIC_POINT_INFO;

  const isAccountInfoValid = () =>
    accountInfo.name.trim() !== "" &&
    accountInfo.bank.trim() !== "" &&
    accountInfo.accountNumber.trim() !== "" &&
    accountInfo.residentNumber.trim() !== "";

  return {
    pointInfo,
    accountInfo,
    userPointHistory,
    pendingPointList: apiPendingList ?? pendingPointListData,
    isAccountInfoValid,
    isLoading: !!user && historyLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  };
}
