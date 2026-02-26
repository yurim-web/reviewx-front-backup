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
    dateRange: {
      from: new Date("2024-01-01"),
      to: new Date("2024-12-31"),
    },
  },
};
