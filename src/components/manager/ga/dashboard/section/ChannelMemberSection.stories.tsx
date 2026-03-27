/**
 * ChannelMemberSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import ChannelMemberSection from "./ChannelMemberSection";
import type { AdminDashboardResponse } from "@/types/api/admin";

const meta: Meta<typeof ChannelMemberSection> = {
  title: "Manager/GA/Dashboard/Section/ChannelMemberSection",
  component: ChannelMemberSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof ChannelMemberSection>;

const makeBase = (
  channels: AdminDashboardResponse["channelStats"]["channels"]
): AdminDashboardResponse => ({
  result: "OK",
  generatedAt: "2026-03-27T00:00:00Z",
  campaignSummary: {
    recruitRate: 72,
    recruitRateChange: 3.2,
    achieveRate: 85,
    achieveRateChange: 1.5,
    rejectRate: 4.2,
    rejectRateChange: -0.8,
    reportRate: 1.1,
    reportRateChange: 0.2,
  },
  campaignStats: {
    total: 142,
    registering: 12,
    recruiting: 38,
    selecting: 22,
    purchasing: 45,
    emergency: 5,
    closed: 18,
    cancelled: 2,
    byType: [],
    byCategory: [],
  },
  rejectReportStats: { totalRejects: 18, totalReports: 7, rejectTrend: -2, reportTrend: 1 },
  accessStats: {
    totalAccess: 25840,
    totalAccessChange: 8.3,
    inflowCount: 4210,
    inflowChange: 5.1,
    pcRate: 42,
    mobileRate: 51,
    tabletRate: 4,
    appRate: 3,
  },
  memberStats: {
    total: 4820,
    totalChange: 3.5,
    newMembers: 142,
    newMembersChange: 12.4,
    active: 3210,
    activeChange: 2.8,
    dormant: 1610,
    dormantChange: -1.2,
  },
  memberTypeStats: {
    reviewer: { total: 3950, newMembers: 118, active: 2740, dormant: 1210 },
    partner: { total: 870, newMembers: 24, active: 470, dormant: 400 },
  },
  channelStats: { channels },
});

/** 빈 상태 (mock 기본 데이터로 렌더) */
export const Default: Story = {
  args: { dashboardData: null },
};

/** 균형 잡힌 채널 분포 */
export const WithData: Story = {
  args: {
    dashboardData: makeBase([
      { channelName: "blog", memberCount: 1820, percentage: 46 },
      { channelName: "instagram", memberCount: 980, percentage: 25 },
      { channelName: "youtube", memberCount: 780, percentage: 20 },
      { channelName: "clip", memberCount: 370, percentage: 9 },
    ]),
  },
};

/** 블로그 집중 분포 */
export const BlogDominant: Story = {
  args: {
    dashboardData: makeBase([
      { channelName: "blog", memberCount: 3200, percentage: 72 },
      { channelName: "instagram", memberCount: 620, percentage: 14 },
      { channelName: "youtube", memberCount: 480, percentage: 11 },
      { channelName: "clip", memberCount: 130, percentage: 3 },
    ]),
  },
};
