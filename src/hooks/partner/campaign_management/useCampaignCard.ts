/* ========================================
   useCampaignCard 커스텀 훅
   ======================================== */

/**
 * useCampaignCard
 *
 * 목적: CampaignCard 컴포넌트의 파생 데이터 계산 및 모달 상태 관리
 *
 * 사용 페이지:
 * - /partner/campaign_management (파트너 캠페인 관리)
 */
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
    [campaign]
  );

  const isContentStage = useMemo(
    () => checkIsContentStage(campaign, reviewingCount, completedCount),
    [campaign, reviewingCount, completedCount]
  );

  // 연장 요청 건수 계산
  const extensionRequestCount = useMemo(() => {
    if (activeTab === "연장 요청" || campaign.subStatus?.includes("extension_request")) {
      // 실제 데이터 기반 연장 요청 건수 계산
      return calculateExtensionRequestCount(campaign);
    }
    return 0;
  }, [campaign, activeTab]);

  const primaryButtonText = useMemo(
    () => getPrimaryButtonText(campaign, completedCount, activeTab, extensionRequestCount),
    [campaign, completedCount, activeTab, extensionRequestCount]
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
    [campaign, activeTab, isContentStage, reviewingCount, completedCount]
  );

  /* ----------------------------------------
     🎛️ 모달 열기/닫기 액션
     ---------------------------------------- */
  const openReceiptModal = useCallback(() => setIsReceiptModalOpen(true), []);
  const closeReceiptModal = useCallback(() => setIsReceiptModalOpen(false), []);
  const openManagementModal = useCallback(() => setIsManagementModalOpen(true), []);
  const closeManagementModal = useCallback(() => setIsManagementModalOpen(false), []);
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
        router.push(`/partner/campaign/edit/${campaignTypePath}/${campaign.id}`);
        return;
      }

      if (buttonText === "패널티 내역 확인") {
        router.push("/partner/campaign_management/penalty");
        return;
      }

      if (buttonText === "신청 내역 확인" || buttonText === "당첨자 선정") {
        const campaignTypePath = getCampaignTypePath(campaign.campaignType);
        router.push(`/partner/campaign_application/${campaignTypePath}/${campaign.id}`);
        return;
      }

      // 등록 기한 연장 요청 버튼 클릭 시 콘텐츠 내역 페이지로 이동
      if (buttonText.startsWith("등록 기한 연장 요청")) {
        const campaignTypePath = getCampaignTypePath(campaign.campaignType);
        router.push(`/partner/campaign_contents/${campaignTypePath}/${campaign.id}`);
        return;
      }
    },
    [campaign.campaignType, campaign.id, openDeleteModal, openManagementModal, openReceiptModal]
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
