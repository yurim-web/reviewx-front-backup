/**
 * RejectStatsSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import RejectStatsSection from "./RejectStatsSection";

const meta: Meta<typeof RejectStatsSection> = {
  title: "Manager/GA/Campaign/Rejected/Section/RejectStatsSection",
  component: RejectStatsSection,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof RejectStatsSection>;

export const Default: Story = {
  args: {
    search_query: "",
    selected_reject_codes: [],
    selected_date_range: undefined,
  },
};

export const WithCodeFilter: Story = {
  args: {
    search_query: "",
    selected_reject_codes: ["R001", "R002"],
    selected_date_range: undefined,
  },
};

export const WithDateRange: Story = {
  args: {
    search_query: "",
    selected_reject_codes: [],
    selected_date_range: {
      from: new Date("2026-03-01"),
      to: new Date("2026-03-27"),
    },
  },
};

export const WithSearchAndFilter: Story = {
  args: {
    search_query: "스킨케어",
    selected_reject_codes: ["R003"],
    selected_date_range: {
      from: new Date("2026-03-01"),
      to: new Date("2026-03-27"),
    },
  },
};
