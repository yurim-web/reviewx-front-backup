/* ========================================
   ⛔ 구매평 전용 - 반려 처리 카드 (type5: 리뷰 확인)
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 구매평 전용
     - "확인" 탭: 리뷰 확인 후 반려 처리된 상태
   
   🎯 주요 기능:
     - 상단: 리뷰 확인 버튼
     - 하단: 강한 강조 "반려 처리" 버튼
   
   📝 참고:
     - 이 카드는 리뷰 확인 후 반려된 상태를 나타냅니다
   ======================================== */

"use client";

import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { ExperienceApplicant } from "./ReviewTypes";

interface ReviewRejectedReviewCardProps {
  applicant: ExperienceApplicant;
  onCheckReview?: (applicantId: string) => void;
  onHandleReject: (applicantId: string) => void;
  dateLabel?: string;
}

export default function ReviewRejectedReviewCard({
  applicant,
  onCheckReview,
  onHandleReject,
  dateLabel = "수정",
}: ReviewRejectedReviewCardProps) {
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
            : `${applicant.registrationDate} 등록`}
        </span>
      </div>

      {/* 반려 처리 */}
      <div className={styles.action_button_section}>
        <button
          className={`${styles.action_button} ${styles.reject_process_button}`}
          onClick={() => {
            console.log("반려 처리 클릭", applicant.id);
            onHandleReject(applicant.id);
          }}
        >
          반려 처리
        </button>
      </div>
    </article>
  );
}
