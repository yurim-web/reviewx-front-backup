/* ========================================
   결제 요약 섹션 스토리북
   ======================================== */

/**
 * PaymentSummarySection.stories
 *
 * 목적: SA 대시보드 결제 요약 섹션 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import PaymentSummarySection from "./PaymentSummarySection";

const meta: Meta<typeof PaymentSummarySection> = {
  title: "Manager/SA/Dashboard/Section/PaymentSummarySection",
  component: PaymentSummarySection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof PaymentSummarySection>;

export const Default: Story = {
  args: {
    dateRange: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    apiData: null,
  },
};

/** API 데이터 있는 상태 — 6개월 차트 + 결제 통계 */
export const WithData: Story = {
  args: {
    dateRange: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    apiData: {
      totalPaymentAmount: 48500000,
      completedPaymentAmount: 32100000,
      pendingPaymentAmount: 16400000,
      paymentChart: [
        { month: "2025-10", amount: 38200000 },
        { month: "2025-11", amount: 41500000 },
        { month: "2025-12", amount: 45800000 },
        { month: "2026-01", amount: 39600000 },
        { month: "2026-02", amount: 43200000 },
        { month: "2026-03", amount: 48500000 },
      ],
    },
  },
};

/** 데이터 없음 */
export const EmptyChart: Story = {
  args: {
    dateRange: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    apiData: {
      totalPaymentAmount: 0,
      completedPaymentAmount: 0,
      pendingPaymentAmount: 0,
      paymentChart: [],
    },
  },
};
