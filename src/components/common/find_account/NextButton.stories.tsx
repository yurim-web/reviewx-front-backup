/**
 * NextButton 컴포넌트 스토리북
 *
 * 다음 버튼 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import NextButton from "./NextButton";

const meta: Meta<typeof NextButton> = {
  title: "Common/FindAccount/NextButton",
  component: NextButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    disabled: {
      description: "버튼 활성화 여부",
      control: "boolean",
    },
    onClick: {
      description: "클릭 핸들러",
      action: "button clicked",
    },
  },
};

export default meta;

type Story = StoryObj<typeof NextButton>;

// 활성화된 버튼
export const Enabled: Story = {
  render: (args) => React.createElement(NextButton, args),
  args: {
    disabled: false,
    onClick: () => console.log("Next button clicked"),
  },
};

// 비활성화된 버튼
export const Disabled: Story = {
  render: (args) => React.createElement(NextButton, args),
  args: {
    disabled: true,
    onClick: () => console.log("Next button clicked (disabled)"),
  },
};

// 인터랙티브 예시 (활성화/비활성화 토글)
export const Interactive: Story = {
  render: (args) => {
    const [disabled, setDisabled] = useState(false);

    return React.createElement(
      "div",
      { style: { padding: "20px", width: "100%" } },
      React.createElement(
        "button",
        {
          onClick: () => setDisabled(!disabled),
          style: {
            padding: "10px 20px",
            marginBottom: "20px",
            cursor: "pointer",
          },
        },
        disabled ? "버튼 활성화" : "버튼 비활성화"
      ),
      React.createElement(NextButton, {
        ...args,
        disabled,
        onClick: () => {
          args.onClick?.();
          console.log("[Storybook] Next button clicked");
        },
      })
    );
  },
  args: {
    disabled: false,
    onClick: () => console.log("Next button clicked"),
  },
};
