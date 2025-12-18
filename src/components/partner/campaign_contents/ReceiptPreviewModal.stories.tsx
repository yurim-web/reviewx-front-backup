/**
 * ReceiptPreviewModal 컴포넌트 스토리북
 *
 * 구매 영수증 미리보기 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import ReceiptPreviewModal from "./ReceiptPreviewModal";

const mockImages = [
  "/images/test_img/receipt_test_1.png",
  "/images/test_img/receipt_test_2.png",
  "/images/test_img/receipt_test_3.png",
];

const meta: Meta<typeof ReceiptPreviewModal> = {
  title: "Partner/CampaignContents/ReceiptPreviewModal",
  component: ReceiptPreviewModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isOpen: {
      description: "모달 표시 여부",
      control: "boolean",
    },
    images: {
      description: "영수증 이미지 URL 배열",
      control: "object",
    },
    initialIndex: {
      description: "초기 이미지 인덱스",
      control: "number",
    },
    onClose: {
      description: "모달 닫기 핸들러",
      action: "modal closed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReceiptPreviewModal>;

// 단일 이미지
export const SingleImage: Story = {
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
      React.createElement(ReceiptPreviewModal, {
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
    images: [mockImages[0]],
    initialIndex: 0,
    onClose: () => console.log("Modal closed"),
  },
};

// 여러 이미지
export const MultipleImages: Story = {
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
      React.createElement(ReceiptPreviewModal, {
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
    images: mockImages,
    initialIndex: 0,
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
        "영수증 미리보기 모달 열기"
      ),
      React.createElement(ReceiptPreviewModal, {
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
    images: mockImages,
    initialIndex: 0,
    onClose: () => console.log("Modal closed"),
  },
};

