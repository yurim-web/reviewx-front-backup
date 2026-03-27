/**
 * ChannelMemberPieChart 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import ChannelMemberPieChart from "./ChannelMemberPieChart";

const meta: Meta<typeof ChannelMemberPieChart> = {
  title: "Manager/GA/Dashboard/Chart/ChannelMemberPieChart",
  component: ChannelMemberPieChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ChannelMemberPieChart>;

export const Default: Story = {
  render: () => <ChannelMemberPieChart channelData={[]} />,
};

export const WithData: Story = {
  render: () => (
    <ChannelMemberPieChart
      channelData={[
        { name: "네이버 블로그", value: 38, count: 3200 },
        { name: "인스타그램", value: 28, count: 2400 },
        { name: "유튜브", value: 18, count: 1520 },
        { name: "릴스", value: 10, count: 860 },
        { name: "쇼츠", value: 6, count: 520 },
      ]}
    />
  ),
};

export const BlogDominant: Story = {
  render: () => (
    <ChannelMemberPieChart
      channelData={[
        { name: "네이버 블로그", value: 75, count: 7500 },
        { name: "인스타그램", value: 15, count: 1500 },
        { name: "유튜브", value: 10, count: 1000 },
      ]}
    />
  ),
};
