/* ========================================
   🏠 방문형 캠페인 일정 정보 컴포넌트
   ======================================== */

/**
 * 방문형 캠페인 일정 정보 컴포넌트
 *
 * 목적: 방문형 캠페인의 일정 정보를 표시하는 전용 컴포넌트입니다.
 *
 * 방문형 캠페인 일정 정보:
 * - 모집 인원: 현재 모집된 인원 / 전체 모집 인원
 * - 모집 기간: 캠페인 모집 기간
 * - 선정 발표: 선정자 발표일
 * - 등록 기간: 방문 후기 등록 기간
 */

import styles from "../../../styles/partner/campaign_application/campaign_infocard.module.css";

interface VisitCampaignScheduleProps {
  /** 모집된 인원 수 */
  recruitedCount: number;
  /** 전체 모집 인원 수 */
  totalCount: number;
  /** 모집 기간 문자열 */
  recruitmentPeriod: string;
  /** 선정 발표일 문자열 */
  announcementDate: string;
  /** 등록 기간 문자열 */
  registrationPeriod: string;
}

/**
 * 방문형 캠페인 일정 정보 컴포넌트
 *
 * 📌 방문형 캠페인 특화 기능:
 * - 실제 매장이나 장소를 방문하여 체험
 * - 방문 인증이 필요
 * - 방문 후 체험 후기 작성
 * - 위치 기반 서비스 연동 가능
 *
 * @param props - VisitCampaignScheduleProps 타입의 props
 * @returns JSX 요소
 */
export default function VisitCampaignSchedule({
  recruitedCount,
  totalCount,
  recruitmentPeriod,
  announcementDate,
  registrationPeriod,
}: VisitCampaignScheduleProps) {
  return (
    <div className={styles.campaign_schedule}>
      {/* 모집 인원 정보 */}
      <div className={styles.schedule_item}>
        <span className={styles.schedule_label}>모집 인원</span>
        <span className={styles.schedule_value}>
          <strong>{recruitedCount}명</strong> / {totalCount}명
        </span>
      </div>

      {/* 모집 기간 정보 */}
      <div className={styles.schedule_item}>
        <span className={styles.schedule_label}>모집 기간</span>
        <span className={styles.schedule_value}>{recruitmentPeriod}</span>
      </div>

      {/* 선정 발표 정보 */}
      <div className={styles.schedule_item}>
        <span className={styles.schedule_label}>선정 발표</span>
        <span className={styles.schedule_value}>{announcementDate}</span>
      </div>

      {/* 등록 기간 정보 */}
      <div className={styles.schedule_item}>
        <span className={styles.schedule_label}>등록 기간</span>
        <span className={styles.schedule_value}>{registrationPeriod}</span>
      </div>
    </div>
  );
}
