/* ========================================
   ✅ 구매평 2차 - 완료 탭 카드
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 구매평 > "완료" 탭 (등록 기간)
   
   🎯 완료 탭 카드 유형 - 1가지:
   
   1️⃣ 확인 완료
      - 상단: "리뷰 확인" 버튼 (검은색 배경, 클릭 시 리뷰 이미지 모달 표시)
      - 중간: 등록/수정 날짜 (예: "2025-11-05 22:01 수정")
      - 하단: "확인 완료" 버튼 (분홍색 배경, 비활성화, 클릭 불가)
      - footer: "신고" 버튼만 (연장 버튼 없음)
   
   🎯 주요 기능:
     - 신고: 콘텐츠 신고 모달 (선정 후 취소, 무단 이탈, 노출 기간 불이행 등)
     - 리뷰 확인: "리뷰 확인" 버튼 클릭 시 리뷰 이미지 모달 표시
   
   📝 참고:
     - 등록 기간에 해당하는 구매평 2차 카드입니다
     - 검수가 완료되어 더 이상 승인/반려가 불가능한 상태입니다
     - 연장 버튼은 표시되지 않습니다
     - 리뷰 확인 버튼 클릭 시 리뷰 이미지가 모달로 표시됩니다
   ======================================== */

"use client";

import { useState } from "react";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { CampaignApplicant } from "../../shared_card/CampaignTypes";
import ReportModal, {
  type ReportOption,
} from "@/components/common/modal/ReportModal";
import ReceiptPreviewModal from "@/components/partner/campaign_contents/ReceiptPreviewModal";

interface PurchaseSecondCompletedCardProps {
  applicant: CampaignApplicant;
  /** 리뷰 확인 버튼 클릭 */
  onCheckReview?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
  /** 등록/수정 날짜 (예: "2025-11-05 22:01") */
  registrationDate?: string;
  /** 리뷰 이미지 목록 (리뷰 확인 모달용) */
  reviewImages?: string[];
}

export default function PurchaseSecondCompletedCard({
  applicant,
  onCheckReview,
  onReport,
  registrationDate,
  reviewImages = [],
}: PurchaseSecondCompletedCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  // 리뷰 이미지 모달 상태
  const [isReviewImageModalOpen, setIsReviewImageModalOpen] = useState(false);

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

  // 리뷰 확인 버튼 클릭 핸들러
  const handleReviewCheckClick = () => {
    if (reviewImages && reviewImages.length > 0) {
      setIsReviewImageModalOpen(true);
    } else if (onCheckReview) {
      onCheckReview(applicant.id);
    }
  };

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

        {/* 상단 액션 버튼 - 리뷰 확인 */}
        <button
          className={styles.content_check_button}
          onClick={handleReviewCheckClick}
        >
          리뷰 확인
        </button>

        {/* 등록/수정 날짜 */}
        <div className={styles.registration_info}>
          <span>
            {registrationDate
              ? registrationDate.includes("등록") || registrationDate.includes("수정")
                ? registrationDate
                : `${registrationDate} 등록`
              : `${applicant.registrationDate} 등록`}
          </span>
        </div>

        {/* 확인 완료 버튼 (비활성화, 분홍색 배경) */}
        <div className={styles.action_button_section}>
          <button
            className={styles.action_button}
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
      </article>

      {/* 신고 버튼 footer (연장 버튼 없음) */}
      <div className={styles.extension_report_footer}>
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

      {/* 리뷰 이미지 모달 */}
      <ReceiptPreviewModal
        isOpen={isReviewImageModalOpen}
        images={reviewImages}
        onClose={() => setIsReviewImageModalOpen(false)}
      />
    </div>
  );
}

