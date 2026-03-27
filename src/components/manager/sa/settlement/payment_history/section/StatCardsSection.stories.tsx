/**
 * StatCardsSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import StatCardsSection from "./StatCardsSection";

const meta: Meta<typeof StatCardsSection> = {
  title: "Manager/SA/Settlement/PaymentHistory/Section/StatCardsSection",
  component: StatCardsSection,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof StatCardsSection>;

export const Default: Story = { args: {} };

/** 날짜 범위 필터 적용 */
export const WithDateFilter: Story = {
  args: {
    selected_date_range: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    selected_business_types: [],
    selected_payment_methods: [],
    selected_tax_invoice_types: [],
    selected_payment_statuses: [],
    selected_member_types: [],
    selected_account_statuses: [],
  },
};

/** 무통장 입금 완료 */
export const FilteredByDeposit: Story = {
  args: {
    selected_date_range: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    selected_business_types: [],
    selected_payment_methods: ["무통장 입금"] as never,
    selected_tax_invoice_types: [],
    selected_payment_statuses: ["완료"] as never,
    selected_member_types: [],
    selected_account_statuses: [],
  },
};

/** 카드 결제 완료 */
export const FilteredByCard: Story = {
  args: {
    selected_date_range: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    selected_business_types: [],
    selected_payment_methods: ["카드 결제"] as never,
    selected_tax_invoice_types: [],
    selected_payment_statuses: ["완료"] as never,
    selected_member_types: [],
    selected_account_statuses: [],
  },
};
