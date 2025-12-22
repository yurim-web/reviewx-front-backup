/**
 * PenaltyHistoryModal 컴포넌트 스토리북
 *
 * 패널티 내역 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import PenaltyHistoryModal, {
  type PenaltyHistoryItem,
} from "./PenaltyHistoryModal";
import styles from "@/styles/manager/common/member/reviewers/modal/penalty_history_modal.module.css";

// Storybook에서 타입 요구사항을 만족하도록 CSS 모듈을 명시적으로 캐스팅
const modal_styles = styles as Record<string, string> & {
  modal_overlay: string;
  modal_container: string;
  modal_content: string;
  modal_header: string;
  modal_title: string;
  close_button: string;
  close_icon: string;
  table_wrapper: string;
  table_header: string;
  table_body: string;
  table_row: string;
  table_cell: string;
  type_tag_penalty: string;
  status_tag: string;
  status_tag_suspended: string;
  status_tag_normal: string;
  empty_state: string;
  empty_message: string;
};

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
  {
    type: "기타",
    reason: "부적절한 콘텐츠 작성",
    processed_date: "2024-01-05 10:20",
    status: "정상",
  },
];

// 안정적인 래퍼 컴포넌트 (깜빡임 방지)
const PenaltyHistoryModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  return (
    <PenaltyHistoryModal {...args} is_open={isOpen} on_close={handleClose} />
  );
};

const meta: Meta<typeof PenaltyHistoryModal> = {
  title: "Manager/Common/Member/Modal/PenaltyHistoryModal",
  component: PenaltyHistoryModal,
  tags: ["autodocs"],
  parameters: {
    // 모달이 전체 화면을 덮도록 Storybook 캔버스를 전체 화면 레이아웃으로 설정
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
    penalty_history: {
      description: "패널티 내역 목록 데이터",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PenaltyHistoryModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 패널티 내역을 표시하는 모달입니다.
 */
export const Default: Story = {
  render: PenaltyHistoryModalWrapper,
  args: {
    penalty_history: mockPenaltyHistory,
    styles: modal_styles,
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
    styles: modal_styles,
  },
};

/**
 * 다양한 상태의 패널티
 *
 * 경고, 일시정지, 정상 상태의 패널티를 모두 표시합니다.
 */
export const VariousStatuses: Story = {
  render: PenaltyHistoryModalWrapper,
  args: {
    penalty_history: [
      ...mockPenaltyHistory,
      {
        type: "지각 제출",
        reason: "연속 지각 제출",
        processed_date: "2024-01-20 16:00",
        status: "일시정지",
      },
      {
        type: "기타",
        reason: "규정 위반",
        processed_date: "2024-01-25 11:15",
        status: "정상",
      },
    ],
    styles: modal_styles,
  },
};

/**
 * 학습 포인트:
 *
 * 1. 패널티 내역 모달 컴포넌트
 *    - 리뷰어/파트너의 패널티 내역을 테이블 형태로 표시합니다
 *    - 유형, 사유, 처리일, 상태 정보를 보여줍니다
 *
 * 2. 조건부 렌더링
 *    - is_open이 false이면 null을 반환하여 아무것도 렌더링하지 않습니다
 *    - 모달이 열려있을 때만 내용을 표시합니다
 *
 * 3. 상태 태그
 *    - 일시 정지: 빨간색 태그
 *    - 정상: 파란색 태그
 *
 * 4. 사유 처리
 *    - reason이 있으면 reason을, 없으면 type을 사유로 사용합니다
 *    - 파트너는 reason이 없고 type만 사용합니다
 *
 * 5. 상태 표시 변환
 *    - '일시정지'를 '일시 정지'로 변환하여 표시합니다
 */
