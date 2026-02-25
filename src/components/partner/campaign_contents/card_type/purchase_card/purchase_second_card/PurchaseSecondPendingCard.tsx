/* ========================================
   구매평 2차 - 대기 탭 카드
   ======================================== */

/**
 * PurchaseSecondPendingCard
 *
 * 목적: 구매평 2단계 캠페인의 제출 대기 탭 콘텐츠 카드를 렌더링합니다.
 *
 * 사용 페이지:
 * - /partner/campaign/[id]/contents (구매평 > "대기" 탭 (등록 기간))
 */

"use client";

import { useState, useEffect } from "react";
import { useModalState } from "@/hooks/useModalState";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { CampaignApplicant } from "../../shared_card/campaignTypes";
import ReportModal, { type ReportOption } from "@/components/common/modal/ReportModal";
import BaseModal from "@/components/common/modal/BaseModal";
import TextareaModal from "@/components/common/modal/TextareaModal";
import ReceiptPreviewModal from "@/components/partner/campaign_contents/ReceiptPreviewModal";

type PendingState =
  | "content_not_registered" // 콘텐츠 미등록
  | "extension_requested" // 등록 기한 연장 요청
  | "rejected" // 반려 처리
  | "reported"; // 신고 처리

interface PurchaseSecondPendingCardProps {
  applicant: CampaignApplicant;
  /** 대기 탭에서의 상태 유형 */
  pendingState?: PendingState;
  /** 연장 승인 여부 (true면 기한이 "기한 연장" 형태로 표시) */
  isExtensionApproved?: boolean;
  /** 연장된 기한 날짜 (예: "2025-11-05") */
  extendedDeadline?: string;
  /** 실제 기한 날짜 (등록일과 다를 수 있음, 선택적) */
  deadlineDate?: string;
  /** 반려 사유 (확인 탭에서 반려 처리 시 입력된 사유) */
  reject_reason?: string;
  /** 등록 기한 연장 요청 사유 (데이터에서 불러옴) */
  extension_request_reason?: string;
  /** 신고 처리된 날짜/시간 (예: "2025-11-02 17:37") */
  reportedDate?: string;
  /** 리뷰 확인 버튼 클릭 (반려 처리일 때) */
  onCheckReview?: (applicantId: string) => void;
  /** 연장 버튼 클릭 */
  onExtend?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
  /** 리뷰 이미지 목록 (리뷰 확인 모달용) */
  reviewImages?: string[];
}

