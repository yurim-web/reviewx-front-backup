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

export const Default: Story = { args: {} };

/** 날짜 범위 필터 적용 */
export const WithDateFilter: Story = {
  args: {
    search_query: "",
    selected_date_range: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    selected_payment_statuses: [],
    selected_member_types: [],
    selected_normal_statuses: [],
  },
};

/** 긴급 지급 필터 */
export const FilteredByUrgent: Story = {
  args: {
    selected_payment_statuses: ["urgent"] as never,
    selected_member_types: [],
    selected_normal_statuses: [],
  },
};

/** 완료된 출금만 */
export const FilteredByCompleted: Story = {
  args: {
    selected_date_range: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    selected_payment_statuses: ["completed"] as never,
    selected_member_types: [],
    selected_normal_statuses: [],
  },
};
