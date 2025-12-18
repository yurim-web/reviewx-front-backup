/**
 * ReportedCampaignTable 컴포넌트 스토리북
 *
 * 신고내역 테이블 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ReportedCampaignTable from "./ReportedCampaignTable";
import type { ReportCode } from "@/data/manager_ga/reported";

const meta: Meta<typeof ReportedCampaignTable> = {
  title: "Manager/GA/Campaign/Reported/ReportedCampaignTable",
  component: ReportedCampaignTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    search_query: {
      description: "검색어",
      control: "text",
    },
    selected_report_codes: {
      description: "선택된 신고 코드 목록",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReportedCampaignTable>;

// 기본 신고내역 테이블
export const Default: Story = {
  render: (args) => React.createElement(ReportedCampaignTable, args),
  args: {
    search_query: "",
    selected_report_codes: [],
  },
};

// 검색어 포함
export const WithSearchQuery: Story = {
  render: (args) => React.createElement(ReportedCampaignTable, args),
  args: {
    search_query: "샘플",
    selected_report_codes: [],
  },
};

// 필터 적용
export const WithFilters: Story = {
  render: (args) => React.createElement(ReportedCampaignTable, args),
  args: {
    search_query: "",
    selected_report_codes: ["R001", "R002"] as ReportCode[],
  },
};

