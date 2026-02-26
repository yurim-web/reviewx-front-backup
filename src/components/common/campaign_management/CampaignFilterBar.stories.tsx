/**
 * CampaignFilterBar 컴포넌트 스토리북
 *
 * 캠페인 관리 필터 바 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */
/* eslint-disable react-hooks/exhaustive-deps */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useMemo, useCallback } from "react";
import CampaignFilterBar from "./CampaignFilterBar";
import type { FilterableCampaign, FilterChangeParams } from "./types";

const meta: Meta<typeof CampaignFilterBar> = {
  title: "Common/CampaignManagement/CampaignFilterBar",
  component: CampaignFilterBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    campaigns: {
      description: "캠페인 배열",
      control: "object",
    },
    onFilterChange: {
      description: "필터 변경 핸들러",
      action: "filter changed",
    },
    onFilteredCampaignsChange: {
      description: "필터링된 캠페인 변경 핸들러",
      action: "filtered campaigns changed",
    },
    activeFilters: {
      description: "활성 필터 상태",
      control: "object",
    },
    typeOptions: {
      description: "유형 옵션 목록",
      control: "object",
    },
    channelOptions: {
      description: "채널 옵션 목록",
      control: "object",
    },
    sortOptions: {
      description: "정렬 옵션 목록",
      control: "object",
    },
    defaultSort: {
      description: "기본 정렬 옵션",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignFilterBar>;

// 목업 캠페인 데이터
const mockCampaigns: FilterableCampaign[] = [
  {
    id: "1",
    title: "샘플 캠페인 1",
    type: "배송형",
    campaignType: "배송형",
    brandName: "브랜드 A",
    brand: "브랜드 A",
    category: "뷰티",
    recruitmentPeriod: "2025-01-01 ~ 2025-01-31",
    recruitedCount: 100,
    daysLeft: 5,
    remainingDays: 5,
  },
  {
    id: "2",
    title: "샘플 캠페인 2",
    type: "방문형",
    campaignType: "방문형",
    brandName: "브랜드 B",
    brand: "브랜드 B",
    category: "패션",
    recruitmentPeriod: "2025-02-01 ~ 2025-02-28",
    recruitedCount: 50,
    daysLeft: 10,
    remainingDays: 10,
  },
  {
    id: "3",
    title: "샘플 캠페인 3",
    type: "구매평",
    campaignType: "구매평",
    brandName: "브랜드 C",
    brand: "브랜드 C",
    category: "식품",
    recruitmentPeriod: "2025-03-01 ~ 2025-03-31",
    recruitedCount: 200,
    daysLeft: 15,
    remainingDays: 15,
  },
];

// 기본 상태
export const Default: Story = {
  render: (args) => {
    const handleFilterChange = useCallback(
      (filters: FilterChangeParams) => {
        args.onFilterChange?.(filters);
      },
      [args.onFilterChange]
    );

    const handleFilteredCampaignsChange = useCallback(
      (filteredCampaigns: FilterableCampaign[]) => {
        args.onFilteredCampaignsChange?.(filteredCampaigns);
      },
      [args.onFilteredCampaignsChange]
    );

    const props = useMemo(
      () => ({
        ...args,
        campaigns: args.campaigns || mockCampaigns,
        onFilterChange: handleFilterChange,
        onFilteredCampaignsChange: handleFilteredCampaignsChange,
      }),
      [args, handleFilterChange, handleFilteredCampaignsChange]
    );

    return React.createElement(CampaignFilterBar, props);
  },
  args: {
    campaigns: mockCampaigns,
    activeFilters: {},
    typeOptions: ["배송형", "방문형", "구매평", "기자단", "미션형"],
    channelOptions: ["네이버 블로그", "클립", "인스타그램", "릴스", "유튜브", "쇼츠"],
    sortOptions: ["최신순", "인기순", "마감임박순"],
    defaultSort: "최신순",
    onFilterChange: (filters) => console.log("Filter changed:", filters),
    onFilteredCampaignsChange: (campaigns) => console.log("Filtered campaigns:", campaigns),
  },
};

// 활성 필터가 있는 상태
export const WithActiveFilters: Story = {
  render: (args) => {
    const handleFilterChange = useCallback(
      (filters: FilterChangeParams) => {
        args.onFilterChange?.(filters);
      },
      [args.onFilterChange]
    );

    const handleFilteredCampaignsChange = useCallback(
      (filteredCampaigns: FilterableCampaign[]) => {
        args.onFilteredCampaignsChange?.(filteredCampaigns);
      },
      [args.onFilteredCampaignsChange]
    );

    const props = useMemo(
      () => ({
        ...args,
        campaigns: args.campaigns || mockCampaigns,
        onFilterChange: handleFilterChange,
        onFilteredCampaignsChange: handleFilteredCampaignsChange,
      }),
      [args, handleFilterChange, handleFilteredCampaignsChange]
    );

    return React.createElement(CampaignFilterBar, props);
  },
  args: {
    campaigns: mockCampaigns,
    activeFilters: {
      types: ["배송형", "방문형"],
      channels: ["네이버 블로그"],
      searchQuery: "",
    },
    typeOptions: ["배송형", "방문형", "구매평", "기자단", "미션형"],
    channelOptions: ["네이버 블로그", "클립", "인스타그램", "릴스", "유튜브", "쇼츠"],
    sortOptions: ["최신순", "인기순", "마감임박순"],
    defaultSort: "최신순",
    onFilterChange: (filters) => console.log("Filter changed:", filters),
    onFilteredCampaignsChange: (campaigns) => console.log("Filtered campaigns:", campaigns),
  },
};

// 빈 캠페인 목록
export const EmptyCampaigns: Story = {
  render: (args) => {
    const handleFilterChange = useCallback(
      (filters: FilterChangeParams) => {
        args.onFilterChange?.(filters);
      },
      [args.onFilterChange]
    );

    const handleFilteredCampaignsChange = useCallback(
      (filteredCampaigns: FilterableCampaign[]) => {
        args.onFilteredCampaignsChange?.(filteredCampaigns);
      },
      [args.onFilteredCampaignsChange]
    );

    const props = useMemo(
      () => ({
        ...args,
        campaigns: args.campaigns || [],
        onFilterChange: handleFilterChange,
        onFilteredCampaignsChange: handleFilteredCampaignsChange,
      }),
      [args, handleFilterChange, handleFilteredCampaignsChange]
    );

    return React.createElement(CampaignFilterBar, props);
  },
  args: {
    campaigns: [],
    activeFilters: {},
    typeOptions: ["배송형", "방문형", "구매평", "기자단", "미션형"],
    channelOptions: ["네이버 블로그", "클립", "인스타그램", "릴스", "유튜브", "쇼츠"],
    sortOptions: ["최신순", "인기순", "마감임박순"],
    defaultSort: "최신순",
    onFilterChange: (filters) => console.log("Filter changed:", filters),
    onFilteredCampaignsChange: (campaigns) => console.log("Filtered campaigns:", campaigns),
  },
};
