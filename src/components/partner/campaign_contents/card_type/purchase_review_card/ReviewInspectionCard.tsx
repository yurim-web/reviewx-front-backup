/* ========================================
   🧾 구매평 전용 - 검수 카드
   - type1: 리뷰 확인
   - type2: 구매 영수증 확인
   - 하단: 승인/반려 버튼
   ======================================== */

"use client";

import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { ExperienceApplicant, ReviewCardType } from "./ReviewTypes";

interface ReviewInspectionCardProps {
  applicant: ExperienceApplicant;
  onCheckReview?: (applicantId: string) => void;
  onCheckReceipt?: (applicantId: string) => void;
  onApprove: (applicantId: string) => void;
  onReject: (applicantId: string) => void;
  dateLabel?: string;
}

function getPrimaryButton(
  type: ReviewCardType,
  id: string,
  handlers: {
    onCheckReview?: (id: string) => void;
    onCheckReceipt?: (id: string) => void;
  }
) {
  const { onCheckReview, onCheckReceipt } = handlers;
  if (type === 1) {
    return {
      label: "리뷰 확인",
      onClick: () => {
        console.log("리뷰 확인 클릭", id);
        onCheckReview?.(id);
      },
    };
  }
  return {
    label: "구매 영수증 확인",
    onClick: () => {
      console.log("구매 영수증 확인 클릭", id);
      onCheckReceipt?.(id);
    },
  };
}

export default function ReviewInspectionCard({
  applicant,
  onCheckReview,
  onCheckReceipt,
  onApprove,
  onReject,
  dateLabel = "등록",
}: ReviewInspectionCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
  const button = getPrimaryButton(applicant.reviewType, applicant.id, {
    onCheckReview,
    onCheckReceipt,
  });

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
      <button className={styles.content_check_button} onClick={button.onClick}>
        {button.label}
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

      {/* 승인/반려 */}
      <div className={styles.approval_buttons}>
        <button
          className={`${styles.action_button} ${styles.approve_button}`}
          onClick={() => {
            console.log("승인 클릭", applicant.id);
            onApprove(applicant.id);
          }}
        >
          승인
        </button>
        <button
          className={`${styles.action_button} ${styles.reject_button}`}
          onClick={() => {
            console.log("반려 클릭", applicant.id);
            onReject(applicant.id);
          }}
        >
          반려
        </button>
      </div>
    </article>
  );
}
