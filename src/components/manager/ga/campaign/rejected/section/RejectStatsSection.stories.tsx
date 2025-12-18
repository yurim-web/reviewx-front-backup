/**
 * RejectStatsSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import RejectStatsSection from "./RejectStatsSection";

const meta: Meta<typeof RejectStatsSection> = {
  title: "Manager/GA/Campaign/Rejected/Section/RejectStatsSection",
  component: RejectStatsSection,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof RejectStatsSection>;

export const Default: Story = {};
