/**
 * AccountFoundModal 컴포넌트 스토리북
 *
 * 아이디 찾기 결과 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import AccountFoundModal from "./AccountFoundModal";
import type { AccountInfo } from "../types";

const meta: Meta<typeof AccountFoundModal> = {
  title: "Common/FindAccount/Modal/AccountFoundModal",
  component: AccountFoundModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isOpen: {
      description: "모달 표시 여부",
      control: "boolean",
    },
    accountInfo: {
      description: "조회한 계정 정보",
      control: "object",
    },
    onClose: {
      description: "모달 닫기 핸들러",
      action: "modal closed",
    },
    onLogin: {
      description: "로그인 버튼 클릭 핸들러",
      action: "login clicked",
    },
    onFindPassword: {
      description: "비밀번호 찾기 버튼 클릭 핸들러",
      action: "find password clicked",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AccountFoundModal>;

const mockAccountInfo: AccountInfo = {
  email: "user@example.com",
  signupDate: "2024-01-15",
};

// 모달이 열려있는 상태 (계정 정보 있음)
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
      React.createElement(AccountFoundModal, {
        ...args,
        isOpen,
        accountInfo: mockAccountInfo,
        onClose: () => {
          setIsOpen(false);
          args.onClose?.();
        },
      })
    );
  },
  args: {
    isOpen: true,
    accountInfo: mockAccountInfo,
    onClose: () => console.log("Modal closed"),
    onLogin: () => console.log("Login clicked"),
    onFindPassword: () => console.log("Find password clicked"),
  },
};

// 모달이 닫혀있는 상태
export const Closed: Story = {
  args: {
    isOpen: false,
    accountInfo: mockAccountInfo,
    onClose: () => console.log("Modal closed"),
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

    const handleLogin = () => {
      args.onLogin?.();
      handleClose();
    };

    const handleFindPassword = () => {
      handleClose();
      args.onFindPassword?.();
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
      React.createElement(AccountFoundModal, {
        ...args,
        isOpen,
        accountInfo: mockAccountInfo,
        onClose: handleClose,
        onLogin: handleLogin,
        onFindPassword: handleFindPassword,
      })
    );
  },
  args: {
    isOpen: false,
    accountInfo: mockAccountInfo,
    onClose: () => console.log("Modal closed"),
    onLogin: () => console.log("Login clicked"),
    onFindPassword: () => console.log("Find password clicked"),
  },
};

