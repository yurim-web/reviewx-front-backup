/**
 * CampaignRejectedFilterSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import CampaignRejectedFilterSection from "./CampaignRejectedFilterSection";

const meta: Meta<typeof CampaignRejectedFilterSection> = {
  title: "Manager/GA/Campaign/Rejected/Section/CampaignRejectedFilterSection",
  component: CampaignRejectedFilterSection,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CampaignRejectedFilterSection>;

export const Default: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState("");
    return (
      <CampaignRejectedFilterSection
        search_query={searchQuery}
        on_search_change={setSearchQuery}
      />
    );
  },
};
