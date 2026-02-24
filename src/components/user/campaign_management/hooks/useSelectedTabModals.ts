/* ========================================
   선정 탭 모달 상태 관리 훅
   ======================================== */

/**
 * useSelectedTabModals
 *
 * 목적: 선정 탭 캠페인 카드에서 사용하는 모든 모달의 상태와 핸들러를 관리하는 커스텀 훅입니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 > 선정 탭)
 */

import { useState, useCallback } from "react";
import type { CampaignApplication } from "@/types/domain/user";
import { useSelectedTabCampaign } from "./useSelectedTabCampaign";

const EXTENSION_COUNTS_STORAGE_KEY = "user_campaign_extension_counts";

function getStoredExtensionCount(campaignId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(EXTENSION_COUNTS_STORAGE_KEY);
    if (!stored) return 0;
    const counts: Record<string, number> = JSON.parse(stored);
    return counts[campaignId] ?? 0;
  } catch {
    return 0;
  }
}

function incrementStoredExtensionCount(campaignId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(EXTENSION_COUNTS_STORAGE_KEY);
    const counts: Record<string, number> = stored ? JSON.parse(stored) : {};
    const newCount = (counts[campaignId] ?? 0) + 1;
    counts[campaignId] = newCount;
    localStorage.setItem(EXTENSION_COUNTS_STORAGE_KEY, JSON.stringify(counts));
    return newCount;
  } catch {
    return 0;
  }
}

