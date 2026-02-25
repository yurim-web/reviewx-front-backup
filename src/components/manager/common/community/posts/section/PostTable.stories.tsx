/**
 * PostTable 컴포넌트 스토리북
 *
 * 게시글 목록 테이블 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import PostTable from "./PostTable";

const meta: Meta<typeof PostTable> = {
  title: "Manager/Common/Community/Posts/Section/PostTable",
  component: PostTable,
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

type Story = StoryObj<typeof PostTable>;

// 기본 테이블 (검색어 없음)
export const Default: Story = {
  args: {
    search_query: "",
  },
};

// 검색 결과가 있는 상태
export const WithSearchQuery: Story = {
  args: {
    search_query: "공지",
  },
};

// 검색 결과가 없는 상태
export const NoSearchResults: Story = {
  args: {
    search_query: "존재하지않는게시글",
  },
};
