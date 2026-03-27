/**
 * SA ChannelMemberSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import ChannelMemberSection from "./ChannelMemberSection";
import type { SAChannelMember } from "@/types/api/admin";

const meta: Meta<typeof ChannelMemberSection> = {
  title: "Manager/SA/Dashboard/Section/ChannelMemberSection",
  component: ChannelMemberSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof ChannelMemberSection>;

/** 빈 상태 (mock 데이터로 렌더) */
export const Default: Story = {
  args: {},
};

/** 균형 잡힌 채널 분포 */
export const WithData: Story = {
  args: {
    apiData: {
      blog: { count: 4820, percentage: 38 },
      instagram: { count: 3650, percentage: 29 },
      clip: { count: 2310, percentage: 18 },
      youtube: { count: 1890, percentage: 15 },
    } satisfies SAChannelMember,
  },
};

/** 블로그 집중 분포 */
export const BlogDominant: Story = {
  args: {
    apiData: {
      blog: { count: 8200, percentage: 72 },
      instagram: { count: 1580, percentage: 14 },
      youtube: { count: 1230, percentage: 11 },
      clip: { count: 340, percentage: 3 },
    } satisfies SAChannelMember,
  },
};

/** 균등 분포 */
export const EqualDistribution: Story = {
  args: {
    apiData: {
      blog: { count: 2500, percentage: 25 },
      instagram: { count: 2500, percentage: 25 },
      clip: { count: 2500, percentage: 25 },
      youtube: { count: 2500, percentage: 25 },
    } satisfies SAChannelMember,
  },
};
