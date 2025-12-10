/**
 * SortFilterControl 컴포넌트 스토리북
 *
 * 정렬 버튼과 정렬 모달을 통합한 컴포넌트의 다양한 사용 예시를 보여줍니다.
 *
 * Storybook이란?
 * - 컴포넌트를 독립적으로 개발하고 테스트할 수 있는 도구입니다
 * - 다양한 props 조합으로 컴포넌트의 동작을 확인할 수 있습니다
 * - 디자이너와 개발자가 협업하기 좋은 도구입니다
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import SortFilterControl, { type SortOptionItem } from "./SortFilterControl";

// Meta 타입: Storybook에서 컴포넌트의 메타데이터를 정의합니다
// title: Storybook 사이드바에서 보이는 경로 (슬래시로 계층 구조 표현)
// component: 스토리를 생성할 컴포넌트
// tags: 자동 문서 생성 등의 기능을 활성화
const meta: Meta<typeof SortFilterControl> = {
  title: "Partner/CampaignApplication/SortFilterControl",
  component: SortFilterControl,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    options: {
      description: "정렬 옵션 배열",
      control: "object",
    },
    value: {
      description: "현재 선택된 정렬 값",
      control: "text",
    },
    onChange: {
      description: "정렬 옵션 변경 핸들러",
      action: "sort changed",
    },
    defaultSort: {
      description: "기본 정렬 값",
      control: "text",
    },
    triggerAriaLabel: {
      description: "트리거 버튼의 접근성 라벨",
      control: "text",
    },
    modalTitle: {
      description: "모달 제목",
      control: "text",
    },
  },
};

export default meta;

// StoryObj 타입: 개별 스토리의 타입을 정의합니다
type Story = StoryObj<typeof SortFilterControl>;

// 기본 정렬 옵션
const defaultSortOptions: SortOptionItem[] = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "name", label: "이름순" },
];

/**
 * 기본 정렬 컨트롤
 *
 * 최신순, 오래된순, 이름순 옵션을 제공하는 정렬 컨트롤입니다.
 */
export const Default: Story = {
  render: (args) => {
    const [sortValue, setSortValue] = useState(args.value || "latest");

    return React.createElement(SortFilterControl, {
      ...args,
      value: sortValue,
      onChange: (option: SortOptionItem) => {
        setSortValue(option.value);
        args.onChange?.(option);
      },
    });
  },
  args: {
    options: defaultSortOptions,
    value: "latest",
    onChange: (option: SortOptionItem) => console.log("Sort changed:", option),
    defaultSort: "latest",
    triggerAriaLabel: "정렬 선택",
    modalTitle: "정렬",
  },
};

/**
 * 인터랙티브 예시
 *
 * 실제로 정렬 옵션을 선택할 수 있는 상태입니다.
 */
export const Interactive: Story = {
  render: (args) => {
    const [sortValue, setSortValue] = useState(args.value || "latest");

    return React.createElement(SortFilterControl, {
      ...args,
      value: sortValue,
      onChange: (option: SortOptionItem) => {
        setSortValue(option.value);
        args.onChange?.(option);
      },
    });
  },
  args: {
    options: defaultSortOptions,
    value: "latest",
    onChange: (option: SortOptionItem) => console.log("Sort changed:", option),
    defaultSort: "latest",
    triggerAriaLabel: "정렬 선택",
    modalTitle: "정렬",
  },
};

/**
 * 커스텀 정렬 옵션
 *
 * 다른 정렬 옵션을 사용하는 예시입니다.
 */
export const CustomOptions: Story = {
  render: (args) => {
    const [sortValue, setSortValue] = useState(args.value || "popular");

    return React.createElement(SortFilterControl, {
      ...args,
      value: sortValue,
      onChange: (option: SortOptionItem) => {
        setSortValue(option.value);
        args.onChange?.(option);
      },
    });
  },
  args: {
    options: [
      { value: "popular", label: "인기순" },
      { value: "rating", label: "평점순" },
      { value: "price", label: "가격순" },
    ],
    value: "popular",
    onChange: (option: SortOptionItem) => console.log("Sort changed:", option),
    defaultSort: "popular",
    triggerAriaLabel: "정렬 선택",
    modalTitle: "정렬",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 통합 컴포넌트 패턴
 *    - 정렬 버튼과 모달을 하나의 컴포넌트로 묶어서 사용합니다
 *    - 내부에서 모달 열기/닫기 상태를 관리하여 코드 중복을 제거합니다
 *
 * 2. useState 훅
 *    - 컴포넌트 내부에서 모달 열림/닫힘 상태를 관리합니다
 *    - isOpen 상태로 모달의 표시 여부를 제어합니다
 *
 * 3. useMemo 훅
 *    - defaultOptionLabel을 메모이제이션하여 불필요한 재계산을 방지합니다
 *    - options나 defaultSort가 변경될 때만 재계산합니다
 *
 * 4. 라디오 버튼 패턴
 *    - 여러 옵션 중 하나만 선택할 수 있는 라디오 버튼을 사용합니다
 *    - checked 속성으로 현재 선택된 옵션을 표시합니다
 *
 * 5. 접근성 (Accessibility)
 *    - role="dialog", aria-modal="true"로 모달임을 명시합니다
 *    - aria-label로 모달의 목적을 설명합니다
 *    - 키보드 네비게이션을 고려합니다
 *
 * 6. 이벤트 전파 제어
 *    - stopPropagation()으로 이벤트 버블링을 막습니다
 *    - 오버레이 클릭 시 모달을 닫습니다
 *
 * 7. 조건부 렌더링
 *    - isOpen이 true일 때만 모달을 렌더링합니다
 *    - && 연산자를 사용하여 간단하게 조건부 렌더링합니다
 */
