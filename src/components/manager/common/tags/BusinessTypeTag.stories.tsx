/**
 * BusinessTypeTag 컴포넌트 스토리북
 *
 * 사업자 구분 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import BusinessTypeTag, {
  type BusinessType,
} from "@/components/manager/common/tags/BusinessTypeTag";

// CSS 모듈 import
import tagsStylesModule from "@/styles/common/tags.module.css";

// CSS 모듈 객체를 타입 단언하여 사용
const tagsStyles = (tagsStylesModule || {
  division_tag: "division_tag",
  division_tag_corporate: "division_tag_corporate",
  division_tag_individual: "division_tag_individual",
}) as Record<string, string> & {
  division_tag: string;
  division_tag_corporate: string;
  division_tag_individual: string;
};

const meta: Meta<typeof BusinessTypeTag> = {
  title: "Manager/Common/Tags/BusinessTypeTag",
  component: BusinessTypeTag,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    type: {
      description: "사업자 구분",
      control: "select",
      options: ["법인", "개인"],
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof BusinessTypeTag>;

// 법인
export const Corporate: Story = {
  args: {
    type: "법인",
    styles: tagsStyles,
  },
};

// 개인
export const Individual: Story = {
  args: {
    type: "개인",
    styles: tagsStyles,
  },
};

// 모든 구분 태그 비교
export const AllTypes: Story = {
  render: () => {
    const types: BusinessType[] = ["법인", "개인"];

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
        React.createElement(BusinessTypeTag, {
          key: type,
          type,
          styles: tagsStyles,
        })
      )
    );
  },
};

