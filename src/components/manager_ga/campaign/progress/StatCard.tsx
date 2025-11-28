/* ========================================
   📊 진행 현황 통계 카드 컴포넌트
   ======================================== */

/**
 * 진행 현황 통계 카드 컴포넌트
 *
 * 목적: 진행 현황 페이지 상단에 표시되는 통계 카드입니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - 통계 제목과 값을 표시합니다
 * - 특정 통계는 빨간색으로 강조 표시할 수 있습니다
 *
 */

import styles from '@/styles/manager_ga/campaign/progress/stat_card.module.css';

// 통계 카드 props 타입 정의
interface StatCardProps {
  title: string; // 카드 제목
  value: string; // 통계 값
  isCancelled?: boolean; // 취소된 캠페인 여부 (선택적)
}

/**
 * 통계 카드 컴포넌트
 *
 * @param title - 카드 제목
 * @param value - 통계 값
 * @param isCancelled - 취소된 캠페인 여부 (선택적, true일 경우 빨간색으로 표시)
 */
export default function StatCard({ title, value, isCancelled }: StatCardProps) {
  // 취소된 캠페인인 경우 빨간색 클래스를 추가합니다
  // className을 여러 개 적용할 때는 배열로 만들고 join(' ')으로 합치거나,
  // 템플릿 리터럴을 사용할 수 있습니다
  const valueClassName = isCancelled
    ? `${styles.stat_card_value} ${styles.stat_card_value_cancelled}`
    : styles.stat_card_value;

  return (
    <div className={styles.stat_card}>
      {/* 카드 제목 */}
      <p className={styles.stat_card_title}>{title}</p>
      {/* 통계 값 - 취소된 캠페인인 경우 빨간색 클래스 적용 */}
      <p className={valueClassName}>{value}</p>
    </div>
  );
}

