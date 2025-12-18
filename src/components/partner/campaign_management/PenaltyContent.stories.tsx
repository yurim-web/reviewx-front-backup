/**
 * PenaltyContent 컴포넌트 스토리북
 *
 * 패널티 내역 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import PenaltyContent from "./PenaltyContent";

const meta: Meta<typeof PenaltyContent> = {
  title: "Partner/CampaignManagement/PenaltyContent",
  component: PenaltyContent,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PenaltyContent>;

/**
 * 기본 상태
 *
 * 패널티 현황과 내역을 표시하는 컴포넌트입니다.
 */
export const Default: Story = {};
