/**
 * PenaltyHistoryModal 컴포넌트 스토리북 (리뷰어 래퍼)
 *
 * 리뷰어용 패널티 이력 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import PenaltyHistoryModal from "./PenaltyHistoryModal";
import type { PenaltyHistoryItem } from "@/data/manager_ga/member/reviewers";

// Mock 패널티 내역 데이터
const mockPenaltyHistory: PenaltyHistoryItem[] = [
  {
    type: "지각 제출",
    reason: "리뷰 제출 기한을 지키지 않음",
    processed_date: "2024-01-15 18:56",
    status: "경고",
  },
  {
    type: "선정 후 취소",
    reason: "캠페인 선정 후 무단 취소",
    processed_date: "2024-01-10 14:30",
    status: "일시정지",
  },
];

// 안정적인 래퍼 컴포넌트 (깜빡임 방지)
const PenaltyHistoryModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  return (
    <PenaltyHistoryModal
      {...args}
      is_open={isOpen}
      on_close={handleClose}
    />
  );
};

const meta: Meta<typeof PenaltyHistoryModal> = {
  title: "Manager/Common/Member/Reviewers/PenaltyHistoryModal",
  component: PenaltyHistoryModal,
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
    penalty_history: {
      description: "패널티 이력 배열",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PenaltyHistoryModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 리뷰어의 패널티 이력을 표시하는 모달입니다.
 */
export const Default: Story = {
  render: PenaltyHistoryModalWrapper,
  args: {
    penalty_history: mockPenaltyHistory,
  },
};

/**
 * 빈 패널티 내역
 *
 * 패널티 내역이 없을 때 빈 상태 메시지를 표시합니다.
 */
export const EmptyPenaltyHistory: Story = {
  render: (args) => (
    <PenaltyHistoryModalWrapper {...args} penalty_history={[]} />
  ),
  args: {
    penalty_history: [],
  },
};

/**
 * 학습 포인트:
 *
 * 1. 리뷰어용 패널티 이력 모달 컴포넌트
 *    - GA/SA 관리자 리뷰어 상세 페이지에서 공통 PenaltyHistoryModal을 사용합니다
 *    - 스타일과 데이터를 전달하여 렌더링합니다
 *
 * 2. 데이터 변환
 *    - PenaltyHistoryItem을 CommonPenaltyHistoryItem으로 변환합니다
 *    - 리뷰어는 reason이 있어서 reason을 포함하여 변환합니다
 *
 * 3. 스타일 전달
 *    - manager_ga/member/reviewers/modal/penalty_history_modal.module.css 스타일을 사용합니다
 *    - 리뷰어와 파트너가 동일한 스타일을 공유합니다
 */


