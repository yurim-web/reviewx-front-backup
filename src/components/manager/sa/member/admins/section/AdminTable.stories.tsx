/**
 * AdminTable 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import AdminTable from "./AdminTable";

const meta: Meta<typeof AdminTable> = {
  title: "Manager/SA/Member/Admins/Section/AdminTable",
  component: AdminTable,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AdminTable>;

export const Default: Story = {
  args: {
    search_query: "",
  },
};

export const WithSearch: Story = {
  args: {
    search_query: "김관리",
  },
};

export const WithLongQuery: Story = {
  args: {
    search_query: "010",
  },
};
