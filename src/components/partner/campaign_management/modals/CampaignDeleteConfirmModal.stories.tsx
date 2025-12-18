/**
 * CampaignDeleteConfirmModal 컴포넌트 스토리북
 *
 * 캠페인 삭제 확인 모달 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import CampaignDeleteConfirmModal from "./CampaignDeleteConfirmModal";

const meta: Meta<typeof CampaignDeleteConfirmModal> = {
  title: "Partner/CampaignManagement/Modals/CampaignDeleteConfirmModal",
  component: CampaignDeleteConfirmModal,
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
    campaignId: {
      description: "캠페인 ID",
      control: "text",
    },
    onConfirm: {
      description: "삭제 확인 핸들러",
      action: "confirmed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignDeleteConfirmModal>;

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
      React.createElement(CampaignDeleteConfirmModal, {
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
    campaignId: "1",
    onClose: () => console.log("Modal closed"),
    onConfirm: () => console.log("Delete confirmed"),
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
        "삭제 확인 모달 열기"
      ),
      React.createElement(CampaignDeleteConfirmModal, {
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
    campaignId: "1",
    onClose: () => console.log("Modal closed"),
    onConfirm: () => console.log("Delete confirmed"),
  },
};

