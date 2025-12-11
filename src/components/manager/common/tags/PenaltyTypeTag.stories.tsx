/**
 * PenaltyTypeTag 컴포넌트 스토리북
 *
 * 패널티 유형 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import PenaltyTypeTag, {
  type PenaltyType,
} from "@/components/manager/common/tags/PenaltyTypeTag";

// CSS 모듈 import
import tagsStylesModule from "@/styles/common/tags.module.css";

// CSS 모듈 객체를 타입 단언하여 사용
const tagsStyles = (tagsStylesModule || {
  type_tag_penalty: "type_tag_penalty",
  type_tag_penalty_warning: "type_tag_penalty_warning",
  type_tag_penalty_caution: "type_tag_penalty_caution",
  type_tag_penalty_suspension: "type_tag_penalty_suspension",
}) as Record<string, string> & {
  type_tag_penalty: string;
  type_tag_penalty_warning: string;
  type_tag_penalty_caution: string;
  type_tag_penalty_suspension: string;
};

const meta: Meta<typeof PenaltyTypeTag> = {
  title: "Manager/Common/Tags/PenaltyTypeTag",
  component: PenaltyTypeTag,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    type: {
      description: "패널티 유형",
      control: "select",
      options: ["경고", "주의", "정지"],
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof PenaltyTypeTag>;

// 경고
export const Warning: Story = {
  args: {
    type: "경고",
    styles: tagsStyles,
  },
};

// 주의
export const Caution: Story = {
  args: {
    type: "주의",
    styles: tagsStyles,
  },
};

// 정지
export const Suspension: Story = {
  args: {
    type: "정지",
    styles: tagsStyles,
  },
};

// 모든 유형 태그 비교
export const AllTypes: Story = {
  render: () => {
    const types: PenaltyType[] = ["경고", "주의", "정지"];

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
        React.createElement(PenaltyTypeTag, {
          key: type,
          type,
          styles: tagsStyles,
        })
      )
    );
  },
};

