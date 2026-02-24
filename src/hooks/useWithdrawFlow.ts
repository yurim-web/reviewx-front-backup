/* ========================================
   🚪 회원 탈퇴 플로우 커스텀 훅
   ======================================== */

/**
 * 회원 탈퇴 플로우 커스텀 훅
 *
 * 목적: 회원 탈퇴 시 모달 관리 및 플로우 제어
 *
 * 사용 위치:
 * - /user/mypage/edit
 * - /partner/mypage/edit
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UseWithdrawFlowOptions {
  /** 탈퇴 완료 후 이동할 경로 (기본값: "/") */
  redirectPath?: string;
  /** 진행 중인 캠페인 확인 함수 (선택적) */
  checkOngoingCampaigns?: () => Promise<boolean>;
  /** 탈퇴 API 호출 함수 (선택적) */
  withdrawApi?: () => Promise<void>;
}

interface UseWithdrawFlowReturn {
  /** 탈퇴 확인 모달 열림 상태 */
  isWithdrawConfirmModalOpen: boolean;
  /** 탈퇴 완료 모달 열림 상태 */
  isWithdrawCompleteModalOpen: boolean;
  /** 탈퇴 차단 모달 열림 상태 */
  isWithdrawBlockedModalOpen: boolean;
  /** 탈퇴 확인 모달 닫기 */
  setIsWithdrawConfirmModalOpen: (open: boolean) => void;
  /** 탈퇴 완료 모달 닫기 */
  setIsWithdrawCompleteModalOpen: (open: boolean) => void;
  /** 탈퇴 차단 모달 닫기 */
  setIsWithdrawBlockedModalOpen: (open: boolean) => void;
  /** 탈퇴 시작 핸들러 */
  handleWithdraw: () => Promise<void>;
  /** 탈퇴 확인 핸들러 */
  handleWithdrawConfirm: () => Promise<void>;
  /** 탈퇴 완료 핸들러 */
  handleWithdrawComplete: () => void;
}

/**
 * 회원 탈퇴 플로우 훅
 *
 * @param options - 훅 옵션
 * @returns 탈퇴 플로우 관련 상태 및 핸들러
 */
export function useWithdrawFlow(options: UseWithdrawFlowOptions = {}): UseWithdrawFlowReturn {
  const router = useRouter();
  const {
    redirectPath = "/",
    checkOngoingCampaigns,
    withdrawApi
  } = options;

  const [isWithdrawConfirmModalOpen, setIsWithdrawConfirmModalOpen] = useState(false);
  const [isWithdrawCompleteModalOpen, setIsWithdrawCompleteModalOpen] = useState(false);
  const [isWithdrawBlockedModalOpen, setIsWithdrawBlockedModalOpen] = useState(false);

  /**
   * 탈퇴 시작 핸들러
   * 진행 중인 캠페인이 있으면 차단 모달 표시, 없으면 확인 모달 표시
   */
  const handleWithdraw = async () => {
    if (checkOngoingCampaigns) {
      const hasOngoingCampaigns = await checkOngoingCampaigns();
      if (hasOngoingCampaigns) {
        setIsWithdrawBlockedModalOpen(true);
        return;
      }
    }
    setIsWithdrawConfirmModalOpen(true);
  };

  /**
   * 탈퇴 확인 핸들러
   * API 호출 후 완료 모달 표시
   */
  const handleWithdrawConfirm = async () => {
    setIsWithdrawConfirmModalOpen(false);

    if (withdrawApi) {
      try {
        await withdrawApi();
      } catch (error) {
        console.error("탈퇴 API 호출 중 오류:", error);
        // TODO: 에러 처리 개선
      }
    }

    setIsWithdrawCompleteModalOpen(true);
  };

  /**
   * 탈퇴 완료 핸들러
   * 완료 모달 닫고 지정된 경로로 이동
   */
  const handleWithdrawComplete = () => {
    setIsWithdrawCompleteModalOpen(false);
    router.push(redirectPath);
  };

  return {
    isWithdrawConfirmModalOpen,
    isWithdrawCompleteModalOpen,
    isWithdrawBlockedModalOpen,
    setIsWithdrawConfirmModalOpen,
    setIsWithdrawCompleteModalOpen,
    setIsWithdrawBlockedModalOpen,
    handleWithdraw,
    handleWithdrawConfirm,
    handleWithdrawComplete,
  };
}
