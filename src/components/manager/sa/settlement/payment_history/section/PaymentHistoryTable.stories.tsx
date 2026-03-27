/**
 * PaymentHistoryTable 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import PaymentHistoryTable from "./PaymentHistoryTable";

const meta: Meta<typeof PaymentHistoryTable> = {
  title: "Manager/SA/Settlement/PaymentHistory/Section/PaymentHistoryTable",
  component: PaymentHistoryTable,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PaymentHistoryTable>;

export const Default: Story = { args: {} };

/** 날짜 범위 필터 적용 */
export const WithDateFilter: Story = {
  args: {
    search_query: "",
    selected_date_range: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    selected_business_types: [],
    selected_payment_methods: [],
    selected_tax_invoice_types: [],
    selected_payment_statuses: [],
    selected_member_types: [],
    selected_account_statuses: [],
  },
};

/** 무통장 입금 완료 필터 */
export const FilteredByDeposit: Story = {
  args: {
    search_query: "",
    selected_date_range: { from: new Date("2026-03-01"), to: new Date("2026-03-27") },
    selected_business_types: [],
    selected_payment_methods: ["무통장 입금"] as never,
    selected_tax_invoice_types: [],
    selected_payment_statuses: ["완료"] as never,
    selected_member_types: [],
    selected_account_statuses: [],
  },
};

/** 이름/회사명 검색 */
export const SearchByName: Story = {
  args: {
    search_query: "주식회사",
    selected_date_range: undefined,
    selected_business_types: [],
    selected_payment_methods: [],
    selected_tax_invoice_types: [],
    selected_payment_statuses: [],
    selected_member_types: [],
    selected_account_statuses: [],
  },
};
