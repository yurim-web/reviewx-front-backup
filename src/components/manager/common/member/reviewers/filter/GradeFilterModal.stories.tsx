/**
 * GradeFilterModal 컴포넌트 스토리북
 *
 * 등급 필터 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback, useEffect } from "react";
import GradeFilterModal from "./GradeFilterModal";
import type { ReviewerStatusType } from "@/data/manager_ga/member/reviewers";

// 안정적인 래퍼 컴포넌트 (깜빡임 방지)
const GradeFilterModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedGrades, setSelectedGrades] = useState<ReviewerStatusType[]>(
    args.selected_grades || []
  );

  // args가 변경될 때 selectedGrades 업데이트
  useEffect(() => {
    if (args.selected_grades !== undefined) {
      setSelectedGrades(args.selected_grades);
    }
  }, [args.selected_grades]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleApply = useCallback(
    (grades: ReviewerStatusType[]) => {
      setSelectedGrades(grades);
      args.on_apply?.(grades);
    },
    [args]
  );

  return (
    <GradeFilterModal
      {...args}
      is_open={isOpen}
      on_close={handleClose}
      selected_grades={selectedGrades}
      on_apply={handleApply}
    />
  );
};

const meta: Meta<typeof GradeFilterModal> = {
  title: "Manager/Common/Member/Reviewers/Filter/GradeFilterModal",
  component: GradeFilterModal,
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
    selected_grades: {
      description: "현재 선택된 등급들",
      control: "object",
    },
    on_apply: {
      description: "필터 적용 함수",
      action: "filter applied",
    },
  },
};

export default meta;

type Story = StoryObj<typeof GradeFilterModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 등급 필터를 선택할 수 있는 모달입니다.
 */
export const Default: Story = {
  render: GradeFilterModalWrapper,
  args: {
    selected_grades: [],
    on_apply: (grades) => console.log("Grades applied:", grades),
  },
};

/**
 * 선택된 등급이 있는 상태
 *
 * 이미 등급이 선택된 상태의 모달입니다.
 */
export const WithSelectedGrades: Story = {
  render: GradeFilterModalWrapper,
  args: {
    selected_grades: ["서포터즈"],
    on_apply: (grades) => console.log("Grades applied:", grades),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 등급 필터 모달 컴포넌트
 *    - 리뷰어 목록 페이지에서 등급을 필터링하는 모달입니다
 *    - 체크박스 방식의 다중 선택 필터링을 제공합니다
 *
 * 2. 등급 옵션
 *    - 모범 회원: 모범적인 활동을 하는 리뷰어
 *    - 주의 회원: 주의가 필요한 리뷰어
 *    - 경고 회원: 경고를 받은 리뷰어
 *    - 이용 제한 회원: 이용이 제한된 리뷰어
 *
 * 3. BaseFilterModal 사용
 *    - 공통 BaseFilterModal 컴포넌트를 사용합니다
 *    - 일관된 UI와 동작을 제공합니다
 */
