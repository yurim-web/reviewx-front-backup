/* ========================================
   SA 관리자 대시보드 메인 페이지
   ======================================== */

/**
 * ManagerSAPage
 *
 * 목적: 최고관리자의 대시보드로, 정산·결제·회원 통계를 한눈에 볼 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa (최고관리자 대시보드)
 */

"use client";

import layoutStyles from "@/styles/manager_sa/layout/sa_layout.module.css";
import DateFilterSection from "@/components/manager/ga/dashboard/section/DateFilterSection";
import SettlementSummarySection from "@/components/manager/sa/dashboard/section/SettlementSummarySection";
import PaymentSummarySection from "@/components/manager/sa/dashboard/section/PaymentSummarySection";
import MemberActivationSection from "@/components/manager/sa/dashboard/section/MemberActivationSection";
import MemberTypeSection from "@/components/manager/sa/dashboard/section/MemberTypeSection";
import ChannelMemberSection from "@/components/manager/sa/dashboard/section/ChannelMemberSection";
import { useDashboardDateFilter } from "@/hooks/manager/useDashboardDateFilter";

export default function ManagerSAPage() {
  const { dateFilter, dateRange, handleDateFilterChange, handleDateRangeChange } =
    useDashboardDateFilter("month");

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        <div className={layoutStyles.page_header}>
          <h1 className={layoutStyles.page_title}>대시보드</h1>

          <DateFilterSection
            dateFilter={dateFilter}
            onFilterChange={handleDateFilterChange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>

        <div className={layoutStyles.summary_row}>
          <SettlementSummarySection dateRange={dateRange} />
          <PaymentSummarySection dateRange={dateRange} />
        </div>

        <div className={layoutStyles.member_stats_row}>
          <MemberActivationSection dateRange={dateRange} />
          <MemberTypeSection dateRange={dateRange} />
          <ChannelMemberSection />
        </div>
      </div>
    </div>
  );
}
