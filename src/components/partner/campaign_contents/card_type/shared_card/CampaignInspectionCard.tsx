/* ========================================
   🧾 구매평/미션형 공통 - 검수 카드
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 구매평/미션형
     - "대기" 탭: 리뷰 확인 버튼이 있는 경우 (구매평만)
     - "확인" 탭: 영수증 확인 또는 리뷰 확인 후 승인/반려 가능한 상태
   
   🎯 주요 기능:
     - 구매평:
       - type1: 리뷰 확인 버튼
       - type2: 구매 영수증 확인 버튼
       - 하단: 승인/반려 버튼
       - footer: 연장/신고 버튼
     - 미션형:
       - type1: 이미지 확인 + 링크 확인
       - type2: 이미지 확인만
       - type3: 링크 확인만
       - 하단: 승인/반려 버튼
   
   📝 참고:
     - "확인" 탭에서만 승인/반려 버튼이 표시됩니다
     - "대기" 탭에서는 승인/반려 버튼이 표시되지 않습니다 (구매평만)
     - campaignType prop으로 구매평/미션형 구분
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

interface CampaignInspectionCardProps {
  applicant: CampaignApplicant;
  /** 리뷰 확인 버튼 클릭 (구매평) */
  onCheckReview?: (applicantId: string) => void;
  /** 구매 영수증 확인 버튼 클릭 (구매평) */
  onCheckReceipt?: (applicantId: string) => void;
  /** 링크 확인 버튼 클릭 (구매평/미션형, contentType이 "both"일 때 사용) */
  onCheckLink?: (applicantId: string) => void;
  /** 이미지 확인 버튼 클릭 (미션형) */
  onCheckImage?: (applicantId: string) => void;
  /** 승인 버튼 클릭 */
  onApprove: (applicantId: string) => void;
  /** 반려 버튼 클릭 */
  onReject: (applicantId: string) => void;
  /** 연장 버튼 클릭 */
  onExtend?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
  /** 콘텐츠 타입 (구매평만, 링크만, 이미지만, 링크+이미지) */
  contentType?: "link" | "image" | "both";
  /** 등록 기한 연장 요청 사유 (데이터에서 불러옴) */
  extension_request_reason?: string;
  dateLabel?: string;
}

export default function CampaignInspectionCard({
  applicant,
  onCheckReview,
  onCheckReceipt,
  onCheckLink,
  onCheckImage,
  onApprove,
  onReject,
  onExtend,
  onReport,
  contentType = "link",
  extension_request_reason = "",
  dateLabel = "등록",
}: CampaignInspectionCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
  const isReview = applicant.campaignType === "review";

  // contentType이 "both"인 경우 두 개의 버튼 표시 (구매평만)
  const isBothContentType = contentType === "both" && isReview;

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isExtendResultModalOpen, setIsExtendResultModalOpen] = useState(false);
  const [extendResultMessage, setExtendResultMessage] = useState<string>("");

  // 신고 옵션 정의
  const reportOptions: ReportOption[] = [
    { value: "selection_cancelled", label: "선정 후 취소" },
    { value: "no_show", label: "무단 이탈 · 노쇼" },
    { value: "exposure_period", label: "노출 기간 불이행" },
    { value: "modification_request", label: "수정 요청 불이행" },
    { value: "other", label: "기타 비매너 행위", isOther: true },
  ];

  // 반려 모달 열기
  const handleRejectClick = () => {
    setIsRejectModalOpen(true);
  };

  // 반려 모달 닫기
  const handleRejectModalClose = () => {
    setIsRejectModalOpen(false);
    setRejectReason("");
  };

  // 반려 확인 처리
  const handleRejectConfirm = () => {
    onReject(applicant.id);
    handleRejectModalClose();
  };

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

  // 구매평 버튼 생성 함수
  const getReviewButton = () => {
    if (!isReview || !applicant.reviewType) return null;

    // contentType이 "image"인 경우 "이미지 확인" 버튼 하나만 표시
    if (contentType === "image") {
      return {
        label: "이미지 확인",
        onClick: () => {
          console.log("이미지 확인 클릭", applicant.id);
          onCheckImage?.(applicant.id) || onCheckReview?.(applicant.id);
        },
      };
    }

    const reviewType = applicant.reviewType;
    const isReceiptFlow = [2, 4, 6].includes(reviewType);

    // 구매평에서만 사용: 영수증 검증 흐름 (reviewType 2, 4, 6)
    if (isReceiptFlow) {
      return {
        label: "구매 영수증 확인",
        onClick: () => {
          console.log("구매 영수증 확인 클릭", applicant.id);
          onCheckReceipt?.(applicant.id);
        },
      };
    }

    return {
      label: "리뷰 확인",
      onClick: () => {
        console.log("리뷰 확인 클릭", applicant.id);
        onCheckReview?.(applicant.id);
      },
    };
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
            onCheckLink?.(applicant.id) || onCheckReview?.(applicant.id);
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
            onCheckLink?.(applicant.id) || onCheckReview?.(applicant.id);
          },
        });
      }

      return buttons;
    }
    return [];
  };

  const reviewButton = getReviewButton();
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
        {/* 구매평: contentType이 "both"인 경우 이미지 확인 + 링크 확인 버튼 두 개 */}
        {isReview && isBothContentType ? (
          <div className={styles.content_check_buttons_wrapper}>
            <button
              className={styles.content_check_button}
              onClick={() => {
                console.log("이미지 확인 클릭", applicant.id);
                onCheckReview?.(applicant.id);
              }}
            >
              이미지 확인
            </button>
            <button
              className={styles.content_check_button}
              onClick={() => {
                console.log("링크 확인 클릭", applicant.id);
                onCheckLink?.(applicant.id) || onCheckReview?.(applicant.id);
              }}
            >
              링크 확인
            </button>
          </div>
        ) : isReview && reviewButton ? (
          <button
            className={styles.content_check_button}
            onClick={reviewButton.onClick}
          >
            {reviewButton.label}
          </button>
        ) : !isReview && missionButtons.length > 0 ? (
          <div className={styles.content_check_buttons_wrapper}>
            {missionButtons.map((btn, idx) => (
              <button
                key={idx}
                className={styles.content_check_button}
                onClick={btn.onClick}
              >
                {btn.label}
              </button>
            ))}
          </div>
        ) : null}

        {/* 등록/수정/지각 등록 */}
        <div className={styles.registration_info}>
          <span
            className={
              dateLabel === "지각 등록" ? styles.late_label : undefined
            }
          >
            {applicant.updatedAt
              ? `${applicant.updatedAt} ${dateLabel}`
              : `${applicant.registrationDate} ${dateLabel}`}
          </span>
        </div>

        {/* 승인/반려 */}
        <div className={styles.approval_buttons}>
          <button
            className={`${styles.action_button} ${styles.approve_button}`}
            onClick={() => {
              console.log("승인 클릭", applicant.id);
              onApprove(applicant.id);
            }}
          >
            승인
          </button>
          <button
            className={`${styles.action_button} ${styles.reject_button}`}
            onClick={handleRejectClick}
          >
            반려
          </button>
        </div>
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

      {/* 반려 사유 입력 모달 */}
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
    </div>
  );
}
