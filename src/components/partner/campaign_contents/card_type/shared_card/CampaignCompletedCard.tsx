/* ========================================
   구매평/미션형 공통 - 완료 카드
   ======================================== */

/**
 * CampaignCompletedCard
 *
 * 목적: 구매평/미션형 공통 캠페인의 완료 탭 콘텐츠 카드를 렌더링합니다.
 *
 * 사용 페이지:
 * - /partner/campaign/[id]/contents (구매평/미션형 > "완료" 탭)
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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

interface CampaignCompletedCardProps {
  applicant: CampaignApplicant;
  /** 리뷰 확인 버튼 클릭 (구매평) */
  onCheckReview?: (applicantId: string) => void;
  /** 구매 영수증 확인 버튼 클릭 (구매평) */
  onCheckReceipt?: (applicantId: string) => void;
  /** 이미지 확인 버튼 클릭 (구매평/미션형, contentType이 "both"일 때 사용) */
  onCheckImage?: (applicantId: string) => void;
  /** 링크 확인 버튼 클릭 (구매평/미션형, contentType이 "both"일 때 사용) */
  onCheckLink?: (applicantId: string) => void;
  /** 콘텐츠 타입 (구매평만, 링크만, 이미지만, 링크+이미지) */
  contentType?: "link" | "image" | "both";
  /** 승인 버튼 클릭 (지각 등록일 때만) */
  onApprove?: (applicantId: string) => void;
  /** 반려 버튼 클릭 (지각 등록일 때만) */
  onReject?: (applicantId: string) => void;
  /** 연장 버튼 클릭 (지각 등록일 때만) */
  onExtend?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
  /** 등록 기한 연장 요청 사유 (데이터에서 불러옴) */
  extension_request_reason?: string;
  dateLabel?: string;
}

