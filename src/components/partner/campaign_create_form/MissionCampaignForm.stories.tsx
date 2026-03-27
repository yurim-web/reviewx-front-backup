/**
 * MissionCampaignForm 컴포넌트 스토리북
 *
 * 미션형 캠페인 생성 폼 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import MissionCampaignForm from "./MissionCampaignForm";

const meta: Meta<typeof MissionCampaignForm> = {
  title: "Partner/CampaignCreateForm/MissionCampaignForm",
  component: MissionCampaignForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/partner/campaign/create",
      },
    },
  },
  argTypes: {
    onSubmit: {
      description: "폼 제출 핸들러",
      action: "form submitted",
    },
    isSubmitting: {
      description: "제출 중 상태",
      control: "boolean",
    },
    initialData: {
      description: "초기 데이터 (수정 모드용)",
      control: "object",
    },
    mode: {
      description: "폼 동작 모드",
      control: "select",
      options: ["create", "edit"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof MissionCampaignForm>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderMissionCampaignForm = (args: any) => {
  return React.createElement(MissionCampaignForm, args);
};

/**
 * 기본 생성 폼
 *
 * 미션형 캠페인을 생성하는 기본 폼입니다.
 */
export const Default: Story = {
  render: renderMissionCampaignForm,
  args: {
    onSubmit: (data) => console.log("Form submitted:", data),
    isSubmitting: false,
    mode: "create",
  },
};

/**
 * 제출 중 상태
 *
 * 폼 제출 중인 상태를 보여줍니다.
 */
export const Submitting: Story = {
  render: renderMissionCampaignForm,
  args: {
    onSubmit: (data) => console.log("Form submitted:", data),
    isSubmitting: true,
    mode: "create",
  },
};

/**
 * 수정 모드
 *
 * 기존 미션형 캠페인을 수정하는 모드입니다.
 */
export const EditMode: Story = {
  render: renderMissionCampaignForm,
  args: {
    onSubmit: (data) => console.log("Form submitted:", data),
    isSubmitting: false,
    mode: "edit",
    initialData: {
      campaignType: "미션형",
      platform: "인스타그램",
      title: "수정할 미션형 캠페인",
      category: "패션",
      brandName: "테스트 패션",
      providedItems: "의류 1벌",
      promotionLink: "https://example.com",
      currentPoints: "58,000",
      additionalPoints: "0",
      recruitmentCount: "15",
      recruitmentPeriod: "2024-01-01 ~ 2024-01-31",
      announcementDate: "2024-02-01",
      registrationPeriod: "2024-02-01 ~ 2024-02-15",
      keywords: "미션형 키워드",
      adultOnly: false,
      allowReParticipation: false,
      allowLateSubmission: true,
      minTextLength: "500",
      minImageCount: "5",
      videoCount: "",
      videoDuration: "",
      requireContentLink: true,
      requireContentImage: false,
      requireLinkAttachment: false,
      requireKeywordAttachment: true,
      guidelines: "",
      isUrgent: false,
    },
  },
};

/**
 * 학습 포인트:
 *
 * 1. 미션형 캠페인 생성 폼 컴포넌트
 *    - 미션형 캠페인 등록을 위한 전용 폼 컴포넌트입니다
 *    - 무료 체험 캠페인으로 진행됩니다
 *
 * 2. 미션형 특화 기능
 *    - requireContentLink, requireContentImage 옵션이 있습니다
 *    - 이미지 확인, 링크 확인 기능을 설정할 수 있습니다
 */
