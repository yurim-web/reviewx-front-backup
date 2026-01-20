/* ========================================
   🎞️ 숏츠 신청자 카드 컴포넌트
   ======================================== */

"use client";

import { YoutubeApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/helpers/url";

interface ShortsCardProps {
  applicant: YoutubeApplicant;
  onSelect: (applicantId: string) => void;
}

export default function ShortsCard({ applicant, onSelect }: ShortsCardProps) {
  const channel_icon_src = getChannelLogo("숏츠");

  return (
    <article
      className={`${styles.applicant_card} ${
        applicant.selectionStatus === "이용제한 계정"
          ? styles.restricted_card
          : ""
      }`}
    >
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
          <span className={styles.nickname}>{applicant.nickname}</span>
        </div>
      </div>

      <div className={styles.channel_section}>
        <img
          src={channel_icon_src}
          alt="숏츠"
          className={styles.channel_icon}
        />
        <a
          href={getChannelUrl("쇼츠", applicant.Id)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.applicant_id}
          onClick={(e) => {
            const url = getChannelUrl("쇼츠", applicant.Id);
            if (url === "#") {
              e.preventDefault();
            }
          }}
        >
          {applicant.Id}
        </a>
      </div>

      <div className={styles.member_type}>{applicant.memberType}</div>

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

      <div className={styles.memo_section}>
        <div className={styles.memo_text}>
          {applicant.memo && applicant.memo.trim() !== ""
            ? applicant.memo
            : "메모 미작성"}
        </div>
      </div>

      <div className={styles.action_button_section}>
        {applicant.selectionStatus === "미선택" && (
          <button
            className={`${styles.action_button} ${styles.select_button}`}
            onClick={() => onSelect(applicant.id)}
            aria-label={`${applicant.nickname} 신청자 선정하기`}
          >
            선정하기
          </button>
        )}
      </div>
    </article>
  );
}
