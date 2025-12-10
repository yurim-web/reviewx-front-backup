/**
 * PageHeader 컴포넌트 스토리북
 * 
 * 페이지 상단 제목 공용 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import PageHeader from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Partner/CampaignApplication/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  argTypes: {
    title: {
      description: "페이지 제목",
      control: "text",
    },
    right: {
      description: "우측 액션 요소 (선택적)",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof PageHeader>;

/**
 * 기본 페이지 헤더
 * 
 * 제목만 있는 기본 형태입니다.
 */
export const Default: Story = {
  args: {
    title: "캠페인 신청 내역",
  },
};

/**
 * 우측 액션 포함
 * 
 * 우측에 추가 버튼이 있는 형태입니다.
 */
export const WithRightAction: Story = {
  args: {
    title: "캠페인 신청 내역",
    right: React.createElement(
      "button",
      {
        onClick: () => console.log("Button clicked"),
        style: {
          padding: "8px 16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          background: "#f5f5f5",
          cursor: "pointer",
        },
      },
      "새 캠페인 등록"
    ),
  },
};
