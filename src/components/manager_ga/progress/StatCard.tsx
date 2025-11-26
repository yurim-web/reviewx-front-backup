/* ========================================
   📊 진행 현황 통계 카드 컴포넌트
   ======================================== */

/**
 * 진행 현황 통계 카드 컴포넌트
 *
 * 목적: 진행 현황 페이지 상단에 표시되는 통계 카드입니다.
 *
 * 사용 페이지:
 * - /manager_ga/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - 통계 제목과 값을 표시합니다
 * - 특정 통계는 빨간색으로 강조 표시할 수 있습니다
 *
 * 학습 포인트:
 * - props: 부모 컴포넌트에서 데이터를 받아옵니다
 * - 구조분해할당: props 객체에서 필요한 속성만 추출합니다
 * - 조건부 스타일: color prop이 있으면 해당 색상을 적용합니다
 * - CSS Modules: className으로 스타일을 적용합니다
 */

import styles from '@/styles/manager_ga/progress.module.css';

// 통계 카드 props 타입 정의
interface StatCardProps {
  title: string; // 카드 제목
  value: string; // 통계 값
  color?: string; // 값 색상 (선택적)
}

/**
 * 통계 카드 컴포넌트
 *
 * @param title - 카드 제목
 * @param value - 통계 값
 * @param color - 값 색상 (선택적, 기본값: #444444)
 */
export default function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div className={styles.stat_card}>
      {/* 카드 제목 */}
      <p className={styles.stat_card_title}>{title}</p>
      {/* 통계 값 - color prop이 있으면 인라인 스타일로 색상 적용 */}
      <p
        className={styles.stat_card_value}
        style={color ? { color } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

