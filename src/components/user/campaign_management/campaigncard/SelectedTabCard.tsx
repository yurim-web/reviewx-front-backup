/* ========================================
   📋 선정 탭 캠페인 카드 컴포넌트
   ======================================== */

/**
 * 선정 탭 캠페인 카드 컴포넌트
 *
 * 목적: "선정" 탭에 표시되는 캠페인 카드를 렌더링합니다.
 *
 * 캠페인 유형별 경우의 수:
 *
 * 1. 배송형, 방문형, 기자단:
 *    - Type 1: 콘텐츠 등록 + 등록 기한 연장 요청 (2개 버튼)
 *      - 모달: ContentRegistrationModal.tsx(링크만)
 *    - Type 2: 콘텐츠 수정 + 등록 기한 연장 요청 (2개 버튼)
 *      - 모달: ContentRegistrationModal.tsx(링크만)
 *
 * 2. 미션형:
 *    - Type 1: 콘텐츠 등록 + 등록 기한 연장 요청 (2개 버튼)
 *      - contentType === "link": ContentRegistrationModal.tsx (링크만)
 *      - contentType === "image": ImageUploadModal.tsx (이미지만)
 *      - contentType === "both" 또는 undefined: CombinedContentModal.tsx (링크 + 이미지)
 *    - Type 2: 콘텐츠 수정 + 등록 기한 연장 요청 (2개 버튼)
 *      - contentType에 따라 동일한 모달이 수정 모드로 열림
 *
 * 3. 구매평:
 *    - 1차: 구매 영수증 등록/수정
 *      - Type 1: 구매 영수증 등록 + 등록 기한 연장 요청 (2개 버튼)
 *        - 모달: ReceiptRegistrationModal.tsx(구매 영수증 이미지 업로드)
 *      - Type 2: 구매 영수증 수정 + 등록 기한 연장 요청 (2개 버튼)
 *        - 모달: ReceiptRegistrationModal.tsx(구매 영수증 이미지 업로드)
 *    - 2차: 콘텐츠 등록/수정
 *      - Type 1: 콘텐츠 등록 + 등록 기한 연장 요청 (2개 버튼)
 *        - 모달: ImageUploadModal.tsx(이미지 업로드)
 *      - Type 2: 콘텐츠 수정 + 등록 기한 연장 요청 (2개 버튼)
 *        - 모달: ImageUploadModal.tsx(이미지 업로드)
 *
 * 학습 포인트:
 * - 조건부 렌더링: 캠페인 타입과 subStatus에 따라 다른 버튼을 표시합니다.
 * - 다중 버튼: 일부 경우에는 2개의 버튼을 동시에 표시합니다.
 * - 상태 관리: useState를 사용하여 모달의 열림/닫힘 상태를 관리합니다.
 */

import { useState } from "react";
import type { CampaignApplication } from "@/types/user/user";
import BaseModal from "@/components/common/modal/BaseModal";
import buttonStyles from "../../../../styles/user/campaign_management/buttons.module.css";
import { getButtonClassName } from "@/components/common/campaign_management/utils/button_style_utils";
import CampaignCardBase from "./CampaignCardBase";
import ReceiptRegistrationModal from "../modals/ReceiptRegistrationModal";
import ContentRegistrationModal from "../modals/ContentRegistrationModal";
import ImageUploadModal from "../modals/ImageUploadModal";
import CombinedContentModal from "../modals/CombinedContentModal";

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
 * - 구매평: 구매 영수증 또는 콘텐츠 등록/수정 + 등록 기한 연장 요청 (2개 버튼)
 */
