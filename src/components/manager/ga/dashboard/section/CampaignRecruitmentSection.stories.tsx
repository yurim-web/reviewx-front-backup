/**
 * CampaignRecruitmentSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import CampaignRecruitmentSection from "./CampaignRecruitmentSection";
import type { AdminDashboardResponse } from "@/types/api/admin";

const meta: Meta<typeof CampaignRecruitmentSection> = {
  title: "Manager/GA/Dashboard/Section/CampaignRecruitmentSection",
  component: CampaignRecruitmentSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof CampaignRecruitmentSection>;

const baseDashboard: AdminDashboardResponse = {
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
      { type: "purchase", label: "구매형", count: 30 },
      { type: "mission", label: "미션형", count: 22 },
    ],
    byCategory: [
      { category: "뷰티", recruitmentRate: 78, achievementRate: 88, averageDuration: 14 },
      { category: "푸드", recruitmentRate: 65, achievementRate: 82, averageDuration: 12 },
      { category: "패션", recruitmentRate: 70, achievementRate: 79, averageDuration: 10 },
      { category: "생활", recruitmentRate: 58, achievementRate: 74, averageDuration: 16 },
    ],
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
  channelStats: { channels: [{ channelName: "blog", memberCount: 1820, percentage: 46 }] },
};

/** 빈 상태 (mock 기본 데이터로 렌더) */
export const Default: Story = {
  args: { dashboardData: null },
};

/** API 데이터 있는 상태 — 카테고리별 모집률/달성률 차트 표시 */
export const WithData: Story = {
  args: { dashboardData: baseDashboard },
};
