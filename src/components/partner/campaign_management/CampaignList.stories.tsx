/**
 * CampaignList 컴포넌트 스토리북 (파트너)
 *
 * 파트너 캠페인 목록 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignList from "./CampaignList";
import type { PartnerCampaign } from "@/types/domain/partner";

const mockCampaigns: PartnerCampaign[] = [
  {
    id: "1",
    title: "샘플 캠페인 1",
    category: "배송형",
    campaignType: "배송형",
    status: "진행 중",
    image: "/images/main/main_banner.png",
    recruitedCount: 25,
    totalCount: 50,
    daysLeft: 5,
    brandName: "테스트 브랜드",
    recruitmentPeriod: "2024-01-01 ~ 2024-01-15",
    announcementDate: "2024-01-20",
    registrationPeriod: "2024-01-25 ~ 2024-02-10",
    applicants: 30,
    recruits: 50,
    selected: 25,
  },
  {
    id: "2",
    title: "샘플 캠페인 2",
    category: "방문형",
    campaignType: "방문형",
    status: "모집 중",
    image: "/images/main/main_banner.png",
    recruitedCount: 15,
    totalCount: 30,
    daysLeft: 2,
    brandName: "테스트 브랜드2",
    recruitmentPeriod: "2024-01-20 ~ 2024-02-05",
    announcementDate: "2024-02-10",
    registrationPeriod: "2024-02-15 ~ 2024-03-01",
    applicants: 20,
    recruits: 30,
    selected: 15,
  },
];

const meta: Meta<typeof CampaignList> = {
  title: "Partner/CampaignManagement/CampaignList",
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
      options: ["전체", "예정", "신청", "진행", "종료", "취소", "패널티"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignList>;

// 전체 탭 캠페인 목록
export const AllCampaigns: Story = {
  render: (args) => React.createElement(CampaignList, args),
  args: {
    campaigns: mockCampaigns,
    activeStatTab: "전체",
  },
};

// 진행중 탭 캠페인 목록
export const OngoingCampaigns: Story = {
  render: (args) => React.createElement(CampaignList, args),
  args: {
    campaigns: mockCampaigns,
    activeStatTab: "진행",
  },
};

// 빈 목록 상태
export const EmptyList: Story = {
  render: (args) => React.createElement(CampaignList, args),
  args: {
    campaigns: [],
    activeStatTab: "전체",
  },
};
