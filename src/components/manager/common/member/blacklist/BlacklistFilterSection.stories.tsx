/**
 * BlacklistFilterSection 컴포넌트 스토리북
 *
 * 차단 이력 필터 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useCallback, useMemo } from "react";
import BlacklistFilterSection from "./BlacklistFilterSection";

const meta: Meta<typeof BlacklistFilterSection> = {
  title: "Manager/Common/Member/Blacklist/BlacklistFilterSection",
  component: BlacklistFilterSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    search_query: {
      description: "검색어",
      control: "text",
    },
    on_search_change: {
      description: "검색어 변경 핸들러",
      action: "search changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof BlacklistFilterSection>;

// 기본 필터 섹션
export const Default: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState(args.search_query || "");

    const handleSearchChange = useCallback(
      (query: string) => {
        setSearchQuery(query);
        args.on_search_change?.(query);
      },
      [args.on_search_change]
    );

    const props = useMemo(
      () => ({
        search_query: searchQuery,
        on_search_change: handleSearchChange,
      }),
      [searchQuery, handleSearchChange]
    );

    return React.createElement(BlacklistFilterSection, props);
  },
  args: {
    search_query: "",
    on_search_change: (query) => console.log("Search changed:", query),
  },
};

// 검색어가 입력된 상태
export const WithSearchQuery: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState(args.search_query || "홍길동");

    const handleSearchChange = useCallback(
      (query: string) => {
        setSearchQuery(query);
        args.on_search_change?.(query);
      },
      [args.on_search_change]
    );

    const props = useMemo(
      () => ({
        search_query: searchQuery,
        on_search_change: handleSearchChange,
      }),
      [searchQuery, handleSearchChange]
    );

    return React.createElement(BlacklistFilterSection, props);
  },
  args: {
    search_query: "홍길동",
    on_search_change: (query) => console.log("Search changed:", query),
  },
};


