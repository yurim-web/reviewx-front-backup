/**
 * MemberStatsSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberStatsSection from "./MemberStatsSection";

const meta: Meta<typeof MemberStatsSection> = {
  title: "Manager/GA/Dashboard/MemberStatsSection",
  component: MemberStatsSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof MemberStatsSection>;

export const Default: Story = {
  args: {
    dateRange: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    dashboardData: null,
  },
};

export const WithData: Story = {
  args: {
    dateRange: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    dashboardData: {
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
        byType: [{ type: "purchase", label: "구매형", count: 180 }],
        byCategory: [
          { category: "뷰티", recruitmentRate: 92, achievementRate: 88, averageDuration: 14 },
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
    },
  },
};
