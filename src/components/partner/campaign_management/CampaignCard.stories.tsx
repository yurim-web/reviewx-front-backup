/**
 * CampaignCard 컴포넌트 스토리북 (파트너)
 *
 * 파트너 캠페인 카드 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignCard from "./CampaignCard";
import type { PartnerCampaign } from "@/types/domain/partner";

const mockCampaign: PartnerCampaign = {
  id: "1",
  title: "샘플 캠페인 제목",
  category: "배송형",
  campaignType: "배송형",
  status: "진행 중",
  subStatus: undefined,
  image: "/images/main/main_banner.png",
  recruitedCount: 25,
  totalCount: 50,
  daysLeft: 5,
  brandName: "테스트 브랜드",
  recruitmentPeriod: "2024-01-01 ~ 2024-01-15",
  announcementDate: "2024-01-20",
  registrationPeriod: "2024-01-25 ~ 2024-02-10",
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
    activeTab: "진행",
  },
};

// 모집중 탭
export const RecruitingTab: Story = {
  render: (args) => React.createElement(CampaignCard, args),
  args: {
    campaign: {
      ...mockCampaign,
      status: "모집 중",
    },
    activeTab: "신청",
  },
};

// 모집완료 탭
export const CompletedTab: Story = {
  render: (args) => React.createElement(CampaignCard, args),
  args: {
    campaign: {
      ...mockCampaign,
      status: "종료",
    },
    activeTab: "종료",
  },
};
