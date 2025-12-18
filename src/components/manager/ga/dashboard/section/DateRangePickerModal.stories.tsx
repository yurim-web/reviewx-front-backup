/**
 * DateRangePickerModal 컴포넌트 스토리북
 *
 * 날짜 범위 선택 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import DateRangePickerModal, { type DateRange } from "./DateRangePickerModal";

const meta: Meta<typeof DateRangePickerModal> = {
  title: "Manager/GA/Dashboard/Section/DateRangePickerModal",
  component: DateRangePickerModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
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
    selected_range: {
      description: "현재 선택된 날짜 범위",
      control: "object",
    },
    on_apply: {
      description: "날짜 범위 적용 핸들러 함수",
      action: "date range applied",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DateRangePickerModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 날짜 범위를 선택할 수 있는 모달입니다.
 */
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
      undefined
    );
    const handleClose = useCallback(() => setIsOpen(false), []);
    const handleApply = useCallback((range: DateRange | undefined) => {
      setDateRange(range);
      console.log("Date range applied:", range);
    }, []);
    return (
      <DateRangePickerModal
        is_open={isOpen}
        on_close={handleClose}
        selected_range={dateRange}
        on_apply={handleApply}
      />
    );
  },
};
