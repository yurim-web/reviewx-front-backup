/* ========================================
   ApplicationModal 스토리북
   ======================================== */

/**
 * ApplicationModal.stories
 *
 * 목적: 캠페인 신청 모달 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/CampaignDetail/Modal/ApplicationModal)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import ApplicationModal from "./ApplicationModal";

const meta: Meta<typeof ApplicationModal> = {
  title: "User/CampaignDetail/Modal/ApplicationModal",
  component: ApplicationModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isOpen: {
      description: "모달 표시 여부",
      control: "boolean",
    },
    type: {
      description: "모달 타입 (delivery, review, mission, reporter, visit)",
      control: "select",
      options: ["delivery", "review", "mission", "reporter", "visit"],
    },
    onClose: {
      description: "모달 닫기 핸들러",
      action: "modal closed",
    },
    dayCount: {
      description: "남은 일수 또는 긴급 상태 (예: 'D-5', '긴급', '마감임박')",
      control: "text",
    },
    channelName: {
      description: "캠페인에서 요구하는 채널 이름",
      control: "text",
    },
    channelUrl: {
      description: "사용자가 연결한 채널 URL",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ApplicationModal>;

// 배송형 모달
export const Delivery: Story = {
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
      React.createElement(ApplicationModal, {
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
    type: "delivery",
    dayCount: "D-5",
    channelName: "네이버 블로그",
    channelUrl: "https://blog.naver.com/example",
    onClose: () => console.log("Modal closed"),
  },
};

// 구매평 모달
export const Review: Story = {
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
      React.createElement(ApplicationModal, {
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
    type: "review",
    dayCount: "D-3",
    onClose: () => console.log("Modal closed"),
  },
};

// 미션형 모달
export const Mission: Story = {
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
      React.createElement(ApplicationModal, {
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
    type: "mission",
    dayCount: "D-7",
    onClose: () => console.log("Modal closed"),
  },
};

// 기자단 모달
export const Reporter: Story = {
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
      React.createElement(ApplicationModal, {
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
    type: "reporter",
    dayCount: "D-4",
    onClose: () => console.log("Modal closed"),
  },
};

// 방문형 모달
export const Visit: Story = {
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
      React.createElement(ApplicationModal, {
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
    type: "visit",
    dayCount: "D-6",
    channelName: "인스타그램",
    channelUrl: "https://instagram.com/example",
    onClose: () => console.log("Modal closed"),
  },
};

// 긴급 캠페인 모달 (배송형)
export const UrgentDelivery: Story = {
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
      React.createElement(ApplicationModal, {
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
    type: "delivery",
    dayCount: "긴급",
    channelName: "유튜브",
    channelUrl: "https://youtube.com/@example",
    onClose: () => console.log("Modal closed"),
  },
};

// 채널 미연결 상태 (방문형)
export const VisitNoChannel: Story = {
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
      React.createElement(ApplicationModal, {
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
    type: "visit",
    dayCount: "D-2",
    channelName: "네이버 블로그",
    channelUrl: undefined, // 채널 미연결 상태
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
      React.createElement(ApplicationModal, {
        ...args,
        isOpen,
        onClose: handleClose,
      })
    );
  },
  args: {
    isOpen: false,
    type: "delivery",
    dayCount: "D-5",
    channelName: "네이버 블로그",
    channelUrl: "https://blog.naver.com/example",
    onClose: () => console.log("Modal closed"),
  },
};

// 모달이 닫혀있는 상태
export const Closed: Story = {
  args: {
    isOpen: false,
    type: "delivery",
    dayCount: "D-5",
    channelName: "네이버 블로그",
    onClose: () => console.log("Modal closed"),
  },
};
