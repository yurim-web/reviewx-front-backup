/**
 * ReviewerFilterSection 컴포넌트 스토리북
 *
 * 리뷰어 필터 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import ReviewerFilterSection from "./ReviewerFilterSection";

const meta: Meta<typeof ReviewerFilterSection> = {
  title: "Manager/Common/Member/Reviewers/ReviewerFilterSection",
  component: ReviewerFilterSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
  },
  argTypes: {
    search_query: {
      description: "검색어 상태",
      control: "text",
    },
    on_search_change: {
      description: "검색어 변경 핸들러 함수",
      action: "search changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReviewerFilterSection>;

/**
 * 기본 필터 섹션
 *
 * 리뷰어 목록 페이지의 필터 섹션입니다.
 */
export const Default: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState(args.search_query || "");
    return (
      <ReviewerFilterSection
        {...({} as any)}
        search_query={searchQuery}
        on_search_change={(query) => {
          setSearchQuery(query);
          args.on_search_change?.(query);
        }}
      />
    );
  },
  args: {
    search_query: "",
    on_search_change: (query) => console.log("Search changed:", query),
  },
};

/**
 * 검색어가 있는 상태
 *
 * 이미 검색어가 입력된 상태의 필터 섹션입니다.
 */
export const WithSearchQuery: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState("프로모즈");
    return (
      <ReviewerFilterSection
        {...({} as any)}
        search_query={searchQuery}
        on_search_change={(query) => {
          setSearchQuery(query);
          args.on_search_change?.(query);
        }}
      />
    );
  },
  args: {
    search_query: "프로모즈",
    on_search_change: (query) => console.log("Search changed:", query),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 리뷰어 필터 섹션 컴포넌트
 *    - GA/SA 관리자 리뷰어 목록 페이지에서 공통 MemberFilterSection을 사용합니다
 *    - 스타일과 필터 모달 컴포넌트를 전달하여 렌더링합니다
 *
 * 2. 필터 옵션
 *    - 채널 필터: Blog, Clip, Instagram, Youtube, Store
 *    - 등급 필터: 모범 회원, 주의 회원, 경고 회원, 이용 제한 회원
 *    - 유형 필터: 프로모즈, 일반, 인플루언서
 *    - 상태 필터: 정상, 일시 정지, 영구 정지
 *
 * 3. 검색 기능
 *    - 검색어 입력으로 리뷰어를 검색할 수 있습니다
 *
 * 4. 다운로드 기능
 *    - 리뷰어 목록을 엑셀로 다운로드할 수 있습니다
 */
