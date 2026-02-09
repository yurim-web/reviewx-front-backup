/* ========================================
   🪟 선정 탭 모달 컴포넌트
   ======================================== */

/**
 * SelectedTabModals
 *
 * 목적: 선정 탭 캠페인 카드의 모든 모달을 렌더링하는 컴포넌트
 *
 * 설명:
 * - 캠페인 타입에 따라 다른 모달을 표시합니다.
 * - 배송형, 방문형, 기자단: ContentRegistrationModal (링크만)
 * - 미션형: contentType에 따라 ContentRegistrationModal, ImageUploadModal, CombinedContentModal
 * - 구매평: ReceiptRegistrationModal (구매기간) 또는 ImageUploadModal (등록기간)
 * - 등록 기한 연장 요청 모달: 모든 캠페인 공통
 */

import type { CampaignApplication } from "@/types/domain/user";
import BaseModal from "@/components/common/modal/BaseModal";
import { TextareaModal } from "@/components/common/modal";
import ReceiptRegistrationModal from "../modals/ReceiptRegistrationModal";
import ContentRegistrationModal from "../modals/ContentRegistrationModal";
import ImageUploadModal from "../modals/ImageUploadModal";
import CombinedContentModal from "../modals/CombinedContentModal";
import {
  isContentTypeCampaign,
  isMissionTypeCampaign,
} from "../utils/selectedTabHelpers";

interface SelectedTabModalsProps {
  campaign: CampaignApplication;
  isPurchasePeriod: boolean;
  // 콘텐츠 모달 상태
  isContentModalOpen: boolean;
  contentModalMode: "register" | "edit";
  onCloseContentModal: () => void;
  // 구매 영수증 모달 상태
  isReceiptModalOpen: boolean;
  receiptModalMode: "register" | "edit";
  onCloseReceiptModal: () => void;
  // 등록 기한 연장 요청 모달 상태
  isExtensionModalOpen: boolean;
  isExtensionLimitModalOpen: boolean;
  isExtensionSecondRequestModalOpen: boolean;
  extensionReason: string;
  onExtensionReasonChange: (reason: string) => void;
  onCloseExtensionModal: () => void;
  onCloseExtensionLimitModal: () => void;
  onConfirmSecondRequest: () => void;
  onConfirmExtension: () => void;
  onCloseExtensionSecondRequestModal: () => void;
  // 등록기간 마감 모달 상태
  isRegistrationPeriodEndedModalOpen: boolean;
  onCloseRegistrationPeriodEndedModal: () => void;
  // 콘텐츠 등록 성공 콜백
  onContentRegistered?: (campaignId?: string) => void;
}

