/* ========================================
   ✅ 경험형 완료 카드 (완료 탭)
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 배송형/방문형/기자단형 > "완료" 탭
   
   🎯 주요 기능:
     - "확인 완료" 버튼 (비활성화 상태)
     - footer에 "신고" 버튼만 노출
   
   📝 참고:
     - 완료 탭에서는 한 가지 경우의 수만 있습니다
     - 모든 완료된 콘텐츠는 동일한 형태로 표시됩니다
   ======================================== */

"use client";

import { useState, useEffect } from "react";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/helpers/url";
import { formatDateForMobile } from "@/utils/formatting/date";
import type { ExperienceApplicant } from "./ExperienceTypes";
import ReportModal, {
  type ReportOption,
} from "@/components/common/modal/ReportModal";
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
}

/**
 * 경험형 완료 카드
 *
 * 완료 탭에서 사용되는 카드로, 한 가지 경우의 수만 있습니다:
 * - "확인 완료" 버튼 (비활성화) + footer에 "신고" 버튼
 *
 * 사용 위치:
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
  onContentCheck,
  dateLabel = "등록",
  onReport,
}: ExperienceCompletedCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  // 이미지 확인 모달 상태
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

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

  // footer는 항상 필요 (신고 버튼 노출)
  const hasFooter = true;

  return (
    <div className={baseStyles.card_wrapper}>
      {/* 카드 본문 */}
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
            <span className={contentStyles.user_type}>
              {applicant.userType}
            </span>
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
          <img
            src={channel_icon_src}
            alt={`${applicant.channel} 채널`}
            className={contentStyles.channel_icon}
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
            onClick={() => setIsReceiptModalOpen(true)}
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
            - 완료 탭에서는 핑크색 배경과 핑크색 텍스트로 표시됩니다
            - 배경: rgba(255, 86, 148, 0.1) (연한 핑크)
            - 텍스트: #ff5694 (핑크색)
        */}
        <div className={actionStyles.action_button_section}>
          <button
            className={`${actionStyles.action_button} ${actionStyles.completion_confirmed_button}`}
            disabled
          >
            확인 완료
          </button>
        </div>

        {/* 등록/수정 일시 */}
        <div className={actionStyles.registration_info}>
          {dateLabel === "지각 등록" ? (
            <span className={actionStyles.late_label}>
              {isMobile
                ? formatDateForMobile(
                    applicant.updatedAt || applicant.registrationDate,
                  )
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

      {/* 이미지 확인 모달 */}
      <ReceiptPreviewModal
        isOpen={isReceiptModalOpen}
        images={applicant.receiptImages || []}
        onClose={() => setIsReceiptModalOpen(false)}
      />

      {/* 완료 탭에서는 연장/반려 관련 모달을 사용하지 않습니다 */}
    </div>
  );
}
