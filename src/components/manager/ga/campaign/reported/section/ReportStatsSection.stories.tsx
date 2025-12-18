/**
 * ReportStatsSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import ReportStatsSection from "./ReportStatsSection";

const meta: Meta<typeof ReportStatsSection> = {
  title: "Manager/GA/Campaign/Reported/Section/ReportStatsSection",
  component: ReportStatsSection,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ReportStatsSection>;

export const Default: Story = {};
