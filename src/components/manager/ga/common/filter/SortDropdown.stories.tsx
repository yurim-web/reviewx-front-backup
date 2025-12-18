/**
 * SortDropdown 컴포넌트 스토리북
 *
 * 정렬 드롭다운 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import SortDropdown from "./SortDropdown";

const meta: Meta<typeof SortDropdown> = {
  title: "Manager/GA/Common/Filter/SortDropdown",
  component: SortDropdown,
  tags: ["autodocs"],
  argTypes: {
    selected_sort: {
      description: "선택된 정렬 옵션",
      control: "text",
    },
    on_sort_change: {
      description: "정렬 옵션 변경 핸들러",
      action: "sort changed",
    },
    sort_options: {
      description: "정렬 옵션 목록 (선택적)",
      control: "object",
    },
    default_sort_options: {
      description: "기본 정렬 옵션 목록",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SortDropdown>;

/**
 * 기본 상태
 *
 * 기본 정렬 옵션을 사용하는 드롭다운입니다.
 */
export const Default: Story = {
  render: (args) => {
    const [selectedSort, setSelectedSort] = useState("최신순");
    return (
      <SortDropdown
        {...args}
        selected_sort={selectedSort}
        on_sort_change={(sort) => {
          setSelectedSort(sort);
          args.on_sort_change?.(sort);
        }}
      />
    );
  },
  args: {},
};

/**
 * 커스텀 정렬 옵션
 *
 * 사용자 정의 정렬 옵션을 사용하는 드롭다운입니다.
 */
export const WithCustomOptions: Story = {
  render: (args) => {
    const [selectedSort, setSelectedSort] = useState("이름순");
    return (
      <SortDropdown
        {...args}
        selected_sort={selectedSort}
        on_sort_change={(sort) => {
          setSelectedSort(sort);
          args.on_sort_change?.(sort);
        }}
        sort_options={["이름순", "날짜순", "조회수순", "좋아요순"]}
      />
    );
  },
  args: {},
};
