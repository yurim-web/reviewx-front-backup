/**
 * CampaignSummarySection 컴포넌트 스토리북
 *
 * GA 관리자 대시보드 캠페인 요약 섹션 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignSummarySection from "./CampaignSummarySection";
import type { StatCardData } from "../StatCard";

const meta: Meta<typeof CampaignSummarySection> = {
  title: "Manager/GA/Dashboard/CampaignSummarySection",
  component: CampaignSummarySection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    stats: {
      description: "통계 카드 데이터 배열",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignSummarySection>;

const mockStats: StatCardData[] = [
  {
    title: "캠페인 모집률",
    value: "75%",
    change: "+5%",
    changeType: "positive",
    progress: 75,
    progressColor: "default",
  },
  {
    title: "달성률",
    value: "95%",
    change: "+10%",
    changeType: "positive",
    progress: 95,
    progressColor: "default",
  },
  {
    title: "반려율",
    value: "12%",
    change: "-3%",
    changeType: "negative",
    progress: 12,
    progressColor: "red",
  },
  {
    title: "신고율",
    value: "5%",
    change: "0%",
    changeType: "neutral",
    progress: 5,
    progressColor: "default",
  },
];

// 기본 요약 섹션
export const Default: Story = {
  render: (args) => React.createElement(CampaignSummarySection, args),
  args: {
    stats: mockStats,
  },
};

// 단일 통계 카드
export const SingleStat: Story = {
  render: (args) => React.createElement(CampaignSummarySection, args),
  args: {
    stats: [mockStats[0]],
  },
};

