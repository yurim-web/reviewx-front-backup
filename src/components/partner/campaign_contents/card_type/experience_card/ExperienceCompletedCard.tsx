/* ========================================
   ✅ 경험형 완료 카드 (완료탭)
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 배송형/방문형/기자단형 > "완료" 탭
   
   🎯 주요 기능:
     - 일반 완료: "확인 완료" 버튼 + footer에 "신고" 버튼만
     - 지각 제출: "승인", "반려" 버튼 + footer에 "연장", "신고" 버튼
   
   📝 참고:
     - 완료 탭에는 2가지 경우의 수가 있습니다
     - 지각 제출인 경우 "승인", "반려" 버튼이 표시됩니다
   ======================================== */

"use client";

import { useState } from "react";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/channelUrlHelper";
import type { ExperienceApplicant } from "./ExperienceTypes";
import TextareaModal from "@/components/common/modal/TextareaModal";
import ReportModal, {
  type ReportOption,
} from "@/components/common/modal/ReportModal";
import BaseModal from "@/components/common/modal/BaseModal";

interface ExperienceCompletedCardProps {
  /** 카드에 표시할 신청자 정보 */
  applicant: ExperienceApplicant;
  /** 링크 확인(콘텐츠 확인) 버튼 클릭 */
  onContentCheck: (applicantId: string) => void;
  /** 등록/수정/지각 등록 라벨 */
  dateLabel?: string;
  /** 지각 제출 여부 (true면 "승인", "반려" 버튼 표시) */
  isLate?: boolean;
  /** 승인 버튼 클릭 (지각 제출인 경우) */
  onApprove?: (applicantId: string) => void;
  /** 반려 버튼 클릭 (지각 제출인 경우) */
  onReject?: (applicantId: string) => void;
  /** 연장 버튼 클릭 */
  onExtend?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
  /** 등록 기한 연장 요청 사유 (데이터에서 불러옴) */
  extension_request_reason?: string;
}

/**
 * 경험형 완료 카드
 *
 * 완료 탭에서 사용되는 카드로, 2가지 경우의 수가 있습니다:
 * 1. 일반 완료: "확인 완료" 버튼 + footer에 "신고" 버튼만
 * 2. 지각 제출: "승인", "반려" 버튼 + footer에 "연장", "신고" 버튼
 *
 * @param applicant - 신청자 정보
 * @param onContentCheck - 링크 확인 버튼 클릭 핸들러
 * @param dateLabel - 등록/수정/지각 등록 라벨
 * @param isLate - 지각 제출 여부
 * @param onApprove - 승인 버튼 클릭 핸들러 (지각 제출인 경우)
 * @param onReject - 반려 버튼 클릭 핸들러 (지각 제출인 경우)
 * @param onExtend - 연장 버튼 클릭 핸들러
 * @param onReport - 신고 버튼 클릭 핸들러
 */
export default function ExperienceCompletedCard({
  applicant,
  onContentCheck,
  dateLabel = "등록",
  isLate = false,
  onApprove,
  onReject,
  onExtend,
  onReport,
  extension_request_reason = "",
}: ExperienceCompletedCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isExtendResultModalOpen, setIsExtendResultModalOpen] = useState(false);
  const [extendResultMessage, setExtendResultMessage] = useState<string>("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState<string>("");

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
    console.log("반려 사유:", rejectReason);
    handleRejectModalClose();
  };

  // 승인 처리
  const handleApproveClick = () => {
    if (onApprove) {
      onApprove(applicant.id);
    }
  };

  // footer가 필요한지 확인 (지각 제출이거나 신고 버튼이 있는 경우)
  const hasFooter = isLate || true; // 일반 완료도 신고 버튼이 있으므로 항상 true

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
        {/* 📌 클릭 가능한 링크:
            - channelId를 클릭하면 해당 채널로 이동합니다
            - getChannelUrl 유틸리티 함수를 사용하여 올바른 URL을 생성합니다
            - 새 창에서 링크를 엽니다 (target="_blank")
        */}
        <div className={styles.channel_section}>
          <img
            src={channel_icon_src}
            alt={`${applicant.channel} 채널`}
            className={styles.channel_icon}
          />
          <a
            href={getChannelUrl(applicant.channel, applicant.channelId)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.applicant_id}
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

        {/* 링크 확인 */}
        <button
          className={styles.content_check_button}
          onClick={() => onContentCheck(applicant.id)}
          aria-label={`${applicant.nickname} 콘텐츠 확인하기`}
        >
          링크 확인
        </button>

        {/* 등록/수정/지각 등록 */}
        <div className={styles.registration_info}>
          <span
            className={
              dateLabel === "지각 등록" ? styles.late_label : undefined
            }
          >
            {applicant.updatedAt
              ? `${applicant.updatedAt} ${dateLabel}`
              : `${applicant.registrationDate} ${dateLabel}`}
          </span>
        </div>

        {/* 버튼 영역: 지각 제출인 경우 "승인", "반려", 일반 완료인 경우 "확인 완료" */}
        <div className={styles.action_button_section}>
          {isLate ? (
            // 지각 제출: "승인", "반려" 버튼
            <>
              <button
                className={`${styles.action_button} ${styles.approval_button}`}
                onClick={handleApproveClick}
              >
                승인
              </button>
              <button
                className={`${styles.action_button} ${styles.reject_button}`}
                onClick={handleRejectClick}
              >
                반려
              </button>
            </>
          ) : (
            // 일반 완료: "확인 완료" 버튼
            <button
              className={`${styles.action_button} ${styles.disabled_button}`}
              disabled
            >
              확인 완료
            </button>
          )}
        </div>
      </article>

      {/* Footer: 지각 제출인 경우 "연장", "신고", 일반 완료인 경우 "신고"만 */}
      {hasFooter && (
        <div className={styles.extension_report_footer}>
          {isLate && (
            <>
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
            </>
          )}
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

      {/* 등록 기한 연장 요청 사유 모달 (지각 제출인 경우) */}
      {isLate && (
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
      )}

      {/* 연장 결과 모달 (지각 제출인 경우) */}
      {isLate && (
        <BaseModal
          is_open={isExtendResultModalOpen}
          on_close={handleExtendResultModalClose}
          message={extendResultMessage}
          buttons={["닫기"]}
          type="center"
        />
      )}

      {/* 반려 사유 모달 (지각 제출인 경우) */}
      {isLate && (
        <TextareaModal
          is_open={isRejectModalOpen}
          on_close={handleRejectModalClose}
          title="반려 사유 입력"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="반려 사유를 입력해주세요"
          buttons={["취소", "확인"]}
          on_confirm={handleRejectConfirm}
          type="center"
          variant="reject"
        />
      )}
    </div>
  );
}
