/* ========================================
   🛒 구매평 캠페인 일정 정보 컴포넌트
   ======================================== */

/**
 * 구매평 캠페인 일정 정보 컴포넌트
 *
 * 목적: 구매평 캠페인의 일정 정보를 표시하는 전용 컴포넌트입니다.
 *
 * 구매평 캠페인 일정 정보:
 * - 모집 인원: 현재 모집된 인원 / 전체 모집 인원
 * - 모집 기간: 캠페인 모집 기간
 * - 선정 발표: 선정자 발표일
 * - 구매 기간: 제품 구매 기간
 * - 등록 기간: 구매평 등록 기간
 */

import styles from "@/styles/partner/campaign_application/campaign_infocard.module.css";

interface ReviewCampaignScheduleProps {
  /** 모집된 인원 수 */
  recruitedCount: number;
  /** 전체 모집 인원 수 */
  totalCount: number;
  /** 모집 기간 문자열 */
  recruitmentPeriod: string;
  /** 선정 발표일 문자열 */
  announcementDate: string;
  /** 구매 기간 문자열 */
  purchasePeriod: string;
  /** 등록 기간 문자열 */
  registrationPeriod: string;
}

/**
 * 구매평 캠페인 일정 정보 컴포넌트
 *
 * 📌 구매평 캠페인 특화 기능:
 * - 사용자가 직접 제품을 구매하고 리뷰 작성
 * - 구매 기간이 별도로 존재
 * - 구매 후 구매평 작성 기한 관리
 * - 구매 인증이 필요
 *
 * @param props - ReviewCampaignScheduleProps 타입의 props
 * @returns JSX 요소
 */
export default function ReviewCampaignSchedule({
  recruitedCount,
  totalCount,
  recruitmentPeriod,
  announcementDate,
  purchasePeriod,
  registrationPeriod,
}: ReviewCampaignScheduleProps) {
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

      {/* 구매 기간 정보 */}
      <div className={styles.schedule_item}>
        <span className={styles.schedule_label}>구매 기간</span>
        <span className={styles.schedule_value}>{purchasePeriod}</span>
      </div>

      {/* 등록 기간 정보 */}
      <div className={styles.schedule_item}>
        <span className={styles.schedule_label}>등록 기간</span>
        <span className={styles.schedule_value}>{registrationPeriod}</span>
      </div>
    </div>
  );
}
