/* ========================================
   ▶️ 유튜브 신청자 카드 컴포넌트
   ======================================== */

"use client";

import { YoutubeApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";

interface YoutubeCardProps {
  applicant: YoutubeApplicant;
  onSelect: (applicantId: string) => void;
}

export default function YoutubeCard({ applicant, onSelect }: YoutubeCardProps) {
  const channel_icon_src = getChannelLogo("유튜브");

  return (
    <article
      className={`${styles.applicant_card} ${
        applicant.selectionStatus === "이용제한 계정"
          ? styles.restricted_card
          : ""
      }`}
    >
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
          alt="유튜브"
          className={styles.channel_icon}
        />
        <span className={styles.applicant_id}>{applicant.Id}</span>
      </div>

      {/* 회원 타입 */}
      <div className={styles.member_type}>{applicant.memberType}</div>

      {/* 구독자 수 */}
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
      </div>

      {/* 액션 버튼 */}
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

        {applicant.selectionStatus === "이용제한 계정" && (
          <button
            className={`${styles.action_button} ${styles.restricted_button}`}
            disabled
            aria-label="이용 제한 계정"
          >
            이용 제한 계정
          </button>
        )}
      </div>
    </article>
  );
}
