/* ========================================
   ✅ 선정된 카드 컴포넌트
   ======================================== */

/**
 * 선정된 카드 컴포넌트
 *
 * 목적: 이미 선정된 신청자의 정보를 표시하는 카드 컴포넌트입니다.
 *
 * 사용 위치:
 * - /partner/campaign_application/delivery (배송형 캠페인 선정자 목록)
 *
 * 선정된 카드 특징:
 * - 신청자 프로필 정보 표시 (닉네임, 사용자 타입, 프로필 이미지)
 * - 채널 정보 표시 (채널 아이콘, 채널 ID)
 * - 회원 타입 표시 (모범 회원 / 이용 제한)
 * - 통계 정보 표시 (일방문, 총방문, 이웃수)
 * - 메모/자기소개 표시
 * - 선택 취소 버튼 (선정 해제 가능)
 * - 점선 테두리로 선정된 상태 표시
 *
 * 📌 선정된 카드의 특징:
 * 1. 이미 선정된 상태임을 시각적으로 표시
 * 2. 점선 파란색 테두리로 강조
 * 3. 선택 취소 버튼으로 선정 해제 가능
 * 4. 배경색이 약간 변경되어 구분
 */

"use client";

import { Applicant } from "@/data/partner/campaign_application/delivery";
import styles from "@/styles/partner/campaign_application/delivery/delivery_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";

interface SelectedApplicantCardProps {
  /** 선정된 신청자 정보 객체 */
  applicant: Applicant;
  /** 선택 취소 버튼 클릭 핸들러 함수 */
  onCancel: (applicantId: string) => void;
  /** 배송 주소 정보 (배송형 특화) */
  deliveryAddress?: string;
}

/**
 * 선정된 카드 컴포넌트
 *
 * 📌 React 함수형 컴포넌트:
 * - props를 매개변수로 받음
 * - 구조분해할당으로 필요한 속성만 추출
 * - JSX를 반환하여 UI 렌더링
 *
 * 📌 선정된 카드 특화 기능:
 * - 점선 테두리로 선정된 상태 표시
 * - 배경색 변경으로 구분
 * - 선택 취소 버튼으로 선정 해제 가능
 *
 * @param props - SelectedApplicantCardProps 타입의 props
 * @returns JSX 요소
 */
export default function SelectedApplicantCard({
  applicant,
  onCancel,
  deliveryAddress,
}: SelectedApplicantCardProps) {
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
    <div className={`${styles.delivery_applicant_card} ${styles.selected}`}>
      {/* 프로필 영역: 프로필 이미지, 닉네임, 사용자 타입 */}
      <div className={styles.profile_section}>
        <img
          src={applicant.profileImage || "/images/default-profile.png"}
          alt={`${applicant.nickname} 프로필`}
          className={styles.profile_image}
        />
        <div className={styles.profile_info}>
          {/* 사용자 타입 표시 (리뷰어 / 인플루언서) */}
          <div className={styles.user_type}>{applicant.userType}</div>
          {/* 닉네임 표시 */}
          <div className={styles.nickname}>{applicant.nickname}</div>
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
        <span className={styles.channel_id}>id</span>
      </div>

      {/* 회원 타입 표시 */}
      <div className={styles.member_type}>{applicant.memberType}</div>

      {/* 배송 주소 정보 (배송형 특화) */}
      {deliveryAddress && (
        <div className={styles.delivery_address_section}>
          <div className={styles.delivery_address_label}>배송 주소</div>
          <div className={styles.delivery_address_text}>{deliveryAddress}</div>
        </div>
      )}

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
        <div className={styles.memo_text}>{applicant.memo}</div>
        <div className={styles.memo_divider}></div>
      </div>

      {/* 액션 버튼 영역: 선택 취소 버튼 */}
      <div className={styles.action_button}>
        {/* 
          📌 선택 취소 버튼:
          - 선정된 상태를 해제할 수 있는 버튼
          - 회색 배경으로 취소 액션임을 표시
          - 클릭 시 onCancel 핸들러 호출
        */}
        <button
          className={styles.cancel_button}
          onClick={() => onCancel(applicant.id)}
          aria-label={`${applicant.nickname} 신청자 선택 취소`}
        >
          선택 취소
        </button>
      </div>
    </div>
  );
}
