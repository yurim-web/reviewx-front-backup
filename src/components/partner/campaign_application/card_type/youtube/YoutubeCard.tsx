/* ========================================
   ▶️ 유튜브 신청자 카드 컴포넌트
   ======================================== */

"use client";

import Image from "next/image";
import { YoutubeApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/helpers/url";

interface YoutubeCardProps {
  applicant: YoutubeApplicant;
  onSelect: (applicantId: string) => void;
}

export default function YoutubeCard({ applicant, onSelect }: YoutubeCardProps) {
  const channel_icon_src = getChannelLogo("유튜브");

  return (
    <article
      className={`${baseStyles.applicant_card} ${
        applicant.selectionStatus === "이용제한 계정" ? baseStyles.restricted_card : ""
      }`}
    >
      {/* 프로필 영역 */}
      <div className={contentStyles.profile_section}>
        <div className={contentStyles.profile_image_container}>
          <Image
            src={applicant.profileImage || "/images/mypage/profile.svg"}
            alt="프로필"
            className={contentStyles.profile_image}
            fill
          />
        </div>

        <div className={contentStyles.profile_info}>
          <span className={contentStyles.user_type}>{applicant.userType}</span>
          <span className={contentStyles.nickname}>{applicant.nickname}</span>
        </div>
      </div>

      {/* 채널 정보 */}
      <div className={contentStyles.channel_section}>
        <Image src={channel_icon_src} alt="유튜브" className={contentStyles.channel_icon} fill />
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

      {/* 회원 타입 */}
      <div className={contentStyles.member_type}>{applicant.memberType}</div>

      {/* 구독자 수 */}
      <div className={contentStyles.stats_section}>
        <div className={contentStyles.stat_item}>
          <span className={contentStyles.stat_label}>구독자</span>
          <span className={contentStyles.stat_value}>
            {applicant.subscribers ? applicant.subscribers.toLocaleString() : "0"}
          </span>
        </div>
      </div>

      {/* 메모 */}
      <div className={contentStyles.memo_section}>
        <div className={contentStyles.memo_text}>
          {applicant.memo && applicant.memo.trim() !== "" ? applicant.memo : "메모 미작성"}
        </div>
      </div>

      {/* 액션 버튼 */}
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

        {applicant.selectionStatus === "이용제한 계정" && (
          <button
            className={`${actionStyles.action_button} ${actionStyles.restricted_button}`}
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
