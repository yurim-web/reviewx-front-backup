/**
 * DivisionFilterModal 컴포넌트 스토리북
 *
 * 구분 필터 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useCallback, useMemo } from "react";
import DivisionFilterModal, {
  type BlacklistDivision,
} from "./DivisionFilterModal";

const meta: Meta<typeof DivisionFilterModal> = {
  title: "Manager/Common/Member/Blacklist/Filter/DivisionFilterModal",
  component: DivisionFilterModal,
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
    selected_divisions: {
      description: "선택된 구분 배열",
      control: "object",
    },
    on_apply: {
      description: "필터 적용 핸들러",
      action: "filter applied",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DivisionFilterModal>;

// 모달이 열려있는 상태
export const Open: Story = {
  render: (args) => {
    const handleClose = useCallback(() => {
      args.on_close?.();
    }, [args.on_close]);

    const handleApply = useCallback(
      (divisions: BlacklistDivision[]) => {
        args.on_apply?.(divisions);
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
      React.createElement(DivisionFilterModal, props)
    );
  },
  args: {
    is_open: true,
    selected_divisions: ["파트너", "리뷰어"],
    on_close: () => console.log("Modal closed"),
    on_apply: (divisions) => console.log("Divisions applied:", divisions),
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDivisions, setSelectedDivisions] = useState<
      BlacklistDivision[]
    >([]);

    const handleOpen = useCallback(() => {
      setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
      setIsOpen(false);
      args.on_close?.();
    }, [args.on_close]);

    const handleApply = useCallback(
      (divisions: BlacklistDivision[]) => {
        setSelectedDivisions(divisions);
        setIsOpen(false);
        args.on_apply?.(divisions);
      },
      [args.on_apply]
    );

    const modalProps = useMemo(
      () => ({
        ...args,
        is_open: isOpen,
        selected_divisions: selectedDivisions,
        on_close: handleClose,
        on_apply: handleApply,
      }),
      [args, isOpen, selectedDivisions, handleClose, handleApply]
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
        "구분 필터 모달 열기"
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
        `선택된 구분: ${selectedDivisions.length > 0 ? selectedDivisions.join(", ") : "없음"}`
      ),
      React.createElement(DivisionFilterModal, modalProps)
    );
  },
  args: {
    is_open: false,
    selected_divisions: [],
    on_close: () => console.log("Modal closed"),
    on_apply: (divisions) => console.log("Divisions applied:", divisions),
  },
};


