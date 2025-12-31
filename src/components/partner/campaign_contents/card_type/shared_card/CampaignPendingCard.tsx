/* ========================================
   ⏳ 구매평/미션형 공통 - 대기 탭 카드
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 구매평/미션형 > "대기" 탭
   
   🎯 대기 탭 카드 유형 정리:
   
   【구매평 (campaignType: "review")】- 총 4가지 유형
   
   1️⃣ 구매 영수증 미등록 (pendingState: "receipt_not_registered")
      - 상단: "구매 영수증 확인" 버튼 (검은색 배경)
      - 중간: "구매 영수증 미등록" 버튼 (회색, 비활성화)
      - 하단: 기한 날짜 (예: "2025-11-27 기한")
      - footer: 연장/신고 버튼
   
   2️⃣ 콘텐츠 미등록 (pendingState: "content_not_registered")
      - 상단: 없음
      - 중간: "콘텐츠 미등록" 버튼 (회색, 비활성화)
      - 하단: 기한 날짜 (예: "2025-11-27 기한")
      - footer: 연장/신고 버튼
   
   3️⃣ 등록 기한 연장 요청 (pendingState: "extension_requested")
      - 상단: 없음
      - 중간: "등록 기한 연장 요청" 버튼 (흰색 배경, 검은 테두리, 비활성화)
      - 하단: 기한 날짜 (예: "2025-11-27 기한")
      - footer: 연장/신고 버튼
   
   4️⃣ 반려 처리 (pendingState: "rejected")
      - 상단: 
        * reviewType 4 (영수증 흐름): "구매 영수증 확인" 버튼
        * reviewType !== 4 (일반): "리뷰 확인" 버튼
      - 중간: 
        * reviewType 4: "구매 영수증 반려 처리" 버튼 (빨간색)
        * reviewType !== 4: "콘텐츠 반려 처리" 버튼 (빨간색)
      - 하단: 기한 날짜 (예: "2025-11-27 기한")
      - footer: 연장/신고 버튼
   
   【미션형 (campaignType: "mission")】- 총 3가지 유형
   
   1️⃣ 콘텐츠 미등록 (pendingState: "content_not_registered")
      - 상단: 없음 (대기 탭에서는 확인 버튼 없음)
      - 중간: "콘텐츠 미등록" 버튼 (회색, 비활성화)
      - 하단: 기한 날짜 (예: "2025-12-30 기한")
      - footer: 연장/신고 버튼
   
   2️⃣ 등록 기한 연장 요청 (pendingState: "extension_requested")
      - 상단: 없음
      - 중간: "등록 기한 연장 요청" 버튼 (흰색 배경, 검은 테두리, 비활성화)
      - 하단: 기한 날짜 (예: "2025-12-30 기한")
      - footer: 연장/신고 버튼
   
   3️⃣ 반려 처리 (pendingState: "rejected")
      - 상단: 없음
      - 중간: "콘텐츠 반려 처리" 버튼 (빨간색)
      - 하단: 기한 날짜 (예: "2025-12-30 기한")
      - footer: 연장/신고 버튼
   
   📝 공통 사항:
   - 모든 카드에 footer: 연장/신고 버튼 표시
   - 기한 날짜는 상태 버튼 아래에 표시
   - 대기 탭에서는 승인/반려 버튼 없음 (확인 탭에서만 승인/반려 가능)
   - 미션형 대기 탭에서는 이미지/링크 확인 버튼 없음 (확인 탭에서만 확인 가능)
   ======================================== */

"use client";

import { useState } from "react";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { CampaignApplicant } from "./CampaignTypes";
import TextareaModal from "@/components/common/modal/TextareaModal";
import ReportModal, {
  type ReportOption,
} from "@/components/common/modal/ReportModal";
import BaseModal from "@/components/common/modal/BaseModal";

/**
 * 대기 탭 상태 유형 (구매평만 해당)
 * - receipt_not_registered: 구매 영수증 미등록
 * - content_not_registered: 콘텐츠 미등록
 * - extension_requested: 등록 기한 연장 요청
 * - rejected: 반려 처리
 */
type PendingState =
  | "receipt_not_registered"
  | "content_not_registered"
  | "extension_requested"
  | "rejected";

