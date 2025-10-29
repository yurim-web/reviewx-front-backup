/* ========================================
   🎯 미션형 캠페인 일정 정보 컴포넌트
   ======================================== */

/**
 * 미션형 캠페인 일정 정보 컴포넌트
 *
 * 목적: 미션형 캠페인의 일정 정보를 표시하는 전용 컴포넌트입니다.
 *
 * 미션형 캠페인 일정 정보:
 * - 모집 인원: 현재 모집된 인원 / 전체 모집 인원
 * - 모집 기간: 캠페인 모집 기간
 * - 선정 발표: 선정자 발표일
 * - 등록 기간: 미션 수행 결과 등록 기간
 */

import styles from "../../../styles/partner/campaign_application/campaign_infocard.module.css";

interface MissionCampaignScheduleProps {
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
 * 미션형 캠페인 일정 정보 컴포넌트
 *
 * 📌 미션형 캠페인 특화 기능:
 * - 특정 미션이나 과제 수행
 * - 미션 완료 인증 필요
 * - 단계별 미션 진행 가능
 * - 게임화 요소 포함 가능
 *
 * @param props - MissionCampaignScheduleProps 타입의 props
 * @returns JSX 요소
 */
export default function MissionCampaignSchedule({
  recruitedCount,
  totalCount,
  recruitmentPeriod,
  announcementDate,
  registrationPeriod,
}: MissionCampaignScheduleProps) {
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
