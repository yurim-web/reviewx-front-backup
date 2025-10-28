/* ========================================
   🔍 검수카드 컴포넌트
   ======================================== */

/**
 * 검수카드 컴포넌트
 *
 * 목적: 콘텐츠 검수가 필요한 신청자의 정보를 표시하는 카드 컴포넌트입니다.
 *
 * 사용 위치:
 * - /partner/campaign_application/delivery (배송형 캠페인 검수 대기 목록)
 *
 * 검수카드 특징:
 * - 신청자 프로필 정보 표시 (닉네임, 사용자 타입, 프로필 이미지)
 * - 채널 정보 표시 (채널 아이콘, 채널 ID)
 * - 회원 타입 표시 (모범 회원 / 이용 제한)
 * - 통계 정보 표시 (일방문, 총방문, 이웃수)
 * - 메모/자기소개 표시
 * - 콘텐츠 확인하기 버튼 (콘텐츠 검수)
 * - 등록일 정보 표시
 * - 승인/반려 버튼 (검수 결과 처리)
 *
 * 📌 검수카드의 특징:
 * 1. 콘텐츠 검수가 필요한 상태
 * 2. 콘텐츠 확인하기 버튼으로 콘텐츠 검토
 * 3. 등록일 정보로 검수 우선순위 판단
 * 4. 승인/반려 버튼으로 검수 결과 처리
 */

"use client";

import { Applicant } from "@/data/partner/campaign_application/delivery";
import styles from "@/styles/partner/campaign_application/delivery/delivery_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";

interface ReviewApplicantCardProps {
  /** 검수 대상 신청자 정보 객체 */
  applicant: Applicant;
  /** 콘텐츠 확인하기 버튼 클릭 핸들러 함수 */
  onContentCheck: (applicantId: string) => void;
  /** 승인 버튼 클릭 핸들러 함수 */
  onApprove: (applicantId: string) => void;
  /** 반려 버튼 클릭 핸들러 함수 */
  onReject: (applicantId: string) => void;
  /** 등록일 정보 */
  registrationDate?: string;
  /** 배송 주소 정보 (배송형 특화) */
  deliveryAddress?: string;
}

/**
 * 검수카드 컴포넌트
 *
 * 📌 React 함수형 컴포넌트:
 * - props를 매개변수로 받음
 * - 구조분해할당으로 필요한 속성만 추출
 * - JSX를 반환하여 UI 렌더링
 *
 * 📌 검수카드 특화 기능:
 * - 콘텐츠 확인하기 버튼으로 콘텐츠 검토
 * - 등록일 정보 표시로 검수 우선순위 판단
 * - 승인/반려 버튼으로 검수 결과 처리
 * - 검수 워크플로우에 최적화된 UI
 *
 * @param props - ReviewApplicantCardProps 타입의 props
 * @returns JSX 요소
 */
export default function ReviewApplicantCard({
  applicant,
  onContentCheck,
  onApprove,
  onReject,
  registrationDate,
  deliveryAddress,
}: ReviewApplicantCardProps) {
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

      {/* 액션 버튼 영역: 콘텐츠 확인하기, 승인/반려 */}
      <div className={styles.action_button}>
        {/* 
          📌 콘텐츠 확인하기 버튼:
          - 검수 대상 콘텐츠를 확인하는 버튼
          - 전체 너비로 강조 표시
          - 클릭 시 콘텐츠 상세 페이지로 이동
        */}
        <button
          className={styles.content_check_button}
          onClick={() => onContentCheck(applicant.id)}
          aria-label={`${applicant.nickname} 콘텐츠 확인하기`}
        >
          콘텐츠 확인하기
        </button>

        {/* 등록일 정보 표시 */}
        {registrationDate && (
          <div className={styles.registration_info}>
            {registrationDate} 등록
          </div>
        )}

        {/* 
          📌 승인/반려 버튼:
          - 검수 결과를 처리하는 버튼들
          - 승인: 초록색 버튼
          - 반려: 빨간색 버튼
          - 두 버튼이 나란히 배치
        */}
        <div className={styles.approval_buttons}>
          <button
            className={styles.approve_button}
            onClick={() => onApprove(applicant.id)}
            aria-label={`${applicant.nickname} 승인`}
          >
            승인
          </button>
          <button
            className={styles.reject_button}
            onClick={() => onReject(applicant.id)}
            aria-label={`${applicant.nickname} 반려`}
          >
            반려
          </button>
        </div>
      </div>
    </div>
  );
}
