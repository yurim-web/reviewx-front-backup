/**
 * UserTypeTag 컴포넌트 스토리북
 *
 * 유저 타입 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import UserTypeTag, {
  type UserType,
} from "@/components/manager/common/tags/UserTypeTag";

// CSS 모듈 import
import tagsStylesModule from "@/styles/common/tags.module.css";

// CSS 모듈 객체를 타입 단언하여 사용
const tagsStyles = (tagsStylesModule || {
  division_tag: "division_tag",
  division_tag_reviewer: "division_tag_reviewer",
  division_tag_partner: "division_tag_partner",
  division_tag_admin: "division_tag_admin",
}) as Record<string, string> & {
  division_tag: string;
  division_tag_reviewer: string;
  division_tag_partner: string;
  division_tag_admin: string;
};

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
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof UserTypeTag>;

// 리뷰어
export const Reviewer: Story = {
  args: {
    type: "리뷰어",
    styles: tagsStyles,
  },
};

// 파트너
export const Partner: Story = {
  args: {
    type: "파트너",
    styles: tagsStyles,
  },
};

// 관리자
export const Admin: Story = {
  args: {
    type: "관리자",
    styles: tagsStyles,
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
          styles: tagsStyles,
        })
      )
    );
  },
};

