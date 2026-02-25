/* ========================================
   📊 정산 금액 통계 차트 섹션 컴포넌트
   ======================================== */

/**
 * 정산 금액 통계 차트 섹션 컴포넌트
 *
 * 목적: 정산 금액의 시간별 추이를 차트로 표시하는 섹션 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa (대시보드 페이지)
 */

import styles from "@/styles/manager_sa/dashboard/sections/settlement_chart_section.module.css";
import AmountChart from "../chart/AmountChart";
import { settlementChartData } from "@/data/manager_sa/dashboard/dashboardData";

export default function SettlementChartSection() {
  return (
    <div className={styles.settlement_chart_section_card}>
      {/* 섹션 제목 */}
      <h2 className={styles.settlement_chart_section_title}>정산 금액 통계</h2>

      {/* 차트 영역 */}
      <div className={styles.settlement_chart_section_chart_container}>
        <AmountChart
          data={settlementChartData}
          gradientId="settlementGradient"
          chartAreaClass="chart_area_settlement"
        />
      </div>
    </div>
  );
}