export function useSelectedTabModals(campaign: CampaignApplication) {
  // 캠페인 날짜 및 기간 계산 (등록기간 마감 체크를 위해 필요)
  const { daysUntilDeadline, isPurchasePeriod } = useSelectedTabCampaign(campaign);

  // 콘텐츠 모달 상태 관리
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentModalMode, setContentModalMode] = useState<"register" | "edit">("register");

  // 구매 영수증 모달 상태 관리
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptModalMode, setReceiptModalMode] = useState<"register" | "edit">("register");

  // 등록 기한 연장 요청 모달 상태 관리
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isExtensionLimitModalOpen, setIsExtensionLimitModalOpen] = useState(false);
  const [isExtensionSecondRequestModalOpen, setIsExtensionSecondRequestModalOpen] = useState(false);
  const [extensionReason, setExtensionReason] = useState<string>("");

  // 등록기간 마감 모달 상태 관리
  const [isRegistrationPeriodEndedModalOpen, setIsRegistrationPeriodEndedModalOpen] =
    useState(false);

  /**
   * 등록기간이 마감되었는지 확인하는 함수
   *
   * 설명:
   * - daysUntilDeadline이 null이거나 음수이면 등록기간이 마감된 것입니다.
   * - 구매평 캠페인의 경우 구매기간일 때는 구매 영수증 등록이므로 등록기간 체크를 하지 않습니다.
   * - 수정 모드일 때는 등록기간이 지났어도 수정할 수 있습니다.
   */
  const isRegistrationPeriodEnded = (mode: "register" | "edit"): boolean => {
    // 수정 모드일 때는 등록기간이 지났어도 수정 가능
    if (mode === "edit") {
      return false;
    }

    // 구매평 캠페인의 구매기간일 때는 구매 영수증 등록이므로 등록기간 체크 안 함
    if (campaign.type === "구매평" && isPurchasePeriod) {
      return false;
    }

    // daysUntilDeadline이 null이거나 음수이면 등록기간 마감
    return daysUntilDeadline === null || daysUntilDeadline < 0;
  };

  // 콘텐츠 모달 열기 핸들러
  const openContentModal = (mode: "register" | "edit") => {
    // 등록기간이 마감되었는지 확인
    if (isRegistrationPeriodEnded(mode)) {
      // 등록기간이 마감되었으면 마감 안내 모달 표시
      setIsRegistrationPeriodEndedModalOpen(true);
      return;
    }

    // 등록기간이 마감되지 않았으면 기존대로 모달 열기
    setContentModalMode(mode);
    setIsContentModalOpen(true);
  };

  // 콘텐츠 모달 닫기 핸들러
  const closeContentModal = () => {
    setIsContentModalOpen(false);
  };

  // 구매 영수증 모달 열기 핸들러
  const openReceiptModal = (mode: "register" | "edit") => {
    setReceiptModalMode(mode);
    setIsReceiptModalOpen(true);
  };

  // 구매 영수증 모달 닫기 핸들러
  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
  };

  /**
   * 등록 기한 연장 요청 핸들러
   *
   * 설명:
   * - 최대 2번까지 신청 가능합니다.
   *   - 1번째 신청 (extensionCount === 0): 바로 사유 입력 모달 표시
   *   - 2번째 신청 (extensionCount === 1): 확인 모달 먼저 표시 (이번이 마지막이라는 안내)
   *   - 3번째 이상 신청 (extensionCount >= 2): 제한 안내 모달 표시 (연장 불가)
   * - 연장 횟수: campaign.extensionCount 우선, 없으면 localStorage에서 조회
   */
  const handleExtensionRequest = useCallback(() => {
    const extensionCount =
      (campaign as { extensionCount?: number }).extensionCount ??
      getStoredExtensionCount(campaign.id);

    if (extensionCount >= 2) {
      // 세 번째 이상 신청 시: 제한 안내 모달 (연장 불가)
      setIsExtensionLimitModalOpen(true);
    } else if (extensionCount === 1) {
      // 두 번째 신청 시: 확인 모달 먼저 표시 (이번이 마지막이라는 안내)
      setIsExtensionSecondRequestModalOpen(true);
    } else {
      // 첫 번째 신청 시: 바로 사유 입력 모달 표시
      setExtensionReason(""); // 사유 초기화
      setIsExtensionModalOpen(true);
    }
  }, [campaign]);

  /**
   * 두 번째 신청 확인 모달에서 확인 버튼 클릭 핸들러
   *
   * 설명:
   * - 두 번째 신청 확인 모달에서 "확인"을 누르면 사유 입력 모달을 엽니다.
   */
  const handleConfirmSecondRequest = () => {
    setIsExtensionSecondRequestModalOpen(false);
    setExtensionReason(""); // 사유 초기화
    setIsExtensionModalOpen(true);
  };

  /**
   * 등록 기한 연장 요청 확인 핸들러
   *
   * 설명:
   * - 실제 API 호출로 등록 기한 연장을 요청합니다.
   * - 성공 시 localStorage에 연장 횟수 저장 (다음 요청 시 두 번째/세 번째 모달 표시용)
   */
  const handleConfirmExtension = async () => {
    try {
      // TODO: 실제 API 호출로 등록 기한 연장 요청
      // const response = await requestDeadlineExtension(campaign.id, extensionReason);

      // 성공 시 연장 횟수 저장 (localStorage)
      incrementStoredExtensionCount(campaign.id);

      // 모달 닫기 및 사유 초기화
      setIsExtensionModalOpen(false);
      setExtensionReason("");
      // TODO: 성공 모달 표시 또는 토스트 메시지
    } catch (_error) {
      // TODO: 오류 모달 표시
    }
  };

  // 등록 기한 연장 요청 모달 닫기 핸들러
  const closeExtensionModal = () => {
    setIsExtensionModalOpen(false);
    setExtensionReason(""); // 모달 닫을 때 사유 초기화
  };

  // 등록 기한 연장 제한 모달 닫기 핸들러
  const closeExtensionLimitModal = () => {
    setIsExtensionLimitModalOpen(false);
  };

  // 두 번째 신청 확인 모달 닫기 핸들러
  const closeExtensionSecondRequestModal = () => {
    setIsExtensionSecondRequestModalOpen(false);
  };

  // 등록기간 마감 모달 닫기 핸들러
  const closeRegistrationPeriodEndedModal = () => {
    setIsRegistrationPeriodEndedModalOpen(false);
  };

  return {
    // 콘텐츠 모달 상태
    isContentModalOpen,
    contentModalMode,
    openContentModal,
    closeContentModal,
    // 구매 영수증 모달 상태
    isReceiptModalOpen,
    receiptModalMode,
    openReceiptModal,
    closeReceiptModal,
    // 등록 기한 연장 요청 모달 상태
    isExtensionModalOpen,
    isExtensionLimitModalOpen,
    isExtensionSecondRequestModalOpen,
    extensionReason,
    setExtensionReason,
    handleExtensionRequest,
    handleConfirmSecondRequest,
    handleConfirmExtension,
    closeExtensionModal,
    closeExtensionLimitModal,
    closeExtensionSecondRequestModal,
    // 등록기간 마감 모달 상태
    isRegistrationPeriodEndedModalOpen,
    closeRegistrationPeriodEndedModal,
  };
}
