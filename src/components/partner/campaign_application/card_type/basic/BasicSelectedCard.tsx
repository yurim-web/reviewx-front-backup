/* ========================================
   📋 기본 선정자 카드 컴포넌트 (미션형/구매평용)
   ======================================== */

"use client";

import { BasicApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";

/**
 * BasicSelectedCard 컴포넌트
 *
 * 목적: 미션형과 구매평 캠페인에서 선정된 신청자를 표시하는 카드
 *
 * 특징:
 * - 채널별 특화 정보 없이 기본 정보만 표시
 * - 프로필, 회원 타입, 메모, 선택 취소 버튼 포함
 * - 선정된 상태를 시각적으로 구분
 *
 * 사용 위치:
 * - /partner/campaign_application/mission (미션형 캠페인 선정 탭)
 * - /partner/campaign_application/review (구매평 캠페인 선정 탭)
 */

interface BasicSelectedCardProps {
  /** 기본 신청자 데이터 */
  applicant: BasicApplicant;
  /** 선택 취소 시 호출되는 콜백 함수 */
  onCancel: (applicantId: string) => void;
}

export default function BasicSelectedCard({
  applicant,
  onCancel,
}: BasicSelectedCardProps) {
  return (
    <article
      className={`${styles.applicant_card} ${styles.selected_card} ${
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

      {/* 회원 타입 */}
      <div className={styles.member_type}>{applicant.memberType}</div>

      {/* 메모 */}
      <div className={styles.memo_section}>
        <div className={styles.memo_text}>
          {applicant.memo && applicant.memo.trim() !== ""
            ? applicant.memo
            : "메모 미작성"}
        </div>
      </div>

      {/* 액션 버튼 - 선택 취소 */}
      <div className={styles.action_button_section}>
        <button
          className={`${styles.action_button} ${styles.cancel_button}`}
          onClick={() => onCancel(applicant.id)}
          aria-label={`${applicant.nickname} 선정 취소하기`}
        >
          선택 취소
        </button>
      </div>
    </article>
  );
}
