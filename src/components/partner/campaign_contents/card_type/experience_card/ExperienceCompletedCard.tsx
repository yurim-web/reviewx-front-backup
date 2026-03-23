/* ========================================
   경험형 완료 카드 (완료 탭)
   ======================================== */

/**
 * ExperienceCompletedCard
 *
 * 목적: 배송형/방문형/기자단형 캠페인의 완료 탭 콘텐츠 카드를 렌더링합니다.
 *
 * 사용 페이지:
 * - /partner/campaign/[id]/contents (배송형/방문형/기자단형 > "완료" 탭)
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
import type { ExperienceApplicant } from "./experienceTypes";
import ReportModal, { type ReportOption } from "@/components/common/modal/ReportModal";
import ReceiptPreviewModal from "../../ReceiptPreviewModal";

interface ExperienceCompletedCardProps {
  /** 카드에 표시할 신청자 정보 */
  applicant: ExperienceApplicant;
  /** 링크 확인(콘텐츠 확인) 버튼 클릭 */
  onContentCheck: (applicantId: string) => void;
  /** 등록/수정 라벨 */
  dateLabel?: string;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
  /** 확인 완료 버튼 클릭 (API 22-5) */
  onComplete?: (applicantId: string) => void;
}

/**
 * 경험형 완료 카드
 *
 * 완료 탭에서 사용되는 카드로, 한 가지 경우의 수만 있습니다:
 * - "확인 완료" 버튼 + footer에 "신고" 버튼
 *
 * 사용 페이지:
 * - 캠페인 콘텐츠 내역 페이지 > "완료" 탭
 * - 배송형, 방문형, 기자단형 캠페인에서 사용
 *
 * @param applicant - 신청자 정보
 * @param onContentCheck - 링크 확인 버튼 클릭 핸들러
 * @param dateLabel - 등록/수정 라벨
 * @param onReport - 신고 버튼 클릭 핸들러
 */
export default function ExperienceCompletedCard({
  applicant,
  onContentCheck: _onContentCheck,
  dateLabel = "등록",
  onReport,
  onComplete,
}: ExperienceCompletedCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
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
    //    handleReportModalClose();
  };

  // footer는 항상 필요 (신고 버튼 노출)
  const hasFooter = true;

  return (
    <div className={baseStyles.card_wrapper}>
      {/* 카드 본문 */}
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
        {/* 📌 클릭 가능한 링크:
            - channelId를 클릭하면 해당 채널로 이동합니다
            - getChannelUrl 유틸리티 함수를 사용하여 올바른 URL을 생성합니다
            - 새 창에서 링크를 엽니다 (target="_blank")
        */}
        <div className={contentStyles.channel_section}>
          <Image
            src={channel_icon_src}
            alt={`${applicant.channel} 채널`}
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
              // 📌 링크 클릭 핸들러:
              // - URL이 유효하지 않은 경우 클릭 방지
              // - getChannelUrl이 "#"을 반환하면 기본 동작을 막습니다
              const url = getChannelUrl(applicant.channel, applicant.channelId);
              if (url === "#") {
                e.preventDefault();
              }
            }}
          >
            {applicant.channelId}
          </a>
        </div>

        {/* 링크 확인 / 이미지 확인 버튼 */}
        {applicant.receiptImages && applicant.receiptImages.length > 0 ? (
          <button
            className={actionStyles.content_check_button}
            onClick={() => receiptModal.open()}
            aria-label={`${applicant.nickname} 이미지 확인하기`}
          >
            이미지 확인
          </button>
        ) : (
          <button
            className={actionStyles.content_check_button}
            onClick={() => {
              const url = getChannelUrl(applicant.channel, applicant.channelId);
              if (url && url !== "#") {
                window.open(url, "_blank", "noopener,noreferrer");
              }
            }}
            aria-label={`${applicant.nickname} 콘텐츠 확인하기`}
          >
            링크 확인
          </button>
        )}

        {/* 버튼 영역: 항상 "확인 완료" 버튼 */}
        {/* 📌 확인 완료 버튼 스타일:
            - 완료 탭에서는 연한 핑크 배경과 핑크 텍스트로 표시됩니다
            - 배경: #ff56941a
            - 텍스트: #ff5694 (핑크)
        */}
        <div className={actionStyles.action_button_section}>
          <button
            className={`completion_confirmed_btn ${actionStyles.action_button} ${actionStyles.completion_confirmed_button}`}
            onClick={() => onComplete?.(applicant.id)}
          >
            확인 완료
          </button>
        </div>

        {/* 등록/수정 일시 */}
        <div className={actionStyles.registration_info}>
          {dateLabel === "지각 등록" ? (
            <span className={actionStyles.late_label}>
              {isMobile
                ? formatDateForMobile(applicant.updatedAt || applicant.registrationDate)
                : applicant.updatedAt || applicant.registrationDate}{" "}
              <span className={actionStyles.late_text_full}>지각 등록</span>
              <span className={actionStyles.late_text_short}>지각</span>
            </span>
          ) : (
            <span>
              {applicant.updatedAt
                ? `${isMobile ? formatDateForMobile(applicant.updatedAt) : applicant.updatedAt} ${dateLabel}`
                : `${isMobile ? formatDateForMobile(applicant.registrationDate) : applicant.registrationDate} ${dateLabel}`}
            </span>
          )}
        </div>
      </article>

      {/* Footer: 완료 탭에서는 항상 "신고" 버튼만 노출 */}
      {hasFooter && (
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

      {/* 이미지 확인 모달 */}
      <ReceiptPreviewModal
        isOpen={receiptModal.isOpen}
        images={applicant.receiptImages || []}
        onClose={() => receiptModal.close()}
      />

      {/* 완료 탭에서는 연장/반려 관련 모달을 사용하지 않습니다 */}
    </div>
  );
}
