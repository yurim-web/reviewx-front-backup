/**
 * FilterSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import FilterSection from "./FilterSection";

const meta: Meta<typeof FilterSection> = {
  title: "Manager/GA/Campaign/Rejected/Section/FilterSection",
  component: FilterSection,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FilterSection>;

export const Default: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState("");
    return (
      <FilterSection
        search_query={searchQuery}
        on_search_change={setSearchQuery}
      />
    );
  },
};
