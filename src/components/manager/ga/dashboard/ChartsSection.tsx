/* ========================================
   
   ======================================== */

/**
 * 차트 섹션 컴포넌트
 *
 * 목적: 캠페인 모집 통계, 반려/신고 통계, 접속 통계를 표시하는 섹션 컴포넌트입니다.
 *
 */

import styles from "@/styles/manager_ga/dashboard/charts.module.css";
import CampaignRecruitmentSection from "./section/CampaignRecruitmentSection";
import RejectionReportSection from "./section/RejectionReportSection";
import AccessStatsSection from "./section/AccessStatsSection";
import type { DateRange } from "./section/DateRangePickerModal";

interface ChartsSectionProps {
  dateRange: DateRange;
}

export default function ChartsSection({ dateRange }: ChartsSectionProps) {
  return (
    <div className={styles.charts_grid_three}>
      {/* 캠페인 모집 통계 섹션 */}
      <CampaignRecruitmentSection />

      {/* 반려/신고 통계 섹션 */}
      <RejectionReportSection dateRange={dateRange} />

      {/* 접속 통계 섹션 */}
      <AccessStatsSection />
    </div>
  );
}
