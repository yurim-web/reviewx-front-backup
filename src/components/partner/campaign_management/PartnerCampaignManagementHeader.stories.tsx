/**
 * PartnerCampaignManagementHeader 컴포넌트 스토리북
 *
 * 파트너 캠페인 관리 공통 헤더 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import PartnerCampaignManagementHeader from "./PartnerCampaignManagementHeader";
import type { PartnerMainTab, PartnerStatTab } from "@/types/domain/partner";

const meta: Meta<typeof PartnerCampaignManagementHeader> = {
  title: "Partner/CampaignManagement/PartnerCampaignManagementHeader",
  component: PartnerCampaignManagementHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/partner/campaign_management",
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
      options: ["전체", "예정", "신청", "진행", "종료", "취소", "패널티"],
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

type Story = StoryObj<typeof PartnerCampaignManagementHeader>;

// 전체 탭 활성화
export const AllStatTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<PartnerMainTab>("campaign");
    const [activeStatTab, setActiveStatTab] = useState<PartnerStatTab>("전체");
    return React.createElement(PartnerCampaignManagementHeader, {
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
    activeStatTab: "전체",
    setActiveTab: (tab) => console.log("Main tab changed to:", tab),
    setActiveStatTab: (tab) => console.log("Stat tab changed to:", tab),
  },
};

// 진행 탭 활성화
export const ProgressStatTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<PartnerMainTab>("campaign");
    const [activeStatTab, setActiveStatTab] = useState<PartnerStatTab>("진행");
    return React.createElement(PartnerCampaignManagementHeader, {
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
    activeStatTab: "진행",
    setActiveTab: (tab) => console.log("Main tab changed to:", tab),
    setActiveStatTab: (tab) => console.log("Stat tab changed to:", tab),
  },
};

