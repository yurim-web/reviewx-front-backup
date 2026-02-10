/* ========================================
   ✅ 구매평 1차 - 완료 탭 카드
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 구매평 > "완료" 탭 (구매 기간)
   
   🎯 완료 탭 카드 유형 - 1가지:
   
   1️⃣ 확인 완료
      - 상단: "구매 영수증 확인" 버튼 (검은색 배경)
      - 중간: 등록 날짜 (예: "2025-11-02 17:37 등록")
      - 하단: "확인 완료" 버튼 (분홍색 배경, 비활성화, 클릭 불가)
      - footer: "신고" 버튼만 (연장 버튼 없음)
   
   🎯 주요 기능:
     - 신고: 콘텐츠 신고 모달 (선정 후 취소, 무단 이탈, 노출 기간 불이행 등)
   
   📝 참고:
     - 구매 기간에 해당하는 구매평 1차 카드입니다
     - 검수가 완료되어 더 이상 승인/반려가 불가능한 상태입니다
     - 연장 버튼은 표시되지 않습니다
   ======================================== */

"use client";

import { useState, useEffect } from "react";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { formatDateForMobile } from "@/utils/formatting/date";
import type { CampaignApplicant } from "../../shared_card/CampaignTypes";
import ReportModal, {
  type ReportOption,
} from "@/components/common/modal/ReportModal";
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
  onCheckReceipt,
  onReport,
  registrationDate,
}: PurchaseFirstCompletedCardProps) {
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
            <span className={contentStyles.user_type}>
              {applicant.userType}
            </span>
            <span className={contentStyles.nickname}>{applicant.nickname}</span>
          </div>
        </div>

        {/* 상단 액션 버튼 - 구매 영수증 확인 / 이미지 확인 */}
        <button
          className={actionStyles.content_check_button}
          onClick={() => {
            // console.log("구매 영수증 확인 클릭", applicant.id);
            setIsReceiptModalOpen(true);
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
          <img
            src="/images/management_page/report_icon.svg"
            alt="신고 아이콘"
            className={actionStyles.report_icon}
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

      {/* 이미지 확인 모달 */}
      <ReceiptPreviewModal
        isOpen={isReceiptModalOpen}
        images={applicant.receiptImages || []}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
}
