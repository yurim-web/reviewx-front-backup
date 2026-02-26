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
    dateRange: {
      from: new Date("2024-01-01"),
      to: new Date("2024-12-31"),
    },
  },
};
