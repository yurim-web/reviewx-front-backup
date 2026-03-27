/**
 * MemberTypeSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberTypeSection from "./MemberTypeSection";
import type { AdminDashboardResponse } from "@/types/api/admin";

const meta: Meta<typeof MemberTypeSection> = {
  title: "Manager/GA/Dashboard/Section/MemberTypeSection",
  component: MemberTypeSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof MemberTypeSection>;

const mockDashboardData: AdminDashboardResponse = {
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
    byType: [
      { type: "delivery", label: "배송형", count: 52 },
      { type: "visit", label: "방문형", count: 38 },
    ],
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
  channelStats: {
    channels: [
      { channelName: "blog", memberCount: 1820, percentage: 46 },
      { channelName: "instagram", memberCount: 980, percentage: 25 },
      { channelName: "youtube", memberCount: 780, percentage: 20 },
      { channelName: "clip", memberCount: 370, percentage: 9 },
    ],
  },
};

/** 빈 상태 (mock 데이터로 렌더) */
export const Default: Story = {
  args: {
    dateRange: {
      from: new Date("2026-03-01"),
      to: new Date("2026-03-27"),
    },
    dashboardData: null,
  },
};

/** API 데이터 있는 상태 — 리뷰어/파트너 비율 명확히 표시 */
export const WithData: Story = {
  args: {
    dateRange: {
      from: new Date("2026-03-01"),
      to: new Date("2026-03-27"),
    },
    dashboardData: mockDashboardData,
  },
};
