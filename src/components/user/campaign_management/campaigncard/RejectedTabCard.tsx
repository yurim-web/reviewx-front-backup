/* ========================================
   📋 취소/반려 탭 캠페인 카드 컴포넌트
   ======================================== */

/**
 * 취소/반려 탭 캠페인 카드 컴포넌트
 *
 * 목적: "취소/반려" 탭에 표시되는 캠페인 카드를 렌더링합니다.
 *
 * 경우의 수: 2가지
 * 1. 반려일 때 (content_rejected,re_register 또는 penalty,content_rejected):
 *    - 2개 버튼: "콘텐츠 반려 사유 확인" + "콘텐츠 수정"
 *    - 사유 확인 클릭 시 반려 사유 모달 표시
 *    - 콘텐츠 수정 클릭 시 콘텐츠 수정 모달 노출
 * 2. 패널티일 때 (penalty):
 *    - 1개 버튼: "패널티 내역 확인"
 *    - 클릭하면 패널티 페이지로 이동
 * 3. 구매 영수증 반려일 때 (receipt_rejected):
 *    - 1개 버튼: "구매 영수증 재등록하기"
 *    - 클릭하면 구매 영수증 등록 모달 노출
 *
 * 학습 포인트:
 * - 복잡한 조건부 렌더링: 여러 조건을 조합하여 다른 UI를 표시합니다.
 * - 다중 버튼: 일부 경우에는 2개의 버튼을 표시합니다.
 * - 라우팅: useRouter를 사용하여 다른 페이지로 이동합니다.
 * - 모달 관리: 반려 사유 모달과 콘텐츠 수정 모달을 별도로 관리합니다.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CampaignApplication } from "@/types/user/user";
import buttonStyles from "../../../../styles/user/campaign_management/buttons.module.css";
import { getButtonClassName } from "@/components/common/campaign_management/utils/button_style_utils";
import CampaignCardBase from "./CampaignCardBase";
import ReceiptRegistrationModal from "../modals/ReceiptRegistrationModal";
import ContentRegistrationModal from "../modals/ContentRegistrationModal";
import ImageUploadModal from "../modals/ImageUploadModal";
import CombinedContentModal from "../modals/CombinedContentModal";
import RejectionReasonModal from "../modals/RejectionReasonModal";

interface RejectedTabCardProps {
  campaign: CampaignApplication;
}

/**
 * 취소/반려 탭 캠페인 카드
 *
 * 설명:
 * - 캠페인이 취소되거나 반려된 상태를 표시합니다.
 * - subStatus에 따라 다른 버튼 조합을 표시합니다.
 * - 일부 경우에는 2개의 버튼을 동시에 표시합니다.
 */
