/* ========================================
   🔍 경험형 검수 카드 (확인 탭 전용)
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 배송형/방문형/기자단형 > "확인" 탭
   
   🎯 주요 기능:
     - 링크 확인 버튼
     - 승인/반려 버튼 (필수)
     - footer: 연장/신고 버튼
   
   📝 참고:
     - 이 카드는 "확인" 탭에서만 사용됩니다
     - "대기" 탭에는 ExperiencePendingCard를 사용하세요
   ======================================== */

"use client";

import { useState } from "react";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { ExperienceApplicant } from "./ExperienceTypes";
import TextareaModal from "@/components/common/modal/TextareaModal";
import ReportModal, {
  type ReportOption,
} from "@/components/common/modal/ReportModal";
import BaseModal from "@/components/common/modal/BaseModal";

interface ExperienceInspectionCardProps {
  /** 카드에 표시할 신청자 정보 */
  applicant: ExperienceApplicant;
  /** 링크 확인(콘텐츠 확인) 버튼 클릭 */
  onContentCheck: (applicantId: string) => void;
  /** 승인 클릭 (필수) */
  onApprove: (applicantId: string) => void;
  /** 반려 클릭 (필수) */
  onReject: (applicantId: string) => void;
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
 * 사용 위치:
 * - 캠페인 콘텐츠 내역 페이지 > "확인" 탭
 * - 배송형, 방문형, 기자단형 캠페인에서 사용
 *
 * 주요 기능:
 * - 링크 확인 버튼
 * - 승인/반려 버튼 (필수)
 * - 하단에 연장/신고 버튼이 항상 노출
 * - 클래스/아이디는 스네이크 케이스 사용
 */
export default function ExperienceInspectionCard({
  applicant,
  onContentCheck,
  onApprove,
  onReject,
  onExtend,
  onReport,
  extension_request_reason = "",
  dateLabel = "등록",
}: ExperienceInspectionCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isExtendResultModalOpen, setIsExtendResultModalOpen] = useState(false);
  const [extendResultMessage, setExtendResultMessage] = useState<string>("");

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
  const handleRejectConfirm = () => {
    if (onReject) {
      onReject(applicant.id);
    }
    handleRejectModalClose();
  };

  // 신고 모달 열기
  const handleReportClick = () => {
    setIsReportModalOpen(true);
    // 기본값 설정 (첫 번째 옵션)
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
    // 여기서 실제 신고 처리 로직을 구현할 수 있습니다
    console.log("신고 사유:", selectedOption, "기타 사유:", otherReason);
    handleReportModalClose();
  };

  // 연장 모달 열기
  const handleExtendClick = () => {
    setIsExtendModalOpen(true);
  };

  // 연장 모달 닫기
  const handleExtendModalClose = () => {
    setIsExtendModalOpen(false);
  };

  // 연장 거절 처리
  const handleExtendReject = () => {
    setIsExtendModalOpen(false);
    setExtendResultMessage("등록 기간 연장이 거절되었습니다.");
    setIsExtendResultModalOpen(true);
  };

  // 연장 승인 처리
  const handleExtendApprove = () => {
    if (onExtend) {
      onExtend(applicant.id);
    }
    setIsExtendModalOpen(false);
    setExtendResultMessage("등록 기간 연장이 완료되었습니다.");
    setIsExtendResultModalOpen(true);
  };

  // 연장 결과 모달 닫기
  const handleExtendResultModalClose = () => {
    setIsExtendResultModalOpen(false);
    setExtendResultMessage("");
  };

  return (
    <div className={styles.card_wrapper}>
      {/* 카드 본문 */}
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

        {/* 채널 정보 */}
        <div className={styles.channel_section}>
          <img
            src={channel_icon_src}
            alt={`${applicant.channel} 채널`}
            className={styles.channel_icon}
          />
          <span className={styles.applicant_id}>{applicant.channelId}</span>
        </div>

        {/* 링크 확인 */}
        <button
          className={styles.content_check_button}
          onClick={() => onContentCheck(applicant.id)}
          aria-label={`${applicant.nickname} 콘텐츠 확인하기`}
        >
          링크 확인
        </button>

        {/* 등록/수정/지각 등록 일시 */}
        <div className={styles.registration_info}>
          <span
            className={
              dateLabel === "지각 등록" ? styles.late_label : undefined
            }
          >
            {/* dateLabel에 따라 올바른 날짜 표시 */}
            {/* "등록"인 경우: registrationDate 사용 */}
            {/* "수정" 또는 "지각 등록"인 경우: updatedAt 사용 */}
            {dateLabel === "등록"
              ? `${applicant.registrationDate} ${dateLabel}`
              : applicant.updatedAt
              ? `${applicant.updatedAt} ${dateLabel}`
              : `${applicant.registrationDate} ${dateLabel}`}
          </span>
        </div>

        {/* 승인/반려 버튼 */}
        <div className={styles.action_button_section}>
          <div className={styles.approval_buttons}>
            <button
              className={`${styles.action_button} ${styles.approve_button}`}
              onClick={() => onApprove(applicant.id)}
              aria-label={`${applicant.nickname} 승인`}
            >
              승인
            </button>
            <button
              className={`${styles.action_button} ${styles.reject_button}`}
              onClick={handleRejectClick}
              aria-label={`${applicant.nickname} 반려`}
            >
              반려
            </button>
          </div>
        </div>
      </article>

      {/* 연장/신고 버튼 footer */}
      <div className={styles.extension_report_footer}>
        <button
          className={styles.extension_button}
          onClick={handleExtendClick}
          aria-label={`${applicant.nickname} 연장`}
        >
          <img
            src="/images/management_page/clock_icon.svg"
            alt="연장 아이콘"
            className={styles.extension_icon}
          />
          <span>연장</span>
        </button>
        <div className={styles.vertical_divider}></div>
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

      {/* 등록 기한 연장 요청 사유 모달 */}
      <TextareaModal
        is_open={isExtendModalOpen}
        on_close={handleExtendModalClose}
        title="등록 기한 연장 요청 사유"
        value={extension_request_reason}
        readOnly={true}
        buttons={["거절", "승인"]}
        on_cancel={handleExtendReject}
        on_confirm={handleExtendApprove}
        type="center"
        variant="extend"
      />

      {/* 연장 결과 모달 (승인/거절 후 표시) */}
      <BaseModal
        is_open={isExtendResultModalOpen}
        on_close={handleExtendResultModalClose}
        message={extendResultMessage}
        buttons={["닫기"]}
        type="center"
      />
    </div>
  );
}
