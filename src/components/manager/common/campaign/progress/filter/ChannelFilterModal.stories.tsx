/**
 * ChannelFilterModal 컴포넌트 스토리북
 *
 * 채널 필터 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useCallback, useMemo } from "react";
import ChannelFilterModal, { type Channel } from "./ChannelFilterModal";

const meta: Meta<typeof ChannelFilterModal> = {
  title: "Manager/Common/Campaign/Progress/Filter/ChannelFilterModal",
  component: ChannelFilterModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    is_open: {
      description: "모달 표시 여부",
      control: "boolean",
    },
    on_close: {
      description: "모달 닫기 핸들러",
      action: "modal closed",
    },
    selected_channels: {
      description: "선택된 채널 배열",
      control: "object",
    },
    on_apply: {
      description: "필터 적용 핸들러",
      action: "filter applied",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChannelFilterModal>;

// 모달이 열려있는 상태
export const Open: Story = {
  render: (args) => {
    const handleClose = useCallback(() => {
      args.on_close?.();
    }, [args.on_close]);

    const handleApply = useCallback(
      (channels: Channel[]) => {
        args.on_apply?.(channels);
      },
      [args.on_apply]
    );

    const props = useMemo(
      () => ({
        ...args,
        is_open: args.is_open ?? true,
        on_close: handleClose,
        on_apply: handleApply,
      }),
      [args, handleClose, handleApply]
    );

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
      React.createElement(ChannelFilterModal, props)
    );
  },
  args: {
    is_open: true,
    selected_channels: ["Blog", "Instagram"],
    on_close: () => console.log("Modal closed"),
    on_apply: (channels) => console.log("Channels applied:", channels),
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedChannels, setSelectedChannels] = useState<Channel[]>([]);

    const handleOpen = useCallback(() => {
      setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
      setIsOpen(false);
      args.on_close?.();
    }, [args.on_close]);

    const handleApply = useCallback(
      (channels: Channel[]) => {
        setSelectedChannels(channels);
        setIsOpen(false);
        args.on_apply?.(channels);
      },
      [args.on_apply]
    );

    const modalProps = useMemo(
      () => ({
        ...args,
        is_open: isOpen,
        selected_channels: selectedChannels,
        on_close: handleClose,
        on_apply: handleApply,
      }),
      [args, isOpen, selectedChannels, handleClose, handleApply]
    );

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
          onClick: handleOpen,
          style: {
            padding: "10px 20px",
            marginBottom: "20px",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
          },
        },
        "채널 필터 모달 열기"
      ),
      React.createElement(
        "div",
        {
          style: {
            marginBottom: "10px",
            position: "relative",
            zIndex: 1,
          },
        },
        `선택된 채널: ${selectedChannels.length > 0 ? selectedChannels.join(", ") : "없음"}`
      ),
      React.createElement(ChannelFilterModal, modalProps)
    );
  },
  args: {
    is_open: false,
    selected_channels: [],
    on_close: () => console.log("Modal closed"),
    on_apply: (channels) => console.log("Channels applied:", channels),
  },
};