interface CampaignPendingCardProps {
  applicant: CampaignApplicant;
  /** 대기 탭에서의 상태 유형 */
  pendingState?: PendingState;
  /** 연장 승인 여부 (true면 기한이 "기한 연장" 형태로 표시) */
  isExtensionApproved?: boolean;
  /** 연장된 기한 날짜 (예: "2025-11-05") */
  extendedDeadline?: string;
  /** 실제 기한 날짜 (등록일과 다를 수 있음, 선택적) */
  deadlineDate?: string;
  /** 구매 영수증 확인 버튼 클릭 (구매평, 영수증 흐름일 때) */
  onCheckReceipt?: (applicantId: string) => void;
  /** 리뷰 확인 버튼 클릭 (구매평, 콘텐츠 미등록 상태일 때) */
  onCheckReview?: (applicantId: string) => void;
  /** 이미지 확인 버튼 클릭 (미션형) */
  onCheckImage?: (applicantId: string) => void;
  /** 링크 확인 버튼 클릭 (미션형) */
  onCheckLink?: (applicantId: string) => void;
  /** 승인 버튼 클릭 (미션형) */
  onApprove?: (applicantId: string) => void;
  /** 반려 버튼 클릭 (미션형) */
  onReject?: (applicantId: string) => void;
  /** 연장 버튼 클릭 (구매평만) */
  onExtend?: (applicantId: string) => void;
  /** 신고 버튼 클릭 (구매평만) */
  onReport?: (applicantId: string) => void;
  /** 등록 기한 연장 요청 사유 (데이터에서 불러옴) */
  extension_request_reason?: string;
  /** 콘텐츠 타입 (미션형만, 링크만, 이미지만, 링크+이미지) */
  contentType?: "link" | "image" | "both";
  dateLabel?: string;
}

