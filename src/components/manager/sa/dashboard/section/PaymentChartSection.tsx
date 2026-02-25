/* ========================================
   📊 결제 금액 통계 차트 섹션 컴포넌트
   ======================================== */

/**
 * 결제 금액 통계 차트 섹션 컴포넌트
 *
 * 목적: 결제 금액의 시간별 추이를 차트로 표시하는 섹션 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa (대시보드 페이지)
 */

import styles from "@/styles/manager_sa/dashboard/sections/payment_chart_section.module.css";
import AmountChart from "../chart/AmountChart";
import { paymentChartData } from "@/data/manager_sa/dashboard/dashboardData";

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
