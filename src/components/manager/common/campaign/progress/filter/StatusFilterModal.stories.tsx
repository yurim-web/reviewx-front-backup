/**
 * StatusFilterModal 컴포넌트 스토리북
 *
 * 상태 필터 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */
/* eslint-disable react-hooks/exhaustive-deps */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useCallback, useMemo } from "react";
import StatusFilterModal, { type CampaignStatus } from "./StatusFilterModal";

const meta: Meta<typeof StatusFilterModal> = {
  title: "Manager/Common/Campaign/Progress/Filter/StatusFilterModal",
  component: StatusFilterModal,
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
    selected_statuses: {
      description: "선택된 상태 배열",
      control: "object",
    },
    on_apply: {
      description: "필터 적용 핸들러",
      action: "filter applied",
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatusFilterModal>;

// 모달이 열려있는 상태
export const Open: Story = {
  render: (args) => {
    const handleClose = useCallback(() => {
      args.on_close?.();
    }, [args.on_close]);

    const handleApply = useCallback(
      (statuses: CampaignStatus[]) => {
        args.on_apply?.(statuses);
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
      React.createElement(StatusFilterModal, props)
    );
  },
  args: {
    is_open: true,
    selected_statuses: ["예정", "진행"],
    on_close: () => console.log("Modal closed"),
    on_apply: (statuses) => console.log("Statuses applied:", statuses),
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState<CampaignStatus[]>([]);

    const handleOpen = useCallback(() => {
      setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
      setIsOpen(false);
      args.on_close?.();
    }, [args.on_close]);

    const handleApply = useCallback(
      (statuses: CampaignStatus[]) => {
        setSelectedStatuses(statuses);
        setIsOpen(false);
        args.on_apply?.(statuses);
      },
      [args.on_apply]
    );

    const modalProps = useMemo(
      () => ({
        ...args,
        is_open: isOpen,
        selected_statuses: selectedStatuses,
        on_close: handleClose,
        on_apply: handleApply,
      }),
      [args, isOpen, selectedStatuses, handleClose, handleApply]
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
        "상태 필터 모달 열기"
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
        `선택된 상태: ${selectedStatuses.length > 0 ? selectedStatuses.join(", ") : "없음"}`
      ),
      React.createElement(StatusFilterModal, modalProps)
    );
  },
  args: {
    is_open: false,
    selected_statuses: [],
    on_close: () => console.log("Modal closed"),
    on_apply: (statuses) => console.log("Statuses applied:", statuses),
  },
};
