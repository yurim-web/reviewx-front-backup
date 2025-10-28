/* ========================================
   📦 배송형 신청자 카드 컴포넌트
   ======================================== */

/**
 * 배송형 신청자 카드 컴포넌트
 *
 * 목적: 배송형 캠페인에 신청한 사용자의 정보를 카드 형태로 표시하는 전용 컴포넌트입니다.
 *
 * 사용 위치:
 * - /partner/campaign_application/delivery (배송형 캠페인 신청자 목록)
 *
 * 배송형 캠페인 특화 기능:
 * - 신청자 프로필 정보 표시 (닉네임, 사용자 타입, 프로필 이미지)
 * - 채널 정보 표시 (채널 아이콘, 채널 ID)
 * - 회원 타입 표시 (모범 회원 / 이용 제한)
 * - 배송 관련 통계 정보 표시 (일방문, 총방문, 이웃수)
 * - 배송 주소 정보 표시 (배송형 특화)
 * - 메모/자기소개 표시
 * - 선정하기 버튼 (미선택 상태)
 * - 이용 제한 표시 (이용제한 계정 상태)
 *
 * 📌 배송형 캠페인의 특징:
 * 1. 제품을 무료로 배송받아 리뷰 작성
 * 2. 배송 주소 확인이 중요
 * 3. 제품 수령 후 리뷰 작성 기한 관리
 * 4. 배송 상태 추적 가능
 */

"use client";

import { Applicant } from "@/data/partner/campaign_application/delivery";
import styles from "@/styles/partner/campaign_application/delivery/delivery_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";

interface DeliveryApplicantCardProps {
  /** 배송형 신청자 정보 객체 */
  applicant: Applicant;
  /** 선정하기 버튼 클릭 핸들러 함수 */
  onSelect: (applicantId: string) => void;
  /** 배송 주소 정보 (배송형 특화) */
  deliveryAddress?: string;
}

/**
 * 배송형 신청자 카드 컴포넌트
 *
 * 📌 React 함수형 컴포넌트:
 * - props를 매개변수로 받음
 * - 구조분해할당으로 필요한 속성만 추출
 * - JSX를 반환하여 UI 렌더링
 *
 * 📌 구조분해할당 예시:
 * const { applicant, onSelect, deliveryAddress } = props;
 * 위 코드를 매개변수에서 바로 사용하여 간결하게 작성
 *
 * 📌 배송형 특화 기능:
 * - deliveryAddress: 배송 주소 정보 표시
 * - 배송 관련 UI 요소 추가
 *
 * @param props - DeliveryApplicantCardProps 타입의 props
 * @returns JSX 요소
 */
export default function DeliveryApplicantCard({
  applicant,
  onSelect,
  deliveryAddress,
}: DeliveryApplicantCardProps) {
  /**
   * 채널 아이콘 경로 가져오기
   *
   * 📌 getChannelLogo 함수 사용:
   * - 유틸리티 함수를 통해 채널 로고 경로 가져오기
   * - 기본값 처리로 안전한 접근
   * - 중앙 집중식 관리로 유지보수 용이
   *
   * 📌 예시:
   * - applicant.channel = "네이버" -> "/images/brand_logo/navershop.svg"
   * - applicant.channel = "쿠팡" -> "/images/brand_logo/coupang.svg"
   */
  const channel_icon_src = getChannelLogo(applicant.channel);

  return (
    <div className={styles.delivery_applicant_card}>
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

      {/* 액션 버튼 영역: 선정하기 / 이용 제한 표시 */}
      <div className={styles.action_button}>
        {/* 
          📌 조건부 렌더링 (Conditional Rendering):
          - && 연산자: 왼쪽 조건이 true일 때만 오른쪽 렌더링
          - 삼항 연산자 대신 더 간결한 방법
          
          applicant.selectionStatus === "미선택" 조건이 true면
          선정하기 버튼을 렌더링
        */}
        {applicant.selectionStatus === "미선택" && (
          <button
            className={styles.select_button}
            onClick={() => onSelect(applicant.id)}
            aria-label={`${applicant.nickname} 신청자 선정하기`}
          >
            선정하기
          </button>
        )}

        {/* 
          📌 이용 제한 계정 표시:
          - disabled 속성: 버튼 비활성화
          - 클릭 불가능한 상태
        */}
        {applicant.selectionStatus === "이용제한 계정" && (
          <button
            className={styles.restricted_button}
            disabled
            aria-label="이용 제한 계정"
          >
            이용 제한 계정
          </button>
        )}
      </div>
    </div>
  );
}
