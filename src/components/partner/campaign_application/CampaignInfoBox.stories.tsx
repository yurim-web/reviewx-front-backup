/**
 * CampaignInfoBox (Campaignbanner) 컴포넌트 스토리북
 *
 * 캠페인 신청 내역 배너 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Campaignbanner from "./CampaignInfoBox";
import type { CampaignInfo } from "./CampaignInfoBox";

const mockCampaignInfo: CampaignInfo = {
  id: "1",
  title: "샘플 캠페인 제목",
  image: "/images/main/main_banner.png",
  status: "모집 중",
  campaignType: "배송형",
  category: "뷰티",
  brandName: "쿠팡",
  recruitmentPeriod: "2024-01-15 ~ 2024-01-30",
  announcementDate: "2024-02-05",
  registrationPeriod: "2024-02-10 ~ 2024-02-25",
  recruitedCount: 25,
  totalCount: 50,
  daysLeft: 5,
  statusText: "모집 중인 캠페인입니다.",
};

const meta: Meta<typeof Campaignbanner> = {
  title: "Partner/CampaignApplication/CampaignInfoBox",
  component: Campaignbanner,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    campaignInfo: {
      description: "캠페인 정보 객체",
      control: "object",
    },
    reviewingCount: {
      description: "콘텐츠 확인 요청 건수",
      control: "number",
    },
    completedCount: {
      description: "콘텐츠 확인 완료 건수",
      control: "number",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Campaignbanner>;

// 기본 캠페인 정보
export const Default: Story = {
  render: (args) => React.createElement(Campaignbanner, args),
  args: {
    campaignInfo: mockCampaignInfo,
  },
};

// 진행 중 상태 (reviewingCount, completedCount 포함)
export const InProgress: Story = {
  render: (args) => React.createElement(Campaignbanner, args),
  args: {
    campaignInfo: {
      ...mockCampaignInfo,
      status: "등록 중",
    },
    reviewingCount: 10,
    completedCount: 15,
  },
};

// 구매평 캠페인 (구매 기간 포함)
export const ReviewType: Story = {
  render: (args) => React.createElement(Campaignbanner, args),
  args: {
    campaignInfo: {
      ...mockCampaignInfo,
      campaignType: "구매평",
      purchasePeriod: "2024-01-15 ~ 2024-01-30",
    },
  },
};