export default function CampaignCompletedCard({
  applicant,
  onCheckReview,
  onCheckReceipt,
  onCheckImage,
  onCheckLink,
  contentType = "link",
  onApprove,
  onReject,
  onExtend,
  onReport,
  extension_request_reason: _extension_request_reason = "",
  dateLabel = "수정",
}: CampaignCompletedCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
  const isReview = applicant.campaignType === "review";

  // contentType이 "both"인 경우 두 개의 버튼 표시 (구매평만)
  const isBothContentType = contentType === "both" && isReview;

  // 지각 등록 상태인지 확인
  const isLate = dateLabel === "지각 등록";

  const reportModal = useModalState();
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  const rejectModal = useModalState();
  const [rejectReason, setRejectReason] = useState("");
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
  const handleReportConfirm = (_selectedOption: string, _otherReason?: string) => {
    if (onReport) {
      onReport(applicant.id);
    }
    handleReportModalClose();
  };

  // 반려 모달 열기 (지각 등록일 때만)
  const handleRejectClick = () => {
    rejectModal.open();
  };

  // 반려 모달 닫기
  const handleRejectModalClose = () => {
    rejectModal.close();
    setRejectReason("");
  };

  // 반려 확인 처리 (지각 등록일 때만)
  const handleRejectConfirm = () => {
    if (onReject) {
      onReject(applicant.id);
    }
    // console.log("반려 사유:", rejectReason);
    handleRejectModalClose();
  };

  // 연장 버튼 클릭 핸들러
  const handleExtendClick = () => {
    // 연장 횟수가 2회 이상이면 제한 모달 표시
    if (extensionCount >= 2) {
      extensionLimitModal.open();
      return;
    }
    // 연장 확인 모달 표시
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

  // 구매평 버튼 생성 함수
  const getReviewButton = () => {
    if (!isReview || !applicant.reviewType) return null;

    // contentType이 "image"인 경우 "이미지 확인" 버튼 하나만 표시
    if (contentType === "image") {
      return {
        label: "이미지 확인",
        onClick: () => {
          if (onCheckImage) {
            onCheckImage(applicant.id);
          } else {
            onCheckReview?.(applicant.id);
          }
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
            onCheckLink?.(applicant.id);
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
            onCheckLink?.(applicant.id);
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
            <Image
              src={applicant.profileImage || "/images/mypage/profile.svg"}
              alt="프로필"
              className={contentStyles.profile_image}
              width={40}
              height={40}
            />
          </div>
          <div className={contentStyles.profile_info}>
            <span className={contentStyles.user_type}>{applicant.userType}</span>
            <span className={contentStyles.nickname}>{applicant.nickname}</span>
          </div>
        </div>

        {/* 채널 정보 */}
        <div className={contentStyles.channel_section}>
          <Image
            src={channel_icon_src}
            alt={applicant.channel}
            className={contentStyles.channel_icon}
            width={20}
            height={20}
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
        {/* 구매평: contentType이 "both"인 경우 이미지 확인 + 링크 확인 버튼 두 개 세로 배치 */}
        {isReview && isBothContentType ? (
          <div className={actionStyles.content_check_buttons_wrapper}>
            <button
              className={actionStyles.content_check_button}
              onClick={() => {
                // console.log("이미지 확인 클릭", applicant.id);
                onCheckImage?.(applicant.id);
              }}
            >
              이미지 확인
            </button>
            <button
              className={actionStyles.content_check_button}
              onClick={() => {
                if (onCheckLink) {
                  onCheckLink(applicant.id);
                } else {
                  onCheckReview?.(applicant.id);
                }
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

        {/* 완료 표시 또는 승인/반려 버튼 */}
        <div className={actionStyles.action_button_section}>
          {isLate ? (
            // 지각 등록일 때: 승인/반려 버튼
            <div className={actionStyles.approval_buttons}>
              <button
                className={`${actionStyles.action_button} ${actionStyles.approve_button}`}
                onClick={() => {
                  // console.log("승인 클릭", applicant.id);
                  onApprove?.(applicant.id);
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
          ) : (
            // 일반 완료일 때: 확인 완료 버튼 (비활성화)
            <button
              className={`${actionStyles.action_button} ${actionStyles.disabled_button}`}
              disabled
            >
              확인 완료
            </button>
          )}
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
      {/* 일반 완료: 신고 버튼만, 지각 등록: 연장/신고 버튼 둘 다 */}
      <div className={actionStyles.extension_report_footer}>
        {isLate && (
          <>
            <button
              className={actionStyles.extension_button}
              onClick={handleExtendClick}
              aria-label={`${applicant.nickname} 연장`}
            >
              <Image
                src="/images/management_page/clock_icon.svg"
                alt="연장 아이콘"
                className={actionStyles.extension_icon}
                width={16}
                height={16}
              />
              <span>연장</span>
            </button>
            <div className={actionStyles.vertical_divider}></div>
          </>
        )}
        <button
          className={actionStyles.report_button}
          onClick={handleReportClick}
          aria-label={`${applicant.nickname} 신고`}
        >
          <Image
            src="/images/management_page/report_icon.svg"
            alt="신고 아이콘"
            className={actionStyles.report_icon}
            width={16}
            height={16}
          />
          <span>신고</span>
        </button>
      </div>

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
      {/* 연장 확인 모달 (지각 등록인 경우) */}
      {isLate && (
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
      )}

      {/* 연장 완료 모달 (지각 등록인 경우) */}
      {isLate && (
        <BaseModal
          is_open={extensionCompleteModal.isOpen}
          on_close={() => extensionCompleteModal.close()}
          message="등록 기간 연장이 완료되었습니다."
          buttons={["닫기"]}
          type="center"
        />
      )}

      {/* 연장 제한 초과 모달 (지각 등록인 경우) */}
      {isLate && (
        <BaseModal
          is_open={extensionLimitModal.isOpen}
          on_close={() => extensionLimitModal.close()}
          message="연장은 최대 두 번까지만 가능합니다."
          buttons={["닫기"]}
          type="center"
        />
      )}

      {/* 반려 사유 입력 모달 (지각 등록일 때만) */}
      {isLate && (
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
      )}
    </div>
  );
}
