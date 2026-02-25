/**
 * CampaignSummarySection 컴포넌트 스토리북
 *
 * GA 관리자 대시보드 캠페인 요약 섹션 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignSummarySection from "./CampaignSummarySection";

const meta: Meta<typeof CampaignSummarySection> = {
  title: "Manager/GA/Dashboard/CampaignSummarySection",
  component: CampaignSummarySection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof CampaignSummarySection>;

const mockDateRange = {
  from: new Date("2026-02-01"),
  to: new Date("2026-02-25"),
};

// 기본 요약 섹션
export const Default: Story = {
  render: (args) => React.createElement(CampaignSummarySection, args),
  args: {
    dateRange: mockDateRange,
  },
};
