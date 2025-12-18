/**
 * MemberStatsSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberStatsSection from "./MemberStatsSection";

const meta: Meta<typeof MemberStatsSection> = {
  title: "Manager/GA/Dashboard/MemberStatsSection",
  component: MemberStatsSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof MemberStatsSection>;

export const Default: Story = {};