export default function PurchaseSecondPendingCard({
  applicant,
  pendingState = "content_not_registered",
  isExtensionApproved = false,
  extendedDeadline,
  deadlineDate,
  reject_reason = "",
  extension_request_reason = "",
  reportedDate,
  onCheckReview,
  onExtend,
  onReport,
  reviewImages = [],
}: PurchaseSecondPendingCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);

  const reportModal = useModalState();
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  // 연장 관련 상태
  const [extensionCount, setExtensionCount] = useState(0);
  const extensionConfirmModal = useModalState();
  const extensionCompleteModal = useModalState();
  const extensionLimitModal = useModalState();
  // 반려 사유 모달 상태
  const rejectReasonModal = useModalState();
  // 연장 요청 사유 모달 상태
  const extendModal = useModalState();
  const extendResultModal = useModalState();
  const [extendResultMessage, setExtendResultMessage] = useState<string>("");
  // 리뷰 이미지 모달 상태
  const reviewImageModal = useModalState();

  // 📌 로컬 상태 관리: 승인 시 카드 상태를 즉시 변경하기 위해 사용
  const [localPendingState, setLocalPendingState] = useState<PendingState>(pendingState);
  const [localIsExtensionApproved, setLocalIsExtensionApproved] = useState(isExtensionApproved);
  const [localExtendedDeadline, setLocalExtendedDeadline] = useState(extendedDeadline);

  // 📌 prop이 변경되면 로컬 상태도 업데이트 (부모 컴포넌트에서 상태 변경 시)
  useEffect(() => {
    setLocalPendingState(pendingState);
  }, [pendingState]);

  useEffect(() => {
    setLocalIsExtensionApproved(isExtensionApproved);
  }, [isExtensionApproved]);

  useEffect(() => {
    setLocalExtendedDeadline(extendedDeadline);
  }, [extendedDeadline]);

  // 신고 옵션 정의
  const reportOptions: ReportOption[] = [
    { value: "selection_cancelled", label: "선정 후 취소" },
    { value: "no_show", label: "무단 이탈 · 노쇼" },
    { value: "exposure_period", label: "노출 기간 불이행" },
    { value: "modification_request", label: "수정 요청 불이행" },
    { value: "other", label: "기타 비매너 행위", isOther: true },
  ];

  // 신고 모달 열기
  const handleReportClick = () => {
    reportModal.open();
    if (!selectedReportOption && reportOptions.length > 0) {
      setSelectedReportOption(reportOptions[0].value);
    }
  };

  // 신고 모달 닫기
  const handleReportModalClose = () => {
    reportModal.close();
    setSelectedReportOption("");
    setOtherReportReason("");
  };

  // 신고 확인 처리
  const handleReportConfirm = (selectedOption: string, otherReason?: string) => {
    if (onReport) {
      onReport(applicant.id);
    }
    // console.log("신고 사유:", selectedOption, "기타 사유:", otherReason);
    handleReportModalClose();
  };

  // 연장 버튼 클릭 핸들러 (footer 연장 버튼)
  const handleFooterExtendClick = () => {
    if (extensionCount >= 2) {
      extensionLimitModal.open();
      return;
    }
    extensionConfirmModal.open();
  };

  // 연장 확인 모달에서 연장 버튼 클릭
  const handleExtensionConfirm = () => {
    if (onExtend) {
      onExtend(applicant.id);
    }
    setExtensionCount((prev) => prev + 1);
    extensionConfirmModal.close();
    extensionCompleteModal.open();
  };

  // 연장 완료 모달 닫기 핸들러 (footer 연장 버튼용)
  const handleExtensionCompleteClose = () => {
    // 📌 카드 상태를 3번째 상태로 변경
    setLocalIsExtensionApproved(true);

    // extendedDeadline: 현재 기한 날짜 기준으로 3일 후 계산
    const baseDate = localExtendedDeadline || deadlineDate;

    if (baseDate) {
      const deadline = new Date(baseDate + "T00:00:00");
      deadline.setDate(deadline.getDate() + 3);
      const formattedDate = deadline.toISOString().split("T")[0];
      setLocalExtendedDeadline(formattedDate);
    } else {
      const today = new Date();
      today.setDate(today.getDate() + 3);
      const formattedDate = today.toISOString().split("T")[0];
      setLocalExtendedDeadline(formattedDate);
    }

    extensionCompleteModal.close();
  };

  // 연장 모달 열기 (상단 "등록 기한 연장 요청" 버튼용)
  const handleExtendClick = () => {
    extendModal.open();
  };

  // 연장 모달 닫기
  const handleExtendModalClose = () => {
    extendModal.close();
  };

  // 연장 거절 처리
  const handleExtendReject = () => {
    extendModal.close();
    setExtendResultMessage("등록 기간 연장이 거절되었습니다.");
    extendResultModal.open();
  };

  // 연장 승인 처리
  const handleExtendApprove = () => {
    if (onExtend) {
      onExtend(applicant.id);
    }

    extendModal.close();
    setExtendResultMessage("등록 기간 연장이 완료되었습니다.");
    extendResultModal.open();
  };

  // 연장 결과 모달 닫기
  const handleExtendResultModalClose = () => {
    if (extendResultMessage === "등록 기간 연장이 완료되었습니다.") {
      // 📌 카드 상태를 3번째 상태로 변경
      setLocalPendingState("content_not_registered");
      setLocalIsExtensionApproved(true);

      if (deadlineDate) {
        const deadline = new Date(deadlineDate + "T00:00:00");
        deadline.setDate(deadline.getDate() + 3);
        const formattedDate = deadline.toISOString().split("T")[0];
        setLocalExtendedDeadline(formattedDate);
      } else {
        const today = new Date();
        today.setDate(today.getDate() + 3);
        const formattedDate = today.toISOString().split("T")[0];
        setLocalExtendedDeadline(formattedDate);
      }
    }

    extendResultModal.close();
    setExtendResultMessage("");
  };

  // 반려 사유 모달 열기
  const handleRejectReasonClick = () => {
    rejectReasonModal.open();
  };

  // 반려 사유 모달 닫기
  const handleRejectReasonModalClose = () => {
    rejectReasonModal.close();
  };

  // 리뷰 확인 버튼 클릭 핸들러
  const handleReviewCheckClick = () => {
    if (reviewImages && reviewImages.length > 0) {
      reviewImageModal.open();
    } else if (onCheckReview) {
      onCheckReview(applicant.id);
    }
  };

  return (
    <div className={baseStyles.card_wrapper}>
      <article
        className={`${baseStyles.applicant_card} ${
          localPendingState === "reported" ? baseStyles.applicant_card_no_footer : ""
        }`.trim()}
      >
        {/* 프로필 영역 */}
        <div className={contentStyles.profile_section}>
          <div className={contentStyles.profile_image_container}>
            <img
              src={applicant.profileImage || "/images/mypage/profile.svg"}
              alt="프로필"
              className={contentStyles.profile_image}
            />
          </div>
          <div className={contentStyles.profile_info}>
            <span className={contentStyles.user_type}>{applicant.userType}</span>
            <span className={contentStyles.nickname}>{applicant.nickname}</span>
          </div>
        </div>

        {/* 상태별 버튼 표시 */}
        <div className={actionStyles.action_button_section}>
          {localPendingState === "content_not_registered" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.disabled_button}`}
              disabled
            >
              콘텐츠 미등록
            </button>
          )}

          {localPendingState === "extension_requested" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.extension_request_button}`}
              onClick={handleExtendClick}
            >
              <span className={actionStyles.extension_request_text_pc}>등록 기한 연장 요청</span>
              <span className={actionStyles.extension_request_text_mobile}>기간 연장 요청</span>
            </button>
          )}

          {localPendingState === "rejected" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.reject_process_button}`}
              onClick={handleRejectReasonClick}
              aria-label={`${applicant.nickname} 반려 사유 확인`}
            >
              콘텐츠 반려 처리
            </button>
          )}

          {localPendingState === "reported" && (
            <button
              className={`${actionStyles.action_button}`}
              disabled
              style={{
                backgroundColor: "rgba(255, 38, 38, 0.1)",
                color: "#ff2626",
                border: "1px solid transparent",
                cursor: "auto",
              }}
            >
              임시 참여 제한
            </button>
          )}
        </div>

        {/* 기한 표시 (미등록, 반려 처리, 연장 요청) 또는 신고 날짜/시간 표시 (신고 처리) */}
        {localPendingState === "reported" && reportedDate ? (
          <div className={actionStyles.registration_info}>
            <span>
              {reportedDate.split(" ")[0]}
              <span className={actionStyles.reported_time_mobile_hide}>
                {reportedDate.includes(" ") ? ` ${reportedDate.split(" ")[1]}` : ""}
              </span>{" "}
              신고
            </span>
          </div>
        ) : (
          (deadlineDate || localExtendedDeadline) && (
            <div className={actionStyles.registration_info}>
              <span>
                {localIsExtensionApproved && localExtendedDeadline
                  ? `${localExtendedDeadline} 기한 연장`
                  : deadlineDate
                    ? `${deadlineDate} 기한`
                    : localExtendedDeadline
                      ? `${localExtendedDeadline} 기한`
                      : ""}
              </span>
            </div>
          )
        )}
      </article>

      {/* 연장/신고 버튼 footer (신고 처리된 경우 표시하지 않음) */}
      {localPendingState !== "reported" && (
        <div className={actionStyles.extension_report_footer}>
          <button
            className={actionStyles.extension_button}
            onClick={handleFooterExtendClick}
            aria-label={`${applicant.nickname} 연장`}
          >
            <img
              src="/images/management_page/clock_icon.svg"
              alt="연장 아이콘"
              className={actionStyles.extension_icon}
            />
            <span>연장</span>
          </button>
          <div className={actionStyles.vertical_divider}></div>
          <button
            className={actionStyles.report_button}
            onClick={handleReportClick}
            aria-label={`${applicant.nickname} 신고`}
          >
            <img
              src="/images/management_page/report_icon.svg"
              alt="신고 아이콘"
              className={actionStyles.report_icon}
            />
            <span>신고</span>
          </button>
        </div>
      )}

      {/* 신고 모달 */}
      <ReportModal
        is_open={reportModal.isOpen}
        on_close={handleReportModalClose}
        title="콘텐츠 신고"
        options={reportOptions}
        selectedOption={selectedReportOption}
        onOptionChange={setSelectedReportOption}
        otherReason={otherReportReason}
        onOtherReasonChange={setOtherReportReason}
        buttons={["취소", "신고"]}
        on_confirm={handleReportConfirm}
        type="center"
      />

      {/* 등록 기한 연장 요청 사유 모달 */}
      <TextareaModal
        is_open={extendModal.isOpen}
        on_close={handleExtendModalClose}
        title="등록 기한 연장 요청 사유"
        value={extension_request_reason}
        readOnly={true}
        placeholder=""
        buttons={["거절", "승인"]}
        on_cancel={handleExtendReject}
        on_confirm={handleExtendApprove}
        type="center"
        variant="extend"
      />

      {/* 연장 결과 모달 (승인/거절 후 표시) */}
      <BaseModal
        is_open={extendResultModal.isOpen}
        on_close={handleExtendResultModalClose}
        message={extendResultMessage}
        buttons={["닫기"]}
        type="center"
      />

      {/* 연장 확인 모달 (푸터 연장 버튼용) */}
      <BaseModal
        is_open={extensionConfirmModal.isOpen}
        on_close={() => extensionConfirmModal.close()}
        message={
          extensionCount === 0
            ? '콘텐츠 등록 기간을<br><span style="color: #FF2626;">3일 연장</span>하시겠습니까?'
            : '이미 연장한 내역이 있습니다.<br><span style="color: #FF2626;">3일 더 연장</span>하시겠습니까?'
        }
        buttons={["취소", "연장"]}
        on_confirm={handleExtensionConfirm}
        type="center"
        button_variant="red"
      />

      {/* 연장 완료 모달 (푸터 연장 버튼용) */}
      <BaseModal
        is_open={extensionCompleteModal.isOpen}
        on_close={handleExtensionCompleteClose}
        message="등록 기간 연장이 완료되었습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 연장 제한 초과 모달 (푸터 연장 버튼용) */}
      <BaseModal
        is_open={extensionLimitModal.isOpen}
        on_close={() => extensionLimitModal.close()}
        message="연장은 최대 두 번까지만 가능합니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 반려 사유 모달 */}
      <TextareaModal
        is_open={rejectReasonModal.isOpen}
        on_close={handleRejectReasonModalClose}
        title="반려 사유"
        titleColor="#ff2626"
        value={reject_reason || "반려 사유가 등록되지 않았습니다."}
        readOnly={true}
        placeholder=""
        buttons={["닫기"]}
        type="center"
        variant="reject"
      />

      {/* 리뷰 이미지 모달 */}
      <ReceiptPreviewModal
        isOpen={reviewImageModal.isOpen}
        images={reviewImages}
        onClose={() => reviewImageModal.close()}
      />
    </div>
  );
}
