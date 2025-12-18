/**
 * SNSLoginModal 컴포넌트 스토리북
 *
 * SNS 로그인 유도 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import SNSLoginModal from "./SNSLoginModal";

const meta: Meta<typeof SNSLoginModal> = {
  title: "Common/FindAccount/Modals/SNSLoginModal",
  component: SNSLoginModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isOpen: {
      description: "모달 표시 여부",
      control: "boolean",
    },
    onClose: {
      description: "모달 닫기 핸들러",
      action: "modal closed",
    },
    onKakaoLogin: {
      description: "카카오 로그인 버튼 클릭 핸들러",
      action: "kakao login clicked",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SNSLoginModal>;

// 모달이 열려있는 상태
export const Open: Story = {
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
        } 
      },
      React.createElement(SNSLoginModal, {
        ...args,
        isOpen,
        onClose: () => {
          setIsOpen(false);
          args.onClose?.();
        },
      })
    );
  },
  args: {
    isOpen: true,
    onClose: () => console.log("SNSLoginModal closed"),
    onKakaoLogin: () => console.log("Kakao Login clicked"),
  },
};

// 모달이 닫혀있는 상태
export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log("SNSLoginModal closed"),
    onKakaoLogin: () => console.log("Kakao Login clicked"),
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
      setIsOpen(false);
      args.onClose?.();
      console.log("[Storybook] Modal closed");
    };

    const handleKakaoLogin = () => {
      args.onKakaoLogin?.();
      handleClose();
    };

    return React.createElement(
      "div",
      { style: { padding: "20px" } },
      React.createElement(
        "button",
        {
          onClick: () => setIsOpen(true),
          style: {
            padding: "10px 20px",
            marginBottom: "20px",
            cursor: "pointer",
          },
        },
        "모달 열기"
      ),
      React.createElement(SNSLoginModal, {
        ...args,
        isOpen,
        onClose: handleClose,
        onKakaoLogin: handleKakaoLogin,
      })
    );
  },
  args: {
    isOpen: false,
    onClose: () => console.log("Modal closed"),
    onKakaoLogin: () => console.log("Kakao login clicked"),
  },
};
