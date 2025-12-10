/**
 * Section 컴포넌트 스토리북
 *
 * 섹션 래퍼 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Section from "./Section";

const meta: Meta<typeof Section> = {
  title: "Manager/Common/Member/MemberDetail/Section",
  component: Section,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    title: {
      description: "섹션 제목",
      control: "text",
    },
    children: {
      description: "섹션 내용",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Section>;

// 기본 섹션
export const Default: Story = {
  args: {
    title: "기본 정보",
    children: React.createElement(
      "div",
      { style: { padding: "20px" } },
      "섹션 내용입니다."
    ),
  },
};

// 활동 정보 섹션
export const ActivityInfo: Story = {
  args: {
    title: "활동 정보",
    children: React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          padding: "20px",
        },
      },
      React.createElement(
        "div",
        { style: { padding: "10px", border: "1px solid #ddd" } },
        "캠페인 진행: 5건"
      ),
      React.createElement(
        "div",
        { style: { padding: "10px", border: "1px solid #ddd" } },
        "캠페인 완료: 10건"
      ),
      React.createElement(
        "div",
        { style: { padding: "10px", border: "1px solid #ddd" } },
        "패널티: 1건"
      )
    ),
  },
};

// 프로필 섹션
export const Profile: Story = {
  args: {
    title: "프로필",
    children: React.createElement(
      "div",
      { style: { padding: "20px" } },
      React.createElement("div", null, "이름: 홍길동"),
      React.createElement("div", null, "이메일: hong@example.com"),
      React.createElement("div", null, "전화번호: 010-1234-5678")
    ),
  },
};


