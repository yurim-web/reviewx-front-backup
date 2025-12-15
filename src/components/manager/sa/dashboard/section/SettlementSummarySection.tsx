/* ========================================
   💰 정산 요약 섹션 컴포넌트
   ======================================== */

/**
 * 정산 요약 섹션 컴포넌트
 *
 * 목적: 정산 요약 통계와 정산 금액 통계 차트를 한 박스 안에 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 위쪽: 예상 수수료, 카드 결제 총액, 입금 총액, 총 결제 금액 등 통계 표시
 * - 위쪽: 출금 요청 금액, 출금 완료 총액, 총 예치금 잔액 통계 표시
 * - 아래쪽: 정산 금액 통계 차트 표시
 * - 7개의 통계 카드를 그리드로 배치
 *
 */

import styles from "@/styles/manager_sa/dashboard/sections/summary_section.module.css";
import StatCard, { StatCardData } from "../StatCard";
import AmountChart from "../chart/AmountChart";
import { settlementChartData } from "@/data/manager_sa/dashboard/dashboardData";

// title 없는 통계 데이터 타입 (dashboardData에서 사용)
interface SettlementStatData {
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

// SettlementSummarySection 컴포넌트의 props 타입 정의
interface SettlementSummarySectionProps {
  // 정산 통계 데이터 배열 (title 제외)
  stats: SettlementStatData[];
}

// 통계 카드 title 고정값 (순서 중요: stats 배열의 인덱스와 일치해야 함)
const SETTLEMENT_STAT_TITLES: readonly string[] = [
  "출금 요청 금액",
  "출금 완료 총액",
  "총 예치금 잔액",
] as const;

export default function SettlementSummarySection({
  stats,
}: SettlementSummarySectionProps) {
  return (
    <div className={styles.summary_section_container}>
      {/* 섹션 제목 */}
      <h2 className={styles.summary_section_title}>정산 요약</h2>

      {/* 통계 카드 그리드 */}
      <div
        className={`${styles.summary_section_stats_grid} ${styles.summary_section_stats_grid_settlement}`}
      >
        {/* map 함수를 사용하여 통계 카드 배열을 순회하며 렌더링 */}
        {/* title은 컴포넌트 내부에서 고정값으로 추가 */}
        {stats.map((stat, index) => {
          // 고정된 title과 stats 데이터를 결합하여 StatCardData 객체 생성
          const statCardData: StatCardData = {
            title: SETTLEMENT_STAT_TITLES[index],
            value: stat.value,
            change: stat.change,
            changeType: stat.changeType,
          };
          return <StatCard key={index} stat={statCardData} />;
        })}
      </div>

      {/* 정산 금액 통계 차트 제목 */}
      <h2 className={styles.summary_section_chart_title}>정산 금액 통계</h2>

      {/* 차트 영역 */}
      <div className={styles.summary_section_chart_container}>
        <AmountChart
          data={settlementChartData}
          gradientId="settlementGradient"
          chartAreaClass="chart_area_settlement"
        />
      </div>
    </div>
  );
}
