/* ========================================
   ReceiptRegistrationModal 스토리북
   ======================================== */

/**
 * ReceiptRegistrationModal.stories
 *
 * 목적: 구매 영수증 등록 모달 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/CampaignManagement/Modals/ReceiptRegistrationModal)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import ReceiptRegistrationModal from "./ReceiptRegistrationModal";

const meta: Meta<typeof ReceiptRegistrationModal> = {
  title: "User/CampaignManagement/ReceiptRegistrationModal",
  component: ReceiptRegistrationModal,
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
    campaignTitle: {
      description: "캠페인 제목",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReceiptRegistrationModal>;

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
        },
      },
      React.createElement(ReceiptRegistrationModal, {
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
    campaignTitle: "샘플 캠페인 제목",
    onClose: () => console.log("Modal closed"),
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return React.createElement(
      "div",
      {
        style: {
          width: "100vw",
          height: "100vh",
          position: "relative",
          margin: 0,
          padding: "20px",
        },
      },
      React.createElement(
        "button",
        {
          onClick: () => setIsOpen(true),
          style: {
            padding: "10px 20px",
            marginBottom: "20px",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
          },
        },
        "모달 열기"
      ),
      React.createElement(ReceiptRegistrationModal, {
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
    isOpen: false,
    campaignTitle: "샘플 캠페인 제목",
    onClose: () => console.log("Modal closed"),
  },
};

