/* ========================================
   ✅ 완료 카드 컴포넌트
   ======================================== */

/**
 * 완료 카드 컴포넌트
 *
 * 목적: 검수가 완료된 신청자의 정보를 표시하는 카드 컴포넌트입니다.
 *
 * 사용 위치:
 * - /partner/campaign_application/delivery (배송형 캠페인 완료된 검수 목록)
 *
 * 완료 카드 특징:
 * - 신청자 프로필 정보 표시 (닉네임, 사용자 타입, 프로필 이미지)
 * - 채널 정보 표시 (채널 아이콘, 채널 ID)
 * - 콘텐츠 확인하기 버튼 (완료된 콘텐츠 확인)
 * - 완료일 정보 표시
 * - 검수 완료 버튼 (비활성화 상태)
 *
 * 📌 완료 카드의 특징:
 * 1. 검수가 완료된 상태
 * 2. 더 이상 액션이 필요하지 않음
 * 3. 검수 완료 버튼이 비활성화됨
 * 4. 완료된 상태임을 명확히 표시
 */

"use client";

import { CompletedApplicant } from "@/data/partner/campaign_application/delivery_review_completed";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";

interface DeliveryCompletedCardProps {
  /** 완료된 신청자 정보 객체 */
  applicant: CompletedApplicant;
  /** 완료 확인 버튼 클릭 핸들러 함수 */
  onConfirm: (applicantId: string) => void;
}

/**
 * 완료 카드 컴포넌트
 *
 * 📌 React 함수형 컴포넌트:
 * - props를 매개변수로 받음
 * - 구조분해할당으로 필요한 속성만 추출
 * - JSX를 반환하여 UI 렌더링
 *
 * 📌 완료 카드 특화 기능:
 * - 검수 완료 버튼이 비활성화된 상태
 * - 완료된 상태임을 시각적으로 표시
 * - 더 이상 액션이 필요하지 않음을 명확히 표시
 *
 * @param props - DeliveryCompletedCardProps 타입의 props
 * @returns JSX 요소
 */
export default function NaverBlogCompletedCard({
  applicant,
  onConfirm,
}: DeliveryCompletedCardProps) {
  /**
   * 채널 아이콘 경로 가져오기
   *
   * 📌 channel_logo_map 사용:
   * - applicant.channel 값을 키로 사용하여 아이콘 경로 가져오기
   * - 모든 채널이 매핑되어 있으므로 항상 올바른 아이콘 표시
   *
   * 📌 예시:
   * - applicant.channel = "네이버" -> "/images/brand_logo/navershop.svg"
   * - applicant.channel = "쿠팡" -> "/images/brand_logo/coupang.svg"
   */
  const channel_icon_src = getChannelLogo(applicant.channel);

  return (
    <article className={styles.applicant_card}>
      {/* 프로필 영역: 프로필 이미지, 닉네임, 사용자 타입 */}
      <div className={styles.profile_section}>
        <div className={styles.profile_image_container}>
          <img
            src={applicant.profileImage || "/images/mypage/profile.svg"}
            alt="프로필"
            className={styles.profile_image}
          />
        </div>
        <div className={styles.profile_info}>
          {/* 사용자 타입 표시 (리뷰어 / 인플루언서) */}
          <span className={styles.user_type}>{applicant.userType}</span>
          {/* 닉네임 표시 */}
          <span className={styles.nickname}>{applicant.nickname}</span>
        </div>
      </div>

      {/* 채널 정보 영역: 채널 아이콘, 채널 ID */}
      <div className={styles.channel_section}>
        <img
          src={channel_icon_src}
          alt={`${applicant.channel} 채널`}
          className={styles.channel_icon}
        />

        <span className={styles.applicant_id}>{applicant.Id}</span>
      </div>

      {/* 
          📌 콘텐츠 확인하기 버튼:
          - 완료된 콘텐츠를 확인하는 버튼
          - 전체 너비로 강조 표시
          - 클릭 시 완료된 콘텐츠 상세 페이지로 이동
        */}
      <button
        className={styles.content_check_button}
        onClick={() => onConfirm(applicant.id)}
        aria-label={`${applicant.nickname} 완료된 콘텐츠 확인하기`}
      >
        콘텐츠 확인하기
      </button>

      {/* 완료일 정보 표시 */}
      <div className={styles.registration_info}>
        {applicant.completionDate} 완료
      </div>

      {/* 액션 버튼 영역: 콘텐츠 확인하기, 완료일, 검수 완료 */}
      <div className={styles.action_button_section}>
        {/* 
          📌 검수 완료 버튼:
          - 완료된 상태를 표시하는 버튼
          - 비활성화된 상태로 더 이상 액션 불가
          - 완료된 상태임을 명확히 표시
        */}
        <button
          className={`${styles.action_button} ${styles.completed_button}`}
          disabled
          aria-label="검수 완료"
        >
          검수 완료
        </button>
      </div>
    </article>
  );
}
