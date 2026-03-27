/**
 * MemberTypeBarChart 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberTypeBarChart from "./MemberTypeBarChart";

const meta: Meta<typeof MemberTypeBarChart> = {
  title: "Manager/SA/Dashboard/Chart/MemberTypeBarChart",
  component: MemberTypeBarChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof MemberTypeBarChart>;

export const Default: Story = {
  args: {
    totalPartnerPercentage: 42,
    totalReviewerPercentage: 58,
    activePartnerPercentage: 35,
    activeReviewerPercentage: 65,
  },
};

export const ReviewerHeavy: Story = {
  args: {
    totalPartnerPercentage: 15,
    totalReviewerPercentage: 85,
    activePartnerPercentage: 20,
    activeReviewerPercentage: 80,
  },
};

export const PartnerHeavy: Story = {
  args: {
    totalPartnerPercentage: 62,
    totalReviewerPercentage: 38,
    activePartnerPercentage: 58,
    activeReviewerPercentage: 42,
  },
};
