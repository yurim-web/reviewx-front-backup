/**
 * DeliveryCampaignForm 컴포넌트 스토리북
 *
 * 배송형 캠페인 생성 폼 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DeliveryCampaignForm from "./DeliveryCampaignForm";

const meta: Meta<typeof DeliveryCampaignForm> = {
  title: "Partner/CampaignCreateForm/DeliveryCampaignForm",
  component: DeliveryCampaignForm,
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

type Story = StoryObj<typeof DeliveryCampaignForm>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderDeliveryCampaignForm = (args: any) => {
  return React.createElement(DeliveryCampaignForm, args);
};

/**
 * 기본 생성 폼
 *
 * 배송형 캠페인을 생성하는 기본 폼입니다.
 */
export const Default: Story = {
  render: renderDeliveryCampaignForm,
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
  render: renderDeliveryCampaignForm,
  args: {
    onSubmit: (data) => console.log("Form submitted:", data),
    isSubmitting: true,
    mode: "create",
  },
};

/**
 * 수정 모드
 *
 * 기존 캠페인을 수정하는 모드입니다.
 */
export const EditMode: Story = {
  render: renderDeliveryCampaignForm,
  args: {
    onSubmit: (data) => console.log("Form submitted:", data),
    isSubmitting: false,
    mode: "edit",
    initialData: {
      campaignType: "배송형",
      platform: "네이버 블로그",
      title: "수정할 캠페인 제목",
      category: "뷰티",
      brandName: "테스트 브랜드",
      providedItems: "제품 1개",
      promotionLink: "https://example.com",
      currentPoints: "58,000",
      additionalPoints: "5,000",
      recruitmentCount: "10",
      recruitmentPeriod: "2024-01-01 ~ 2024-01-31",
      announcementDate: "2024-02-01",
      registrationPeriod: "2024-02-01 ~ 2024-02-15",
      keywords: "배송형 키워드",
      adultOnly: false,
      allowReParticipation: false,
      allowLateSubmission: false,
      minTextLength: "1500",
      minImageCount: "10",
      videoCount: "",
      videoDuration: "",
      requireLinkAttachment: true,
      requireKeywordAttachment: true,
      guidelines: "",
      isUrgent: false,
    },
  },
};

/**
 * 학습 포인트:
 *
 * 1. 배송형 캠페인 생성 폼 컴포넌트
 *    - 배송형 캠페인 등록을 위한 전용 폼 컴포넌트입니다
 *    - 기본 정보, 이미지 업로드, 상세 정보, 참여/제출 옵션을 입력합니다
 *
 * 2. 생성/수정 모드
 *    - mode로 "create" 또는 "edit" 모드를 설정할 수 있습니다
 *    - 수정 모드에서는 initialData로 초기 데이터를 전달합니다
 *
 * 3. 폼 제출
 *    - onSubmit으로 폼 제출을 처리합니다
 *    - isSubmitting으로 제출 중 상태를 표시합니다
 *
 * 4. Next.js 의존성
 *    - useRouter를 사용하므로 Storybook에서 Next.js 모킹이 필요합니다
 *    - parameters.nextjs로 Next.js 환경을 모킹합니다
 */
