/**
 * PenaltyTypeTag 컴포넌트 스토리북
 *
 * 패널티 유형 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import PenaltyTypeTag, { type PenaltyType } from "@/components/manager/common/tags/PenaltyTypeTag";

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
  },
};

export default meta;

type Story = StoryObj<typeof PenaltyTypeTag>;

// 경고
export const Warning: Story = {
  args: {
    type: "경고",
  },
};

// 주의
export const Caution: Story = {
  args: {
    type: "주의",
  },
};

// 정지
export const Suspension: Story = {
  args: {
    type: "정지",
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
        })
      )
    );
  },
};
