/**
 * PayoutStatusTag 컴포넌트 스토리북
 *
 * 출금 처리 상태 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import PayoutStatusTag, {
  type PayoutStatus,
} from "@/components/manager/common/tags/PayoutStatusTag";

const meta: Meta<typeof PayoutStatusTag> = {
  title: "Manager/Common/Tags/PayoutStatusTag",
  component: PayoutStatusTag,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    status: {
      description: "출금 처리 상태",
      control: "select",
      options: ["신청", "긴급", "완료", "반려"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof PayoutStatusTag>;

// 신청
export const Request: Story = {
  args: {
    status: "신청",
  },
};

// 긴급
export const Urgent: Story = {
  args: {
    status: "긴급",
  },
};

// 완료
export const Completed: Story = {
  args: {
    status: "완료",
  },
};

// 반려
export const Rejected: Story = {
  args: {
    status: "반려",
  },
};

// 모든 상태 태그 비교
export const AllStatuses: Story = {
  render: () => {
    const statuses: PayoutStatus[] = ["신청", "긴급", "완료", "반려"];

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
        React.createElement(PayoutStatusTag, {
          key: status,
          status,
        })
      )
    );
  },
};
