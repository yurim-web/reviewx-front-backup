/* ========================================
   ⛔ 경험형 반려 카드 (검수탭 - 반려 표시)
   ======================================== */

"use client";

import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/channelUrlHelper";
import type { ExperienceApplicant } from "./ExperienceTypes";

interface ExperienceRejectedCardProps {
  /** 카드에 표시할 신청자 정보 */
  applicant: ExperienceApplicant;
  /** 링크 확인(콘텐츠 확인) 버튼 클릭 */
  onContentCheck: (applicantId: string) => void;
  /** 반려 처리 상세 모달/액션 클릭 */
  onHandleReject: (applicantId: string) => void;
  /** 등록/수정/지각 등록 라벨 */
  dateLabel?: string;
}

/**
 * 경험형 반려 카드
 * - 검수탭에서도 반려 상태로 보여줄 때 사용
 * - 하단은 강조된 빨간색 "반려 처리" 버튼만 노출
 */
export default function ExperienceRejectedCard({
  applicant,
  onContentCheck,
  onHandleReject,
  dateLabel = "등록",
}: ExperienceRejectedCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);

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

      {/* 채널 정보 */}
      {/* 📌 클릭 가능한 링크:
          - channelId를 클릭하면 해당 채널로 이동합니다
          - getChannelUrl 유틸리티 함수를 사용하여 올바른 URL을 생성합니다
          - 새 창에서 링크를 엽니다 (target="_blank")
      */}
      <div className={styles.channel_section}>
        <img
          src={channel_icon_src}
          alt={`${applicant.channel} 채널`}
          className={styles.channel_icon}
        />
        <a
          href={getChannelUrl(applicant.channel, applicant.channelId)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.applicant_id}
          onClick={(e) => {
            // 📌 링크 클릭 핸들러:
            // - URL이 유효하지 않은 경우 클릭 방지
            // - getChannelUrl이 "#"을 반환하면 기본 동작을 막습니다
            const url = getChannelUrl(applicant.channel, applicant.channelId);
            if (url === "#") {
              e.preventDefault();
            }
          }}
        >
          {applicant.channelId}
        </a>
      </div>

      {/* 링크 확인 */}
      <button
        className={styles.content_check_button}
        onClick={() => onContentCheck(applicant.id)}
        aria-label={`${applicant.nickname} 콘텐츠 확인하기`}
      >
        링크 확인
      </button>

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

      {/* 반려 처리 버튼 */}
      <div className={styles.action_button_section}>
        <button
          className={`${styles.action_button} ${styles.reject_process_button}`}
          onClick={() => onHandleReject(applicant.id)}
        >
          반려 처리
        </button>
      </div>
    </article>
  );
}
