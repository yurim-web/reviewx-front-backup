/* ========================================
   정산 요약 섹션 스토리북
   ======================================== */

/**
 * SettlementSummarySection.stories
 *
 * 목적: SA 대시보드 정산 요약 섹션 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import SettlementSummarySection from "./SettlementSummarySection";

const meta: Meta<typeof SettlementSummarySection> = {
  title: "Manager/SA/Dashboard/Section/SettlementSummarySection",
  component: SettlementSummarySection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof SettlementSummarySection>;

export const Default: Story = {
  args: {
    dateRange: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    apiData: null,
  },
};

/** API 데이터 있는 상태 — 6개월 차트 + 정산 통계 */
export const WithData: Story = {
  args: {
    dateRange: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    apiData: {
      withdrawalRequestAmount: 8750000,
      withdrawalCompleteAmount: 24300000,
      totalDepositBalance: 156800000,
      settlementChart: [
        { month: "2025-10", amount: 19500000 },
        { month: "2025-11", amount: 21200000 },
        { month: "2025-12", amount: 25800000 },
        { month: "2026-01", amount: 22400000 },
        { month: "2026-02", amount: 23100000 },
        { month: "2026-03", amount: 24300000 },
      ],
    },
  },
};

/** 데이터 없음 */
export const EmptyChart: Story = {
  args: {
    dateRange: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    apiData: {
      withdrawalRequestAmount: 0,
      withdrawalCompleteAmount: 0,
      totalDepositBalance: 0,
      settlementChart: [],
    },
  },
};
