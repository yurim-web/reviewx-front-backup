/* ========================================
   📦 배송형 캠페인 일정 정보 컴포넌트
   ======================================== */

/**
 * 배송형 캠페인 일정 정보 컴포넌트
 *
 * 목적: 배송형 캠페인의 일정 정보를 표시하는 전용 컴포넌트입니다.
 *
 * 배송형 캠페인 일정 정보:
 * - 모집 인원: 현재 모집된 인원 / 전체 모집 인원
 * - 모집 기간: 캠페인 모집 기간
 * - 선정 발표: 선정자 발표일
 * - 등록 기간: 콘텐츠 등록 기간
 */

import styles from "@/styles/partner/campaign_application/campaign_infocard.module.css";

interface DeliveryCampaignScheduleProps {
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
 * 배송형 캠페인 일정 정보 컴포넌트
 *
 * 📌 배송형 캠페인 특화 기능:
 * - 제품을 무료로 배송받아 리뷰 작성
 * - 배송 주소 확인이 중요
 * - 제품 수령 후 리뷰 작성 기한 관리
 * - 배송 상태 추적 가능
 *
 * @param props - DeliveryCampaignScheduleProps 타입의 props
 * @returns JSX 요소
 */
export default function DeliveryCampaignSchedule({
  recruitedCount,
  totalCount,
  recruitmentPeriod,
  announcementDate,
  registrationPeriod,
}: DeliveryCampaignScheduleProps) {
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
