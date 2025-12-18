/**
 * CampaignCard 컴포넌트 스토리북
 *
 * 캠페인 카드 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignCard from "./CampaignCard";
import type { CampaignApplication } from "@/types/user/user";

const mockCampaign: CampaignApplication = {
  id: "1",
  title: "샘플 캠페인 제목",
  category: "배송형",
  categoryIcon: "/images/brand_logo/coupang.svg",
  type: "배송형",
  status: "applied",
  subStatus: "content_not_registered",
  isUrgent: false,
  remainingDays: 5,
  image: "/images/main/main_banner.png",
};

const meta: Meta<typeof CampaignCard> = {
  title: "User/CampaignManagement/CampaignCard",
  component: CampaignCard,
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
    campaign: {
      description: "캠페인 정보 객체",
      control: "object",
    },
    activeTab: {
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

type Story = StoryObj<typeof CampaignCard>;

// 신청 탭
export const AppliedTab: Story = {
  render: (args) => React.createElement(CampaignCard, args),
  args: {
    campaign: mockCampaign,
    activeTab: "신청",
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
};

// 선정 탭
export const SelectedTab: Story = {
  render: (args) => React.createElement(CampaignCard, args),
  args: {
    campaign: {
      ...mockCampaign,
      status: "selected",
      subStatus: "content_not_registered",
    },
    activeTab: "선정",
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
};

// 완료 탭
export const CompletedTab: Story = {
  render: (args) => React.createElement(CampaignCard, args),
  args: {
    campaign: {
      ...mockCampaign,
      status: "completed",
    },
    activeTab: "완료",
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
};

// 취소/반려 탭
export const CancelledTab: Story = {
  render: (args) => React.createElement(CampaignCard, args),
  args: {
    campaign: {
      ...mockCampaign,
      status: "cancelled",
      subStatus: "content_rejected,re_register",
    },
    activeTab: "취소/반려",
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
};

// 패널티 탭
export const PenaltyTab: Story = {
  render: (args) => React.createElement(CampaignCard, args),
  args: {
    campaign: {
      ...mockCampaign,
      status: "penalty",
    },
    activeTab: "패널티",
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
};

