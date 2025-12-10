/**
 * PartnerTable 컴포넌트 스토리북
 *
 * 파트너 목록 테이블 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useMemo } from "react";
import PartnerTable from "./PartnerTable";

const meta: Meta<typeof PartnerTable> = {
  title: "Manager/Common/Member/Partners/PartnerTable",
  component: PartnerTable,
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

type Story = StoryObj<typeof PartnerTable>;

// 기본 테이블 (검색어 없음)
export const Default: Story = {
  args: {
    search_query: "",
    detail_path: "/manager_ga/member/partners",
  },
};

// 검색 결과가 있는 상태
export const WithSearchQuery: Story = {
  args: {
    search_query: "회사",
    detail_path: "/manager_ga/member/partners",
  },
};

// SA 관리자 경로
export const SAAdmin: Story = {
  args: {
    search_query: "",
    detail_path: "/manager_sa/member/partners",
  },
};


