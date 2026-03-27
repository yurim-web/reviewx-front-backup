/**
 * ChartsSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import ChartsSection from "./ChartsSection";

const meta: Meta<typeof ChartsSection> = {
  title: "Manager/GA/Dashboard/ChartsSection",
  component: ChartsSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof ChartsSection>;

export const Default: Story = {
  args: {
    dateRange: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    dashboardData: null,
  },
};

const mockDashboardData = {
  result: "OK" as const,
  generatedAt: "2026-03-27T00:00:00Z",
  campaignSummary: {
    recruitRate: 78.5,
    recruitRateChange: 3.2,
    achieveRate: 65.0,
    achieveRateChange: -1.5,
    rejectRate: 4.2,
    rejectRateChange: 0.8,
    reportRate: 1.1,
    reportRateChange: -0.3,
  },
  campaignStats: {
    total: 320,
    registering: 15,
    recruiting: 48,
    selecting: 22,
    purchasing: 130,
    emergency: 5,
    closed: 95,
    cancelled: 5,
    byType: [
      { type: "purchase", label: "구매형", count: 180 },
      { type: "visit", label: "방문형", count: 72 },
      { type: "delivery", label: "배송형", count: 42 },
      { type: "reporter", label: "리포터형", count: 26 },
    ],
    byCategory: [
      { category: "뷰티/스킨케어", recruitmentRate: 92, achievementRate: 88, averageDuration: 14 },
      { category: "식품/음료", recruitmentRate: 85, achievementRate: 76, averageDuration: 12 },
      { category: "생활/인테리어", recruitmentRate: 74, achievementRate: 68, averageDuration: 18 },
      { category: "패션/잡화", recruitmentRate: 68, achievementRate: 61, averageDuration: 15 },
    ],
  },
  rejectReportStats: { totalRejects: 42, totalReports: 18, rejectTrend: -5, reportTrend: 2 },
  accessStats: {
    totalAccess: 12480,
    totalAccessChange: 8.5,
    inflowCount: 3240,
    inflowChange: 12.0,
    pcRate: 42,
    mobileRate: 48,
    tabletRate: 6,
    appRate: 4,
  },
  memberStats: {
    total: 8420,
    totalChange: 5.2,
    newMembers: 312,
    newMembersChange: 8.1,
    active: 5680,
    activeChange: 3.4,
    dormant: 2740,
    dormantChange: -1.2,
  },
  memberTypeStats: {
    reviewer: { total: 7200, newMembers: 280, active: 4900, dormant: 2300 },
    partner: { total: 1220, newMembers: 32, active: 780, dormant: 440 },
  },
  channelStats: {
    channels: [
      { channelName: "네이버 블로그", memberCount: 3200, percentage: 38 },
      { channelName: "인스타그램", memberCount: 2400, percentage: 28 },
      { channelName: "유튜브", memberCount: 1520, percentage: 18 },
      { channelName: "릴스", memberCount: 860, percentage: 10 },
      { channelName: "쇼츠", memberCount: 520, percentage: 6 },
    ],
  },
};

export const WithData: Story = {
  args: {
    dateRange: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    dashboardData: mockDashboardData,
  },
};
