/**
 * CampaignSchedule 컴포넌트 스토리북
 *
 * 캠페인 일정 정보 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignSchedule from "./CampaignSchedule";

const mockScheduleData = {
  recruitedCount: 25,
  totalCount: 50,
  recruitmentPeriod: "2024-01-15 ~ 2024-01-30",
  announcementDate: "2024-02-05",
  registrationPeriod: "2024-02-10 ~ 2024-02-25",
};

const meta: Meta<typeof CampaignSchedule> = {
  title: "Partner/CampaignApplication/CampaignSchedule",
  component: CampaignSchedule,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    scheduleData: {
      description: "캠페인 일정 데이터",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignSchedule>;

// 기본 일정 정보
export const Default: Story = {
  render: (args) => React.createElement(CampaignSchedule, args),
  args: {
    scheduleData: mockScheduleData,
  },
};

// 구매평 캠페인 (구매 기간 포함)
export const WithPurchasePeriod: Story = {
  render: (args) => React.createElement(CampaignSchedule, args),
  args: {
    scheduleData: {
      ...mockScheduleData,
      purchasePeriod: "2024-01-15 ~ 2024-01-30",
    },
  },
};

