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

import StatCardCommon from '@/components/manager_common/campaign/progress/StatCard';
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
 * 목적: 공통 컴포넌트를 사용하여 중복 코드를 제거합니다.
 *
 * @param title - 카드 제목
 * @param value - 통계 값
 * @param isCancelled - 취소된 캠페인 여부 (선택적, true일 경우 빨간색으로 표시)
 */
export default function StatCard({ title, value, isCancelled }: StatCardProps) {
  return (
    <StatCardCommon
      title={title}
      value={value}
      isCancelled={isCancelled}
      styles={styles}
    />
  );
}




