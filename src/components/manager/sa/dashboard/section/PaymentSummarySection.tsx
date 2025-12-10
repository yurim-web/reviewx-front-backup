/* ========================================
   💳 결제 요약 섹션 컴포넌트
   ======================================== */

/**
 * 결제 요약 섹션 컴포넌트
 *
 * 목적: 결제 요약 통계와 결제 금액 통계 차트를 한 박스 안에 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 위쪽: 예상 수수료, 카드 결제 총액, 입금 총액, 총 결제 금액 등 통계 표시
 * - 위쪽: 출금 요청 금액, 출금 완료 총액, 총 예치금 잔액 통계 표시
 * - 아래쪽: 결제 금액 통계 차트 표시
 * - 7개의 통계 카드를 그리드로 배치
 *
 */

import styles from '@/styles/manager_sa/dashboard/sections/summary_section.module.css';
import StatCard, { StatCardData } from '../StatCard';
import AmountChart from '../chart/AmountChart';
import { paymentChartData } from '@/data/manager_sa/dashboard/dashboardData';

// PaymentSummarySection 컴포넌트의 props 타입 정의
interface PaymentSummarySectionProps {
  // 결제 통계 데이터 배열
  stats: StatCardData[];
}

export default function PaymentSummarySection({
  stats,
}: PaymentSummarySectionProps) {
  return (
    <div className={styles.summary_section_container}>
      {/* 섹션 제목 */}
      <h2 className={styles.summary_section_title}>결제 요약</h2>

      {/* 통계 카드 그리드 */}
      <div
        className={`${styles.summary_section_stats_grid} ${styles.summary_section_stats_grid_payment}`}
      >
        {/* map 함수를 사용하여 통계 카드 배열을 순회하며 렌더링 */}
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* 결제 금액 통계 차트 제목 */}
      <h2 className={styles.summary_section_chart_title}>결제 금액 통계</h2>

      {/* 차트 영역 */}
      <div className={styles.summary_section_chart_container}>
        <AmountChart
          data={paymentChartData}
          gradientId="paymentGradient"
          chartAreaClass="chart_area_payment"
        />
      </div>
    </div>
  );
}
