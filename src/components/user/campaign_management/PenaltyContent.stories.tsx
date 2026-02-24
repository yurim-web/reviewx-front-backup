/* ========================================
   PenaltyContent 스토리북
   ======================================== */

/**
 * PenaltyContent.stories
 *
 * 목적: 패널티 내역 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/CampaignManagement/PenaltyContent)
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

