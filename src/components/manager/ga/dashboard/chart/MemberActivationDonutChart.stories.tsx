/**
 * MemberActivationDonutChart 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberActivationDonutChart from "./MemberActivationDonutChart";

const meta: Meta<typeof MemberActivationDonutChart> = {
  title: "Manager/GA/Dashboard/Chart/MemberActivationDonutChart",
  component: MemberActivationDonutChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof MemberActivationDonutChart>;

export const Default: Story = {
  render: () => <MemberActivationDonutChart activePercentage={75} />,
};
