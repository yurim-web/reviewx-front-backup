/* ========================================
   🧾 구매평 1차 - 확인 탭 카드
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 구매평 > "확인" 탭 (구매 기간)
   
   🎯 확인 탭 카드 유형 - 3가지:
   
   1️⃣ 구매영수증 최초 등록 (dateLabel: "등록")
      - 상단: "구매 영수증 확인" 버튼 (검은색 배경)
      - 중간: 등록 날짜 (예: "2025-11-02 17:37 등록")
      - 하단: "승인", "반려" 버튼 (두 개)
      - footer: "연장", "신고" 버튼
   
   2️⃣ 수정 (dateLabel: "수정")
      - 상단: "구매 영수증 확인" 버튼 (검은색 배경)
      - 중간: 수정 날짜 (예: "2025-11-02 17:37 수정")
      - 하단: "승인", "반려" 버튼 (두 개)
      - footer: "연장", "신고" 버튼
   
   3️⃣ 지각 등록 (dateLabel: "지각 등록")
      - 상단: "구매 영수증 확인" 버튼 (검은색 배경)
      - 중간: 지각 등록 날짜 (예: "2025-11-02 17:37 지각 등록", 빨간색 텍스트)
      - 하단: "승인", "반려" 버튼 (두 개)
      - footer: "연장", "신고" 버튼
   
   🎯 주요 기능:
     - 승인/반려: 구매 영수증 검수 후 승인 또는 반려 처리
     - 연장: 등록 기한을 3일 연장 (최대 2회까지 가능)
     - 신고: 콘텐츠 신고 모달 (선정 후 취소, 무단 이탈 등)
     - 반려: 반려 사유 입력 모달 표시
   
   📝 참고:
     - 구매 기간에 해당하는 구매평 1차 카드입니다
     - dateLabel prop으로 등록/수정/지각 등록 구분
     - 지각 등록일 때 날짜 텍스트가 빨간색으로 표시됩니다
   ======================================== */

"use client";

import { useState, useEffect } from "react";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { formatDateForMobile } from "@/utils/formatting/date";
import type { CampaignApplicant } from "../../shared_card/CampaignTypes";
import TextareaModal from "@/components/common/modal/TextareaModal";
import ReportModal, {
  type ReportOption,
} from "@/components/common/modal/ReportModal";
import BaseModal from "@/components/common/modal/BaseModal";
import ReceiptPreviewModal from "../../../ReceiptPreviewModal";

interface PurchaseFirstInspectionCardProps {
  applicant: CampaignApplicant;
  /** 구매 영수증 확인 버튼 클릭 */
  onCheckReceipt?: (applicantId: string) => void;
  /** 승인 버튼 클릭 */
  onApprove: (applicantId: string) => void;
  /** 반려 버튼 클릭 (반려 사유 포함) */
  onReject: (applicantId: string, rejectReason?: string) => void;
  /** 연장 버튼 클릭 (연장 완료 후 대기 탭으로 이동) */
  onExtend?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
  /** 날짜 라벨 ("등록", "수정", "지각 등록") */
  dateLabel?: "등록" | "수정" | "지각 등록";
  /** 등록/수정 날짜 (예: "2025-11-02 17:37") */
  registrationDate?: string;
}

