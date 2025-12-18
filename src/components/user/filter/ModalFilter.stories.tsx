/**
 * ModalFilter 컴포넌트 스토리북
 *
 * 모달 필터 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import ModalFilter from "./ModalFilter";

const meta: Meta<typeof ModalFilter> = {
  title: "User/Filter/ModalFilter",
  component: ModalFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isOpen: {
      description: "모달 열림 여부",
      control: "boolean",
    },
    onClose: {
      description: "모달 닫기 핸들러",
      action: "closed",
    },
    title: {
      description: "모달 제목",
      control: "text",
    },
    sectionTitle: {
      description: "섹션 제목",
      control: "text",
    },
    options: {
      description: "필터 옵션 목록",
      control: "object",
    },
    selectedValues: {
      description: "선택된 값(들)",
      control: "object",
    },
    type: {
      description: "필터 타입 (checkbox/radio)",
      control: "select",
      options: ["checkbox", "radio"],
    },
    layout: {
      description: "레이아웃 (grid/vertical)",
      control: "select",
      options: ["grid", "vertical"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ModalFilter>;

/**
 * 체크박스 필터 (다중 선택)
 *
 * 여러 옵션을 선택할 수 있는 체크박스 필터입니다.
 */
export const CheckboxFilter: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen || true);
    const [selectedValues, setSelectedValues] = useState<string[]>(
      Array.isArray(args.selectedValues) ? args.selectedValues : []
    );

    return React.createElement(ModalFilter, {
      ...args,
      isOpen,
      onClose: () => {
        setIsOpen(false);
        args.onClose?.();
      },
      selectedValues,
      onOptionChange: (option) => {
        const value = typeof option === "string" ? option : option.value;
        setSelectedValues((prev) =>
          prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value]
        );
        args.onOptionChange?.(option);
      },
      onApply: () => {
        args.onApply?.();
      },
      onReset: () => {
        setSelectedValues([]);
        args.onReset?.();
      },
    });
  },
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    title: "카테고리",
    sectionTitle: "카테고리",
    options: ["전체", "식품", "뷰티", "가전", "유아동", "여가", "서비스"],
    selectedValues: [],
    type: "checkbox",
    layout: "grid",
    showReset: true,
    showApply: true,
  },
};

/**
 * 라디오 필터 (단일 선택)
 *
 * 하나의 옵션만 선택할 수 있는 라디오 필터입니다.
 */
export const RadioFilter: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen || true);
    const [selectedValue, setSelectedValue] = useState<string>(
      typeof args.selectedValues === "string" ? args.selectedValues : ""
    );

    return React.createElement(ModalFilter, {
      ...args,
      isOpen,
      onClose: () => {
        setIsOpen(false);
        args.onClose?.();
      },
      selectedValues: selectedValue,
      onOptionChange: (option) => {
        const value = typeof option === "string" ? option : option.value;
        setSelectedValue(value);
        args.onOptionChange?.(option);
      },
      onApply: () => {
        args.onApply?.();
      },
      onReset: () => {
        setSelectedValue("");
        args.onReset?.();
      },
    });
  },
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    title: "정렬",
    options: ["최신순", "오래된순", "인기순", "가격순"],
    selectedValues: "최신순",
    type: "radio",
    layout: "vertical",
    showReset: true,
    showApply: true,
  },
};

/**
 * 세로 레이아웃
 *
 * 세로로 배치된 필터 옵션입니다.
 */
export const VerticalLayout: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen || true);
    const [selectedValues, setSelectedValues] = useState<string[]>(
      Array.isArray(args.selectedValues) ? args.selectedValues : []
    );

    return React.createElement(ModalFilter, {
      ...args,
      isOpen,
      onClose: () => {
        setIsOpen(false);
        args.onClose?.();
      },
      selectedValues,
      onOptionChange: (option) => {
        const value = typeof option === "string" ? option : option.value;
        setSelectedValues((prev) =>
          prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value]
        );
        args.onOptionChange?.(option);
      },
      onApply: () => {
        args.onApply?.();
      },
      onReset: () => {
        setSelectedValues([]);
        args.onReset?.();
      },
    });
  },
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    title: "채널",
    sectionTitle: "채널",
    options: [
      "전체",
      "네이버 블로그",
      "네이버 클립",
      "인스타그램",
      "유튜브",
      "릴스",
      "쇼츠",
    ],
    selectedValues: [],
    type: "checkbox",
    layout: "vertical",
    showReset: true,
    showApply: true,
  },
};

/**
 * 학습 포인트:
 *
 * 1. 범용 모달 필터 컴포넌트
 *    - 체크박스/라디오 버튼 방식의 필터링을 제공합니다
 *    - FilterBar에서 카테고리/채널/정렬 필터로 사용됩니다
 *
 * 2. 다중 선택 vs 단일 선택
 *    - checkbox: 다중 선택 (배열로 관리)
 *    - radio: 단일 선택 (문자열로 관리)
 *
 * 3. 레이아웃 옵션
 *    - grid: 그리드 레이아웃 (여러 열로 배치)
 *    - vertical: 세로 레이아웃 (한 열로 배치)
 *
 * 4. 조건부 렌더링
 *    - isOpen이 false면 null을 반환하여 렌더링하지 않습니다
 *    - 모달 오버레이 클릭 시 닫기 기능을 제공합니다
 */

