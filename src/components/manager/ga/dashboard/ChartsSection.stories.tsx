/**
 * ChartsSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import ChartsSection from "./ChartsSection";

const meta: Meta<typeof ChartsSection> = {
  title: "Manager/GA/Dashboard/ChartsSection",
  component: ChartsSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof ChartsSection>;

export const Default: Story = {};