export default function SelectedTabCard({ campaign }: SelectedTabCardProps) {
  // 모달 상태 관리
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  // 콘텐츠 모달 모드 관리 (등록/수정)
  const [contentModalMode, setContentModalMode] = useState<"register" | "edit">(
    "register"
  );
  // 구매 영수증 모달 모드 관리 (등록/수정)
  const [receiptModalMode, setReceiptModalMode] = useState<"register" | "edit">(
    "register"
  );

  // 등록 기한 연장 요청 모달 상태 관리
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isExtensionLimitModalOpen, setIsExtensionLimitModalOpen] =
    useState(false);

  // 상태 텍스트
  const statusText = "캠페인에 선정되었습니다. 진행해주세요.";

  /**
   * 배송형, 방문형, 기자단인지 확인
   *
   * 설명:
   * - 이 타입들은 콘텐츠 등록/수정 + 등록 기한 연장 요청 버튼을 표시합니다.
   * - 링크만 입력하는 ContentRegistrationModal을 사용합니다.
   */
  const isContentTypeCampaign = ["배송형", "방문형", "기자단"].includes(
    campaign.type
  );

  /**
   * 미션형인지 확인
   *
   * 설명:
   * - 미션형은 콘텐츠 등록/수정 + 등록 기한 연장 요청 버튼을 표시합니다.
   * - contentType에 따라 다른 모달을 사용합니다:
   *   - "link": ContentRegistrationModal.tsx (링크만)
   *   - "image": ImageUploadModal.tsx (이미지만)
   *   - "both" 또는 undefined: CombinedContentModal.tsx (링크 + 이미지)
   */
  const isMissionTypeCampaign = campaign.type === "미션형";

  /**
   * 콘텐츠 등록 여부 확인
   *
   * 설명:
   * - content_not_registered: 콘텐츠 미등록 → "콘텐츠 등록하기"
   * - content_registered: 콘텐츠 등록 완료 → "콘텐츠 수정하기"
   */
  const isContentRegistered = campaign.subStatus === "content_registered";
  const isContentNotRegistered =
    campaign.subStatus === "content_not_registered";

  /**
   * 등록 기한 연장 요청 버튼
   *
   * 설명:
   * - 모든 캠페인에 공통으로 표시되는 버튼입니다.
   * - 등록 기한 연장을 요청할 수 있습니다.
   * - 최대 2번까지 신청 가능합니다.
   *   - 1번째 신청: 바로 요청
   *   - 2번째 신청: 확인 모달 표시
   *   - 3번째 이상: 제한 안내 모달 표시
   */
  const handleExtensionRequest = () => {
    // TODO: 실제 API에서 연장 신청 횟수 가져오기
    // 현재는 임시로 campaign 객체에서 extensionCount를 가져오거나 0으로 설정
    const extensionCount = (campaign as any).extensionCount ?? 0;

    if (extensionCount >= 2) {
      // 세 번째 이상 신청 시: 제한 안내 모달
      setIsExtensionLimitModalOpen(true);
    } else if (extensionCount === 1) {
      // 두 번째 신청 시: 확인 모달
      setIsExtensionModalOpen(true);
    } else {
      // 첫 번째 신청 시: 바로 요청
      handleConfirmExtension();
    }
  };

  /**
   * 등록 기한 연장 요청 확인
   *
   * 설명:
   * - 실제 API 호출로 등록 기한 연장을 요청합니다.
   */
  const handleConfirmExtension = async () => {
    try {
      // TODO: 실제 API 호출로 등록 기한 연장 요청
      // const response = await requestDeadlineExtension(campaign.id);
      console.log("등록 기한 연장 요청:", campaign.id);

      // 성공 시 모달 닫기
      setIsExtensionModalOpen(false);
      // TODO: 성공 모달 표시 또는 토스트 메시지
    } catch (error) {
      console.error("등록 기한 연장 요청 실패:", error);
      // TODO: 오류 모달 표시
    }
  };

  const renderDeadlineExtensionButton = () => (
    <button
      className={`${buttonStyles.action_button} ${buttonStyles.secondary_button}`}
      onClick={handleExtensionRequest}
    >
      등록 기한 연장 요청
    </button>
  );

  /**
   * 버튼 렌더링 함수
   *
   * 설명:
   * - 캠페인 타입에 따라 다른 버튼 조합을 반환합니다.
   * - 배송형, 방문형, 기자단: 콘텐츠 등록/수정 + 등록 기한 연장 요청 (2개 버튼)
   *   - Type 1: 콘텐츠 미등록 → "콘텐츠 등록하기" + "등록 기한 연장 요청" (ContentRegistrationModal.tsx)
   *   - Type 2: 콘텐츠 등록 완료 → "콘텐츠 수정하기" + "등록 기한 연장 요청" (ContentRegistrationModal.tsx)
   * - 미션형: 콘텐츠 등록/수정 + 등록 기한 연장 요청 (2개 버튼)
   *   - Type 1: 콘텐츠 미등록 → "콘텐츠 등록하기" + "등록 기한 연장 요청"
   *     - contentType === "link": ContentRegistrationModal.tsx (링크만)
   *     - contentType === "image": ImageUploadModal.tsx (이미지만)
   *     - contentType === "both" 또는 undefined: CombinedContentModal.tsx (링크 + 이미지)
   *   - Type 2: 콘텐츠 등록 완료 → "콘텐츠 수정하기" + "등록 기한 연장 요청"
   *     - contentType에 따라 동일한 모달이 수정 모드로 열림
   * - 구매평: 구매 영수증 또는 콘텐츠 등록/수정 + 등록 기한 연장 요청 (2개 버튼)
   *   - 1차: 구매 영수증 등록/수정
   *     - Type 1: 구매 영수증 미등록 → "구매 영수증 등록하기" + "등록 기한 연장 요청" (ReceiptRegistrationModal.tsx)
   *     - Type 2: 구매 영수증 등록 완료 → "구매 영수증 수정하기" + "등록 기한 연장 요청" (ReceiptRegistrationModal.tsx)
   *   - 2차: 콘텐츠 등록/수정
   *     - Type 1: 콘텐츠 미등록 → "콘텐츠 등록하기" + "등록 기한 연장 요청" (ImageUploadModal.tsx)
   *     - Type 2: 콘텐츠 등록 완료 → "콘텐츠 수정하기" + "등록 기한 연장 요청" (ImageUploadModal.tsx)
   */
  const renderButtons = () => {
    // 배송형, 방문형, 기자단: 콘텐츠 등록/수정 + 등록 기한 연장 요청 (2개 버튼)
    if (isContentTypeCampaign) {
      // Type 2: 콘텐츠 등록 완료 → "콘텐츠 수정하기" + "등록 기한 연장 요청"
      if (isContentRegistered) {
        return (
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => {
                // 수정 모드로 모달 열기
                setContentModalMode("edit");
                setIsContentModalOpen(true);
              }}
            >
              콘텐츠 수정하기
            </button>
            {renderDeadlineExtensionButton()}
          </>
        );
      }

      // Type 1: 콘텐츠 미등록 또는 그 외의 경우 → "콘텐츠 등록하기" + "등록 기한 연장 요청"
      // 배송형, 방문형, 기자단은 무조건 Type 1 또는 Type 2 중 하나가 표시됨
      return (
        <>
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
            onClick={() => {
              // 등록 모드로 모달 열기
              setContentModalMode("register");
              setIsContentModalOpen(true);
            }}
          >
            콘텐츠 등록하기
          </button>
          {renderDeadlineExtensionButton()}
        </>
      );
    }

    // 미션형: 콘텐츠 등록/수정 + 등록 기한 연장 요청 (2개 버튼)
    // contentType에 따라 다른 모달이 표시됩니다.
    if (isMissionTypeCampaign) {
      // Type 2: 콘텐츠 등록 완료 → "콘텐츠 수정하기" + "등록 기한 연장 요청"
      if (isContentRegistered) {
        return (
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => {
                // 수정 모드로 모달 열기
                setContentModalMode("edit");
                setIsContentModalOpen(true);
              }}
            >
              콘텐츠 수정하기
            </button>
            {renderDeadlineExtensionButton()}
          </>
        );
      }

      // Type 1: 콘텐츠 미등록 또는 그 외의 경우 → "콘텐츠 등록하기" + "등록 기한 연장 요청"
      // 미션형은 무조건 Type 1 또는 Type 2 중 하나가 표시됨
      return (
        <>
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
            onClick={() => {
              // 등록 모드로 모달 열기
              setContentModalMode("register");
              setIsContentModalOpen(true);
            }}
          >
            콘텐츠 등록하기
          </button>
          {renderDeadlineExtensionButton()}
        </>
      );
    }

    // 구매평: 구매 영수증 또는 콘텐츠 등록/수정 + 등록 기한 연장 요청 (2개 버튼)
    if (campaign.type === "구매평") {
      // Type 2: 구매 영수증 등록 완료 → "구매 영수증 수정하기" + "등록 기한 연장 요청"
      if (campaign.subStatus === "receipt_registered") {
        return (
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => {
                setReceiptModalMode("edit");
                setIsReceiptModalOpen(true);
              }}
            >
              구매 영수증 수정하기
            </button>
            {renderDeadlineExtensionButton()}
          </>
        );
      }

      // Type 1: 구매 영수증 미등록 → "구매 영수증 등록하기" + "등록 기한 연장 요청"
      if (campaign.subStatus === "receipt_not_registered") {
        return (
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => {
                setReceiptModalMode("register");
                setIsReceiptModalOpen(true);
              }}
            >
              구매 영수증 등록하기
            </button>
            {renderDeadlineExtensionButton()}
          </>
        );
      }

      // Type 2: 콘텐츠 등록 완료 → "콘텐츠 수정하기" + "등록 기한 연장 요청"
      if (isContentRegistered) {
        return (
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => {
                // 수정 모드로 모달 열기
                setContentModalMode("edit");
                setIsContentModalOpen(true);
              }}
            >
              콘텐츠 수정하기
            </button>
            {renderDeadlineExtensionButton()}
          </>
        );
      }

      // Type 1: 콘텐츠 미등록 또는 그 외의 경우 → "콘텐츠 등록하기" + "등록 기한 연장 요청"
      // 구매평은 무조건 Type 1 또는 Type 2 중 하나가 표시됨
      return (
        <>
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
            onClick={() => {
              // 등록 모드로 모달 열기
              setContentModalMode("register");
              setIsContentModalOpen(true);
            }}
          >
            콘텐츠 등록하기
          </button>
          {renderDeadlineExtensionButton()}
        </>
      );
    }

    // 기본 버튼은 제거됨
    // 배송형, 방문형, 기자단, 미션형, 구매평은 무조건 Type 1 또는 Type 2가 표시됨
    return null;
  };

  // 모달 닫기 핸들러
  const handleCloseContentModal = () => {
    setIsContentModalOpen(false);
  };

  const handleCloseReceiptModal = () => {
    setIsReceiptModalOpen(false);
  };

  return (
    <>
      {/* 등록 기한 연장 요청 모달들 */}
      {/* 두 번째 신청 시 확인 모달 */}
      <BaseModal
        is_open={isExtensionModalOpen}
        on_close={() => setIsExtensionModalOpen(false)}
        message="이미 연장한 내역이 있습니다.<br>추가 연장은 이번 요청이 마지막입니다.<br>계속하시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={handleConfirmExtension}
        type="center"
      />

      {/* 세 번째 이상 신청 시 제한 안내 모달 */}
      <BaseModal
        is_open={isExtensionLimitModalOpen}
        on_close={() => setIsExtensionLimitModalOpen(false)}
        message="연장은 최대 두 번까지만 가능합니다."
        buttons={["닫기"]}
        type="center"
      />

      <CampaignCardBase campaign={campaign} statusText={statusText}>
        <div className={buttonStyles.campaign_actions}>{renderButtons()}</div>
      </CampaignCardBase>

      {/* 캠페인 타입별 콘텐츠 등록 모달 */}
      {/* 조건부 렌더링: campaign.type에 따라 다른 모달을 표시합니다. */}
      {/* 배송형, 방문형, 기자단: 링크만 입력하는 ContentRegistrationModal */}
      {isContentTypeCampaign && (
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

      {/* 미션형: contentType에 따라 다른 모달 표시 */}
      {isMissionTypeCampaign && (
        <>
          {/* contentType === "link": 링크만 입력하는 ContentRegistrationModal */}
          {campaign.contentType === "link" && (
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

          {/* contentType === "image": 이미지만 업로드하는 ImageUploadModal */}
          {campaign.contentType === "image" && (
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

          {/* contentType === "both" 또는 undefined: 링크 + 이미지 모두 업로드하는 CombinedContentModal */}
          {(campaign.contentType === "both" || !campaign.contentType) && (
            <CombinedContentModal
              isOpen={isContentModalOpen}
              onClose={handleCloseContentModal}
              campaignTitle={campaign.title}
            />
          )}
        </>
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

      {/* 구매 영수증 등록 모달 (미션형, 구매평에서 사용) */}
      <ReceiptRegistrationModal
        isOpen={isReceiptModalOpen}
        onClose={handleCloseReceiptModal}
        campaignTitle={campaign.title}
        mode={receiptModalMode}
        existingImages={
          receiptModalMode === "edit"
            ? [
                "/images/main/campaign_img/eximg_1.png",
                "/images/main/campaign_img/eximg_2.png",
              ] // TODO: 실제 등록된 이미지 URL을 campaign 데이터에서 가져오기
            : []
        }
      />
    </>
  );
}
