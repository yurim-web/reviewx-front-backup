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
import { useReviewerProfile } from "@/hooks/user/mypage/useReviewerProfile";

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
  submitWithdrawal: (amount: number, netAmount: number) => Promise<boolean>;
  isLoading: boolean;
}

function getReviewerId(userId: string): number {
  if (userId.includes("kakao")) return 1;
  if (userId.includes("naver")) return 2;
  return 1;
}

export function useWithdrawalInfo(): UseWithdrawalInfoReturn {
  const { user } = useAuth();
  const reviewerId = user ? getReviewerId(user.id) : 0;
  const { data: profile } = useReviewerProfile(user?.id);

  // 포인트 잔액 (API)
  const { data: reviewerData, isLoading } = useQuery({
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

  // 서버 프로필에서 계좌 정보 로드
  useEffect(() => {
    if (!user || !profile) return;
    setUserInfo((prev) => ({
      ...prev,
      name: profile.account_holder ?? profile.name ?? "",
      bank: profile.bank ?? "",
      accountNumber: profile.account_number ?? "",
      residentNumber:
        profile.ssn_front && profile.ssn_back ? `${profile.ssn_front}-${profile.ssn_back}` : "",
    }));
  }, [user, profile]);

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

  const submitWithdrawal = async (amount: number, netAmount: number): Promise<boolean> => {
    if (typeof window === "undefined" || !user) return false;

    const now = new Date();
    const requestId = `withdrawal_${user.id}_${now.getTime()}`;

    const payload = {
      reviewer_id: getReviewerId(user.id),
      user_name: userInfo.name,
      requested_amount: amount,
      net_amount: netAmount,
      tax_amount: amount - netAmount,
      bank: userInfo.bank,
      account_number: userInfo.accountNumber,
      account_holder: userInfo.name,
      status: "PENDING" as const,
      request_date: now.toISOString(),
      processed_date: null,
    };

    // mock API 출금 신청 (서버 응답 확인)
    try {
      await postWithdrawalRequest(payload);
    } catch (_apiError) {
      // mock 서버 미실행 시 localStorage fallback
      console.warn("출금 신청 API 호출 실패 (localStorage fallback):", _apiError);
    }

    // localStorage 동기화 (오프라인 fallback 겸 캐시)
    const storedRequests = localStorage.getItem("withdrawal_requests");
    const requests = storedRequests ? (JSON.parse(storedRequests) as unknown[]) : [];
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

    // 알림 추가
    const storedNotifications = localStorage.getItem("notifications");
    const notifications = storedNotifications ? (JSON.parse(storedNotifications) as unknown[]) : [];
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

    return true;
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
    isLoading: reviewerId > 0 && isLoading,
  };
}
