/**
 * BaseFilterModal 컴포넌트 스토리북
 *
 * 공통 필터 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import BaseFilterModal, { type FilterOption } from "./BaseFilterModal";

// Mock 필터 옵션 데이터
const mockOptions: FilterOption<string>[] = [
  { value: "option1", label: "옵션 1" },
  { value: "option2", label: "옵션 2" },
  { value: "option3", label: "옵션 3" },
  { value: "option4", label: "옵션 4" },
];

// 안정적인 래퍼 컴포넌트
const BaseFilterModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleApply = useCallback(
    (values: string[]) => {
      setSelectedValues(values);
      args.on_apply?.(values);
    },
    [args]
  );

  return (
    <BaseFilterModal
      {...args}
      is_open={isOpen}
      on_close={handleClose}
      selected_values={selectedValues}
      on_apply={handleApply}
    />
  );
};

const meta: Meta<typeof BaseFilterModal> = {
  title: "Manager/GA/Common/Filter/BaseFilterModal",
  component: BaseFilterModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    is_open: {
      description: "모달 열림/닫힘 상태",
      control: "boolean",
    },
    on_close: {
      description: "모달 닫기 핸들러 함수",
      action: "modal closed",
    },
    selected_values: {
      description: "현재 선택된 값들",
      control: "object",
    },
    on_apply: {
      description: "필터 적용 핸들러 함수",
      action: "filter applied",
    },
    options: {
      description: "필터 옵션 목록",
      control: "object",
    },
    section_title: {
      description: "섹션 제목",
      control: "text",
    },
    modal_title: {
      description: "모달 제목",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof BaseFilterModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 공통 필터 모달의 기본 상태입니다.
 */
export const Default: Story = {
  render: BaseFilterModalWrapper,
  args: {
    options: mockOptions,
    section_title: "필터 옵션",
    modal_title: "필터",
  },
};

/**
 * 선택된 값이 있는 상태
 *
 * 일부 옵션이 이미 선택된 상태입니다.
 */
export const WithSelectedValues: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedValues, setSelectedValues] = useState<string[]>(["option1", "option3"]);

    return (
      <BaseFilterModal
        {...args}
        is_open={isOpen}
        on_close={() => setIsOpen(false)}
        selected_values={selectedValues}
        on_apply={(values) => {
          setSelectedValues(values as string[]);
          args.on_apply?.(values);
        }}
      />
    );
  },
  args: {
    options: mockOptions,
    section_title: "필터 옵션",
    modal_title: "필터",
  },
};

/**
 * 많은 옵션이 있는 상태
 *
 * 많은 필터 옵션이 있는 경우의 레이아웃을 확인할 수 있습니다.
 */
export const WithManyOptions: Story = {
  render: BaseFilterModalWrapper,
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `option${i + 1}`,
      label: `옵션 ${i + 1}`,
    })),
    section_title: "필터 옵션",
    modal_title: "필터",
  },
};
