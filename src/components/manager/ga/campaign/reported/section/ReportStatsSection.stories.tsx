/**
 * ReportStatsSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import ReportStatsSection from "./ReportStatsSection";

const meta: Meta<typeof ReportStatsSection> = {
  title: "Manager/GA/Campaign/Reported/Section/ReportStatsSection",
  component: ReportStatsSection,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ReportStatsSection>;

export const Default: Story = {
  args: {
    search_query: "",
    selected_report_codes: [],
    selected_date_range: undefined,
  },
};

export const WithCodeFilter: Story = {
  args: {
    search_query: "",
    selected_report_codes: ["W001", "W002"],
    selected_date_range: undefined,
  },
};

export const WithDateRange: Story = {
  args: {
    search_query: "",
    selected_report_codes: [],
    selected_date_range: {
      from: new Date("2026-03-01"),
      to: new Date("2026-03-27"),
    },
  },
};

export const WithSearchAndFilter: Story = {
  args: {
    search_query: "허위광고",
    selected_report_codes: ["W003"],
    selected_date_range: {
      from: new Date("2026-03-01"),
      to: new Date("2026-03-27"),
    },
  },
};
