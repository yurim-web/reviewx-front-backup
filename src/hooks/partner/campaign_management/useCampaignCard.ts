/* ========================================
   🪝 useCampaignCard 커스텀 훅
   ======================================== */

/**
 * 커스텀 훅 목적
 *
 * - `CampaignCard` 컴포넌트에서만 사용되는 파생 데이터 계산과 모달 상태 관리를 한 곳에 모읍니다.
 * - 컴포넌트는 UI 렌더링에 집중하고, 비즈니스 로직은 훅으로 분리하여 가독성을 높입니다.
 *
 * 📍 사용 컴포넌트:
 * - src/components/partner/campaign_management/CampaignCard.tsx
 *   (파트너 캠페인 관리 페이지의 캠페인 카드 컴포넌트에서 사용)
 *
 * 📌 훅 위치:
 * - src/hooks/partner/campaign_management/useCampaignCard.ts
 *
 * 🎓
 * 1. **커스텀 훅 분리**: 여러 state/useMemo/useCallback 조합을 하나의 훅으로 묶어 재사용성을 높입니다.
 * 2. **반환 구조 명확화**: UI에서 바로 사용할 `state`와 `actions`를 구분하여 명확하게 전달합니다.
 * 3. **의존성 관리**: useMemo/useCallback의 의존성을 훅 내부에서 관리하여 컴포넌트 로직을 단순화합니다.
 */

/* ----------------------------------------
   📦 의존성 모듈 (React 훅 & 비즈니스 헬퍼)
   ---------------------------------------- */
import { useCallback, useMemo, useState } from "react";
import type { PartnerCampaign, PartnerStatTab } from "@/types/domain/partner";
import {
  calculateContentCounts,
  getCampaignTypePath,
  getPrimaryButtonText,
  getStatusTextForCampaign,
  isContentStage as checkIsContentStage,
  calculateExtensionRequestCount,
} from "@/components/partner/campaign_management/utils/campaign_card_helpers";

interface UseCampaignCardParams {
  campaign: PartnerCampaign;
  activeTab: PartnerStatTab;
}

/* ----------------------------------------
   🧾 훅 반환 타입 정의
   ---------------------------------------- */
export interface UseCampaignCardReturn {
  state: {
    campaignStatus: string; // 현재 캠페인 카드의 메인 상태 (예정/신청/진행/종료/취소)
    campaignSubStatus: string; // 서브 상태: 버튼 조합을 결정하거나 콘텐츠 단계 여부 판단
    waitingCount: number; // 대기 중 콘텐츠 수
    reviewingCount: number; // 검수 중 콘텐츠 수
    completedCount: number; // 완료된 콘텐츠 수
    isContentStage: boolean; // 콘텐츠 관련 버튼 2개(검수/완료)를 노출할지 여부
    primaryButtonText: string; // 메인 액션 버튼에 표시할 텍스트
    statusDescription: string; // 카드 본문에 표시할 상태 설명 문자열
    isReceiptModalOpen: boolean; // 영수증 등록 모달 열림 여부
    isManagementModalOpen: boolean; // 캠페인 관리 모달 열림 여부
    isDeleteModalOpen: boolean; // 캠페인 삭제 확인 모달 열림 여부
  };
  actions: {
    openReceiptModal: () => void; // 영수증 등록 모달 열기
    closeReceiptModal: () => void; // 영수증 등록 모달 닫기
    openManagementModal: () => void; // 캠페인 관리 모달 열기
    closeManagementModal: () => void; // 캠페인 관리 모달 닫기
    openDeleteModal: () => void; // 캠페인 삭제 확인 모달 열기
    closeDeleteModal: () => void; // 캠페인 삭제 확인 모달 닫기
    handleButtonClick: (buttonText: string) => void; // 카드 하단 버튼 클릭 공용 핸들러
  };
}

