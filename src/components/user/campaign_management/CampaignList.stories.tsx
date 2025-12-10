/**
 * CampaignList 컴포넌트 스토리북
 *
 * 캠페인 목록 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignList from "./CampaignList";
import type { CampaignApplication, StatTab } from "@/types/user/user";
import { campaignManagementData } from "@/data/user/campaign_management/campaignManagementData";

const meta: Meta<typeof CampaignList> = {
  title: "User/CampaignManagement/CampaignList",
  component: CampaignList,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    campaigns: {
      description: "캠페인 목록",
      control: "object",
    },
    activeStatTab: {
      description: "현재 활성화된 통계 탭",
      control: "select",
      options: ["신청", "선정", "완료", "취소/반려", "패널티"],
    },
    onTabChange: {
      description: "탭 변경 핸들러",
      action: "tab changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignList>;

// 신청 탭 캠페인 목록
export const AppliedCampaigns: Story = {
  render: (args) => React.createElement(CampaignList, args),
  args: {
    campaigns: campaignManagementData,
    activeStatTab: "신청",
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
};

// 선정 탭 캠페인 목록
export const SelectedCampaigns: Story = {
  render: (args) => React.createElement(CampaignList, args),
  args: {
    campaigns: campaignManagementData,
    activeStatTab: "선정",
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
};

// 완료 탭 캠페인 목록
export const CompletedCampaigns: Story = {
  render: (args) => React.createElement(CampaignList, args),
  args: {
    campaigns: campaignManagementData,
    activeStatTab: "완료",
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
};

// 빈 목록 상태
export const EmptyList: Story = {
  render: (args) => React.createElement(CampaignList, args),
  args: {
    campaigns: [],
    activeStatTab: "신청",
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
};

