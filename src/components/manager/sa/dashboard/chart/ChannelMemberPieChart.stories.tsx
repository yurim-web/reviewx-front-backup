/**
 * ChannelMemberPieChart 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import ChannelMemberPieChart from "./ChannelMemberPieChart";

const meta: Meta<typeof ChannelMemberPieChart> = {
  title: "Manager/SA/Dashboard/Chart/ChannelMemberPieChart",
  component: ChannelMemberPieChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof ChannelMemberPieChart>;

export const Default: Story = {};
