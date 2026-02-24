/**
 * ModalButton 컴포넌트 스토리북
 *
 * 모달 버튼 컴포넌트의 다양한 variant 타입을 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ModalButton from "./ModalButton";

const meta: Meta<typeof ModalButton> = {
  title: "Common/FindAccount/Modal/ModalButton",
  component: ModalButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      description: "버튼 variant 타입",
      control: "select",
      options: ["primary", "secondary", "close", "kakao", "sns-secondary"],
    },
    children: {
      description: "버튼 텍스트",
      control: "text",
    },
    onClick: {
      description: "클릭 핸들러",
      action: "button clicked",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ModalButton>;

// Primary 버튼
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "로그인",
    onClick: () => console.log("Primary button clicked"),
  },
};

// Secondary 버튼
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "비밀번호 찾기",
    onClick: () => console.log("Secondary button clicked"),
  },
};

// Close 버튼
export const Close: Story = {
  args: {
    variant: "close",
    children: "닫기",
    onClick: () => console.log("Close button clicked"),
  },
};

// Kakao 버튼
export const Kakao: Story = {
  args: {
    variant: "kakao",
    children: "카카오 로그인",
    onClick: () => console.log("Kakao button clicked"),
  },
};

// SNS Secondary 버튼
export const SNSSecondary: Story = {
  args: {
    variant: "sns-secondary",
    children: "일반 로그인",
    onClick: () => console.log("SNS Secondary button clicked"),
  },
};

// 모든 버튼 variant 비교
export const AllVariants: Story = {
  render: () => {
    return React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "20px",
        },
      },
      React.createElement(ModalButton, {
        variant: "primary",
        onClick: () => {},
      }, "Primary 버튼"),
      React.createElement(ModalButton, {
        variant: "secondary",
        onClick: () => {},
      }, "Secondary 버튼"),
      React.createElement(ModalButton, {
        variant: "close",
        onClick: () => {},
      }, "Close 버튼"),
      React.createElement(ModalButton, {
        variant: "kakao",
        onClick: () => {},
      }, "Kakao 버튼"),
      React.createElement(ModalButton, {
        variant: "sns-secondary",
        onClick: () => {},
      }, "SNS Secondary 버튼")
    );
  },
};

