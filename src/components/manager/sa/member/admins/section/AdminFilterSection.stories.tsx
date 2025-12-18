/**
 * AdminFilterSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import AdminFilterSection from "./AdminFilterSection";

const meta: Meta<typeof AdminFilterSection> = {
  title: "Manager/SA/Member/Admins/Section/AdminFilterSection",
  component: AdminFilterSection,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AdminFilterSection>;

export const Default: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState("");
    return (
      <AdminFilterSection
        search_query={searchQuery}
        on_search_change={setSearchQuery}
      />
    );
  },
};
