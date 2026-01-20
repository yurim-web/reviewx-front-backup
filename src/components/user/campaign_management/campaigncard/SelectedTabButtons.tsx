/* ========================================
   🔘 선정 탭 버튼 컴포넌트
   ======================================== */

/**
 * SelectedTabButtons
 *
 * 목적: 선정 탭 캠페인 카드의 버튼들을 렌더링하는 컴포넌트
 *
 * 설명:
 * - 캠페인 타입에 따라 다른 버튼 조합을 반환합니다.
 * - 배송형, 방문형, 기자단: 콘텐츠 등록/수정 + 등록 기한 연장 요청
 * - 미션형: 콘텐츠 등록/수정 + 등록 기한 연장 요청 (contentType에 따라 다른 모달)
 * - 구매평: 구매기간(구매 영수증) 또는 등록기간(콘텐츠) 등록/수정 + 등록 기한 연장 요청
 */

import type { CampaignApplication } from "@/types/domain/user";
import buttonStyles from "../../../../styles/user/campaign_management/buttons.module.css";
import {
  isContentTypeCampaign,
  isMissionTypeCampaign,
  isContentRegistered,
} from "../utils/selectedTabHelpers";

interface SelectedTabButtonsProps {
  campaign: CampaignApplication;
  isPurchasePeriod: boolean;
  onOpenContentModal: (mode: "register" | "edit") => void;
  onOpenReceiptModal: (mode: "register" | "edit") => void;
  onExtensionRequest: () => void;
}

/**
 * 등록 기한 연장 요청 버튼 렌더링
 */
function DeadlineExtensionButton({
  onExtensionRequest,
}: {
  onExtensionRequest: () => void;
}) {
  return (
    <button
      className={`${buttonStyles.action_button} ${buttonStyles.secondary_button}`}
      onClick={onExtensionRequest}
    >
      등록 기한 연장 요청
    </button>
  );
}

export default function SelectedTabButtons({
  campaign,
  isPurchasePeriod,
  onOpenContentModal,
  onOpenReceiptModal,
  onExtensionRequest,
}: SelectedTabButtonsProps) {
  const isContentType = isContentTypeCampaign(campaign);
  const isMissionType = isMissionTypeCampaign(campaign);
  const isContentReg = isContentRegistered(campaign);

  // 배송형, 방문형, 기자단: 콘텐츠 등록/수정 + 등록 기한 연장 요청
  if (isContentType) {
    if (isContentReg) {
      // Type 2: 콘텐츠 등록 완료 → "콘텐츠 수정" + "등록 기한 연장 요청"
      return (
        <>
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.content_edit_button}`}
            onClick={() => onOpenContentModal("edit")}
          >
            콘텐츠 수정
          </button>
          <DeadlineExtensionButton onExtensionRequest={onExtensionRequest} />
        </>
      );
    }

    // Type 1: 콘텐츠 미등록 → "콘텐츠 등록" + "등록 기한 연장 요청"
    return (
      <>
        <button
          className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
          onClick={() => onOpenContentModal("register")}
        >
          콘텐츠 등록
        </button>
        <DeadlineExtensionButton onExtensionRequest={onExtensionRequest} />
      </>
    );
  }

  // 미션형: 콘텐츠 등록/수정 + 등록 기한 연장 요청
  if (isMissionType) {
    if (isContentReg) {
      // Type 2: 콘텐츠 등록 완료 → "콘텐츠 수정" + "등록 기한 연장 요청"
      return (
        <>
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.content_edit_button}`}
            onClick={() => onOpenContentModal("edit")}
          >
            콘텐츠 수정
          </button>
          <DeadlineExtensionButton onExtensionRequest={onExtensionRequest} />
        </>
      );
    }

    // Type 1: 콘텐츠 미등록 → "콘텐츠 등록" + "등록 기한 연장 요청"
    return (
      <>
        <button
          className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
          onClick={() => onOpenContentModal("register")}
        >
          콘텐츠 등록
        </button>
        <DeadlineExtensionButton onExtensionRequest={onExtensionRequest} />
      </>
    );
  }

  // 구매평: 구매기간과 등록기간에 따라 다른 버튼 표시
  if (campaign.type === "구매평") {
    // 구매기간
    if (isPurchasePeriod) {
      // Type 2: 구매 영수증 등록 완료 → "구매 영수증 수정" + "등록 기한 연장 요청"
      if (campaign.subStatus === "receipt_registered") {
        return (
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.content_edit_button}`}
              onClick={() => onOpenReceiptModal("edit")}
            >
              구매 영수증 수정
            </button>
            <DeadlineExtensionButton onExtensionRequest={onExtensionRequest} />
          </>
        );
      }

      // Type 1: 구매 영수증 미등록 → "구매 영수증 등록" + "등록 기한 연장 요청"
      return (
        <>
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
            onClick={() => onOpenReceiptModal("register")}
          >
            구매 영수증 등록
          </button>
          <DeadlineExtensionButton onExtensionRequest={onExtensionRequest} />
        </>
      );
    }

    // 등록기간
    if (isContentReg) {
      // Type 2: 콘텐츠 등록 완료 → "콘텐츠 수정" + "등록 기한 연장 요청"
      return (
        <>
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.content_edit_button}`}
            onClick={() => onOpenContentModal("edit")}
          >
            콘텐츠 수정
          </button>
          <DeadlineExtensionButton onExtensionRequest={onExtensionRequest} />
        </>
      );
    }

    // Type 1: 콘텐츠 미등록 → "콘텐츠 등록" + "등록 기한 연장 요청"
    return (
      <>
        <button
          className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
          onClick={() => onOpenContentModal("register")}
        >
          콘텐츠 등록
        </button>
        <DeadlineExtensionButton onExtensionRequest={onExtensionRequest} />
      </>
    );
  }

  return null;
}
