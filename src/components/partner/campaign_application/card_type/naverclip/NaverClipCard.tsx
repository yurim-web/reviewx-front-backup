/* ========================================
   🎬 네이버 클립 신청자 카드 컴포넌트
   ======================================== */

"use client";

import { NaverClipApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/helpers/url";

interface NaverClipCardProps {
  applicant: NaverClipApplicant;
  onSelect: (applicantId: string) => void;
}

export default function NaverClipCard({
  applicant,
  onSelect,
}: NaverClipCardProps) {
  const channel_icon_src = getChannelLogo("네이버클립");

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

      {/* 채널 정보 영역 */}
      <div className={styles.channel_section}>
        <img
          src={channel_icon_src}
          alt="네이버 클립"
          className={styles.channel_icon}
        />
        <a
          href={getChannelUrl("네이버클립", applicant.Id)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.applicant_id}
          onClick={(e) => {
            const url = getChannelUrl("네이버클립", applicant.Id);
            if (url === "#") {
              e.preventDefault();
            }
          }}
        >
          {applicant.Id}
        </a>
      </div>

      {/* 회원 타입 */}
      <div className={styles.member_type}>{applicant.memberType}</div>

      {/* 팔로워 정보만 표시 (네이버 클립 특화) */}
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
