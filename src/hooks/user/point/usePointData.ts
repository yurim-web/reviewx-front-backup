/* ========================================
   포인트 데이터 커스텀 훅
   ======================================== */

/**
 * usePointData
 *
 * 목적: localStorage에서 유저 포인트/계좌/내역 데이터를 로드하고 상태를 관리합니다.
 *
 * 사용 페이지:
 * - /user/point/all (전체 포인트 내역)
 * - /user/point/earned (적립 포인트 내역)
 * - /user/point/withdrawn (출금 포인트 내역)
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PointHistory } from "@/types/domain/user";
import { pendingPointListData } from "@/data/user/point/pointData";
import { StoredUserAccount } from "@/lib/auth/types";

type PointUserAccount = StoredUserAccount & {
  point_history?: PointHistory[];
  pending_point_list?: typeof pendingPointListData;
};

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

export function usePointData(): UsePointDataReturn {
  const { user } = useAuth();

  const [pointInfo, setPointInfo] = useState<PointInfo>({
    available_points: 0,
    pending_points: 0,
    current_points: 0,
  });
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    name: "",
    bank: "",
    accountNumber: "",
    residentNumber: "",
  });
  const [userPointHistory, setUserPointHistory] = useState<PointHistory[]>([]);
  const [pendingPointList, setPendingPointList] = useState(() => pendingPointListData);

  const loadPointData = () => {
    if (typeof window === "undefined" || !user) return;
    try {
      const storedAccounts = localStorage.getItem("user_accounts");
      if (storedAccounts) {
        const accounts: PointUserAccount[] = JSON.parse(storedAccounts);
        const userAccount = accounts.find((a) => a.id === user.id || a.email === user.email);
        if (userAccount) {
          setPointInfo({
            available_points: userAccount.available_points || 0,
            pending_points: userAccount.pending_points || 0,
            current_points: userAccount.current_points || 0,
          });
          setAccountInfo({
            name: userAccount.account_holder || userAccount.name || "",
            bank: userAccount.bank || "",
            accountNumber: userAccount.account_number || "",
            residentNumber:
              userAccount.ssn_front && userAccount.ssn_back
                ? `${userAccount.ssn_front}-${userAccount.ssn_back}`
                : "",
          });
          setUserPointHistory(userAccount.point_history || []);
          if (userAccount.pending_point_list?.length !== undefined) {
            setPendingPointList(userAccount.pending_point_list);
          }
        }
      }
    } catch (_error) {
      // 포인트 정보 로드 실패 시 기본값 유지
    }
  };

  useEffect(() => {
    loadPointData();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadPointData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isAccountInfoValid = () =>
    accountInfo.name.trim() !== "" &&
    accountInfo.bank.trim() !== "" &&
    accountInfo.accountNumber.trim() !== "" &&
    accountInfo.residentNumber.trim() !== "";

  return {
    pointInfo,
    accountInfo,
    userPointHistory,
    pendingPointList,
    isAccountInfoValid,
  };
}
