/**
 * CampaignTypeTag 컴포넌트 스토리북
 *
 * 캠페인 타입 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignTypeTag, {
  type CampaignType,
} from "@/components/manager/common/tags/CampaignTypeTag";

const meta: Meta<typeof CampaignTypeTag> = {
  title: "Manager/Common/Tags/CampaignTypeTag",
  component: CampaignTypeTag,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    type: {
      description: "캠페인 타입",
      control: "select",
      options: ["배송형", "방문형", "구매평", "기자단", "미션형"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignTypeTag>;

// 배송형
export const Delivery: Story = {
  args: {
    type: "배송형",
  },
};

// 방문형
export const Visit: Story = {
  args: {
    type: "방문형",
  },
};

// 구매평
export const Review: Story = {
  args: {
    type: "구매평",
  },
};

// 기자단
export const Reporter: Story = {
  args: {
    type: "기자단",
  },
};

// 미션형
export const Mission: Story = {
  args: {
    type: "미션형",
  },
};

// 모든 타입 태그 비교
export const AllTypes: Story = {
  render: () => {
    const types: CampaignType[] = ["배송형", "방문형", "구매평", "기자단", "미션형"];

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
      ...types.map((type) =>
        React.createElement(CampaignTypeTag, {
          key: type,
          type,
        })
      )
    );
  },
};
