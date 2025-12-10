/**
 * CampaignManagementHeader 컴포넌트 스토리북
 *
 * 캠페인 관리 공통 헤더 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import CampaignManagementHeader from "./CampaignManagementHeader";
import type { MainTab } from "@/types/user/user";
import { campaignManagementStats } from "@/data/user/campaign_management/campaignManagementData";

const meta: Meta<typeof CampaignManagementHeader> = {
  title: "User/CampaignManagement/CampaignManagementHeader",
  component: CampaignManagementHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/user/campaign_management",
      },
    },
  },
  argTypes: {
    activeTab: {
      description: "현재 활성 메인 탭",
      control: "select",
      options: ["campaign", "point", "account"],
    },
    activeStatTab: {
      description: "현재 활성 통계 탭",
      control: "select",
      options: ["신청", "선정", "완료", "취소/반려", "패널티"],
    },
    setActiveTab: {
      description: "메인 탭 변경 핸들러",
      action: "main tab changed",
    },
    setActiveStatTab: {
      description: "통계 탭 변경 핸들러",
      action: "stat tab changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignManagementHeader>;

// 신청 탭 활성화
export const AppliedStatTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<MainTab>("campaign");
    const [activeStatTab, setActiveStatTab] = useState<
      "신청" | "선정" | "완료" | "취소/반려" | "패널티"
    >("신청");
    return React.createElement(CampaignManagementHeader, {
      ...args,
      activeTab,
      activeStatTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
      },
      setActiveStatTab: (tab) => {
        setActiveStatTab(tab);
        args.setActiveStatTab?.(tab);
      },
    });
  },
  args: {
    activeTab: "campaign",
    activeStatTab: "신청",
    setActiveTab: (tab) => console.log("Main tab changed to:", tab),
    setActiveStatTab: (tab) => console.log("Stat tab changed to:", tab),
  },
};

// 선정 탭 활성화
export const SelectedStatTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<MainTab>("campaign");
    const [activeStatTab, setActiveStatTab] = useState<
      "신청" | "선정" | "완료" | "취소/반려" | "패널티"
    >("선정");
    return React.createElement(CampaignManagementHeader, {
      ...args,
      activeTab,
      activeStatTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
      },
      setActiveStatTab: (tab) => {
        setActiveStatTab(tab);
        args.setActiveStatTab?.(tab);
      },
    });
  },
  args: {
    activeTab: "campaign",
    activeStatTab: "선정",
    setActiveTab: (tab) => console.log("Main tab changed to:", tab),
    setActiveStatTab: (tab) => console.log("Stat tab changed to:", tab),
  },
};

