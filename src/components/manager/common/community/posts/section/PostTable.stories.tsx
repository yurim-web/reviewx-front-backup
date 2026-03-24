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
};

export default meta;

type Story = StoryObj<typeof PostTable>;

// 기본 테이블
export const Default: Story = {
  args: {
    boards: [],
    selected_post_ids: [],
    on_selected_post_ids_change: () => {},
    manager_type: "ga",
  },
};

// 데이터가 있는 상태
export const WithData: Story = {
  args: {
    boards: [
      {
        boardId: 1,
        division: "NOTICE",
        boardCategory: "공지사항",
        target: "ALL",
        title: "[공지] 테스트 게시글",
        viewCount: 100,
        isFixed: false,
        createdAt: "2026-03-01 10:00",
        createdBy: "관리자 A",
      },
    ],
    selected_post_ids: [],
    on_selected_post_ids_change: () => {},
    manager_type: "ga",
  },
};
