/**
 * CampaignStatusTag 컴포넌트 스토리북
 *
 * 캠페인 상태 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignStatusTag, {
  type CampaignStatus,
} from "@/components/manager/common/tags/CampaignStatusTag";

const meta: Meta<typeof CampaignStatusTag> = {
  title: "Manager/Common/Tags/CampaignStatusTag",
  component: CampaignStatusTag,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    status: {
      description: "캠페인 상태",
      control: "select",
      options: ["예정", "신청", "진행", "종료", "취소", "긴급"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignStatusTag>;

// 예정
export const Scheduled: Story = {
  args: {
    status: "예정",
  },
};

// 신청
export const Applied: Story = {
  args: {
    status: "신청",
  },
};

// 진행
export const Progress: Story = {
  args: {
    status: "진행",
  },
};

// 종료
export const Ended: Story = {
  args: {
    status: "종료",
  },
};

// 취소
export const Cancelled: Story = {
  args: {
    status: "취소",
  },
};

// 긴급
export const Urgent: Story = {
  args: {
    status: "긴급",
  },
};

// 모든 상태 태그 비교
export const AllStatuses: Story = {
  render: () => {
    const statuses: CampaignStatus[] = ["예정", "신청", "진행", "종료", "취소", "긴급"];

    return React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          padding: "20px",
        },
      },
      ...statuses.map((status) =>
        React.createElement(CampaignStatusTag, {
          key: status,
          status,
        })
      )
    );
  },
};
