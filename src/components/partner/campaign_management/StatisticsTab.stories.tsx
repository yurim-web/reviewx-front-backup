/**
 * StatisticsTab 컴포넌트 스토리북 (파트너)
 *
 * 파트너 캠페인 관리 통계 탭 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import StatisticsTab from "./StatisticsTab";
import type { PartnerStatTab } from "@/types/partner/partner";

const mockStats = {
  전체: 10,
  진행중: 5,
  모집중: 3,
  모집완료: 2,
  마감: 0,
};

const meta: Meta<typeof StatisticsTab> = {
  title: "Partner/CampaignManagement/StatisticsTab",
  component: StatisticsTab,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/partner/campaign_management",
      },
    },
  },
  argTypes: {
    activeTab: {
      description: "현재 활성화된 통계 탭",
      control: "select",
      options: ["전체", "진행중", "모집중", "모집완료", "마감"],
    },
    stats: {
      description: "캠페인 통계 데이터",
      control: "object",
    },
    setActiveTab: {
      description: "통계 탭 변경 핸들러",
      action: "stat tab changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatisticsTab>;

// 전체 탭 활성화
export const AllTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<PartnerStatTab>("전체");
    return React.createElement(StatisticsTab, {
      ...args,
      activeTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
        console.log("[Storybook] Stat tab changed to:", tab);
      },
    });
  },
  args: {
    activeTab: "전체",
    stats: mockStats,
    setActiveTab: (tab) => console.log("Stat tab changed to:", tab),
  },
};

// 진행중 탭 활성화
export const OngoingTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<PartnerStatTab>("진행중");
    return React.createElement(StatisticsTab, {
      ...args,
      activeTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
        console.log("[Storybook] Stat tab changed to:", tab);
      },
    });
  },
  args: {
    activeTab: "진행중",
    stats: mockStats,
    setActiveTab: (tab) => console.log("Stat tab changed to:", tab),
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<PartnerStatTab>(
      args.activeTab || "전체"
    );
    return React.createElement(StatisticsTab, {
      ...args,
      activeTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
        console.log("[Storybook] Stat tab changed to:", tab);
      },
    });
  },
  args: {
    activeTab: "전체",
    stats: mockStats,
    setActiveTab: (tab) => console.log("Stat tab changed to:", tab),
  },
};

