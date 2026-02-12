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
    styles: styles,
    detail_path: "/manager_ga/member/reviewers",
  },
};
