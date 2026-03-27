/**
 * MemberTypeBarChart 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberTypeBarChart from "./MemberTypeBarChart";

const meta: Meta<typeof MemberTypeBarChart> = {
  title: "Manager/GA/Dashboard/Chart/MemberTypeBarChart",
  component: MemberTypeBarChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof MemberTypeBarChart>;

export const Default: Story = {
  render: () => (
    <MemberTypeBarChart
      totalPartnerPercentage={30}
      totalReviewerPercentage={70}
      activePartnerPercentage={40}
      activeReviewerPercentage={60}
    />
  ),
};

export const ReviewerHeavy: Story = {
  render: () => (
    <MemberTypeBarChart
      totalPartnerPercentage={12}
      totalReviewerPercentage={88}
      activePartnerPercentage={18}
      activeReviewerPercentage={82}
    />
  ),
};

export const PartnerHeavy: Story = {
  render: () => (
    <MemberTypeBarChart
      totalPartnerPercentage={55}
      totalReviewerPercentage={45}
      activePartnerPercentage={62}
      activeReviewerPercentage={38}
    />
  ),
};
