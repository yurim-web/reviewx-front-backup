/* ========================================
   ✅ 미션형 전용 - 완료 카드 (type7~9)
   - type7: 이미지 확인 + 링크 확인
   - type8: 이미지 확인만
   - type9: 링크 확인만
   - 하단: 비활성화 "검수 완료"
   ======================================== */

"use client";

import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { ExperienceApplicant, MissionCardType } from "./MissionTypes";

interface MissionCompletedCardProps {
  applicant: ExperienceApplicant;
  onCheckLink?: (applicantId: string) => void;
  onCheckImage?: (applicantId: string) => void;
  dateLabel?: string;
}

function getPrimaryButtons(
  type: MissionCardType,
  id: string,
  handlers: {
    onCheckLink?: (id: string) => void;
    onCheckImage?: (id: string) => void;
  }
) {
  const { onCheckLink, onCheckImage } = handlers;
  switch (type) {
    case 7:
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
    case 8:
      return [
        {
          label: "이미지 확인",
          onClick: () => {
            console.log("이미지 확인 클릭", id);
            onCheckImage?.(id);
          },
        },
      ];
    case 9:
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

export default function MissionCompletedCard({
  applicant,
  onCheckLink,
  onCheckImage,
  dateLabel = "수정",
}: MissionCompletedCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
  const buttons = getPrimaryButtons(applicant.missionType, applicant.id, {
    onCheckLink,
    onCheckImage,
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

