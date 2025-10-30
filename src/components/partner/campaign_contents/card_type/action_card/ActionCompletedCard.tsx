/* ========================================
   ✅ 액션형 완료 카드 (구매평/미션형)
   - 상단 액션 버튼은 동일 규칙을 따르되, 하단은 비활성화된 "검수 완료"
   ======================================== */

"use client";

import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { ExperienceApplicant, ActionCardType } from "./ActionTypes";

interface ActionCompletedCardProps {
  applicant: ExperienceApplicant;
  onContentCheck?: (applicantId: string) => void;
  onCheckLink?: (applicantId: string) => void;
  onCheckImage?: (applicantId: string) => void;
  onCheckReceipt?: (applicantId: string) => void;
  dateLabel?: string;
}

function getPrimaryButtons(
  type: ActionCardType,
  id: string,
  handlers: {
    onCheckLink?: (id: string) => void;
    onCheckImage?: (id: string) => void;
    onCheckReceipt?: (id: string) => void;
  }
) {
  const { onCheckLink, onCheckImage, onCheckReceipt } = handlers;
  switch (type) {
    case 1:
      return [
        {
          label: "구매 영수증 확인",
          onClick: () => {
            console.log("구매 영수증 확인 클릭", id);
            onCheckReceipt?.(id);
          },
        },
      ];
    case 2:
      return [
        {
          label: "이미지 확인",
          onClick: () => {
            console.log("이미지 확인 클릭", id);
            onCheckImage?.(id);
          },
        },
        {
          label: "링크 확인",
          onClick: () => {
            console.log("링크 확인 클릭", id);
            onCheckLink?.(id);
          },
        },
      ];
    case 3:
      return [
        {
          label: "이미지 확인",
          onClick: () => {
            console.log("이미지 확인 클릭", id);
            onCheckImage?.(id);
          },
        },
      ];
    case 4:
    default:
      return [
        {
          label: "링크 확인",
          onClick: () => {
            console.log("링크 확인 클릭", id);
            onCheckLink?.(id);
          },
        },
      ];
  }
}

export default function ActionCompletedCard({
  applicant,
  onCheckLink,
  onCheckImage,
  onCheckReceipt,
  dateLabel = "등록",
}: ActionCompletedCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
  const buttons = getPrimaryButtons(applicant.actionType, applicant.id, {
    onCheckLink,
    onCheckImage,
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

      {/* 채널/아이디 영역 제거 (요청 반영) */}

      {/* 액션 버튼(상단) */}
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          className={styles.content_check_button}
          onClick={btn.onClick}
        >
          {btn.label}
        </button>
      ))}

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
