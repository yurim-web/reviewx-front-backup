/* ========================================
   ⏳ 구매평 2차 - 대기 탭 카드
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 구매평 > "대기" 탭 (등록 기간)
   
   🎯 대기 탭 카드 유형 - 5가지:
   
   1️⃣ 콘텐츠 미등록 (pendingState: "content_not_registered")
      - 상단: 없음
      - 중간: "콘텐츠 미등록" 버튼 (회색, 비활성화)
      - 하단: 기한 날짜 (예: "2025-11-02 기한")
      - footer: 연장/신고 버튼
   
   2️⃣ 등록 기한 연장 요청 (pendingState: "extension_requested")
      - 상단: 없음
      - 중간: "등록 기한 연장 요청" 버튼 (흰색 배경, 검은 테두리, 클릭 시 연장 요청 사유 모달 표시)
      - 하단: 기한 날짜 (예: "2025-11-02 기한")
      - footer: 연장/신고 버튼
      → 버튼 클릭 시 리뷰어가 입력한 연장 요청 사유 모달 표시
   
   3️⃣ 연장 승인 후 아직 등록 안함 (pendingState: "content_not_registered", isExtensionApproved: true)
      - 상단: 없음
      - 중간: "콘텐츠 미등록" 버튼 (회색, 비활성화)
      - 하단: 연장된 기한 날짜 (예: "2025-11-05 기한 연장")
      - footer: 연장/신고 버튼
   
   4️⃣ 반려 처리 (pendingState: "rejected")
      - 상단: 없음
      - 중간: "콘텐츠 반려 처리" 버튼 (빨간색, 클릭 시 반려 사유 모달 표시)
      - 하단: 기한 날짜 (예: "2025-11-02 기한")
      - footer: 연장/신고 버튼
   
   5️⃣ 임시 참여 제한 (pendingState: "reported")
      - 상단: 없음
      - 중간: "임시 참여 제한" 버튼 (빨간색 배경, 빨간색 텍스트)
      - 하단: 신고 날짜/시간 (예: "2025-11-02 17:37 신고")
      - footer: 없음 (연장/신고 버튼 없음)
   
   🎯 주요 기능:
     - 연장: 등록 기한을 3일 연장 (최대 2회까지 가능)
     - 신고: 콘텐츠 신고 모달 (선정 후 취소, 무단 이탈, 노출 기간 불이행 등)
     - 반려 사유 확인: "콘텐츠 반려 처리" 버튼 클릭 시 파트너가 입력한 반려 사유 모달 표시
     - 연장 요청 사유 확인: "등록 기한 연장 요청" 버튼 클릭 시 리뷰어가 입력한 연장 요청 사유 모달 표시
     - 리뷰 확인: "리뷰 확인" 버튼 클릭 시 리뷰 이미지 모달 표시
   
   📝 참고:
     - 등록 기간에 해당하는 구매평 2차 카드입니다
     - 대기 탭에서는 승인/반려 버튼 없음 (확인 탭에서만 승인/반려 가능)
     - pendingState prop으로 상태를 구분합니다
     - deadlineDate prop으로 캠페인 등록 기간의 마지막 날짜를 표시합니다
     - reject_reason prop으로 반려 사유를 전달받아 모달에 표시합니다
     - extension_request_reason prop으로 연장 요청 사유를 전달받아 모달에 표시합니다
     - reportedDate prop으로 신고 날짜/시간을 전달받아 표시합니다
   ======================================== */

"use client";

