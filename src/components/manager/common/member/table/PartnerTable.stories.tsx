/**
 * PartnerTable 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import PartnerTable from "./PartnerTable";
import styles from "@/styles/manager/common/member/partners/partner_table.module.css";

const meta: Meta<typeof PartnerTable> = {
  title: "Manager/Common/Member/Table/PartnerTable",
  component: PartnerTable,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PartnerTable>;

export const Default: Story = {
  args: {
    search_query: "",

    styles: styles as any,
    detail_path: "/manager_ga/member/partners",
  },
};

// 검색어 있는 상태
export const WithSearchQuery: Story = {
  args: {
    search_query: "주식회사",
    styles: styles as any,
    detail_path: "/manager_ga/member/partners",
  },
};

// SA 관리자 경로
export const SAAdmin: Story = {
  args: {
    search_query: "",
    styles: styles as any,
    detail_path: "/manager_sa/member/partners",
  },
};