export default function RejectedTabCard({ campaign }: RejectedTabCardProps) {
  // 모달 상태 관리
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isRejectionReasonModalOpen, setIsRejectionReasonModalOpen] =
    useState(false);

  // 콘텐츠 수정 모달 모드 관리 (등록/수정)
  const [contentModalMode, setContentModalMode] = useState<"register" | "edit">(
    "edit"
  );

  // Next.js의 useRouter 훅을 사용하여 라우팅 기능 가져오기
  const router = useRouter();

  // 상태 텍스트
  const statusText = "캠페인 신청이 취소되었습니다.";

  /**
   * 반려 사유 확인 버튼 클릭 핸들러
   *
   * 설명:
   * - 반려 사유 모달을 엽니다.
   */
  const handleRejectionReasonClick = () => {
    setIsRejectionReasonModalOpen(true);
  };

  /**
   * 콘텐츠 수정 버튼 클릭 핸들러
   *
   * 설명:
   * - 콘텐츠 수정 모달을 엽니다.
   * - 수정 모드로 설정합니다.
   */
  const handleContentEditClick = () => {
    setContentModalMode("edit");
    setIsContentModalOpen(true);
  };

  /**
   * 구매 영수증 재등록 버튼 클릭 핸들러
   *
   * 설명:
   * - 구매 영수증 등록 모달을 엽니다.
   */
  const handleReceiptReRegisterClick = () => {
    setIsReceiptModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseContentModal = () => {
    setIsContentModalOpen(false);
  };

  const handleCloseReceiptModal = () => {
    setIsReceiptModalOpen(false);
  };

  const handleCloseRejectionReasonModal = () => {
    setIsRejectionReasonModalOpen(false);
  };

  /**
   * 반려 여부 확인
   *
   * 설명:
   * - 콘텐츠가 반려된 경우인지 확인합니다.
   */
  const isContentRejected =
    campaign.subStatus === "content_rejected,re_register" ||
    campaign.subStatus === "penalty,content_rejected";

  /**
   * 패널티 여부 확인
   *
   * 설명:
   * - 패널티가 부과된 경우인지 확인합니다.
   */
  const isPenalty =
    campaign.subStatus === "penalty" ||
    campaign.subStatus === "penalty,content_rejected";

  /**
   * 버튼 영역 렌더링
   *
   * 설명:
   * - 기능 명세서에 따라 버튼 조합을 표시합니다.
   * - 반려일 때: "콘텐츠 반려 사유 확인" + "콘텐츠 수정"
   * - 패널티일 때: "패널티 내역 확인"
   * - 구매 영수증 반려일 때: "구매 영수증 재등록하기"
   */
  const renderButtons = () => {
    // 경우 1: 반려일 때 → 2개 버튼
    if (isContentRejected) {
      return (
        <>
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.danger_button}`}
            onClick={handleRejectionReasonClick}
          >
            콘텐츠 반려 사유 확인
          </button>
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
            onClick={handleContentEditClick}
          >
            콘텐츠 수정
          </button>
        </>
      );
    }

    // 경우 2: 패널티일 때 → 1개 버튼
    if (isPenalty) {
      return (
        <button
          className={`${buttonStyles.action_button} ${buttonStyles.danger_button}`}
          onClick={() => router.push("/user/campaign_management/penalty")}
        >
          패널티 내역 확인
        </button>
      );
    }

    // 경우 3: 구매 영수증 반려일 때 → 1개 버튼
    if (campaign.subStatus === "receipt_rejected") {
      return (
        <button
          className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
          onClick={handleReceiptReRegisterClick}
        >
          구매 영수증 재등록하기
        </button>
      );
    }

    // 기본: 콘텐츠 재등록하기 (현재는 사용되지 않을 수 있음)
    return (
      <button
        className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
        onClick={handleContentEditClick}
      >
        콘텐츠 수정
      </button>
    );
  };

  return (
    <>
      <CampaignCardBase campaign={campaign} statusText={statusText}>
        <div className={buttonStyles.campaign_actions}>{renderButtons()}</div>
      </CampaignCardBase>

      {/* 반려 사유 확인 모달 */}
      <RejectionReasonModal
        isOpen={isRejectionReasonModalOpen}
        onClose={handleCloseRejectionReasonModal}
        rejectionReason={(campaign as any).rejectionReason}
        campaignTitle={campaign.title}
      />

      {/* 캠페인 타입별 콘텐츠 수정 모달 */}
      {campaign.type === "미션형" && (
        <CombinedContentModal
          isOpen={isContentModalOpen}
          onClose={handleCloseContentModal}
          campaignTitle={campaign.title}
          mode={contentModalMode}
          existingLink={
            contentModalMode === "edit"
              ? "https://chatgpt.com/g/g-p-6807041b2c64819192e7b94698e6ddc2-jeongmin/c/691ebb1d-f07c-8320-a9bf-ebcf16aa46111" // TODO: 실제 등록된 링크를 campaign 데이터에서 가져오기
              : ""
          }
          existingImages={
            contentModalMode === "edit"
              ? [
                  "/images/main/campaign_img/eximg_1.png",
                  "/images/main/campaign_img/eximg_2.png",
                ] // TODO: 실제 등록된 이미지 URL을 campaign 데이터에서 가져오기
              : []
          }
        />
      )}
      {campaign.type === "구매평" && (
        <ImageUploadModal
          isOpen={isContentModalOpen}
          onClose={handleCloseContentModal}
          campaignTitle={campaign.title}
          mode={contentModalMode}
          existingImages={
            contentModalMode === "edit"
              ? [
                  "/images/main/campaign_img/eximg_1.png",
                  "/images/main/campaign_img/eximg_2.png",
                ] // TODO: 실제 등록된 이미지 URL을 campaign 데이터에서 가져오기
              : []
          }
        />
      )}
      {["배송형", "방문형", "기자단"].includes(campaign.type) && (
        <ContentRegistrationModal
          isOpen={isContentModalOpen}
          onClose={handleCloseContentModal}
          campaignTitle={campaign.title}
          mode={contentModalMode}
          existingLink={
            contentModalMode === "edit"
              ? "https://chatgpt.com/g/g-p-6807041b2c64819192e7b94698e6ddc2-jeongmin/c/691ebb1d-f07c-8320-a9bf-ebcf16aa46111" // TODO: 실제 등록된 링크를 campaign 데이터에서 가져오기
              : ""
          }
        />
      )}

      {/* 구매 영수증 등록 모달 */}
      <ReceiptRegistrationModal
        isOpen={isReceiptModalOpen}
        onClose={handleCloseReceiptModal}
        campaignTitle={campaign.title}
      />
    </>
  );
}
