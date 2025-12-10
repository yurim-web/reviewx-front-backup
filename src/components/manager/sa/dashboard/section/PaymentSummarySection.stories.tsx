/**
 * PaymentSummarySection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import PaymentSummarySection from "./PaymentSummarySection";

const meta: Meta<typeof PaymentSummarySection> = {
  title: "Manager/SA/Dashboard/Section/PaymentSummarySection",
  component: PaymentSummarySection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof PaymentSummarySection>;

export const Default: Story = {
  args: {
    stats: [],
  },
};
