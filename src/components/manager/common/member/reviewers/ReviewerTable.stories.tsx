/**
 * ReviewerTable 컴포넌트 스토리북
 *
 * 리뷰어 목록 테이블 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useMemo } from "react";
import ReviewerTable from "./ReviewerTable";

const meta: Meta<typeof ReviewerTable> = {
  title: "Manager/Common/Member/Reviewers/ReviewerTable",
  component: ReviewerTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    search_query: {
      description: "검색어",
      control: "text",
    },
    detail_path: {
      description: "상세 페이지 경로",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReviewerTable>;

// 기본 테이블 (검색어 없음)
export const Default: Story = {
  args: {
    search_query: "",
    detail_path: "/manager_ga/member/reviewers",
  },
};

// 검색 결과가 있는 상태
export const WithSearchQuery: Story = {
  args: {
    search_query: "홍길동",
    detail_path: "/manager_ga/member/reviewers",
  },
};

// SA 관리자 경로
export const SAAdmin: Story = {
  args: {
    search_query: "",
    detail_path: "/manager_sa/member/reviewers",
  },
};


