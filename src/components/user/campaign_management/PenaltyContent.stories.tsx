/**
 * PenaltyContent 컴포넌트 스토리북
 *
 * 패널티 내역 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import PenaltyContent from "./PenaltyContent";

const meta: Meta<typeof PenaltyContent> = {
  title: "User/CampaignManagement/PenaltyContent",
  component: PenaltyContent,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof PenaltyContent>;

// 기본 패널티 내역
export const Default: Story = {
  render: () => React.createElement(PenaltyContent),
};

