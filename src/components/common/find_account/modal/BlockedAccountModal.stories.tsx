/**
 * BlockedAccountModal 컴포넌트 스토리북
 *
 * 정지/탈퇴 계정 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import BlockedAccountModal from "./BlockedAccountModal";

const meta: Meta<typeof BlockedAccountModal> = {
  title: "Common/FindAccount/Modal/BlockedAccountModal",
  component: BlockedAccountModal,
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
  },
};

export default meta;

type Story = StoryObj<typeof BlockedAccountModal>;

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
      React.createElement(BlockedAccountModal, {
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
    onClose: () => console.log("Modal closed"),
  },
};

// 모달이 닫혀있는 상태
export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log("Modal closed"),
  },
};

// 인터랙티브 예시 (열기/닫기 동작 시뮬레이션)
export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
      setIsOpen(false);
      args.onClose?.();
      console.log("[Storybook] Modal closed");
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
      React.createElement(BlockedAccountModal, {
        ...args,
        isOpen,
        onClose: handleClose,
      })
    );
  },
  args: {
    isOpen: false,
    onClose: () => console.log("Modal closed"),
  },
};

