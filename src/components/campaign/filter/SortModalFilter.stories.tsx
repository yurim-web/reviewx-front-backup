/**
 * SortModalFilter 컴포넌트 스토리북
 *
 * 정렬 모달 필터 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import SortModalFilter from "./SortModalFilter";

const meta: Meta<typeof SortModalFilter> = {
  title: "Campaign/Filter/SortModalFilter",
  component: SortModalFilter,
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
    options: {
      description: "정렬 옵션 목록",
      control: "object",
    },
    selectedValue: {
      description: "선택된 정렬 값",
      control: "text",
    },
    onOptionChange: {
      description: "옵션 변경 핸들러",
      action: "option changed",
    },
    showReset: {
      description: "초기화 버튼 표시 여부",
      control: "boolean",
    },
    defaultSort: {
      description: "기본 정렬값",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SortModalFilter>;

/**
 * 기본 정렬 필터
 *
 * 라디오 버튼 방식의 정렬 필터입니다.
 */
export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen || true);
    const [selectedValue, setSelectedValue] = useState<string>(
      args.selectedValue || args.defaultSort || "최신순"
    );

    return React.createElement(SortModalFilter, {
      ...args,
      isOpen,
      onClose: () => {
        setIsOpen(false);
        args.onClose?.();
      },
      selectedValue,
      onOptionChange: (option) => {
        const value = typeof option === "string" ? option : option.value;
        setSelectedValue(value);
        args.onOptionChange?.(option);
      },
    });
  },
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    title: "정렬",
    options: ["최신순", "오래된순", "인기순", "가격순"],
    selectedValue: "최신순",
    showReset: true,
    defaultSort: "최신순",
  },
};

/**
 * 다양한 정렬 옵션
 *
 * 더 많은 정렬 옵션이 있는 정렬 필터입니다.
 */
export const ExtendedOptions: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen || true);
    const [selectedValue, setSelectedValue] = useState<string>(
      args.selectedValue || args.defaultSort || "최신순"
    );

    return React.createElement(SortModalFilter, {
      ...args,
      isOpen,
      onClose: () => {
        setIsOpen(false);
        args.onClose?.();
      },
      selectedValue,
      onOptionChange: (option) => {
        const value = typeof option === "string" ? option : option.value;
        setSelectedValue(value);
        args.onOptionChange?.(option);
      },
    });
  },
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    title: "정렬",
    options: [
      "최신순",
      "오래된순",
      "인기순",
      "가격순",
      "리뷰 많은순",
      "평점 높은순",
    ],
    selectedValue: "인기순",
    showReset: true,
    defaultSort: "최신순",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 정렬 전용 모달 필터
 *    - 라디오 버튼 방식의 단일 선택 정렬 필터입니다
 *    - 세로 레이아웃으로 옵션을 표시합니다
 *
 * 2. 기본 정렬값
 *    - defaultSort로 초기화 시 사용할 기본값을 설정합니다
 *    - 초기화 버튼 클릭 시 defaultSort로 되돌아갑니다
 *
 * 3. 단일 선택
 *    - 라디오 버튼으로 하나의 옵션만 선택할 수 있습니다
 *    - 선택된 옵션은 시각적으로 강조 표시됩니다
 *
 * 4. 스크롤 없음
 *    - 정렬 옵션은 보통 적은 수이므로 스크롤이 필요 없습니다
 *    - 세로 레이아웃으로 깔끔하게 표시됩니다
 */

