/**
 * WithdrawalStatCardsSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import WithdrawalStatCardsSection from "./WithdrawalStatCardsSection";

const meta: Meta<typeof WithdrawalStatCardsSection> = {
  title: "Manager/SA/Settlement/Withdrawal/Section/WithdrawalStatCardsSection",
  component: WithdrawalStatCardsSection,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof WithdrawalStatCardsSection>;

export const Default: Story = {};
