/**
 * UserTypeTag 컴포넌트 스토리북
 *
 * 유저 타입 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import UserTypeTag, { type UserType } from "@/components/manager/common/tags/UserTypeTag";

const meta: Meta<typeof UserTypeTag> = {
  title: "Manager/Common/Tags/UserTypeTag",
  component: UserTypeTag,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    type: {
      description: "유저 타입",
      control: "select",
      options: ["리뷰어", "파트너", "관리자"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof UserTypeTag>;

// 리뷰어
export const Reviewer: Story = {
  args: {
    type: "리뷰어",
  },
};

// 파트너
export const Partner: Story = {
  args: {
    type: "파트너",
  },
};

// 관리자
export const Admin: Story = {
  args: {
    type: "관리자",
  },
};

// 모든 타입 태그 비교
export const AllTypes: Story = {
  render: () => {
    const types: UserType[] = ["리뷰어", "파트너", "관리자"];

    return React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          padding: "20px",
        },
      },
      ...types.map((type) =>
        React.createElement(UserTypeTag, {
          key: type,
          type,
        })
      )
    );
  },
};
