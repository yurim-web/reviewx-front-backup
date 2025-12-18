/**
 * SettlementSummarySection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import SettlementSummarySection from "./SettlementSummarySection";

const meta: Meta<typeof SettlementSummarySection> = {
  title: "Manager/SA/Dashboard/Section/SettlementSummarySection",
  component: SettlementSummarySection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof SettlementSummarySection>;

export const Default: Story = {
  args: {
    stats: [],
  },
};
