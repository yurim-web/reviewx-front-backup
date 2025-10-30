/* ========================================
   ✅ 경험형 완료 카드 (완료탭)
   ======================================== */

"use client";

import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { ExperienceApplicant } from "./ExperienceTypes";

interface ExperienceCompletedCardProps {
  /** 카드에 표시할 신청자 정보 */
  applicant: ExperienceApplicant;
  /** 링크 확인(콘텐츠 확인) 버튼 클릭 */
  onContentCheck: (applicantId: string) => void;
  /** 등록/수정/지각 등록 라벨 */
  dateLabel?: string;
}

/**
 * 경험형 완료 카드
 * - 완료탭에서 사용
 * - 하단에는 비활성화된 "검수 완료" 버튼만 노출
 */
export default function ExperienceCompletedCard({
  applicant,
  onContentCheck,
  dateLabel = "등록",
}: ExperienceCompletedCardProps) {
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

      {/* 등록/수정/지각 등록 */}
      <div className={styles.registration_info}>
        <span
          className={dateLabel === "지각 등록" ? styles.late_label : undefined}
        >
          {applicant.updatedAt
            ? `${applicant.updatedAt} ${dateLabel}`
            : `${applicant.registrationDate} ${dateLabel}`}
        </span>
      </div>

      {/* 완료 표시 */}
      <div className={styles.action_button_section}>
        <button
          className={`${styles.action_button} ${styles.disabled_button}`}
          disabled
        >
          검수 완료
        </button>
      </div>
    </article>
  );
}
