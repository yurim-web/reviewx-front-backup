/**
 * DateFilterSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DateFilterSection, { type DateFilter } from "./DateFilterSection";

const meta: Meta<typeof DateFilterSection> = {
  title: "Manager/GA/Dashboard/Section/DateFilterSection",
  component: DateFilterSection,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DateFilterSection>;

export const Default: Story = {
  render: () => {
    const [dateFilter, setDateFilter] = useState<DateFilter>("today");
    return <DateFilterSection dateFilter={dateFilter} onFilterChange={setDateFilter} />;
  },
};

export const Weekly: Story = {
  render: () => {
    const [dateFilter, setDateFilter] = useState<DateFilter>("week");
    return <DateFilterSection dateFilter={dateFilter} onFilterChange={setDateFilter} />;
  },
};

export const Monthly: Story = {
  render: () => {
    const [dateFilter, setDateFilter] = useState<DateFilter>("month");
    return <DateFilterSection dateFilter={dateFilter} onFilterChange={setDateFilter} />;
  },
};

export const AllOptions: Story = {
  render: () => {
    const [dateFilter, setDateFilter] = useState<DateFilter>("today");
    return <DateFilterSection dateFilter={dateFilter} onFilterChange={setDateFilter} />;
  },
};
