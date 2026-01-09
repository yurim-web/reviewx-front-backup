/* ========================================
   👤 신청자 카드 컴포넌트
   ======================================== */

/**
 * 신청자 카드 컴포넌트
 *
 * 목적: 캠페인에 신청한 사용자의 정보를 카드 형태로 표시하는 컴포넌트입니다.
 *
 * 사용 위치:
 * - /partner/campaign_application/delivery (배송형)
 * - /partner/campaign_application/mission (미션형)
 * - /partner/campaign_application/review (리뷰형)
 * - /partner/campaign_application/reporter (기자단형)
 * - /partner/campaign_application/visit (방문형)
 *
 * 주요 기능:
 * - 신청자 프로필 정보 표시 (닉네임, 사용자 타입, 프로필 이미지)
 * - 채널 정보 표시 (채널 아이콘, 채널 ID)
 * - 회원 타입 표시 (모범 회원 / 이용 제한)
 * - 통계 정보 표시 (일방문, 총방문, 이웃수)
 * - 메모/자기소개 표시
 * - 선정하기 버튼 (미선택 상태)
 * - 이용 제한 표시 (이용제한 계정 상태)
 *
 * 📌 컴포넌트 분리의 장점:
 * 1. 재사용성: 같은 컴포넌트를 여러 곳에서 사용 가능
 * 2. 가독성: 페이지 코드가 간결해짐
 * 3. 유지보수: 컴포넌트만 수정하면 모든 곳에 반영
 * 4. 테스트: 개별 컴포넌트 테스트 용이
 */

"use client";

import { Applicant } from "@/data/partner/campaign_application/delivery_applicants";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";

/**
 * 채널 이름과 아이콘 경로를 매핑하는 객체
 *
 * 📌 Record 타입:
 * - TypeScript의 유틸리티 타입
 * - Record<키타입, 값타입> 형태
 * - 문자열 키와 문자열 값을 가진 객체를 정의
 *
 * 📌 사용 예시:
 * - "네이버" -> "/images/brand_logo/navershop.svg"
 * - "네이버 인플루언서" -> "/images/brand_logo/naverblog.svg"
 */
const channel_logo_map: Record<string, string> = {
  네이버: "/images/brand_logo/navershop.svg",
  네이버블로그: "/images/brand_logo/naverblog.svg",
  네이버쇼핑: "/images/brand_logo/navershop.svg",
  쿠팡: "/images/brand_logo/coupang.svg",
  인스타: "/images/brand_logo/insta.svg",
  카카오선물하기: "/images/brand_logo/kakaopre.svg",
  올리브영: "/images/brand_logo/oliveyoung.svg",
  오늘의집: "/images/brand_logo/todayhouse.svg",
  유튜브: "/images/brand_logo/youtube.svg",
};

interface ApplicantCardProps {
  /** 신청자 정보 객체 */
  applicant: Applicant;
  /** 선정하기 버튼 클릭 핸들러 함수 */
  onSelect: (applicantId: string) => void;
}

/**
 * 신청자 카드 컴포넌트
 *
 * 📌 React 함수형 컴포넌트:
 * - props를 매개변수로 받음
 * - 구조분해할당으로 필요한 속성만 추출
 * - JSX를 반환하여 UI 렌더링
 *
 * 📌 구조분해할당 예시:
 * const { applicant, onSelect } = props;
 * 위 코드를 매개변수에서 바로 사용하여 간결하게 작성
 *
 * @param props - ApplicantCardProps 타입의 props
 * @returns JSX 요소
 */
export default function ApplicantCard({
  applicant,
  onSelect,
}: ApplicantCardProps) {
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
  const channel_icon_src = channel_logo_map[applicant.channel];

  return (
    <div className={styles.applicant_card}>
      {/* 프로필 영역: 프로필 이미지, 닉네임, 사용자 타입 */}
      <div className={styles.profile_section}>
        <img
          src={applicant.profileImage || "/images/mypage/profile.svg"}
          alt="프로필"
          className={styles.profile_image}
        />
        <div className={styles.profile_info}>
          {/* 닉네임 표시 */}
          <div className={styles.user_type}>{applicant.userType}</div>
          {/* 사용자 타입 표시 (리뷰어 / 인플루언서) */}
          <div className={styles.nickname}>{applicant.nickname}</div>
        </div>
      </div>

      {/* 채널 정보 영역: 채널 아이콘, 채널 ID */}
      <div className={styles.channel_section}>
        <img
          src={channel_icon_src}
          alt="채널"
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
          <button className={styles.restricted_button} disabled>
            이용 제한 계정
          </button>
        )}
      </div>
    </div>
  );
}
