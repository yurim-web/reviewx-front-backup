/**
 * CampaignHistoryModal 컴포넌트 스토리북 (리뷰어 래퍼)
 *
 * 리뷰어용 캠페인 진행 이력 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import CampaignHistoryModal from "./CampaignHistoryModal";
import type { RecentCampaign } from "@/data/manager_ga/member/reviewers";

// Mock 캠페인 데이터
const mockCampaigns: RecentCampaign[] = [
  {
    campaign_number: "CP-2024-001",
    partner_name: "테스트 파트너",
    campaign_name: "프리미엄 뷰티 제품 체험 캠페인",
    status: "진행",
    type: "배송형",
    channel: "Blog",
    points: 5000,
  },
  {
    campaign_number: "CP-2024-002",
    partner_name: "테스트 파트너2",
    campaign_name: "맛집 탐방 캠페인",
    status: "종료",
    type: "구매평",
    channel: "Instagram",
    points: 3000,
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
  title: "Manager/Common/Member/Reviewers/CampaignHistoryModal",
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
 * 리뷰어의 캠페인 진행 이력을 표시하는 모달입니다.
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
