/* ========================================
   구매평 1차 - 완료 탭 카드
   ======================================== */

/**
 * PurchaseFirstCompletedCard
 *
 * 목적: 구매평 1단계 캠페인의 완료 탭 콘텐츠 카드를 렌더링합니다.
 *
 * 사용 페이지:
 * - /partner/campaign/[id]/contents (구매평 > "완료" 탭 (구매 기간))
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useModalState } from "@/hooks/useModalState";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { formatDateForMobile } from "@/utils/formatting/date";
import type { CampaignApplicant } from "../../shared_card/campaignTypes";
import ReportModal, { type ReportOption } from "@/components/common/modal/ReportModal";
import ReceiptPreviewModal from "../../../ReceiptPreviewModal";

interface PurchaseFirstCompletedCardProps {
  applicant: CampaignApplicant;
  /** 구매 영수증 확인 버튼 클릭 */
  onCheckReceipt?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
  /** 등록 날짜 (예: "2025-11-02 17:37") */
  registrationDate?: string;
}

export default function PurchaseFirstCompletedCard({
  applicant,
  onCheckReceipt: _onCheckReceipt,
  onReport,
  registrationDate,
}: PurchaseFirstCompletedCardProps) {
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

        {/* 상단 액션 버튼 - 구매 영수증 확인 / 이미지 확인 */}
        <button
          className={actionStyles.content_check_button}
          onClick={() => {
            //            receiptModal.open();
          }}
        >
          구매영수증 확인
        </button>

        {/* 확인 완료 버튼 (비활성화, 분홍색 배경) */}
        <div className={actionStyles.action_button_section}>
          <button
            className={actionStyles.action_button}
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

        {/* 등록 날짜 */}
        <div className={actionStyles.registration_info}>
          <span>
            {registrationDate
              ? `${isMobile ? formatDateForMobile(registrationDate) : registrationDate} 등록`
              : `${isMobile ? formatDateForMobile(applicant.registrationDate) : applicant.registrationDate} 등록`}
          </span>
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
