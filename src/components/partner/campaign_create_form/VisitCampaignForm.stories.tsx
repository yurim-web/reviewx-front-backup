/**
 * VisitCampaignForm 컴포넌트 스토리북
 *
 * 방문형 캠페인 생성 폼 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import VisitCampaignForm from "./VisitCampaignForm";

const meta: Meta<typeof VisitCampaignForm> = {
  title: "Partner/CampaignCreateForm/VisitCampaignForm",
  component: VisitCampaignForm,
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

type Story = StoryObj<typeof VisitCampaignForm>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderVisitCampaignForm = (args: any) => {
  return <VisitCampaignForm {...args} />;
};

/**
 * 기본 생성 폼
 *
 * 방문형 캠페인을 생성하는 기본 폼입니다.
 */
export const Default: Story = {
  render: renderVisitCampaignForm,
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
  render: renderVisitCampaignForm,
  args: {
    onSubmit: (data) => console.log("Form submitted:", data),
    isSubmitting: true,
    mode: "create",
  },
};

/**
 * 수정 모드
 *
 * 기존 방문형 캠페인을 수정하는 모드입니다.
 */
export const EditMode: Story = {
  render: renderVisitCampaignForm,
  args: {
    onSubmit: (data) => console.log("Form submitted:", data),
    isSubmitting: false,
    mode: "edit",
    initialData: {
      campaignType: "방문형",
      platform: "네이버 블로그",
      title: "수정할 방문형 캠페인",
      category: "음식",
      brandName: "테스트 식당",
      providedItems: "식사 1인분",
      promotionLink: "https://example.com",
      currentPoints: "58,000",
      additionalPoints: "0",
      recruitmentCount: "5",
      recruitmentPeriod: "2024-01-01 ~ 2024-01-31",
      announcementDate: "2024-02-01",
      registrationPeriod: "2024-02-01 ~ 2024-02-15",
      region: "서울",
      subRegion: "강남구",
      visitZipCode: "06000",
      visitBaseAddress: "서울 강남구 테헤란로 123",
      visitDetailAddress: "1층",
      visitLink: "https://map.naver.com/example",
      keywords: "방문형 키워드",
      adultOnly: false,
      allowReParticipation: false,
      allowLateSubmission: false,
      minTextLength: "1000",
      minImageCount: "5",
      videoCount: "",
      videoDuration: "",
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
 * 1. 방문형 캠페인 생성 폼 컴포넌트
 *    - 방문형 캠페인 등록을 위한 전용 폼 컴포넌트입니다
 *    - 매장 방문을 위한 캠페인입니다
 *
 * 2. 방문형 특화 기능
 *    - region, visitAddress, addressDetail, visitLink 필드가 있습니다
 *    - 지역 선택과 방문 주소 정보를 입력할 수 있습니다
 */
