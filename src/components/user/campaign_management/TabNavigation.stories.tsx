/**
 * TabNavigation 컴포넌트 스토리북
 *
 * 상단 탭 네비게이션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import TabNavigation from "./TabNavigation";
import type { MainTab } from "@/types/domain/user";

const meta: Meta<typeof TabNavigation> = {
  title: "User/CampaignManagement/TabNavigation",
  component: TabNavigation,
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
    activeTab: {
      description: "현재 활성화된 탭",
      control: "select",
      options: ["campaign", "point", "account"],
    },
    setActiveTab: {
      description: "탭 변경 핸들러",
      action: "tab changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TabNavigation>;

// 캠페인 탭 활성화
export const CampaignTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<MainTab>("campaign");
    return React.createElement(TabNavigation, {
      ...args,
      activeTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
        console.log("[Storybook] Tab changed to:", tab);
      },
    });
  },
  args: {
    activeTab: "campaign",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
};

// 포인트 탭 활성화
export const PointTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<MainTab>("point");
    return React.createElement(TabNavigation, {
      ...args,
      activeTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
        console.log("[Storybook] Tab changed to:", tab);
      },
    });
  },
  args: {
    activeTab: "point",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
};

// 계정 탭 활성화
export const AccountTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<MainTab>("account");
    return React.createElement(TabNavigation, {
      ...args,
      activeTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
        console.log("[Storybook] Tab changed to:", tab);
      },
    });
  },
  args: {
    activeTab: "account",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<MainTab>(
      args.activeTab || "campaign"
    );
    return React.createElement(TabNavigation, {
      ...args,
      activeTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
        console.log("[Storybook] Tab changed to:", tab);
      },
    });
  },
  args: {
    activeTab: "campaign",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
};

