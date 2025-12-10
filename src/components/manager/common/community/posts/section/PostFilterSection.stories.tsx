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
      />
    );
  },
};
