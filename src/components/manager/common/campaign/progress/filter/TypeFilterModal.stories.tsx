/**
 * TypeFilterModal 컴포넌트 스토리북
 *
 * 유형 필터 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useCallback, useMemo } from "react";
import TypeFilterModal, { type CampaignType } from "./TypeFilterModal";

const meta: Meta<typeof TypeFilterModal> = {
  title: "Manager/Common/Campaign/Progress/Filter/TypeFilterModal",
  component: TypeFilterModal,
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
    selected_types: {
      description: "선택된 유형 배열",
      control: "object",
    },
    on_apply: {
      description: "필터 적용 핸들러",
      action: "filter applied",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TypeFilterModal>;

// 모달이 열려있는 상태
export const Open: Story = {
  render: (args) => {
    const handleClose = useCallback(() => {
      args.on_close?.();
    }, [args.on_close]);

    const handleApply = useCallback(
      (types: CampaignType[]) => {
        args.on_apply?.(types);
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
      React.createElement(TypeFilterModal, props)
    );
  },
  args: {
    is_open: true,
    selected_types: ["배송형", "방문형"],
    on_close: () => console.log("Modal closed"),
    on_apply: (types) => console.log("Types applied:", types),
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<CampaignType[]>([]);

    const handleOpen = useCallback(() => {
      setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
      setIsOpen(false);
      args.on_close?.();
    }, [args.on_close]);

    const handleApply = useCallback(
      (types: CampaignType[]) => {
        setSelectedTypes(types);
        setIsOpen(false);
        args.on_apply?.(types);
      },
      [args.on_apply]
    );

    const modalProps = useMemo(
      () => ({
        ...args,
        is_open: isOpen,
        selected_types: selectedTypes,
        on_close: handleClose,
        on_apply: handleApply,
      }),
      [args, isOpen, selectedTypes, handleClose, handleApply]
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
        "유형 필터 모달 열기"
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
        `선택된 유형: ${selectedTypes.length > 0 ? selectedTypes.join(", ") : "없음"}`
      ),
      React.createElement(TypeFilterModal, modalProps)
    );
  },
  args: {
    is_open: false,
    selected_types: [],
    on_close: () => console.log("Modal closed"),
    on_apply: (types) => console.log("Types applied:", types),
  },
};

