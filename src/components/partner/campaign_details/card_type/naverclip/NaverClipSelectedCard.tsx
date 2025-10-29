/* ========================================
   🎬 네이버 클립 선정된 카드 컴포넌트
   ======================================== */

"use client";

import { NaverClipApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";

interface NaverClipSelectedCardProps {
  applicant: NaverClipApplicant;
  onCancel: (applicantId: string) => void;
}

export default function NaverClipSelectedCard({
  applicant,
  onCancel,
}: NaverClipSelectedCardProps) {
  const channel_icon_src = getChannelLogo("네이버클립");

  return (
    <article className={`${styles.applicant_card} ${styles.selected_card}`}>
      {/* 프로필 */}
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
          alt="네이버 클립"
          className={styles.channel_icon}
        />
        <span className={styles.applicant_id}>{applicant.Id}</span>
      </div>

      {/* 회원 타입 */}
      <div className={styles.member_type}>{applicant.memberType}</div>

      {/* 팔로워 */}
      <div className={styles.stats_section}>
        <div className={styles.stat_item}>
          <span className={styles.stat_label}>팔로워</span>
          <span className={styles.stat_value}>
            {applicant.followers ? applicant.followers.toLocaleString() : "0"}
          </span>
        </div>
      </div>

      {/* 메모 */}
      <div className={styles.memo_section}>
        <div className={styles.memo_text}>
          {applicant.memo && applicant.memo.trim() !== ""
            ? applicant.memo
            : "메모 미작성"}
        </div>
        <div className={styles.memo_divider}></div>
      </div>

      {/* 선택 취소 */}
      <div className={styles.action_button_section}>
        <button
          className={`${styles.action_button} ${styles.cancel_button}`}
          onClick={() => onCancel(applicant.id)}
          aria-label={`${applicant.nickname} 신청자 선택 취소`}
        >
          선택 취소
        </button>
      </div>
    </article>
  );
}
