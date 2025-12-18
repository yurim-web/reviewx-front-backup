/**
 * ExistingAccountModal 컴포넌트 스토리북
 *
 * 기존 계정 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import ExistingAccountModal from "./ExistingAccountModal";

const meta: Meta<typeof ExistingAccountModal> = {
  title: "User/SignUp/ExistingAccountModal",
  component: ExistingAccountModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    socialLoginType: {
      description: "소셜 로그인 타입",
      control: "select",
      options: ["kakao", "naver"],
    },
    onClose: {
      description: "모달 닫기 핸들러",
      action: "modal closed",
    },
    onKakaoLogin: {
      description: "카카오 로그인 핸들러",
      action: "kakao login clicked",
    },
    onNaverLogin: {
      description: "네이버 로그인 핸들러",
      action: "naver login clicked",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ExistingAccountModal>;

// 카카오 로그인 타입
export const KakaoType: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return React.createElement(
      "div",
      {
        style: {
          width: "100vw",
          height: "100vh",
          position: "relative",
          margin: 0,
          padding: 0,
        },
      },
      React.createElement(ExistingAccountModal, {
        ...args,
        onClose: () => {
          setIsOpen(false);
          args.onClose?.();
        },
      })
    );
  },
  args: {
    socialLoginType: "kakao",
    onClose: () => console.log("Modal closed"),
    onKakaoLogin: () => console.log("Kakao login clicked"),
    onNaverLogin: () => console.log("Naver login clicked"),
  },
};

// 네이버 로그인 타입
export const NaverType: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return React.createElement(
      "div",
      {
        style: {
          width: "100vw",
          height: "100vh",
          position: "relative",
          margin: 0,
          padding: 0,
        },
      },
      React.createElement(ExistingAccountModal, {
        ...args,
        onClose: () => {
          setIsOpen(false);
          args.onClose?.();
        },
      })
    );
  },
  args: {
    socialLoginType: "naver",
    onClose: () => console.log("Modal closed"),
    onKakaoLogin: () => console.log("Kakao login clicked"),
    onNaverLogin: () => console.log("Naver login clicked"),
  },
};