export default function SelectedTabModals({
  campaign,
  isPurchasePeriod,
  isContentModalOpen,
  contentModalMode,
  onCloseContentModal,
  isReceiptModalOpen,
  receiptModalMode,
  onCloseReceiptModal,
  isExtensionModalOpen,
  isExtensionLimitModalOpen,
  isExtensionSecondRequestModalOpen,
  extensionReason,
  onExtensionReasonChange,
  onCloseExtensionModal,
  onCloseExtensionLimitModal,
  onConfirmSecondRequest,
  onConfirmExtension,
  onCloseExtensionSecondRequestModal,
  isRegistrationPeriodEndedModalOpen,
  onCloseRegistrationPeriodEndedModal,
  onContentRegistered,
}: SelectedTabModalsProps) {
  const isContentType = isContentTypeCampaign(campaign);
  const isMissionType = isMissionTypeCampaign(campaign);

  return (
    <>
      {/* 등록 기한 연장 요청 모달 */}
      <TextareaModal
        is_open={isExtensionModalOpen}
        on_close={onCloseExtensionModal}
        title="등록 기한 연장 요청"
        value={extensionReason}
        onChange={onExtensionReasonChange}
        placeholder="사유 입력"
        buttons={["닫기", "확인"]}
        on_confirm={onConfirmExtension}
        type="center"
        confirm_disabled_when_empty
      />

      {/* 두 번째 신청 시 확인 모달 */}
      <BaseModal
        is_open={isExtensionSecondRequestModalOpen}
        on_close={onCloseExtensionSecondRequestModal}
        message="이미 연장한 내역이 있습니다.<br>추가 연장은 이번 요청이 마지막입니다.<br>계속하시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={onConfirmSecondRequest}
        type="center"
      />

      {/* 세 번째 이상 신청 시 제한 안내 모달 */}
      <BaseModal
        is_open={isExtensionLimitModalOpen}
        on_close={onCloseExtensionLimitModal}
        message="연장은 최대 두 번까지만 가능합니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 배송형, 방문형, 기자단: 링크만 입력하는 ContentRegistrationModal */}
      {isContentType && (
        <ContentRegistrationModal
          isOpen={isContentModalOpen}
          onClose={onCloseContentModal}
          campaignTitle={campaign.title}
          mode={contentModalMode}
          existingLink={
            contentModalMode === "edit"
              ? campaign.registeredContentLink || ""
              : ""
          }
          campaignId={campaign.id}
          campaignType={campaign.type}
          onContentRegistered={onContentRegistered}
        />
      )}

      {/* 미션형: contentType에 따라 다른 모달 표시 */}
      {isMissionType && (
        <>
          {/* contentType === "link": 링크만 입력하는 ContentRegistrationModal */}
          {campaign.contentType === "link" && (
            <ContentRegistrationModal
              isOpen={isContentModalOpen}
              onClose={onCloseContentModal}
              campaignTitle={campaign.title}
              mode={contentModalMode}
              existingLink={
                contentModalMode === "edit"
                  ? campaign.registeredContentLink || ""
                  : ""
              }
              campaignId={campaign.id}
              campaignType={campaign.type}
              onContentRegistered={onContentRegistered}
            />
          )}

          {/* contentType === "image": 이미지만 업로드하는 ImageUploadModal */}
          {campaign.contentType === "image" && (
            <ImageUploadModal
              isOpen={isContentModalOpen}
              onClose={onCloseContentModal}
              campaignTitle={campaign.title}
              mode={contentModalMode}
              existingImages={
                contentModalMode === "edit"
                  ? campaign.registeredContentImages || []
                  : []
              }
              campaignId={campaign.id}
              campaignType={campaign.type}
              onContentRegistered={onContentRegistered}
            />
          )}

          {/* contentType === "both" 또는 undefined: 링크 + 이미지 모두 업로드하는 CombinedContentModal */}
          {(campaign.contentType === "both" || !campaign.contentType) && (
            <CombinedContentModal
              isOpen={isContentModalOpen}
              onClose={onCloseContentModal}
              campaignTitle={campaign.title}
              mode={contentModalMode}
              existingLink={
                contentModalMode === "edit"
                  ? campaign.registeredContentLink || ""
                  : ""
              }
              existingImages={
                contentModalMode === "edit"
                  ? campaign.registeredContentImages || []
                  : []
              }
              campaignId={campaign.id}
              campaignType={campaign.type}
              onContentRegistered={onContentRegistered}
            />
          )}
        </>
      )}

      {/* 구매평: 등록기간일 때 ImageUploadModal */}
      {campaign.type === "구매평" && !isPurchasePeriod && (
        <ImageUploadModal
          isOpen={isContentModalOpen}
          onClose={onCloseContentModal}
          campaignTitle={campaign.title}
          mode={contentModalMode}
          existingImages={
            contentModalMode === "edit"
              ? campaign.registeredContentImages || []
              : []
          }
          campaignId={campaign.id}
          campaignType={campaign.type}
          onContentRegistered={onContentRegistered}
        />
      )}

      {/* 구매 영수증 등록 모달 (구매평 구매기간) */}
      <ReceiptRegistrationModal
        isOpen={isReceiptModalOpen}
        onClose={onCloseReceiptModal}
        campaignTitle={campaign.title}
        mode={receiptModalMode}
        existingImages={
          receiptModalMode === "edit"
            ? campaign.registeredReceiptImages || []
            : []
        }
      />

      {/* 등록 기간 마감 모달 */}
      <BaseModal
        is_open={isRegistrationPeriodEndedModalOpen}
        on_close={onCloseRegistrationPeriodEndedModal}
        message="등록 기간이 마감되었습니다."
        buttons={["닫기"]}
        type="center"
      />
    </>
  );
}
