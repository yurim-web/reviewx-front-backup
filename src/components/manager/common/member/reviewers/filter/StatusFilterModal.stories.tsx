/**
 * StatusFilterModal 컴포넌트 스토리북 (리뷰어)
 *
 * 리뷰어 상태 필터 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback, useEffect } from "react";
import StatusFilterModal from "./StatusFilterModal";
import type { ReviewerStatus } from "@/data/manager_ga/member/reviewers";

// 안정적인 래퍼 컴포넌트 (깜빡임 방지)
const StatusFilterModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<ReviewerStatus[]>(
    args.selected_statuses || []
  );

  // args가 변경될 때 selectedStatuses 업데이트
  useEffect(() => {
    if (args.selected_statuses !== undefined) {
      setSelectedStatuses(args.selected_statuses);
    }
  }, [args.selected_statuses]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleApply = useCallback(
    (statuses: ReviewerStatus[]) => {
      setSelectedStatuses(statuses);
      args.on_apply?.(statuses);
    },
    [args]
  );

  return (
    <StatusFilterModal
      {...args}
      is_open={isOpen}
      on_close={handleClose}
      selected_statuses={selectedStatuses}
      on_apply={handleApply}
    />
  );
};

const meta: Meta<typeof StatusFilterModal> = {
  title: "Manager/Common/Member/Reviewers/Filter/StatusFilterModal",
  component: StatusFilterModal,
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
    selected_statuses: {
      description: "현재 선택된 상태들",
      control: "object",
    },
    on_apply: {
      description: "필터 적용 함수",
      action: "filter applied",
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatusFilterModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 리뷰어 상태 필터를 선택할 수 있는 모달입니다.
 */
export const Default: Story = {
  render: StatusFilterModalWrapper,
  args: {
    selected_statuses: [],
    on_apply: (statuses) => console.log("Statuses applied:", statuses),
  },
};

/**
 * 선택된 상태가 있는 상태
 *
 * 이미 상태가 선택된 상태의 모달입니다.
 */
export const WithSelectedStatuses: Story = {
  render: StatusFilterModalWrapper,
  args: {
    selected_statuses: ["정상"],
    on_apply: (statuses) => console.log("Statuses applied:", statuses),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 리뷰어 상태 필터 모달 컴포넌트
 *    - 리뷰어 목록 페이지에서 상태를 필터링하는 모달입니다
 *    - 체크박스 방식의 다중 선택 필터링을 제공합니다
 *
 * 2. 상태 옵션
 *    - 정상: 정상 상태의 리뷰어
 *    - 일시 정지: 일시 정지된 리뷰어
 *    - 영구 정지: 영구 정지된 리뷰어
 *
 * 3. BaseFilterModal 사용
 *    - 공통 BaseFilterModal 컴포넌트를 사용합니다
 *    - 일관된 UI와 동작을 제공합니다
 */


