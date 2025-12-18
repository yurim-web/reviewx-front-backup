/* ========================================
   📊 결제 금액 통계 차트 섹션 컴포넌트
   ======================================== */

/**
 * 결제 금액 통계 차트 섹션 컴포넌트
 *
 * 목적: 결제 금액의 시간별 추이를 차트로 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 결제 금액 통계 차트 표시
 * - 섹션 제목 표시
 *
 */

import styles from '@/styles/manager_sa/dashboard/sections/payment_chart_section.module.css';
import AmountChart from '../chart/AmountChart';
import { paymentChartData } from '@/data/manager_sa/dashboard/dashboardData';

export default function PaymentChartSection() {
  return (
    <div className={styles.payment_chart_section_card}>
      {/* 섹션 제목 */}
      <h2 className={styles.payment_chart_section_title}>결제 금액 통계</h2>

      {/* 차트 영역 */}
      <div className={styles.payment_chart_section_chart_container}>
        <AmountChart
          data={paymentChartData}
          gradientId="paymentGradient"
          chartAreaClass="chart_area_payment"
        />
      </div>
    </div>
  );
}
