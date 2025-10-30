/* ========================================
   ✅ 구매평 전용 - 완료 카드 (type3)
   - 상단: 리뷰 확인
   - 하단: 비활성화 "검수 완료"
   ======================================== */

"use client";

import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { ExperienceApplicant } from "./ReviewTypes";

interface ReviewCompletedCardProps {
  applicant: ExperienceApplicant;
  onCheckReview?: (applicantId: string) => void;
  dateLabel?: string;
}

export default function ReviewCompletedCard({
  applicant,
  onCheckReview,
  dateLabel = "수정",
}: ReviewCompletedCardProps) {
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

      {/* 상단 액션 버튼 */}
      <button
        className={styles.content_check_button}
        onClick={() => {
          console.log("리뷰 확인 클릭", applicant.id);
          onCheckReview?.(applicant.id);
        }}
      >
        리뷰 확인
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
