/**
 * SettlementChartSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import SettlementChartSection from "./SettlementChartSection";

const meta: Meta<typeof SettlementChartSection> = {
  title: "Manager/SA/Dashboard/Section/SettlementChartSection",
  component: SettlementChartSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof SettlementChartSection>;

export const Default: Story = {};
