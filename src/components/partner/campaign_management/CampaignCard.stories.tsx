/**
 * CampaignCard 컴포넌트 스토리북 (파트너)
 *
 * 파트너 캠페인 카드 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignCard from "./CampaignCard";
import type { PartnerCampaign, PartnerStatTab } from "@/types/partner/partner";

const mockCampaign: PartnerCampaign = {
  id: "1",
  title: "샘플 캠페인 제목",
  category: "배송형",
  categoryIcon: "/images/brand_logo/coupang.svg",
  type: "배송형",
  status: "ongoing",
  subStatus: undefined,
  isUrgent: false,
  remainingDays: 5,
  image: "/images/main/main_banner.png",
  recruitmentCount: 50,
  currentRecruitment: 25,
  startDate: "2024-01-15",
  endDate: "2024-01-30",
};

const meta: Meta<typeof CampaignCard> = {
  title: "Partner/CampaignManagement/CampaignCard",
  component: CampaignCard,
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
    campaign: {
      description: "캠페인 정보 객체",
      control: "object",
    },
    activeTab: {
      description: "현재 활성화된 통계 탭",
      control: "select",
      options: ["전체", "진행중", "모집중", "모집완료", "마감"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignCard>;

// 진행중 탭
export const OngoingTab: Story = {
  render: (args) => React.createElement(CampaignCard, args),
  args: {
    campaign: mockCampaign,
    activeTab: "진행중",
  },
};

// 모집중 탭
export const RecruitingTab: Story = {
  render: (args) => React.createElement(CampaignCard, args),
  args: {
    campaign: {
      ...mockCampaign,
      status: "recruiting",
    },
    activeTab: "모집중",
  },
};

// 모집완료 탭
export const CompletedTab: Story = {
  render: (args) => React.createElement(CampaignCard, args),
  args: {
    campaign: {
      ...mockCampaign,
      status: "completed",
    },
    activeTab: "모집완료",
  },
};

