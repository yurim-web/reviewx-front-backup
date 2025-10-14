/**
 * 캠페인 일정 정보 컴포넌트
 * 
 * 목적: 캠페인의 모집 인원, 일정 등의 정보를 표시합니다.
 * 
 * 주요 기능:
 * - 모집 인원 (현재/전체)
 * - 모집 기간
 * - 선정 발표일
 * - 추가 일정 정보 (동적으로 추가 가능)
 */

import styles from "../../styles/campaign/campaign_detail.module.css";

/**
 * 일정 항목 인터페이스
 */
interface ScheduleItem {
  label: string;              // 항목 라벨 (예: "구매 기간", "등록 기간")
  value: string;              // 항목 값
  isRecruitmentInfo?: boolean; // 모집 기간인지 여부 (스타일 적용용)
}

/**
 * Props 인터페이스
 */
interface CampaignScheduleInfoProps {
  currentRecruitment: number;   // 현재 모집 인원
  totalRecruitment: number;     // 전체 모집 인원
  applicationStart: string;     // 모집 시작일
  applicationEnd: string;       // 모집 종료일
  announcement: string;         // 선정 발표일
  additionalSchedules?: ScheduleItem[]; // 추가 일정 (선택사항)
}

/**
 * 캠페인 일정 정보 컴포넌트
 * 
 * @param props - CampaignScheduleInfoProps 타입의 속성들
 * @returns 캠페인 일정 정보를 담은 JSX 요소
 */
export default function CampaignScheduleInfo({
  currentRecruitment,
  totalRecruitment,
  applicationStart,
  applicationEnd,
  announcement,
  additionalSchedules = [],
}: CampaignScheduleInfoProps) {
  return (
    // ========================================
    // 캠페인 참여 정보
    // ========================================
    <article className={styles.campaign_info}>
      {/* 모집 인원 */}
      <div className={styles.info_item_container}>
        <span className={styles.label}>모집 인원</span>
        <span className={styles.value}>
          {/* 현재 모집된 인원 (강조) */}
          <span className={styles.current_count}>
            {currentRecruitment}명
          </span>
          
          {/* 구분자 */}
          <span className={styles.separator}> / </span>
          
          {/* 전체 모집 인원 */}
          <span className={styles.total_count}>
            {totalRecruitment}명
          </span>
        </span>
      </div>

      {/* 모집 기간 */}
      <div className={styles.info_item_container}>
        <span className={styles.label}>모집 기간</span>
        {/* 
          템플릿 리터럴: 백틱(`)을 사용한 문자열 + 변수 결합
          className에 여러 클래스 조합 가능
        */}
        <span className={`${styles.value} ${styles.recruitment_info}`}>
          {applicationStart} ~ {applicationEnd}
        </span>
      </div>

      {/* 선정 발표 */}
      <div className={styles.info_item_container}>
        <span className={styles.label}>선정 발표</span>
        <span className={styles.value}>{announcement}</span>
      </div>

      {/* 
        추가 일정 항목들 (배열 렌더링)
        map(): 배열의 각 요소를 JSX로 변환
      */}
      {additionalSchedules.map((schedule, index) => (
        <div key={index} className={styles.info_item_container}>
          <span className={styles.label}>{schedule.label}</span>
          <span 
            className={
              schedule.isRecruitmentInfo 
                ? `${styles.value} ${styles.recruitment_info}`
                : styles.value
            }
          >
            {schedule.value}
          </span>
        </div>
      ))}
    </article>
  );
}

