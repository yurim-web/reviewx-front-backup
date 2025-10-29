/* ========================================
   🚫 이용제한계정 카드 컴포넌트
   ======================================== */

/**
 * 이용제한계정 카드 컴포넌트
 *
 * 목적: 이용 제한된 계정의 신청자 정보를 표시하는 카드 컴포넌트입니다.
 *
 * 사용 위치:
 * - /partner/campaign_application/delivery (배송형 캠페인 신청자 목록)
 *
 * 이용제한계정 카드 특징:
 * - 신청자 프로필 정보 표시 (닉네임, 사용자 타입, 프로필 이미지)
 * - 채널 정보 표시 (채널 아이콘, 채널 ID)
 * - 회원 타입 표시 (모범 회원 / 이용 제한)
 * - 통계 정보 표시 (일방문, 총방문, 이웃수)
 * - 메모/자기소개 표시
 * - 이용 제한 계정 버튼 (비활성화 상태)
 *
 * 📌 이용제한계정의 특징:
 * 1. 계정이 제재를 받은 상태
 * 2. 선정할 수 없는 상태
 * 3. 버튼이 비활성화되어 클릭 불가
 * 4. 시각적으로 제한된 상태임을 표시
 */

"use client";

import { Applicant } from "@/data/partner/campaign_application/delivery_applicants";
import styles from "@/styles/partner/campaign_application/delivery/delivery_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";

interface DeliveryRestrictedCardProps {
  /** 이용제한 신청자 정보 객체 */
  applicant: Applicant;
}

/**
 * 이용제한계정 카드 컴포넌트
 *
 * 📌 React 함수형 컴포넌트:
 * - props를 매개변수로 받음
 * - 구조분해할당으로 필요한 속성만 추출
 * - JSX를 반환하여 UI 렌더링
 *
 * 📌 이용제한계정 특화 기능:
 * - 버튼이 비활성화된 상태로 표시
 * - 클릭 불가능한 상태임을 명확히 표시
 * - 시각적으로 제한된 상태임을 강조
 *
 * @param props - DeliveryRestrictedCardProps 타입의 props
 * @returns JSX 요소
 */
export default function NaverBlogRestrictedCard({
  applicant,
}: DeliveryRestrictedCardProps) {
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
    <article className={`${styles.applicant_card} ${styles.restricted_card}`}>
      {/* 프로필 영역: 프로필 이미지, 닉네임, 사용자 타입 */}
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
        {/* 
          📌 하드코딩된 텍스트:
          - 현재 "id"로 고정되어 있음
          - 실제로는 applicant.channelId 같은 prop을 사용해야 함
        */}
        <span className={styles.applicant_id}>{applicant.Id}</span>
      </div>

      {/* 회원 타입 표시 */}
      <div className={styles.member_type}>{applicant.memberType}</div>

      {/* 통계 정보 영역: 일방문, 총방문, 이웃수 */}
      <div className={styles.stats_section}>
        {/* 
          📌 통계 아이템 1: 일방문
          - toLocaleString(): 숫자를 천 단위 콤마로 표시
          - 예: 135 -> "135", 1350 -> "1,350"
        */}
        <div className={styles.stat_item}>
          <span className={styles.stat_label}>일방문</span>
          <span className={styles.stat_value}>
            {applicant.dailyVisits.toLocaleString()}
          </span>
        </div>

        {/* 통계 아이템 2: 총방문 */}
        <div className={styles.stat_item}>
          <span className={styles.stat_label}>총방문</span>
          <span className={styles.stat_value}>
            {applicant.totalVisits.toLocaleString()}
          </span>
        </div>

        {/* 통계 아이템 3: 이웃수 */}
        <div className={styles.stat_item}>
          <span className={styles.stat_label}>이웃수</span>
          <span className={styles.stat_value}>
            {applicant.neighbors.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 메모 영역: 신청자가 작성한 자기소개 */}
      <div className={styles.memo_section}>
        <div className={styles.memo_text}>
          {applicant.memo && applicant.memo.trim() !== ""
            ? applicant.memo
            : "메모 미작성"}
        </div>
        <div className={styles.memo_divider}></div>
      </div>

      {/* 액션 버튼 영역: 이용 제한 계정 표시 */}
      <div className={styles.action_button_section}>
        <button
          className={`${styles.action_button} ${styles.restricted_button}`}
          disabled
          aria-label="이용 제한 계정"
        >
          이용 제한 계정
        </button>
      </div>
    </article>
  );
}
