/* ========================================
   📋 취소/반려 탭 캠페인 카드 컴포넌트
   ======================================== */

/**
 * 취소/반려 탭 캠페인 카드 컴포넌트
 *
 * 목적: "취소/반려" 탭에 표시되는 캠페인 카드를 렌더링합니다.
 *
 * 경우의 수: 4가지
 * 1. 반려일 때 (content_rejected,re_register 또는 penalty,content_rejected):
 *    - 2개 버튼: "콘텐츠 반려 사유 확인" + "콘텐츠 수정"
 *    - 사유 확인 클릭 시 반려 사유 모달 표시
 *    - 콘텐츠 수정 클릭 시 콘텐츠 수정 모달 노출
 *    - 단, 수정 기간이 지난 경우 "등록 기간이 마감되었습니다." 모달 표시
 * 2. 패널티일 때 (penalty 또는 penalty,content_rejected):
 *    - 패널티 부과 사유:
 *      - 마감 기간이 지날 때까지 등록하지 않은 경우
 *      - 선정 후 신청 취소 시
 *      - 지각 제출 허용 시 7일 유예기간 내 미등록 (자동 신고)
 *    - 1개 버튼: "패널티 내역 확인"
 *    - 클릭하면 패널티 페이지(/user/campaign_management/penalty)로 이동
 * 3. 구매 영수증 반려일 때 (receipt_rejected):
 *    - 1개 버튼: "구매 영수증 재등록하기"
 *    - 클릭하면 구매 영수증 등록 모달 노출
 *
 * 참고사항:
 * - 지각 제출 허용 시 7일의 유예기간이 주어지며, 그 기간 안에 등록하지 않을 경우 회원 자동 신고
 * - 지각 제출 시 7일 안에 '완료' 상태가 되어야만 포인트 지급 (수정 기간 포함)
 *
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CampaignApplication } from "@/types/domain/user";
import buttonStyles from "../../../../styles/user/campaign_management/buttons.module.css";
import { getButtonClassName } from "@/components/common/campaign_management/utils/button_style_utils";
import CampaignCardBase from "./CampaignCardBase";
import ReceiptRegistrationModal from "../modals/ReceiptRegistrationModal";
import ContentRegistrationModal from "../modals/ContentRegistrationModal";
import ImageUploadModal from "../modals/ImageUploadModal";
import CombinedContentModal from "../modals/CombinedContentModal";
import RejectionReasonModal from "../modals/RejectionReasonModal";
import BaseModal from "@/components/common/modal/BaseModal";

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
  const [
    isRegistrationPeriodEndedModalOpen,
    setIsRegistrationPeriodEndedModalOpen,
  ] = useState(false);

  // 콘텐츠 수정 모달 모드 관리 (등록/수정)
  const [contentModalMode, setContentModalMode] = useState<"register" | "edit">(
    "edit"
  );

  // Next.js의 useRouter 훅을 사용하여 라우팅 기능 가져오기
  const router = useRouter();

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
   * - 패널티 부과 사유:
   *   1. 마감 기간이 지날 때까지 등록하지 않은 경우
   *   2. 선정 후 신청 취소 시
   *   3. 지각 제출 허용 시 7일 유예기간 내 미등록 (자동 신고)
   */
  const isPenalty =
    campaign.subStatus === "penalty" ||
    campaign.subStatus === "penalty,content_rejected" ||
    campaign.isPenalty === true;

  // 상태 텍스트 (반려/패널티/기타에 따라 다르게 표시)
  const statusText = isContentRejected
    ? "등록한 콘텐츠가 반려되었습니다. 반려 사유 확인 후 다시 등록해 주세요."
    : isPenalty
      ? "콘텐츠 등록 기간이 지났습니다."
      : "캠페인 신청이 취소되었습니다.";

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
   * 등록 기간이 마감되었는지 확인하는 함수
   *
   * 설명:
   * - 반려된 캠페인의 경우 수정 기간이 지났는지 확인합니다.
   * - 현재는 반려된 캠페인들은 모두 수정 가능한 것으로 간주합니다.
   * - TODO: 실제 데이터 구조에 맞게 수정 기간 체크 로직 구현 필요
   *   (예: campaign.editDeadline 또는 campaign.editPeriodEndDate 필드 사용)
   *
   * @returns 수정 기간이 지났으면 true, 아니면 false
   */
  const isEditPeriodEnded = (): boolean => {
    // TODO: 실제 수정 기간 필드를 사용하여 체크
    // 현재는 반려된 캠페인들은 모두 수정 가능한 것으로 간주
    // remainingDays가 음수여도 반려 후 수정 기간은 별도일 수 있으므로 false 반환
    return false;
  };

  /**
   * 콘텐츠 수정 버튼 클릭 핸들러
   *
   * 설명:
   * - 반려된 캠페인인 경우 수정 기간이 지났는지 확인합니다.
   * - 수정 기간이 지났으면 "등록 기간이 마감되었습니다." 모달을 표시합니다.
   * - 수정 기간이 남았으면 콘텐츠 수정 모달을 엽니다.
   */
  const handleContentEditClick = () => {
    // 반려된 캠페인이고 수정 기간이 지났을 경우
    if (isContentRejected && isEditPeriodEnded()) {
      setIsRegistrationPeriodEndedModalOpen(true);
      return;
    }

    // 수정 기간이 남았거나 반려되지 않은 경우 콘텐츠 수정 모달 열기
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
   * 버튼 영역 렌더링
   *
   * 설명:
   * - 기능 명세서에 따라 버튼 조합을 표시합니다.
   * - 반려일 때: "콘텐츠 반려 사유 확인" + "콘텐츠 수정"
   * - 패널티일 때: "패널티 내역 확인" (패널티 페이지로 이동)
   * - 구매 영수증 반려일 때: "구매 영수증 재등록하기"
   *
   * 패널티 케이스:
   * - 마감 기간이 지날 때까지 등록하지 않은 경우
   * - 선정 후 신청 취소 시
   * - 지각 제출 허용 시 7일 유예기간 내 미등록
   */
  const renderButtons = () => {
    // 경우 1: 반려일 때 → 2개 버튼
    if (isContentRejected) {
      return (
        <>
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.rejected_content_edit_button}`}
            onClick={handleContentEditClick}
          >
            콘텐츠 수정
          </button>
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.danger_button}`}
            onClick={handleRejectionReasonClick}
          >
            <span className={buttonStyles.desktop_only_text}>
              콘텐츠 반려 사유 확인
            </span>
            <span className={buttonStyles.mobile_only_text}>
              반려 사유 확인
            </span>
          </button>
        </>
      );
    }

    // 경우 2: 패널티일 때 → 1개 버튼
    // 패널티 부과 사유: 마감 기간 지나서 등록 안함, 선정 후 신청 취소, 지각 제출 허용 시 7일 유예기간 내 미등록
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
        className={`${buttonStyles.action_button} ${buttonStyles.rejected_content_edit_button}`}
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
        rejectionReason={campaign.rejectionReason}
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
              ? "https://www.naver.com/" // TODO: 실제 등록된 링크를 campaign 데이터에서 가져오기
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
              ? "https://www.naver.com/" // TODO: 실제 등록된 링크를 campaign 데이터에서 가져오기
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

      {/* 등록 기간 마감 모달 */}
      <BaseModal
        is_open={isRegistrationPeriodEndedModalOpen}
        on_close={() => setIsRegistrationPeriodEndedModalOpen(false)}
        message="등록 기간이 마감되었습니다."
        buttons={["닫기"]}
      />
    </>
  );
}
