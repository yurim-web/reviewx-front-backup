/**
 * RejectedCampaignTable 컴포넌트 스토리북
 *
 * 반려내역 테이블 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import RejectedCampaignTable from "./RejectedCampaignTable";
import type { RejectCode } from "@/data/manager_ga/rejected";

const meta: Meta<typeof RejectedCampaignTable> = {
  title: "Manager/GA/Campaign/Rejected/RejectedCampaignTable",
  component: RejectedCampaignTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    search_query: {
      description: "검색어",
      control: "text",
    },
    selected_reject_codes: {
      description: "선택된 반려 코드 목록",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof RejectedCampaignTable>;

// 기본 반려내역 테이블
export const Default: Story = {
  render: (args) => React.createElement(RejectedCampaignTable, args),
  args: {
    search_query: "",
    selected_reject_codes: [],
  },
};

// 검색어 포함
export const WithSearchQuery: Story = {
  render: (args) => React.createElement(RejectedCampaignTable, args),
  args: {
    search_query: "샘플",
    selected_reject_codes: [],
  },
};

// 필터 적용
export const WithFilters: Story = {
  render: (args) => React.createElement(RejectedCampaignTable, args),
  args: {
    search_query: "",
    selected_reject_codes: ["RJ001", "RJ002"] as unknown as RejectCode[],
  },
};

// 빈 상태 — 검색 결과 없음
export const Empty: Story = {
  render: (args) => React.createElement(RejectedCampaignTable, args),
  args: {
    search_query: "존재하지않는캠페인명검색어xyz",
    selected_reject_codes: [],
  },
};

// 반려 코드 필터 선택
export const WithRejectCodeFilter: Story = {
  render: (args) => React.createElement(RejectedCampaignTable, args),
  args: {
    search_query: "",
    selected_reject_codes: ["R001", "R002"] as unknown as RejectCode[],
  },
};
