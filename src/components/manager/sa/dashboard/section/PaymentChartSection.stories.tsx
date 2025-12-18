/**
 * PaymentChartSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import PaymentChartSection from "./PaymentChartSection";

const meta: Meta<typeof PaymentChartSection> = {
  title: "Manager/SA/Dashboard/Section/PaymentChartSection",
  component: PaymentChartSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof PaymentChartSection>;

export const Default: Story = {};
