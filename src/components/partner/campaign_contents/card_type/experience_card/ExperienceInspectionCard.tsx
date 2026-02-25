/* ========================================
   경험형 검수 카드 (확인 탭 전용)
   ======================================== */

/**
 * ExperienceInspectionCard
 *
 * 목적: 배송형/방문형/기자단형 캠페인의 검수 탭 콘텐츠 카드를 렌더링합니다.
 *
 * 사용 페이지:
 * - /partner/campaign/[id]/contents (배송형/방문형/기자단형 > "확인" 탭)
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
import TextareaModal from "@/components/common/modal/TextareaModal";
import ReportModal, { type ReportOption } from "@/components/common/modal/ReportModal";
import BaseModal from "@/components/common/modal/BaseModal";
import ReceiptPreviewModal from "../../ReceiptPreviewModal";

interface ExperienceInspectionCardProps {
  /** 카드에 표시할 신청자 정보 */
  applicant: ExperienceApplicant;
  /** 링크 확인(콘텐츠 확인) 버튼 클릭 */
  onContentCheck: (applicantId: string) => void;
  /** 승인 클릭 (필수) */
  onApprove: (applicantId: string) => void;
  /** 반려 클릭 (필수) - 반려 사유와 함께 호출됨 */
  onReject: (applicantId: string, rejectReason: string) => void;
  /** 연장 버튼 클릭 */
  onExtend?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
  /** 등록 기한 연장 요청 사유 (데이터에서 불러옴) */
  extension_request_reason?: string;
  /** 등록/수정/지각 등록 라벨 */
  dateLabel?: string;
}

/**
 * 경험형 검수 카드 (확인 탭 전용)
 *
 * 사용 페이지:
 * - 캠페인 콘텐츠 내역 페이지 > "확인" 탭
 * - 배송형, 방문형, 기자단형 캠페인에서 사용
 *
 * 경우의 수 (3가지):
 * 1. 최초 등록: dateLabel="등록" → "2025-11-02 17:37 등록" (회색 텍스트)
 * 2. 수정: dateLabel="수정" → "2025-11-02 02:21 수정" (회색 텍스트)
 * 3. 지각 등록: dateLabel="지각 등록" → "2025-11-02 17:37 지각 등록" (빨간색 텍스트)
 *
 * @param dateLabel - "등록", "수정", "지각 등록" 중 하나
 */
export default function ExperienceInspectionCard({
  applicant,
  onContentCheck: _onContentCheck,
  onApprove,
  onReject,
  onExtend,
  onReport,
  extension_request_reason: _extension_request_reason = "",
  dateLabel = "등록",
}: ExperienceInspectionCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
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
  // 📌 반려 사유를 입력하고 "반려" 버튼을 클릭하면:
  // 1. onReject 콜백에 반려 사유와 함께 호출
  // 2. 부모 컴포넌트에서 반려 사유를 저장하고 대기 탭으로 이동
  // 3. 대기 탭에서 ExperiencePendingCard의 4번째 경우로 표시
  const handleRejectConfirm = () => {
    if (onReject && rejectReason.trim()) {
      onReject(applicant.id, rejectReason);
    }
    handleRejectModalClose();
  };

  // 신고 모달 열기
  const handleReportClick = () => {
    reportModal.open();
    // 기본값 설정 (첫 번째 옵션)
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

        {/* 승인/반려 버튼 */}
        <div className={actionStyles.action_button_section}>
          <div className={actionStyles.approval_buttons}>
            <button
              className={`${actionStyles.action_button} ${actionStyles.approve_button}`}
              onClick={() => onApprove(applicant.id)}
              aria-label={`${applicant.nickname} 승인`}
            >
              승인
            </button>
            <button
              className={`${actionStyles.action_button} ${actionStyles.reject_button}`}
              onClick={handleRejectClick}
              aria-label={`${applicant.nickname} 반려`}
            >
              반려
            </button>
          </div>
        </div>

        {/* 등록/수정/지각 등록 일시 */}
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
              {dateLabel === "등록"
                ? `${isMobile ? formatDateForMobile(applicant.registrationDate) : applicant.registrationDate} ${dateLabel}`
                : applicant.updatedAt
                  ? `${isMobile ? formatDateForMobile(applicant.updatedAt) : applicant.updatedAt} ${dateLabel}`
                  : `${isMobile ? formatDateForMobile(applicant.registrationDate) : applicant.registrationDate} ${dateLabel}`}
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

      {/* 연장 확인 모달 (푸터 연장 버튼용) */}
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

      {/* 연장 완료 모달 (푸터 연장 버튼용) */}
      {/* 📌 연장 확인 후 표시되는 완료 메시지 모달 */}
      <BaseModal
        is_open={extensionCompleteModal.isOpen}
        on_close={() => extensionCompleteModal.close()}
        message="등록 기간 연장이 완료되었습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 연장 제한 초과 모달 (푸터 연장 버튼용) */}
      {/* 📌 연장 횟수가 2회 이상일 때 표시되는 제한 모달 */}
      <BaseModal
        is_open={extensionLimitModal.isOpen}
        on_close={() => extensionLimitModal.close()}
        message="연장은 최대 두 번까지만 가능합니다."
        buttons={["닫기"]}
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
