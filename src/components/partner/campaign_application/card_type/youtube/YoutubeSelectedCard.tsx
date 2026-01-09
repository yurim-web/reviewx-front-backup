/* ========================================
   ▶️ 유튜브 선정된 카드 컴포넌트
   ======================================== */

"use client";

import { YoutubeApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/channelUrlHelper";

interface YoutubeSelectedCardProps {
  applicant: YoutubeApplicant;
  onCancel: (applicantId: string) => void;
}

export default function YoutubeSelectedCard({
  applicant,
  onCancel,
}: YoutubeSelectedCardProps) {
  const channel_icon_src = getChannelLogo("유튜브");

  return (
    <article
      className={`${styles.applicant_card} ${styles.selected_card} ${
        applicant.userType === "인플루언서"
          ? styles.selected_card_influencer
          : ""
      }`}
    >
      {/* 프로필 */}
      <div className={styles.profile_section}>
        <div className={styles.profile_image_container}>
          <img
            src={applicant.profileImage || "/images/mypage/profile.svg"}
            alt="프로필"
            className={styles.profile_image}
          />
        </div>
        <div className={styles.profile_info}>
          <span className={styles.user_type}>{applicant.userType}</span>
          {/* 닉네임 표시 - 인플루언서일 때 특별한 스타일 적용 */}
          <span
            className={`${styles.nickname} ${
              applicant.userType === "인플루언서"
                ? styles.influencer_nickname
                : ""
            }`}
          >
            {applicant.nickname}
          </span>
        </div>
      </div>

      {/* 채널 정보 */}
      <div className={styles.channel_section}>
        <img
          src={channel_icon_src}
          alt="유튜브"
          className={styles.channel_icon}
        />
        <a
          href={getChannelUrl("유튜브", applicant.Id)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.applicant_id}
          onClick={(e) => {
            const url = getChannelUrl("유튜브", applicant.Id);
            if (url === "#") {
              e.preventDefault();
            }
          }}
        >
          {applicant.Id}
        </a>
      </div>

      {/* 구독자 */}
      <div className={styles.stats_section}>
        <div className={styles.stat_item}>
          <span className={styles.stat_label}>구독자</span>
          <span className={styles.stat_value}>
            {applicant.subscribers
              ? applicant.subscribers.toLocaleString()
              : "0"}
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
          className={`${styles.action_button} ${
            applicant.userType === "인플루언서"
              ? styles.influencer_cancel_button
              : styles.cancel_button
          }`}
          onClick={() => onCancel(applicant.id)}
          aria-label={`${applicant.nickname} 신청자 선택 취소`}
        >
          선택 취소
        </button>
      </div>
    </article>
  );
}
