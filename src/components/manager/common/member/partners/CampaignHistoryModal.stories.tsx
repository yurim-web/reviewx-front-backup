/**
 * CampaignHistoryModal 컴포넌트 스토리북 (파트너 래퍼)
 *
 * 파트너용 캠페인 진행 이력 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import CampaignHistoryModal from "./CampaignHistoryModal";
import type { RecentCampaign } from "@/data/manager_ga/member/partners";

// Mock 캠페인 데이터
const mockCampaigns: RecentCampaign[] = [
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
    type: "구매평",
    channel: "Instagram",
    points: 3000,
  },
  {
    campaign_number: "CP-2024-003",
    campaign_name: "구매평 작성 캠페인",
    status: "종료",
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
  title: "Manager/Common/Member/Partners/CampaignHistoryModal",
  component: CampaignHistoryModal,
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
    campaigns: {
      description: "최근 캠페인 배열",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignHistoryModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 파트너의 캠페인 진행 이력을 표시하는 모달입니다.
 */
export const Default: Story = {
  render: CampaignHistoryModalWrapper,
  args: {
    campaigns: mockCampaigns,
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
  },
};

/**
 * 학습 포인트:
 *
 * 1. 파트너용 캠페인 진행 이력 모달 컴포넌트
 *    - GA/SA 관리자 파트너 상세 페이지에서 공통 CampaignHistoryModal을 사용합니다
 *    - 스타일과 데이터를 전달하여 렌더링합니다
 *
 * 2. 데이터 변환
 *    - RecentCampaign을 CampaignHistoryItem으로 변환합니다
 *    - convert_to_campaign_history_item 함수를 사용합니다
 *
 * 3. 스타일 전달
 *    - manager_ga/member/reviewers/modal/campaign_history_modal.module.css 스타일을 사용합니다
 *    - 리뷰어와 파트너가 동일한 스타일을 공유합니다
 */
