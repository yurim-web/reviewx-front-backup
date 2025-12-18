/**
 * DivisionFilterModal 컴포넌트 스토리북
 *
 * 구분 필터 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback, useEffect } from "react";
import DivisionFilterModal from "./DivisionFilterModal";
import type { PartnerDivision } from "@/data/manager_ga/member/partners";

// 안정적인 래퍼 컴포넌트 (깜빡임 방지)
const DivisionFilterModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedDivisions, setSelectedDivisions] = useState<PartnerDivision[]>(
    args.selected_divisions || []
  );

  // args가 변경될 때 selectedDivisions 업데이트
  useEffect(() => {
    if (args.selected_divisions !== undefined) {
      setSelectedDivisions(args.selected_divisions);
    }
  }, [args.selected_divisions]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleApply = useCallback(
    (divisions: PartnerDivision[]) => {
      setSelectedDivisions(divisions);
      args.on_apply?.(divisions);
    },
    [args]
  );

  return (
    <DivisionFilterModal
      {...args}
      is_open={isOpen}
      on_close={handleClose}
      selected_divisions={selectedDivisions}
      on_apply={handleApply}
    />
  );
};

const meta: Meta<typeof DivisionFilterModal> = {
  title: "Manager/Common/Member/Partners/Filter/DivisionFilterModal",
  component: DivisionFilterModal,
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
      description: "모달 닫기 함수",
      action: "modal closed",
    },
    selected_divisions: {
      description: "현재 선택된 구분들",
      control: "object",
    },
    on_apply: {
      description: "필터 적용 함수",
      action: "filter applied",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DivisionFilterModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 구분 필터를 선택할 수 있는 모달입니다.
 */
export const Default: Story = {
  render: DivisionFilterModalWrapper,
  args: {
    selected_divisions: [],
    on_apply: (divisions) => console.log("Divisions applied:", divisions),
  },
};

/**
 * 선택된 구분이 있는 상태
 *
 * 이미 구분이 선택된 상태의 모달입니다.
 */
export const WithSelectedDivisions: Story = {
  render: DivisionFilterModalWrapper,
  args: {
    selected_divisions: ["법인"],
    on_apply: (divisions) => console.log("Divisions applied:", divisions),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 구분 필터 모달 컴포넌트
 *    - 파트너 목록 페이지에서 구분(법인/개인)을 필터링하는 모달입니다
 *    - 체크박스 방식의 다중 선택 필터링을 제공합니다
 *
 * 2. 구분 옵션
 *    - 법인: 법인 파트너
 *    - 개인: 개인 파트너
 *
 * 3. BaseFilterModal 사용
 *    - 공통 BaseFilterModal 컴포넌트를 사용합니다
 *    - 일관된 UI와 동작을 제공합니다
 */