import { useState, useEffect } from "react";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { CampaignApplicant } from "../../shared_card/CampaignTypes";
import ReportModal, {
  type ReportOption,
} from "@/components/common/modal/ReportModal";
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

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  // 연장 관련 상태
  const [extensionCount, setExtensionCount] = useState(0);
  const [isExtensionConfirmModalOpen, setIsExtensionConfirmModalOpen] =
    useState(false);
  const [isExtensionCompleteModalOpen, setIsExtensionCompleteModalOpen] =
    useState(false);
  const [isExtensionLimitModalOpen, setIsExtensionLimitModalOpen] =
    useState(false);
  // 반려 사유 모달 상태
  const [isRejectReasonModalOpen, setIsRejectReasonModalOpen] = useState(false);
  // 연장 요청 사유 모달 상태
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isExtendResultModalOpen, setIsExtendResultModalOpen] = useState(false);
  const [extendResultMessage, setExtendResultMessage] = useState<string>("");
  // 리뷰 이미지 모달 상태
  const [isReviewImageModalOpen, setIsReviewImageModalOpen] = useState(false);

  // 📌 로컬 상태 관리: 승인 시 카드 상태를 즉시 변경하기 위해 사용
  const [localPendingState, setLocalPendingState] =
    useState<PendingState>(pendingState);
  const [localIsExtensionApproved, setLocalIsExtensionApproved] =
    useState(isExtensionApproved);
  const [localExtendedDeadline, setLocalExtendedDeadline] =
    useState(extendedDeadline);

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
    setIsReportModalOpen(true);
    if (!selectedReportOption && reportOptions.length > 0) {
      setSelectedReportOption(reportOptions[0].value);
    }
  };

  // 신고 모달 닫기
  const handleReportModalClose = () => {
    setIsReportModalOpen(false);
    setSelectedReportOption("");
    setOtherReportReason("");
  };

  // 신고 확인 처리
  const handleReportConfirm = (
    selectedOption: string,
    otherReason?: string,
  ) => {
    if (onReport) {
      onReport(applicant.id);
    }
    // console.log("신고 사유:", selectedOption, "기타 사유:", otherReason);
    handleReportModalClose();
  };

  // 연장 버튼 클릭 핸들러 (footer 연장 버튼)
  const handleFooterExtendClick = () => {
    if (extensionCount >= 2) {
      setIsExtensionLimitModalOpen(true);
      return;
    }
    setIsExtensionConfirmModalOpen(true);
  };

  // 연장 확인 모달에서 연장 버튼 클릭
  const handleExtensionConfirm = () => {
    if (onExtend) {
      onExtend(applicant.id);
    }
    setExtensionCount((prev) => prev + 1);
    setIsExtensionConfirmModalOpen(false);
    setIsExtensionCompleteModalOpen(true);
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

    setIsExtensionCompleteModalOpen(false);
  };

  // 연장 모달 열기 (상단 "등록 기한 연장 요청" 버튼용)
  const handleExtendClick = () => {
    setIsExtendModalOpen(true);
  };

  // 연장 모달 닫기
  const handleExtendModalClose = () => {
    setIsExtendModalOpen(false);
  };

  // 연장 거절 처리
  const handleExtendReject = () => {
    setIsExtendModalOpen(false);
    setExtendResultMessage("등록 기간 연장이 거절되었습니다.");
    setIsExtendResultModalOpen(true);
  };

  // 연장 승인 처리
  const handleExtendApprove = () => {
    if (onExtend) {
      onExtend(applicant.id);
    }

    setIsExtendModalOpen(false);
    setExtendResultMessage("등록 기간 연장이 완료되었습니다.");
    setIsExtendResultModalOpen(true);
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

    setIsExtendResultModalOpen(false);
    setExtendResultMessage("");
  };

  // 반려 사유 모달 열기
  const handleRejectReasonClick = () => {
    setIsRejectReasonModalOpen(true);
  };

  // 반려 사유 모달 닫기
  const handleRejectReasonModalClose = () => {
    setIsRejectReasonModalOpen(false);
  };

  // 리뷰 확인 버튼 클릭 핸들러
  const handleReviewCheckClick = () => {
    if (reviewImages && reviewImages.length > 0) {
      setIsReviewImageModalOpen(true);
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
            <span className={contentStyles.user_type}>
              {applicant.userType}
            </span>
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
              <span className={actionStyles.extension_request_text_pc}>
                등록 기한 연장 요청
              </span>
              <span className={actionStyles.extension_request_text_mobile}>
                기간 연장 요청
              </span>
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
        is_open={isReportModalOpen}
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
        is_open={isExtendModalOpen}
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
        is_open={isExtendResultModalOpen}
        on_close={handleExtendResultModalClose}
        message={extendResultMessage}
        buttons={["닫기"]}
        type="center"
      />

      {/* 연장 확인 모달 (푸터 연장 버튼용) */}
      <BaseModal
        is_open={isExtensionConfirmModalOpen}
        on_close={() => setIsExtensionConfirmModalOpen(false)}
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
        is_open={isExtensionCompleteModalOpen}
        on_close={handleExtensionCompleteClose}
        message="등록 기간 연장이 완료되었습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 연장 제한 초과 모달 (푸터 연장 버튼용) */}
      <BaseModal
        is_open={isExtensionLimitModalOpen}
        on_close={() => setIsExtensionLimitModalOpen(false)}
        message="연장은 최대 두 번까지만 가능합니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 반려 사유 모달 */}
      <TextareaModal
        is_open={isRejectReasonModalOpen}
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
        isOpen={isReviewImageModalOpen}
        images={reviewImages}
        onClose={() => setIsReviewImageModalOpen(false)}
      />
    </div>
  );
}
