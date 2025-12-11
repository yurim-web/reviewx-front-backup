/**
 * ReviewerTypeTag 컴포넌트 스토리북
 *
 * 리뷰어 타입 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ReviewerTypeTag, {
  type ReviewerType,
} from "@/components/manager/common/tags/ReviewerTypeTag";

// CSS 모듈 import
import tagsStylesModule from "@/styles/common/tags.module.css";

// CSS 모듈 객체를 타입 단언하여 사용
const tagsStyles = (tagsStylesModule || {
  type_tag: "type_tag",
  type_tag_supporter: "type_tag_supporter",
  type_tag_normal: "type_tag_normal",
  type_tag_influencer: "type_tag_influencer",
}) as Record<string, string> & {
  type_tag: string;
  type_tag_supporter: string;
  type_tag_normal: string;
  type_tag_influencer: string;
};

const meta: Meta<typeof ReviewerTypeTag> = {
  title: "Manager/Common/Tags/ReviewerTypeTag",
  component: ReviewerTypeTag,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    type: {
      description: "리뷰어 타입",
      control: "select",
      options: ["서포터즈", "일반", "인플루언서"],
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReviewerTypeTag>;

// 서포터즈
export const Supporter: Story = {
  args: {
    type: "서포터즈",
    styles: tagsStyles,
  },
};

// 일반
export const Normal: Story = {
  args: {
    type: "일반",
    styles: tagsStyles,
  },
};

// 인플루언서
export const Influencer: Story = {
  args: {
    type: "인플루언서",
    styles: tagsStyles,
  },
};

// 모든 타입 태그 비교
export const AllTypes: Story = {
  render: () => {
    const types: ReviewerType[] = ["서포터즈", "일반", "인플루언서"];

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
        React.createElement(ReviewerTypeTag, {
          key: type,
          type,
          styles: tagsStyles,
        })
      )
    );
  },
};