export default function CampaignPendingCard({
  applicant,
  pendingState = "content_not_registered",
  isExtensionApproved = false,
  extendedDeadline,
  deadlineDate,
  onCheckReceipt,
  onCheckReview,
  onCheckImage,
  onCheckLink,
  onApprove,
  onReject,
  onExtend,
  onReport,
  extension_request_reason = "",
  contentType = "link",
  dateLabel = "등록",
}: CampaignPendingCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
  const isReview = applicant.campaignType === "review";

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isExtendResultModalOpen, setIsExtendResultModalOpen] = useState(false);
  const [extendResultMessage, setExtendResultMessage] = useState<string>("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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
    otherReason?: string
  ) => {
    if (onReport) {
      onReport(applicant.id);
    }
    console.log("신고 사유:", selectedOption, "기타 사유:", otherReason);
    handleReportModalClose();
  };

  // 연장 모달 열기
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
    setIsExtendResultModalOpen(false);
    setExtendResultMessage("");
  };

  // 반려 모달 열기 (미션형만)
  const handleRejectClick = () => {
    setIsRejectModalOpen(true);
  };

  // 반려 모달 닫기
  const handleRejectModalClose = () => {
    setIsRejectModalOpen(false);
    setRejectReason("");
  };

  // 반려 확인 처리 (미션형만)
  const handleRejectConfirm = () => {
    if (onReject) {
      onReject(applicant.id);
    }
    handleRejectModalClose();
  };

  // 미션형 버튼 생성 함수 (contentType 기준으로 버튼 결정)
  const getMissionButtons = () => {
    if (!isReview) {
      const buttons: Array<{ label: string; onClick: () => void }> = [];

      // contentType이 "both"인 경우: 이미지 확인 + 링크 확인 두 개
      if (contentType === "both") {
        buttons.push({
          label: "이미지 확인",
          onClick: () => {
            console.log("이미지 확인 클릭", applicant.id);
            onCheckImage?.(applicant.id);
          },
        });
        buttons.push({
          label: "링크 확인",
          onClick: () => {
            console.log("링크 확인 클릭", applicant.id);
            onCheckLink?.(applicant.id);
          },
        });
      }
      // contentType이 "image"인 경우: 이미지 확인 하나만
      else if (contentType === "image") {
        buttons.push({
          label: "이미지 확인",
          onClick: () => {
            console.log("이미지 확인 클릭", applicant.id);
            onCheckImage?.(applicant.id);
          },
        });
      }
      // contentType이 "link"인 경우: 링크 확인 하나만
      else if (contentType === "link") {
        buttons.push({
          label: "링크 확인",
          onClick: () => {
            console.log("링크 확인 클릭", applicant.id);
            onCheckLink?.(applicant.id);
          },
        });
      }

      return buttons;
    }
    return [];
  };

  const missionButtons = getMissionButtons();

  return (
    <div className={styles.card_wrapper}>
      <article className={styles.applicant_card}>
        {/* 프로필 영역 */}
        <div className={styles.profile_section}>
          <div className={styles.profile_image_container}>
            {applicant.profileImage ? (
              <img
                src={applicant.profileImage}
                alt="프로필"
                className={styles.profile_image}
              />
            ) : (
              <div className={styles.profile_placeholder}></div>
            )}
          </div>
          <div className={styles.profile_info}>
            <span className={styles.user_type}>{applicant.userType}</span>
            <span className={styles.nickname}>{applicant.nickname}</span>
          </div>
        </div>

        {/* 상단 액션 버튼 */}
        {/* 구매평: 영수증 확인 버튼 (영수증 흐름일 때만) */}
        {/* 구매평에서만 사용: 영수증 검증 흐름 (reviewType 2, 4, 6) */}
        {isReview &&
          (pendingState === "receipt_not_registered" ||
            (pendingState === "rejected" && applicant.reviewType === 4)) && (
            <button
              className={styles.content_check_button}
              onClick={() => {
                console.log("구매 영수증 확인 클릭", applicant.id);
                onCheckReceipt?.(applicant.id);
              }}
            >
              구매 영수증 확인
            </button>
          )}

        {/* 구매평: 반려 상태일 때 리뷰 확인 버튼 (상단에 표시) */}
        {isReview &&
          pendingState === "rejected" &&
          applicant.reviewType !== 4 && (
            <button
              className={styles.content_check_button}
              onClick={() => {
                console.log("리뷰 확인 클릭", applicant.id);
                onCheckReview?.(applicant.id);
              }}
            >
              리뷰 확인
            </button>
          )}

        {/* 대기 탭에서는 미션형도 이미지/링크 확인 버튼 없음 (확인 탭에서만 확인 가능) */}

        {/* 상태별 버튼 표시 */}
        <div className={styles.action_button_section}>
          {/* 구매평 상태별 버튼 */}
          {isReview && pendingState === "receipt_not_registered" && (
            <button
              className={`${styles.action_button} ${styles.disabled_button}`}
              disabled
            >
              구매 영수증 미등록
            </button>
          )}

          {isReview && pendingState === "content_not_registered" && (
            <button
              className={`${styles.action_button} ${styles.disabled_button}`}
              disabled
            >
              콘텐츠 미등록
            </button>
          )}

          {isReview && pendingState === "extension_requested" && (
            <button
              className={`${styles.action_button} ${styles.extension_request_button}`}
              disabled
            >
              등록 기한 연장 요청
            </button>
          )}

          {isReview && pendingState === "rejected" && (
            <button
              className={`${styles.action_button} ${styles.reject_process_button}`}
              disabled
            >
              {applicant.reviewType === 4
                ? "구매 영수증 반려 처리"
                : "콘텐츠 반려 처리"}
            </button>
          )}

          {/* 미션형 상태별 버튼 */}
          {!isReview && pendingState === "content_not_registered" && (
            <button
              className={`${styles.action_button} ${styles.disabled_button}`}
              disabled
            >
              콘텐츠 미등록
            </button>
          )}

          {!isReview && pendingState === "extension_requested" && (
            <button
              className={`${styles.action_button} ${styles.extension_request_button}`}
              disabled
            >
              등록 기한 연장 요청
            </button>
          )}

          {!isReview && pendingState === "rejected" && (
            <button
              className={`${styles.action_button} ${styles.reject_process_button}`}
              disabled
            >
              콘텐츠 반려 처리
            </button>
          )}

          {/* 대기 탭에서는 미션형도 승인/반려 버튼 없음 (확인 탭에서만 승인/반려 가능) */}
        </div>

        {/* 기한 표시 (연장 승인 후에는 "기한 연장" 형태로 표시) */}
        {/* 대기 탭에서는 등록 날짜가 아니라 기한 날짜만 표시, 버튼 밑에 표시 */}
        {deadlineDate ? (
          <div className={styles.registration_info}>
            <span>
              {isExtensionApproved && extendedDeadline
                ? `${extendedDeadline} 기한 연장`
                : `${deadlineDate} 기한`}
            </span>
          </div>
        ) : null}
      </article>

      {/* 연장/신고 버튼 footer */}
      <div className={styles.extension_report_footer}>
        <button
          className={styles.extension_button}
          onClick={handleExtendClick}
          aria-label={`${applicant.nickname} 연장`}
        >
          <img
            src="/images/management_page/clock_icon.svg"
            alt="연장 아이콘"
            className={styles.extension_icon}
          />
          <span>연장</span>
        </button>
        <div className={styles.vertical_divider}></div>
        <button
          className={styles.report_button}
          onClick={handleReportClick}
          aria-label={`${applicant.nickname} 신고`}
        >
          <img
            src="/images/management_page/report_icon.svg"
            alt="신고 아이콘"
            className={styles.report_icon}
          />
          <span>신고</span>
        </button>
      </div>

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
        buttons={["거절", "승인"]}
        on_cancel={handleExtendReject}
        on_confirm={handleExtendApprove}
        type="center"
        variant="extend"
      />

      {/* 연장 결과 모달 */}
      <BaseModal
        is_open={isExtendResultModalOpen}
        on_close={handleExtendResultModalClose}
        message={extendResultMessage}
        buttons={["닫기"]}
        type="center"
      />

      {/* 반려 사유 입력 모달 (미션형만, 승인/반려 버튼이 있을 때) */}
      {!isReview && onApprove && onReject && !pendingState && (
        <TextareaModal
          is_open={isRejectModalOpen}
          on_close={handleRejectModalClose}
          title="반려 사유"
          titleColor="#ff2626"
          value={rejectReason}
          onChange={setRejectReason}
          placeholder="사유 입력"
          buttons={["취소", "반려"]}
          on_confirm={handleRejectConfirm}
          type="center"
          variant="reject"
        />
      )}
    </div>
  );
}
