/* ========================================
   ImageUploadModal 스토리북
   ======================================== */

/**
 * ImageUploadModal.stories
 *
 * 목적: 이미지 업로드 모달 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/CampaignManagement/Modals/ImageUploadModal)
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import ImageUploadModal from "./ImageUploadModal";

// 안정적인 래퍼 컴포넌트
const ImageUploadModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  return (
    <ImageUploadModal {...args} isOpen={isOpen} onClose={handleClose} />
  );
};

const meta: Meta<typeof ImageUploadModal> = {
  title: "User/CampaignManagement/Modals/ImageUploadModal",
  component: ImageUploadModal,
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

type Story = StoryObj<typeof ImageUploadModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 이미지를 업로드하여 콘텐츠를 등록할 수 있는 모달입니다.
 */
export const Default: Story = {
  render: ImageUploadModalWrapper,
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
  render: ImageUploadModalWrapper,
  args: {},
};
