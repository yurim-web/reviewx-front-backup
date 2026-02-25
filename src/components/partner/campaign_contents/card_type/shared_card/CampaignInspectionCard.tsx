/* ========================================
   구매평/미션형 공통 - 검수 카드
   ======================================== */

/**
 * CampaignInspectionCard
 *
 * 목적: 구매평/미션형 공통 캠페인의 검수 탭 콘텐츠 카드를 렌더링합니다.
 *
 * 사용 페이지:
 * - /partner/campaign/[id]/contents (구매평/미션형)
 */

"use client";

import { useState, useEffect } from "react";
import { useModalState } from "@/hooks/useModalState";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/helpers/url";
import { formatDateForMobile } from "@/utils/formatting/date";
import type { CampaignApplicant } from "./campaignTypes";
import TextareaModal from "@/components/common/modal/TextareaModal";
import ReportModal, { type ReportOption } from "@/components/common/modal/ReportModal";
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
  /** 연장 버튼 클릭 (연장 완료 후 대기 탭으로 이동) */
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

  const rejectModal = useModalState();
  const [rejectReason, setRejectReason] = useState("");
  const reportModal = useModalState();
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  // 연장 관련 상태
  const [extensionCount, setExtensionCount] = useState(0); // 연장 횟수 추적
  const extensionConfirmModal = useModalState();
  const extensionCompleteModal = useModalState();
  const extensionLimitModal = useModalState();

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    rejectModal.open();
  };

  // 반려 모달 닫기
  const handleRejectModalClose = () => {
    rejectModal.close();
    setRejectReason("");
  };

  // 반려 확인 처리
  const handleRejectConfirm = () => {
    onReject(applicant.id);
    handleRejectModalClose();
  };

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

  // 연장 버튼 클릭 핸들러
  // 📌 연장 버튼 클릭 처리:
  // - 연장 버튼을 클릭하면 이 함수가 실행됩니다
  // - 연장 횟수가 2회 이상이면 제한 모달을 표시합니다
  // - 그렇지 않으면 연장 확인 모달을 표시합니다
  const handleExtendClick = () => {
    // console.log("연장 버튼 클릭, 현재 연장 횟수:", extensionCount);
    // 연장 횟수가 2회 이상이면 제한 모달 표시
    if (extensionCount >= 2) {
      // console.log("연장 제한 모달 표시");
      extensionLimitModal.open();
      return;
    }
    // 연장 확인 모달 표시
    // console.log("연장 확인 모달 표시");
    extensionConfirmModal.open();
  };

  // 연장 확인 모달에서 연장 버튼 클릭
  // 📌 연장 확인 처리:
  // - 연장 완료 모달을 표시합니다
  // - 연장 완료 모달의 "닫기" 버튼을 눌렀을 때만 onExtend를 호출하여 탭 이동을 수행합니다
  const handleExtensionConfirm = () => {
    // console.log("연장 확인 모달에서 연장 버튼 클릭");
    setExtensionCount((prev) => prev + 1);
    extensionConfirmModal.close();
    extensionCompleteModal.open();
    // console.log("연장 완료 모달 표시");
  };

  // 연장 완료 모달 닫기 핸들러
  // 📌 연장 완료 후 처리:
  // - 연장 완료 모달의 "닫기" 버튼을 클릭하면 이 함수가 실행됩니다
  // - onExtend 콜백을 호출하여 부모 컴포넌트에 탭 이동을 요청합니다
  // - 부모 컴포넌트에서 대기 탭으로 이동하고 날짜를 업데이트합니다
  const handleExtensionCompleteClose = () => {
    // console.log(
    //   "연장 완료 모달 닫기, onExtend 호출:",
    //   applicant.id,
    //   "onExtend 존재:",
    //   !!onExtend
    // );
    extensionCompleteModal.close();
    // 연장 완료 후 대기 탭으로 이동하기 위해 onExtend를 호출
    // 부모 컴포넌트에서 탭 이동과 날짜 업데이트를 처리합니다
    if (onExtend) {
      onExtend(applicant.id);
    } else {
      console.warn("onExtend가 전달되지 않았습니다!");
    }
  };

  // 구매평 버튼 생성 함수
  const getReviewButton = () => {
    if (!isReview || !applicant.reviewType) return null;

    // contentType이 "image"인 경우 "이미지 확인" 버튼 하나만 표시
    if (contentType === "image") {
      return {
        label: "이미지 확인",
        onClick: () => {
          // console.log("이미지 확인 클릭", applicant.id);
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
          // console.log("구매 영수증 확인 클릭", applicant.id);
          onCheckReceipt?.(applicant.id);
        },
      };
    }

    return {
      label: "리뷰 확인",
      onClick: () => {
        // console.log("리뷰 확인 클릭", applicant.id);
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
            // console.log("이미지 확인 클릭", applicant.id);
            onCheckImage?.(applicant.id);
          },
        });
        buttons.push({
          label: "링크 확인",
          onClick: () => {
            // console.log("링크 확인 클릭", applicant.id);
            onCheckLink?.(applicant.id) || onCheckReview?.(applicant.id);
          },
        });
      }
      // contentType이 "image"인 경우: 이미지 확인 하나만
      else if (contentType === "image") {
        buttons.push({
          label: "이미지 확인",
          onClick: () => {
            // console.log("이미지 확인 클릭", applicant.id);
            onCheckImage?.(applicant.id);
          },
        });
      }
      // contentType이 "link"인 경우: 링크 확인 하나만
      else if (contentType === "link") {
        buttons.push({
          label: "링크 확인",
          onClick: () => {
            // console.log("링크 확인 클릭", applicant.id);
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

  // Format date for display
  const dateToDisplay = applicant.updatedAt || applicant.registrationDate;
  const formattedDate = isMobile ? formatDateForMobile(dateToDisplay) : dateToDisplay;

  return (
    <div className={baseStyles.card_wrapper}>
      <article className={baseStyles.applicant_card}>
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

        {/* 채널 정보 */}
        <div className={contentStyles.channel_section}>
          <img
            src={channel_icon_src}
            alt={applicant.channel}
            className={contentStyles.channel_icon}
          />
          <a
            href={getChannelUrl(applicant.channel, applicant.channelId)}
            target="_blank"
            rel="noopener noreferrer"
            className={contentStyles.applicant_id}
            onClick={(e) => {
              const url = getChannelUrl(applicant.channel, applicant.channelId);
              if (url === "#") {
                e.preventDefault();
              }
            }}
          >
            {applicant.channelId}
          </a>
        </div>

        {/* 상단 액션 버튼 */}
        {/* 구매평: contentType이 "both"인 경우 이미지 확인 + 링크 확인 버튼 두 개 */}
        {isReview && isBothContentType ? (
          <div className={actionStyles.content_check_buttons_wrapper}>
            <button
              className={actionStyles.content_check_button}
              onClick={() => {
                // console.log("이미지 확인 클릭", applicant.id);
                onCheckReview?.(applicant.id);
              }}
            >
              이미지 확인
            </button>
            <button
              className={actionStyles.content_check_button}
              onClick={() => {
                // console.log("링크 확인 클릭", applicant.id);
                onCheckLink?.(applicant.id) || onCheckReview?.(applicant.id);
              }}
            >
              링크 확인
            </button>
          </div>
        ) : isReview && reviewButton ? (
          <button className={actionStyles.content_check_button} onClick={reviewButton.onClick}>
            {reviewButton.label}
          </button>
        ) : !isReview && missionButtons.length > 0 ? (
          <div className={actionStyles.content_check_buttons_wrapper}>
            {missionButtons.map((btn, idx) => (
              <button key={idx} className={actionStyles.content_check_button} onClick={btn.onClick}>
                {btn.label}
              </button>
            ))}
          </div>
        ) : null}

        {/* 승인/반려 */}
        <div className={actionStyles.approval_buttons}>
          <button
            className={`${actionStyles.action_button} ${actionStyles.approve_button}`}
            onClick={() => {
              // console.log("승인 클릭", applicant.id);
              onApprove(applicant.id);
            }}
          >
            승인
          </button>
          <button
            className={`${actionStyles.action_button} ${actionStyles.reject_button}`}
            onClick={handleRejectClick}
          >
            반려
          </button>
        </div>

        {/* 등록/수정/지각 등록 */}
        <div className={actionStyles.registration_info}>
          {dateLabel === "지각 등록" ? (
            <span className={actionStyles.late_label}>
              {formattedDate} <span className={actionStyles.late_text_full}>지각 등록</span>
              <span className={actionStyles.late_text_short}>지각</span>
            </span>
          ) : (
            <span>
              {formattedDate} {dateLabel}
            </span>
          )}
        </div>
      </article>

      {/* 연장/신고 버튼 footer */}
      <div className={actionStyles.extension_report_footer}>
        <button
          className={actionStyles.extension_button}
          onClick={handleExtendClick}
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

      {/* 반려 사유 입력 모달 */}
      <TextareaModal
        is_open={rejectModal.isOpen}
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

      {/* 연장 확인 모달 */}
      {/* 📌 연장 버튼 클릭 시 표시되는 모달:
          - 연장 횟수에 따라 다른 메시지 표시
          - 첫 연장: "콘텐츠 등록 기간을 3일 연장하시겠습니까?"
          - 두 번째 연장 (중복 연장): "이미 연장한 내역이 있습니다. 추가 연장은 이번 요청이 마지막입니다. 계속하시겠습니까?"
      */}
      <BaseModal
        is_open={extensionConfirmModal.isOpen}
        on_close={() => extensionConfirmModal.close()}
        message={
          extensionCount === 0
            ? '콘텐츠 등록 기간을<br><span style="color: #FF2626;">3일 연장</span>하시겠습니까?'
            : "이미 연장한 내역이 있습니다.<br>추가 연장은 이번 요청이 마지막입니다.<br>계속하시겠습니까?"
        }
        buttons={extensionCount === 0 ? ["취소", "연장"] : ["취소", "확인"]}
        on_confirm={handleExtensionConfirm}
        type="center"
        button_variant="red"
      />

      {/* 연장 완료 모달 */}
      {/* 📌 연장 완료 모달:
          - 연장이 성공적으로 완료되었을 때 표시됩니다
          - "닫기" 버튼을 클릭하면 대기 탭으로 이동합니다
      */}
      <BaseModal
        is_open={extensionCompleteModal.isOpen}
        on_close={handleExtensionCompleteClose}
        message="등록 기간 연장이 완료되었습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 연장 제한 초과 모달 */}
      <BaseModal
        is_open={extensionLimitModal.isOpen}
        on_close={() => extensionLimitModal.close()}
        message="연장은 최대 두 번까지만 가능합니다."
        buttons={["닫기"]}
        type="center"
      />
    </div>
  );
}
