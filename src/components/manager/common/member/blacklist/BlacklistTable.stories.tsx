/**
 * BlacklistTable 컴포넌트 스토리북
 *
 * 차단 내역 테이블 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import BlacklistTable from "./BlacklistTable";

const meta: Meta<typeof BlacklistTable> = {
  title: "Manager/Common/Member/Blacklist/BlacklistTable",
  component: BlacklistTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    search_query: {
      description: "검색어",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof BlacklistTable>;

// 기본 테이블 (검색어 없음)
export const Default: Story = {
  args: {
    search_query: "",
  },
};

// 검색 결과가 있는 상태
export const WithSearchQuery: Story = {
  args: {
    search_query: "홍길동",
  },
};

// 검색 결과가 없는 상태
export const NoSearchResults: Story = {
  args: {
    search_query: "존재하지않는사용자",
  },
};
