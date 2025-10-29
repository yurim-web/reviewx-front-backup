/* ========================================
   📰 기자단 캠페인 일정 정보 컴포넌트
   ======================================== */

/**
 * 기자단 캠페인 일정 정보 컴포넌트
 *
 * 목적: 기자단 캠페인의 일정 정보를 표시하는 전용 컴포넌트입니다.
 *
 * 기자단 캠페인 일정 정보:
 * - 모집 인원: 현재 모집된 인원 / 전체 모집 인원
 * - 모집 기간: 캠페인 모집 기간
 * - 선정 발표: 선정자 발표일
 * - 등록 기간: 기사 등록 기간
 */

import styles from "../../../styles/partner/campaign_application/campaign_infocard.module.css";

interface ReporterCampaignScheduleProps {
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
 * 기자단 캠페인 일정 정보 컴포넌트
 *
 * 📌 기자단 캠페인 특화 기능:
 * - 전문적인 기사나 콘텐츠 작성
 * - 기자단 자격 요건 확인 필요
 * - 고품질 콘텐츠 작성 요구
 * - 언론사나 미디어 연동 가능
 *
 * @param props - ReporterCampaignScheduleProps 타입의 props
 * @returns JSX 요소
 */
export default function ReporterCampaignSchedule({
  recruitedCount,
  totalCount,
  recruitmentPeriod,
  announcementDate,
  registrationPeriod,
}: ReporterCampaignScheduleProps) {
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
