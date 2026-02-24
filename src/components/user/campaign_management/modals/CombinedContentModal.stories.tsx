/* ========================================
   CombinedContentModal 스토리북
   ======================================== */

/**
 * CombinedContentModal.stories
 *
 * 목적: 통합 콘텐츠 등록 모달 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/CampaignManagement/Modals/CombinedContentModal)
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import CombinedContentModal from "./CombinedContentModal";

// 안정적인 래퍼 컴포넌트
const CombinedContentModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  return (
    <CombinedContentModal {...args} isOpen={isOpen} onClose={handleClose} />
  );
};

const meta: Meta<typeof CombinedContentModal> = {
  title: "User/CampaignManagement/Modals/CombinedContentModal",
  component: CombinedContentModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isOpen: {
      description: "모달 열림/닫힘 상태",
      control: "boolean",
    },
    onClose: {
      description: "모달 닫기 핸들러 함수",
      action: "modal closed",
    },
    campaignTitle: {
      description: "캠페인 제목 (선택적)",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CombinedContentModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 링크와 이미지를 모두 업로드할 수 있는 통합 콘텐츠 등록 모달입니다.
 */
export const Default: Story = {
  render: CombinedContentModalWrapper,
  args: {
    campaignTitle: "테스트 캠페인",
  },
};

/**
 * 캠페인 제목 없음
 *
 * 캠페인 제목이 없는 상태입니다.
 */
export const WithoutCampaignTitle: Story = {
  render: CombinedContentModalWrapper,
  args: {},
};
