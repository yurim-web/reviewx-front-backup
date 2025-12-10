/**
 * FilterBar 컴포넌트 스토리북
 *
 * 필터/정렬 바 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import FilterBar from "./FilterBar";

const categoryOptions = [
  "전체",
  "식품",
  "뷰티",
  "가전",
  "유아동",
  "여가",
  "서비스",
  "생활",
  "패션",
  "가구",
  "디지털",
  "문화",
  "반려동물",
  "기타",
];

const channelOptions = [
  "전체",
  "네이버 블로그",
  "네이버 클립",
  "인스타그램",
  "유튜브",
  "릴스",
  "쇼츠",
];

const meta: Meta<typeof FilterBar> = {
  title: "User/Filter/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    categoryOptions: {
      description: "카테고리 옵션 목록",
      control: "object",
    },
    channelOptions: {
      description: "채널 옵션 목록",
      control: "object",
    },
    useRegionFilter: {
      description: "지역 필터 사용 여부",
      control: "boolean",
    },
    closingSoon: {
      description: "마감임박 필터 활성화 여부",
      control: "boolean",
    },
    onFilterChange: {
      description: "필터 변경 핸들러",
      action: "filter changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FilterBar>;

// 기본 필터 바
export const Default: Story = {
  render: (args) => {
    const [closingSoon, setClosingSoon] = useState(false);
    return React.createElement(FilterBar, {
      ...args,
      closingSoon,
      onClosingSoonChange: (value) => {
        setClosingSoon(value);
        args.onClosingSoonChange?.(value);
      },
    });
  },
  args: {
    categoryOptions,
    channelOptions,
    useRegionFilter: false,
    closingSoon: false,
    onFilterChange: (filters) => console.log("Filters changed:", filters),
    onClosingSoonChange: (value) => console.log("Closing soon changed:", value),
  },
};

// 지역 필터 포함
export const WithRegionFilter: Story = {
  render: (args) => {
    const [closingSoon, setClosingSoon] = useState(false);
    return React.createElement(FilterBar, {
      ...args,
      closingSoon,
      onClosingSoonChange: (value) => {
        setClosingSoon(value);
        args.onClosingSoonChange?.(value);
      },
    });
  },
  args: {
    categoryOptions,
    channelOptions,
    useRegionFilter: true,
    closingSoon: false,
    onFilterChange: (filters) => console.log("Filters changed:", filters),
    onClosingSoonChange: (value) => console.log("Closing soon changed:", value),
  },
};

// 마감임박 필터 활성화
export const WithClosingSoon: Story = {
  render: (args) => {
    const [closingSoon, setClosingSoon] = useState(true);
    return React.createElement(FilterBar, {
      ...args,
      closingSoon,
      onClosingSoonChange: (value) => {
        setClosingSoon(value);
        args.onClosingSoonChange?.(value);
      },
    });
  },
  args: {
    categoryOptions,
    channelOptions,
    useRegionFilter: false,
    closingSoon: true,
    onFilterChange: (filters) => console.log("Filters changed:", filters),
    onClosingSoonChange: (value) => console.log("Closing soon changed:", value),
  },
};

