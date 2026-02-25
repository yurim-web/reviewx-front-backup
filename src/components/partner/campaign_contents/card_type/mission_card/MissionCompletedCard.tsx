/* ========================================
   미션형 - 완료 탭 카드
   ======================================== */

/**
 * MissionCompletedCard
 *
 * 목적: 미션형 캠페인의 완료 탭 콘텐츠 카드를 렌더링합니다.
 *
 * 사용 페이지:
 * - /partner/campaign/[id]/contents (미션형 > "완료" 탭)
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
import type { CampaignApplicant } from "../shared_card/campaignTypes";
import ReportModal, { type ReportOption } from "@/components/common/modal/ReportModal";
import ReceiptPreviewModal from "../../ReceiptPreviewModal";

interface MissionCompletedCardProps {
  applicant: CampaignApplicant;
  /** 링크 확인 버튼 클릭 */
  onCheckLink?: (applicantId: string) => void;
  /** 이미지 확인 버튼 클릭 */
  onCheckImage?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
  /** 콘텐츠 타입 (링크만, 이미지만, 링크+이미지) */
  contentType: "link" | "image" | "both";
  /** 등록/수정 날짜 */
  registrationDate?: string;
  /** 등록/수정 라벨 */
  dateLabel?: string;
}

export default function MissionCompletedCard({
  applicant,
  onCheckLink: _onCheckLink,
  onCheckImage: _onCheckImage,
  onReport,
  contentType,
  registrationDate,
  dateLabel = "등록",
}: MissionCompletedCardProps) {
  const _channel_icon_src = getChannelLogo(applicant.channel);

  const reportModal = useModalState();
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  // 이미지 확인 모달 상태
  const receiptModal = useModalState();

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

        {/* 상단 액션 버튼 */}
        {/* contentType에 따라 다른 버튼 표시 */}
        {contentType === "both" ? (
          // 이미지+링크: 두 개의 버튼 세로 배치
          <div className={actionStyles.content_check_buttons_wrapper}>
            <button
              className={actionStyles.content_check_button}
              onClick={() => {
                // console.log("이미지 확인 클릭", applicant.id);
                receiptModal.open();
              }}
            >
              이미지 확인
            </button>
            <button
              className={actionStyles.content_check_button}
              onClick={() => {
                // console.log("링크 확인 클릭", applicant.id);
                const url = getChannelUrl(applicant.channel, applicant.channelId);
                if (url && url !== "#") {
                  window.open(url, "_blank", "noopener,noreferrer");
                }
              }}
            >
              링크 확인
            </button>
          </div>
        ) : contentType === "image" ? (
          // 이미지만: 이미지 확인 버튼 하나만
          <button
            className={actionStyles.content_check_button}
            onClick={() => {
              // console.log("이미지 확인 클릭", applicant.id);
              receiptModal.open();
            }}
          >
            이미지 확인
          </button>
        ) : (
          // 링크만: 링크 확인 버튼 하나만
          <button
            className={actionStyles.content_check_button}
            onClick={() => {
              // console.log("링크 확인 클릭", applicant.id);
              const url = getChannelUrl(applicant.channel, applicant.channelId);
              if (url && url !== "#") {
                window.open(url, "_blank", "noopener,noreferrer");
              }
            }}
          >
            링크 확인
          </button>
        )}

        {/* 확인 완료 버튼 (비활성화, 핑크 배경) */}
        <div className={actionStyles.action_button_section}>
          <button
            className={`${actionStyles.action_button} ${actionStyles.disabled_button}`}
            disabled
            style={{
              backgroundColor: "rgba(255, 86, 148, 0.1)",
              color: "#ff5694",
              border: "1px solid transparent",
              cursor: "auto",
            }}
          >
            확인 완료
          </button>
        </div>

        {/* 등록/수정 날짜 */}
        <div className={actionStyles.registration_info}>
          {dateLabel === "지각 등록" ? (
            <span className={actionStyles.late_label}>
              {isMobile
                ? formatDateForMobile(registrationDate || applicant.registrationDate)
                : registrationDate || applicant.registrationDate}{" "}
              <span className={actionStyles.late_text_full}>지각 등록</span>
              <span className={actionStyles.late_text_short}>지각</span>
            </span>
          ) : (
            <span>
              {registrationDate
                ? `${isMobile ? formatDateForMobile(registrationDate) : registrationDate} ${dateLabel}`
                : `${isMobile ? formatDateForMobile(applicant.registrationDate) : applicant.registrationDate} ${dateLabel}`}
            </span>
          )}
        </div>
      </article>

      {/* 신고 버튼 footer (연장 버튼 없음) */}
      <div className={actionStyles.extension_report_footer}>
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

      {/* 이미지 확인 모달 */}
      <ReceiptPreviewModal
        isOpen={receiptModal.isOpen}
        images={applicant.receiptImages || []}
        onClose={() => receiptModal.close()}
      />
    </div>
  );
}