export function useCampaignCard({
  campaign,
  activeTab,
}: UseCampaignCardParams): UseCampaignCardReturn {
  /* ----------------------------------------
     📌 모달 상태 관리 (영수증/관리/삭제)
     ---------------------------------------- */
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /* ----------------------------------------
     📌 캠페인 기본 상태/서브 상태 파생값
     ---------------------------------------- */
  const campaignStatus = campaign.status as string;
  const campaignSubStatus = (campaign.subStatus ?? "") as string;

  /* ----------------------------------------
     📊 콘텐츠 대기/검수/완료 건수 및 단계 판별
     ---------------------------------------- */
  const { waitingCount, reviewingCount, completedCount } = useMemo(
    () => calculateContentCounts(campaign),
    [campaign],
  );

  const isContentStage = useMemo(
    () => checkIsContentStage(campaign, reviewingCount, completedCount),
    [campaign, reviewingCount, completedCount],
  );

  // 연장 요청 건수 계산
  const extensionRequestCount = useMemo(() => {
    if (
      activeTab === "연장 요청" ||
      campaign.subStatus?.includes("extension_request")
    ) {
      // 실제 데이터 기반 연장 요청 건수 계산
      return calculateExtensionRequestCount(campaign);
    }
    return 0;
  }, [campaign, activeTab]);

  const primaryButtonText = useMemo(
    () =>
      getPrimaryButtonText(
        campaign,
        completedCount,
        activeTab,
        extensionRequestCount,
      ),
    [campaign, completedCount, activeTab, extensionRequestCount],
  );

  const statusDescription = useMemo(
    () =>
      getStatusTextForCampaign({
        campaign,
        activeTab,
        isContentStage,
        reviewingCount,
        completedCount,
      }),
    [campaign, activeTab, isContentStage, reviewingCount, completedCount],
  );

  /* ----------------------------------------
     🎛️ 모달 열기/닫기 액션
     ---------------------------------------- */
  const openReceiptModal = useCallback(() => setIsReceiptModalOpen(true), []);
  const closeReceiptModal = useCallback(() => setIsReceiptModalOpen(false), []);
  const openManagementModal = useCallback(
    () => setIsManagementModalOpen(true),
    [],
  );
  const closeManagementModal = useCallback(
    () => setIsManagementModalOpen(false),
    [],
  );
  const openDeleteModal = useCallback(() => setIsDeleteModalOpen(true), []);
  const closeDeleteModal = useCallback(() => setIsDeleteModalOpen(false), []);

  /* ----------------------------------------
     🖱️ 카드 버튼 클릭 핸들러 (공용)
     ---------------------------------------- */
  const handleButtonClick = useCallback(
    (buttonText: string) => {
      if (buttonText === "구매 영수증 등록하기") {
        openReceiptModal();
        return;
      }

      if (buttonText === "캠페인 관리") {
        openManagementModal();
        return;
      }

      if (buttonText === "캠페인 삭제") {
        openDeleteModal();
        return;
      }

      if (buttonText === "캠페인 수정") {
        const campaignTypePath = getCampaignTypePath(campaign.campaignType);
        window.location.href = `/partner/campaign/edit/${campaignTypePath}/${campaign.id}`;
        return;
      }

      if (buttonText === "패널티 내역 확인") {
        window.location.href = "/partner/campaign_management/penalty";
        return;
      }

      if (buttonText === "신청 내역 확인" || buttonText === "당첨자 선정") {
        const campaignTypePath = getCampaignTypePath(campaign.campaignType);
        window.location.href = `/partner/campaign_application/${campaignTypePath}/${campaign.id}`;
        return;
      }

      // 등록 기한 연장 요청 버튼 클릭 시 콘텐츠 내역 페이지로 이동
      if (buttonText.startsWith("등록 기한 연장 요청")) {
        const campaignTypePath = getCampaignTypePath(campaign.campaignType);
        window.location.href = `/partner/campaign_contents/${campaignTypePath}/${campaign.id}`;
        return;
      }

      console.log(`[useCampaignCard] 알 수 없는 버튼 클릭: ${buttonText}`);
    },
    [
      campaign.campaignType,
      campaign.id,
      openDeleteModal,
      openManagementModal,
      openReceiptModal,
    ],
  );

  return {
    state: {
      campaignStatus,
      campaignSubStatus,
      waitingCount,
      reviewingCount,
      completedCount,
      isContentStage,
      primaryButtonText,
      statusDescription,
      isReceiptModalOpen,
      isManagementModalOpen,
      isDeleteModalOpen,
    },
    actions: {
      openReceiptModal,
      closeReceiptModal,
      openManagementModal,
      closeManagementModal,
      openDeleteModal,
      closeDeleteModal,
      handleButtonClick,
    },
  };
}
