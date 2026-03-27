/**
 * ReviewerTable 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import ReviewerTable from "./ReviewerTable";
import styles from "@/styles/manager/common/member/reviewers/reviewer_table.module.css";

const meta: Meta<typeof ReviewerTable> = {
  title: "Manager/Common/Member/Table/ReviewerTable",
  component: ReviewerTable,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ReviewerTable>;

export const Default: Story = {
  args: {
    search_query: "",

    styles: styles as any,
    detail_path: "/manager_ga/member/reviewers",
  },
};

// 검색어 있는 상태
export const WithSearchQuery: Story = {
  args: {
    search_query: "홍길동",
    styles: styles as any,
    detail_path: "/manager_ga/member/reviewers",
  },
};

// SA 관리자 경로
export const SAAdmin: Story = {
  args: {
    search_query: "",
    styles: styles as any,
    detail_path: "/manager_sa/member/reviewers",
  },
};
