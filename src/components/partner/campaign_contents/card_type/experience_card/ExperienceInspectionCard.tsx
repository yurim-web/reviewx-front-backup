/* ========================================
   🔍 경험형 검수 카드 (검수탭)
   ======================================== */

"use client";

import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { ExperienceApplicant } from "./ExperienceTypes";

interface ExperienceInspectionCardProps {
  /** 카드에 표시할 신청자 정보 */
  applicant: ExperienceApplicant;
  /** 링크 확인(콘텐츠 확인) 버튼 클릭 */
  onContentCheck: (applicantId: string) => void;
  /** 승인 클릭 */
  onApprove: (applicantId: string) => void;
  /** 반려 클릭 */
  onReject: (applicantId: string) => void;
  /** 등록/수정/지각 등록 라벨 */
  dateLabel?: string;
}

/**
 * 경험형 검수 카드
 * - 검수탭에서 사용
 * - 하단에 승인/반려 버튼이 함께 노출
 * - 클래스/아이디는 스네이크 케이스 사용
 */
export default function ExperienceInspectionCard({
  applicant,
  onContentCheck,
  onApprove,
  onReject,
  dateLabel = "등록",
}: ExperienceInspectionCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);

  return (
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
          className={dateLabel === "지각 등록" ? styles.late_label : undefined}
        >
          {applicant.updatedAt
            ? `${applicant.updatedAt} ${dateLabel}`
            : `${applicant.registrationDate} ${dateLabel}`}
        </span>
      </div>

      {/* 승인/반려 */}
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
            onClick={() => onReject(applicant.id)}
            aria-label={`${applicant.nickname} 반려`}
          >
            반려
          </button>
        </div>
      </div>
    </article>
  );
}
