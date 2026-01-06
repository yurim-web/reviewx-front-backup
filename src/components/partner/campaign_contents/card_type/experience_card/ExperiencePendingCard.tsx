/* ========================================
   ⏳ 경험형 대기 탭 카드
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 배송형/방문형/기자단형 > "대기" 탭
   
   🎯 4가지 상태 유형:
     1. "콘텐츠 미등록" (회색 버튼) - 기본 상태
     2. "등록 기한 연장 요청" (흰색 버튼, 회색 테두리) - 연장 요청이 들어온 상태
     3. "콘텐츠 미등록" (회색 버튼) + "기한 연장" 표시 - 연장 승인 후 상태
     4. "콘텐츠 반려 처리" (빨간 버튼) - 반려 처리된 상태
   
   🎯 주요 기능:
     - 상태에 따라 다른 버튼 텍스트와 스타일 표시
     - footer: 연장/신고 버튼 (연장 요청 사유 확인, 신고 모달)
   
   📝 참고:
     - pendingState prop으로 상태를 구분합니다
     - 연장 승인 후에는 기한이 "2025-11-05 기한 연장" 형태로 표시됩니다
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

type PendingState =
  | "content_not_registered" // 콘텐츠 미등록
  | "extension_requested" // 등록 기한 연장 요청
  | "rejected"; // 반려 처리

interface ExperiencePendingCardProps {
  /** 카드에 표시할 신청자 정보 */
  applicant: ExperienceApplicant;
  /** 대기 탭에서의 상태 유형 */
  pendingState?: PendingState;
  /** 연장 승인 여부 (true면 기한이 "기한 연장" 형태로 표시) */
  isExtensionApproved?: boolean;
  /** 연장된 기한 날짜 (예: "2025-11-05") */
  extendedDeadline?: string;
  /** 실제 기한 날짜 (등록일과 다를 수 있음, 선택적) */
  deadlineDate?: string;
  /** 링크 확인(콘텐츠 확인) 버튼 클릭 */
  onContentCheck: (applicantId: string) => void;
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
 * 경험형 대기 탭 카드
 *
 * 사용 위치:
 * - 캠페인 콘텐츠 내역 페이지 > "대기" 탭
 * - 배송형, 방문형, 기자단형 캠페인에서 사용
 *
 * 주요 기능:
 * - 링크 확인 버튼
 * - 상태에 따라 다른 버튼 텍스트와 스타일 표시
 * - 하단에 연장/신고 버튼이 항상 노출
 * - 승인/반려 버튼은 없음 (확인 탭 전용 기능)
 * - 클래스/아이디는 스네이크 케이스 사용
 */
export default function ExperiencePendingCard({
  applicant,
  pendingState = "content_not_registered",
  isExtensionApproved = false,
  extendedDeadline,
  deadlineDate,
  onContentCheck,
  onExtend,
  onReport,
  extension_request_reason = "",
  dateLabel = "등록",
}: ExperiencePendingCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
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

        {/* 링크 확인 버튼은 대기 탭에서 제거됨 */}

        {/* 등록/수정/지각 등록 일시 */}
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

        {/* 기한 표시 (연장 승인 후에는 "기한 연장" 형태로 표시, 기한이 등록일과 다를 때만 표시) */}
        {deadlineDate && (
          <div className={styles.registration_info}>
            <span>
              {isExtensionApproved && extendedDeadline
                ? `${extendedDeadline} 기한 연장`
                : `${deadlineDate} 기한`}
            </span>
          </div>
        )}

        {/* 상태별 버튼 표시 */}
        <div className={styles.action_button_section}>
          {pendingState === "content_not_registered" && (
            <button
              className={`${styles.action_button} ${styles.disabled_button}`}
              disabled
            >
              콘텐츠 미등록
            </button>
          )}

          {pendingState === "extension_requested" && (
            <button
              className={`${styles.action_button} ${styles.extension_request_button}`}
              disabled
            >
              등록 기한 연장 요청
            </button>
          )}

          {pendingState === "rejected" && (
            <button
              className={`${styles.action_button} ${styles.reject_process_button}`}
              disabled
            >
              콘텐츠 반려 처리
            </button>
          )}
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
