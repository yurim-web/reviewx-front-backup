/**
 * PostFilterSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import PostFilterSection from "./PostFilterSection";

const meta: Meta<typeof PostFilterSection> = {
  title: "Manager/Common/Community/Posts/Section/PostFilterSection",
  component: PostFilterSection,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PostFilterSection>;

export const Default: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState("");
    return (
      <PostFilterSection
        search_query={searchQuery}
        on_search_change={setSearchQuery}
        selected_divisions={[]}
        on_divisions_change={() => {}}
        selected_targets={[]}
        on_targets_change={() => {}}
        selected_date_range={undefined}
        on_date_range_change={() => {}}
        manager_type="ga"
      />
    );
  },
};
