/* ========================================
   🎬 릴스 신청자 카드 컴포넌트
   ======================================== */

"use client";

import { InstagramApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/helpers/url";

interface ReelsCardProps {
  applicant: InstagramApplicant;
  onSelect: (applicantId: string) => void;
}

export default function ReelsCard({ applicant, onSelect }: ReelsCardProps) {
  const channel_icon_src = getChannelLogo("릴스");

  return (
    <article
      className={`${baseStyles.applicant_card} ${
        applicant.selectionStatus === "이용제한 계정"
          ? baseStyles.restricted_card
          : ""
      }`}
    >
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
          <span className={contentStyles.nickname}>{applicant.nickname}</span>
        </div>
      </div>

      <div className={contentStyles.channel_section}>
        <img
          src={channel_icon_src}
          alt="릴스"
          className={contentStyles.channel_icon}
        />
        <a
          href={getChannelUrl("릴스", applicant.Id)}
          target="_blank"
          rel="noopener noreferrer"
          className={contentStyles.applicant_id}
          onClick={(e) => {
            const url = getChannelUrl("릴스", applicant.Id);
            if (url === "#") {
              e.preventDefault();
            }
          }}
        >
          {applicant.Id}
        </a>
      </div>

      <div className={contentStyles.member_type}>{applicant.memberType}</div>

      <div className={contentStyles.stats_section}>
        <div className={contentStyles.stat_item}>
          <span className={contentStyles.stat_label}>팔로워</span>
          <span className={contentStyles.stat_value}>
            {applicant.followers ? applicant.followers.toLocaleString() : "0"}
          </span>
        </div>
      </div>

      <div className={contentStyles.memo_section}>
        <div className={contentStyles.memo_text}>
          {applicant.memo && applicant.memo.trim() !== ""
            ? applicant.memo
            : "메모 미작성"}
        </div>
      </div>

      <div className={actionStyles.action_button_section}>
        {applicant.selectionStatus === "미선택" && (
          <button
            className={`${actionStyles.action_button} ${actionStyles.select_button}`}
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
