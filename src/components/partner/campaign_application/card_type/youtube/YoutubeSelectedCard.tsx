/* ========================================
   ▶️ 유튜브 선정된 카드 컴포넌트
   ======================================== */

"use client";

import { YoutubeApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/helpers/url";

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
      className={`${baseStyles.applicant_card} ${baseStyles.selected_card} ${
        applicant.userType === "인플루언서"
          ? baseStyles.selected_card_influencer
          : ""
      }`}
    >
      {/* 프로필 */}
      <div className={contentStyles.profile_section}>
        <div className={contentStyles.profile_image_container}>
          <img
            src={applicant.profileImage || "/images/mypage/profile.svg"}
            alt="프로필"
            className={contentStyles.profile_image}
          />
        </div>
        <div className={contentStyles.profile_info}>
          <span className={contentStyles.user_type}>{applicant.userType}</span>
          {/* 닉네임 표시 - 인플루언서일 때 특별한 스타일 적용 */}
          <span
            className={`${contentStyles.nickname} ${
              applicant.userType === "인플루언서"
                ? contentStyles.influencer_nickname
                : ""
            }`}
          >
            {applicant.nickname}
          </span>
        </div>
      </div>

      {/* 채널 정보 */}
      <div className={contentStyles.channel_section}>
        <img
          src={channel_icon_src}
          alt="유튜브"
          className={contentStyles.channel_icon}
        />
        <a
          href={getChannelUrl("유튜브", applicant.Id)}
          target="_blank"
          rel="noopener noreferrer"
          className={contentStyles.applicant_id}
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
      <div className={contentStyles.stats_section}>
        <div className={contentStyles.stat_item}>
          <span className={contentStyles.stat_label}>구독자</span>
          <span className={contentStyles.stat_value}>
            {applicant.subscribers
              ? applicant.subscribers.toLocaleString()
              : "0"}
          </span>
        </div>
      </div>

      {/* 메모 */}
      <div className={contentStyles.memo_section}>
        <div className={contentStyles.memo_text}>
          {applicant.memo && applicant.memo.trim() !== ""
            ? applicant.memo
            : "메모 미작성"}
        </div>
        <div className={contentStyles.memo_divider}></div>
      </div>

      {/* 선택 취소 */}
      <div className={actionStyles.action_button_section}>
        <button
          className={`${actionStyles.action_button} ${
            applicant.userType === "인플루언서"
              ? actionStyles.influencer_cancel_button
              : actionStyles.cancel_button
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
