/**
 * CampaignHistoryModal 컴포넌트 스토리북
 *
 * 캠페인 진행 내역 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import CampaignHistoryModal, {
  type CampaignHistoryItem,
} from "./CampaignHistoryModal";
import styles from "@/styles/manager_ga/member/reviewers/modal/campaign_history_modal.module.css";

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
  table_cell_campaign_name: string;
  status_tag: string;
  status_tag_progress: string;
  status_tag_completed: string;
  status_tag_cancelled: string;
  type_tag: string;
  channel_icon_wrapper: string;
  channel_icon: string;
  empty_state: string;
  empty_message: string;
};

// Mock 캠페인 내역 데이터
const mockCampaigns: CampaignHistoryItem[] = [
  {
    campaign_number: "CP-2024-001",
    campaign_name: "프리미엄 뷰티 제품 체험 캠페인",
    status: "진행",
    type: "배송형",
    channel: "Blog",
    points: 5000,
  },
  {
    campaign_number: "CP-2024-002",
    campaign_name: "맛집 탐방 캠페인",
    status: "종료",
    type: "방문형",
    channel: "Instagram",
    points: 3000,
  },
  {
    campaign_number: "CP-2024-003",
    campaign_name: "구매평 작성 캠페인",
    status: "취소",
    type: "구매평",
    channel: "Store",
    points: 0,
  },
];

// 안정적인 래퍼 컴포넌트 (깜빡임 방지)
const CampaignHistoryModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  return (
    <CampaignHistoryModal {...args} is_open={isOpen} on_close={handleClose} />
  );
};

const meta: Meta<typeof CampaignHistoryModal> = {
  title: "Manager/Common/Member/Modal/CampaignHistoryModal",
  component: CampaignHistoryModal,
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
    campaigns: {
      description: "캠페인 목록 데이터",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignHistoryModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 캠페인 진행 내역을 표시하는 모달입니다.
 */
export const Default: Story = {
  render: CampaignHistoryModalWrapper,
  args: {
    campaigns: mockCampaigns,
    styles: modal_styles,
  },
};

/**
 * 빈 캠페인 목록
 *
 * 캠페인 내역이 없을 때 빈 상태 메시지를 표시합니다.
 */
export const EmptyCampaigns: Story = {
  render: (args) => <CampaignHistoryModalWrapper {...args} campaigns={[]} />,
  args: {
    campaigns: [],
    styles: modal_styles,
  },
};

/**
 * 다양한 상태의 캠페인
 *
 * 진행, 종료, 취소 상태의 캠페인을 모두 표시합니다.
 */
export const VariousStatuses: Story = {
  render: CampaignHistoryModalWrapper,
  args: {
    campaigns: [
      ...mockCampaigns,
      {
        campaign_number: "CP-2024-004",
        campaign_name: "기자단 활동 캠페인",
        status: "진행",
        type: "기자단",
        channel: "Youtube",
        points: 8000,
      },
      {
        campaign_number: "CP-2024-005",
        campaign_name: "미션형 캠페인",
        status: "종료",
        type: "미션형",
        channel: "Clip",
        points: 4000,
      },
    ],
    styles: modal_styles,
  },
};

/**
 * 학습 포인트:
 *
 * 1. 캠페인 진행 내역 모달 컴포넌트
 *    - 리뷰어/파트너의 캠페인 진행 내역을 테이블 형태로 표시합니다
 *    - 캠페인 번호, 캠페인명, 상태, 유형, 채널, 지급 포인트 정보를 보여줍니다
 *
 * 2. 조건부 렌더링
 *    - is_open이 false이면 null을 반환하여 아무것도 렌더링하지 않습니다
 *    - 모달이 열려있을 때만 내용을 표시합니다
 *
 * 3. 상태 태그
 *    - 진행: 초록색 태그
 *    - 종료: 파란색 태그
 *    - 취소: 빨간색 태그
 *
 * 4. 채널 아이콘
 *    - 각 채널에 맞는 아이콘을 표시합니다
 *    - Blog, Clip, Instagram, Youtube, Store
 *
 * 5. 포인트 포맷팅
 *    - toLocaleString을 사용하여 천 단위 콤마로 포맷팅합니다
 */
