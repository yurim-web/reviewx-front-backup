/**
 * SA MemberActivationSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberActivationSection from "./MemberActivationSection";
import type { SAMemberActivation } from "@/types/api/admin";

const dateRange = { from: new Date("2026-03-01"), to: new Date("2026-03-27") };

const meta: Meta<typeof MemberActivationSection> = {
  title: "Manager/SA/Dashboard/Section/MemberActivationSection",
  component: MemberActivationSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof MemberActivationSection>;

/** 빈 상태 (mock 데이터로 렌더) */
export const Default: Story = {
  args: { dateRange, apiData: null },
};

/** 높은 활성화율 */
export const WithData: Story = {
  args: {
    dateRange,
    apiData: {
      totalMembers: 12580,
      activeMembers: 8234,
      inactiveMembers: 4346,
      activePercentage: 65,
      totalMembersChange: { percentage: 12, type: "positive" },
    } satisfies SAMemberActivation,
  },
};

/** 낮은 활성화율 */
export const LowActivity: Story = {
  args: {
    dateRange,
    apiData: {
      totalMembers: 3200,
      activeMembers: 480,
      inactiveMembers: 2720,
      activePercentage: 15,
      totalMembersChange: { percentage: 3, type: "negative" },
    } satisfies SAMemberActivation,
  },
};

/** 증감 없음 */
export const NeutralChange: Story = {
  args: {
    dateRange,
    apiData: {
      totalMembers: 5000,
      activeMembers: 2500,
      inactiveMembers: 2500,
      activePercentage: 50,
      totalMembersChange: { percentage: 0, type: "neutral" },
    } satisfies SAMemberActivation,
  },
};