export default function PurchaseFirstInspectionCard({
  applicant,
  onCheckReceipt,
  onApprove,
  onReject,
  onExtend,
  onReport,
  dateLabel = "등록",
  registrationDate,
}: PurchaseFirstInspectionCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  // 연장 관련 상태
  const [extensionCount, setExtensionCount] = useState(0);
  const [isExtensionConfirmModalOpen, setIsExtensionConfirmModalOpen] =
    useState(false);
  const [isExtensionCompleteModalOpen, setIsExtensionCompleteModalOpen] =
    useState(false);
  const [isExtensionLimitModalOpen, setIsExtensionLimitModalOpen] =
    useState(false);
  // 이미지 확인 모달 상태
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
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
    setIsRejectModalOpen(true);
  };

  // 반려 모달 닫기
  const handleRejectModalClose = () => {
    setIsRejectModalOpen(false);
    setRejectReason("");
  };

  // 반려 확인 처리
  // 📌 반려 사유를 입력하고 "반려" 버튼을 클릭하면:
  // 1. onReject 콜백에 반려 사유와 함께 호출
  // 2. 부모 컴포넌트에서 반려 사유를 저장하고 대기 탭으로 이동
  // 3. 대기 탭에서 PurchaseFirstPendingCard의 "구매 영수증 반려 처리" 상태로 표시
  const handleRejectConfirm = () => {
    if (rejectReason.trim()) {
      onReject(applicant.id, rejectReason);
    } else {
      // 반려 사유가 없어도 반려 처리 (선택적)
      onReject(applicant.id);
    }
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
    // console.log("신고 사유:", selectedOption, "기타 사유:", otherReason);
    handleReportModalClose();
  };

  // 연장 버튼 클릭 핸들러
  const handleExtendClick = () => {
    if (extensionCount >= 2) {
      setIsExtensionLimitModalOpen(true);
      return;
    }
    setIsExtensionConfirmModalOpen(true);
  };

  // 연장 확인 모달에서 연장 버튼 클릭
  const handleExtensionConfirm = () => {
    setExtensionCount((prev) => prev + 1);
    setIsExtensionConfirmModalOpen(false);
    setIsExtensionCompleteModalOpen(true);
  };

  // 연장 완료 모달 닫기 핸들러
  const handleExtensionCompleteClose = () => {
    setIsExtensionCompleteModalOpen(false);
    if (onExtend) {
      onExtend(applicant.id);
    }
  };

  // 지각 등록 상태인지 확인
  const isLate = dateLabel === "지각 등록";

  return (
    <div className={baseStyles.card_wrapper}>
      <article
        className={baseStyles.applicant_card}
      >
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

        {/* 등록/수정/지각 등록 날짜 */}
        <div className={actionStyles.registration_info}>
          {isLate ? (
            <span className={actionStyles.late_label}>
              {isMobile
                ? formatDateForMobile(registrationDate || applicant.registrationDate)
                : (registrationDate || applicant.registrationDate)}{" "}
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

        {/* 승인/반려 버튼 */}
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

      {/* 연장 확인 모달 */}
      {/* 📌 연장 버튼 클릭 시 표시되는 모달:
          - 연장 횟수에 따라 다른 메시지 표시
          - 첫 연장: "콘텐츠 등록 기간을 3일 연장하시겠습니까?"
          - 두 번째 연장 (중복 연장): "이미 연장한 내역이 있습니다. 추가 연장은 이번 요청이 마지막입니다. 계속하시겠습니까?"
      */}
      <BaseModal
        is_open={isExtensionConfirmModalOpen}
        on_close={() => setIsExtensionConfirmModalOpen(false)}
        message={
          extensionCount === 0
            ? '콘텐츠 등록 기간을<br><span style="color: #FF2626;">3일 연장</span>하시겠습니까?'
            : "이미 연장한 내역이 있습니다.<br>추가 연장은 이번 요청이 마지막입니다.<br>계속하시겠습니까?"
        }
        buttons={extensionCount === 0 ? ["취소", "연장"] : ["취소", "확인"]}
        on_confirm={handleExtensionConfirm}
        type="center"
      />

      {/* 연장 완료 모달 */}
      <BaseModal
        is_open={isExtensionCompleteModalOpen}
        on_close={handleExtensionCompleteClose}
        message="등록 기간 연장이 완료되었습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 연장 제한 초과 모달 */}
      <BaseModal
        is_open={isExtensionLimitModalOpen}
        on_close={() => setIsExtensionLimitModalOpen(false)}
        message="연장은 최대 두 번까지만 가능합니다."
        buttons={["닫기"]}
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
