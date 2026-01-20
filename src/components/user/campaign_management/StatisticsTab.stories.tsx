/**
 * StatisticsTab 컴포넌트 스토리북
 *
 * 통계 탭 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import StatisticsTab from "./StatisticsTab";
import type { CampaignStats, StatTab } from "@/types/domain/user";

const mockStats: CampaignStats = {
  신청: 5,
  선정: 12,
  완료: 28,
  "취소/반려": 3,
};

const meta: Meta<typeof StatisticsTab> = {
  title: "User/CampaignManagement/StatisticsTab",
  component: StatisticsTab,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/user/campaign_management",
      },
    },
  },
  argTypes: {
    activeStatTab: {
      description: "현재 활성화된 통계 탭",
      control: "select",
      options: ["신청", "선정", "완료", "취소/반려", "패널티"],
    },
    stats: {
      description: "캠페인 통계 데이터",
      control: "object",
    },
    setActiveStatTab: {
      description: "통계 탭 변경 핸들러",
      action: "stat tab changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatisticsTab>;

// 신청 탭 활성화
export const AppliedTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<StatTab>("신청");
    return React.createElement(StatisticsTab, {
      ...args,
      activeStatTab: activeTab,
      setActiveStatTab: (tab) => {
        setActiveTab(tab);
        args.setActiveStatTab?.(tab);
        console.log("[Storybook] Stat tab changed to:", tab);
      },
    });
  },
  args: {
    activeStatTab: "신청",
    stats: mockStats,
    setActiveStatTab: (tab) => console.log("Stat tab changed to:", tab),
  },
};

// 선정 탭 활성화
export const SelectedTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<StatTab>("선정");
    return React.createElement(StatisticsTab, {
      ...args,
      activeStatTab: activeTab,
      setActiveStatTab: (tab) => {
        setActiveTab(tab);
        args.setActiveStatTab?.(tab);
        console.log("[Storybook] Stat tab changed to:", tab);
      },
    });
  },
  args: {
    activeStatTab: "선정",
    stats: mockStats,
    setActiveStatTab: (tab) => console.log("Stat tab changed to:", tab),
  },
};

// 완료 탭 활성화
export const CompletedTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<StatTab>("완료");
    return React.createElement(StatisticsTab, {
      ...args,
      activeStatTab: activeTab,
      setActiveStatTab: (tab) => {
        setActiveTab(tab);
        args.setActiveStatTab?.(tab);
        console.log("[Storybook] Stat tab changed to:", tab);
      },
    });
  },
  args: {
    activeStatTab: "완료",
    stats: mockStats,
    setActiveStatTab: (tab) => console.log("Stat tab changed to:", tab),
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<StatTab>(
      args.activeStatTab || "신청"
    );
    return React.createElement(StatisticsTab, {
      ...args,
      activeStatTab: activeTab,
      setActiveStatTab: (tab) => {
        setActiveTab(tab);
        args.setActiveStatTab?.(tab);
        console.log("[Storybook] Stat tab changed to:", tab);
      },
    });
  },
  args: {
    activeStatTab: "신청",
    stats: mockStats,
    setActiveStatTab: (tab) => console.log("Stat tab changed to:", tab),
  },
};

