/**
 * ReviewCampaignForm 컴포넌트 스토리북
 *
 * 구매평 캠페인 생성 폼 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ReviewCampaignForm from "./ReviewCampaignForm";

const meta: Meta<typeof ReviewCampaignForm> = {
  title: "Partner/CampaignCreateForm/ReviewCampaignForm",
  component: ReviewCampaignForm,
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

type Story = StoryObj<typeof ReviewCampaignForm>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderReviewCampaignForm = (args: any) => {
  return React.createElement(ReviewCampaignForm, args);
};

/**
 * 기본 생성 폼
 *
 * 구매평 캠페인을 생성하는 기본 폼입니다.
 */
export const Default: Story = {
  render: renderReviewCampaignForm,
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
  render: renderReviewCampaignForm,
  args: {
    onSubmit: (data) => console.log("Form submitted:", data),
    isSubmitting: true,
    mode: "create",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 구매평 캠페인 생성 폼 컴포넌트
 *    - 구매평 캠페인 등록을 위한 전용 폼 컴포넌트입니다
 *    - 선구매 후 리뷰를 작성하는 페이백 캠페인입니다
 *
 * 2. 구매평 특화 기능
 *    - purchasePoints, purchasePeriod 필드가 있습니다
 *    - 구매 링크를 설정할 수 있습니다
 */

