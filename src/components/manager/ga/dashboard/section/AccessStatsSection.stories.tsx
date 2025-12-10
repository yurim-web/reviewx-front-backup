/**
 * AccessStatsSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import AccessStatsSection from "./AccessStatsSection";

const meta: Meta<typeof AccessStatsSection> = {
  title: "Manager/GA/Dashboard/Section/AccessStatsSection",
  component: AccessStatsSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof AccessStatsSection>;

export const Default: Story = {};
