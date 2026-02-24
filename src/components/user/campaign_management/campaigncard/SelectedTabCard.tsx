/* ========================================
   선정 탭 캠페인 카드 컴포넌트
   ======================================== */

/**
 * SelectedTabCard
 *
 * 목적: "선정" 탭에 표시되는 캠페인 카드를 렌더링합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 > 선정 탭)
 */

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { CampaignApplication } from "@/types/domain/user";
import CampaignCardBase from "./CampaignCardBase";
import SelectedTabButtons from "./SelectedTabButtons";
import SelectedTabModals from "./SelectedTabModals";
import cardStyles from "../../../../styles/user/campaign_management/campaign_card.module.css";
import buttonStyles from "../../../../styles/user/campaign_management/campaign_buttons.module.css";
import { useSelectedTabCampaign } from "../hooks/useSelectedTabCampaign";
import { useSelectedTabModals } from "../hooks/useSelectedTabModals";
import { getStatusText, isContentRegistered } from "../utils/selectedTabHelpers";
import { addCompletedCampaignId } from "@/data/user/campaign_management/campaignManagementData";

interface SelectedTabCardProps {
  campaign: CampaignApplication;
}

/**
 * 선정 탭 캠페인 카드
 *
 * 설명:
 * - 캠페인에 선정된 후 진행해야 할 단계에 따라 다른 버튼을 표시합니다.
 * - 배송형, 방문형, 기자단: 콘텐츠 등록/수정 + 등록 기한 연장 요청 (2개 버튼) - 링크만
 * - 미션형: 콘텐츠 등록/수정 + 등록 기한 연장 요청 (2개 버튼) - contentType에 따라 다른 모달
 * - 구매평: 구매기간(구매 영수증) 또는 등록기간(콘텐츠) 등록/수정 + 등록 기한 연장 요청 (2개 버튼)
 */
export default function SelectedTabCard({ campaign }: SelectedTabCardProps) {
  const router = useRouter();

  // 캠페인 날짜 및 기간 계산 훅
  const { isPurchasePeriod, daysUntilDeadline } = useSelectedTabCampaign(campaign);

  // 모달 상태 관리 훅
  const {
    isContentModalOpen,
    contentModalMode,
    openContentModal,
    closeContentModal,
    isReceiptModalOpen,
    receiptModalMode,
    openReceiptModal,
    closeReceiptModal,
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
    isRegistrationPeriodEndedModalOpen,
    closeRegistrationPeriodEndedModal,
  } = useSelectedTabModals(campaign);

  // 상태 텍스트 계산
  const statusText = useMemo(
    () =>
      getStatusText(campaign, isContentRegistered(campaign), isPurchasePeriod, daysUntilDeadline),
    [campaign, isPurchasePeriod, daysUntilDeadline]
  );

  return (
    <>
      {/* 메인 카드 */}
      <div className={cardStyles.campaign_card_wrapper}>
        <CampaignCardBase campaign={campaign} statusText={statusText}>
          <div className={buttonStyles.campaign_actions}>
            <SelectedTabButtons
              campaign={campaign}
              isPurchasePeriod={isPurchasePeriod}
              onOpenContentModal={openContentModal}
              onOpenReceiptModal={openReceiptModal}
              onExtensionRequest={handleExtensionRequest}
            />
          </div>
        </CampaignCardBase>
      </div>

      {/* 모든 모달 */}
      <SelectedTabModals
        campaign={campaign}
        isPurchasePeriod={isPurchasePeriod}
        isContentModalOpen={isContentModalOpen}
        contentModalMode={contentModalMode}
        onCloseContentModal={closeContentModal}
        isReceiptModalOpen={isReceiptModalOpen}
        receiptModalMode={receiptModalMode}
        onCloseReceiptModal={closeReceiptModal}
        isExtensionModalOpen={isExtensionModalOpen}
        isExtensionLimitModalOpen={isExtensionLimitModalOpen}
        isExtensionSecondRequestModalOpen={isExtensionSecondRequestModalOpen}
        extensionReason={extensionReason}
        onExtensionReasonChange={setExtensionReason}
        onCloseExtensionModal={closeExtensionModal}
        onCloseExtensionLimitModal={closeExtensionLimitModal}
        onConfirmSecondRequest={handleConfirmSecondRequest}
        onConfirmExtension={handleConfirmExtension}
        onCloseExtensionSecondRequestModal={closeExtensionSecondRequestModal}
        isRegistrationPeriodEndedModalOpen={isRegistrationPeriodEndedModalOpen}
        onCloseRegistrationPeriodEndedModal={closeRegistrationPeriodEndedModal}
        onContentRegistered={(campaignId) => {
          // 콘텐츠 등록 성공 시 완료 탭으로 이동
          // 실제 구현 시에는 API 호출 후 상태 업데이트 처리
          if (campaignId) {
            // localStorage에 완료된 캠페인 ID 저장
            addCompletedCampaignId(campaignId);
          }
          // 완료 탭으로 이동
          router.push("/user/campaign_management/completed");
        }}
      />
    </>
  );
}
