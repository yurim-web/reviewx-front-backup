/**
 * CampaignReportedFilterSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import CampaignReportedFilterSection from "./CampaignReportedFilterSection";

const meta: Meta<typeof CampaignReportedFilterSection> = {
  title: "Manager/GA/Campaign/Reported/Section/CampaignReportedFilterSection",
  component: CampaignReportedFilterSection,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CampaignReportedFilterSection>;

export const Default: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState("");
    return (
      <CampaignReportedFilterSection
        search_query={searchQuery}
        on_search_change={setSearchQuery}
      />
    );
  },
};
