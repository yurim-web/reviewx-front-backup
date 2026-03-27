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

export const Default: Story = {
  args: {
    channelData: [
      { name: "블로그", value: 45, count: 1350 },
      { name: "인스타그램", value: 25, count: 750 },
      { name: "유튜브", value: 20, count: 600 },
      { name: "네이버클립", value: 10, count: 300 },
    ],
  },
};

export const BlogDominant: Story = {
  args: {
    channelData: [
      { name: "블로그", value: 72, count: 5040 },
      { name: "인스타그램", value: 18, count: 1260 },
      { name: "유튜브", value: 10, count: 700 },
    ],
  },
};

export const EqualDistribution: Story = {
  args: {
    channelData: [
      { name: "블로그", value: 25, count: 750 },
      { name: "인스타그램", value: 25, count: 750 },
      { name: "유튜브", value: 25, count: 750 },
      { name: "릴스", value: 25, count: 750 },
    ],
  },
};
