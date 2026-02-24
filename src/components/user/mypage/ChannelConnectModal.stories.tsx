/* ========================================
   ChannelConnectModal 스토리북
   ======================================== */

/**
 * ChannelConnectModal.stories
 *
 * 목적: 채널 연결 모달 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/MyPage/ChannelConnectModal)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useCallback, useMemo } from "react";
import ChannelConnectModal from "./ChannelConnectModal";

// 스타일 객체를 컴포넌트 외부로 이동
const wrapperStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  position: "relative",
  margin: 0,
  padding: 0,
};

const interactiveWrapperStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  position: "relative",
  margin: 0,
  padding: "20px",
};

const meta: Meta<typeof ChannelConnectModal> = {
  title: "User/MyPage/ChannelConnectModal",
  component: ChannelConnectModal,
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
    channelName: {
      description: "채널 이름",
      control: "text",
    },
    initialUrl: {
      description: "초기 채널 URL",
      control: "text",
    },
    onConnect: {
      description: "채널 연결 핸들러",
      action: "channel connected",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChannelConnectModal>;

// 모달이 열려있는 상태
export const Open: Story = {
  render: (args) => {
    // useState 제거, args.isOpen을 직접 사용 (깜빡임 방지)
    const handleClose = useCallback(() => {
      args.onClose?.();
    }, [args.onClose]);

    const props = useMemo(
      () => ({
        ...args,
        isOpen: args.isOpen ?? true, // args.isOpen이 undefined일 경우 true
        onClose: handleClose,
      }),
      [args, handleClose]
    );

    return React.createElement(
      "div",
      { style: wrapperStyle },
      React.createElement(ChannelConnectModal, props)
    );
  },
  args: {
    isOpen: true,
    channelName: "네이버 블로그",
    initialUrl: "",
    onClose: () => console.log("Modal closed"),
    onConnect: (channelInfo) => console.log("Channel connected:", channelInfo),
  },
};

// 기존 URL이 있는 상태
export const WithExistingUrl: Story = {
  render: (args) => {
    // useState 제거, args.isOpen을 직접 사용 (깜빡임 방지)
    const handleClose = useCallback(() => {
      args.onClose?.();
    }, [args.onClose]);

    const props = useMemo(
      () => ({
        ...args,
        isOpen: args.isOpen ?? true, // args.isOpen이 undefined일 경우 true
        onClose: handleClose,
      }),
      [args, handleClose]
    );

    return React.createElement(
      "div",
      { style: wrapperStyle },
      React.createElement(ChannelConnectModal, props)
    );
  },
  args: {
    isOpen: true,
    channelName: "인스타그램",
    initialUrl: "https://instagram.com/test",
    onClose: () => console.log("Modal closed"),
    onConnect: (channelInfo) => console.log("Channel connected:", channelInfo),
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = useCallback(() => {
      setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
      setIsOpen(false);
      args.onClose?.();
    }, [args.onClose]);

    const modalProps = useMemo(
      () => ({
        ...args,
        isOpen,
        onClose: handleClose,
      }),
      [args, isOpen, handleClose]
    );

    return React.createElement(
      "div",
      { style: interactiveWrapperStyle },
      React.createElement(
        "button",
        {
          onClick: handleOpen,
          style: {
            padding: "10px 20px",
            marginBottom: "20px",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
          },
        },
        "채널 연결 모달 열기"
      ),
      React.createElement(ChannelConnectModal, modalProps)
    );
  },
  args: {
    isOpen: false,
    channelName: "유튜브",
    initialUrl: "",
    onClose: () => console.log("Modal closed"),
    onConnect: (channelInfo) => console.log("Channel connected:", channelInfo),
  },
};

