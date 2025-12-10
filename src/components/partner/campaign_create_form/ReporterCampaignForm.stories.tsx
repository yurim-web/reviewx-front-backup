/**
 * ReporterCampaignForm 컴포넌트 스토리북
 *
 * 기자단 캠페인 생성 폼 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ReporterCampaignForm from "./ReporterCampaignForm";

const meta: Meta<typeof ReporterCampaignForm> = {
  title: "Partner/CampaignCreateForm/ReporterCampaignForm",
  component: ReporterCampaignForm,
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

type Story = StoryObj<typeof ReporterCampaignForm>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderReporterCampaignForm = (args: any) => {
  return React.createElement(ReporterCampaignForm, args);
};

/**
 * 기본 생성 폼
 *
 * 기자단 캠페인을 생성하는 기본 폼입니다.
 */
export const Default: Story = {
  render: renderReporterCampaignForm,
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
  render: renderReporterCampaignForm,
  args: {
    onSubmit: (data) => console.log("Form submitted:", data),
    isSubmitting: true,
    mode: "create",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 기자단 캠페인 생성 폼 컴포넌트
 *    - 기자단 캠페인 등록을 위한 전용 폼 컴포넌트입니다
 *    - 전문적인 리포팅을 위한 캠페인입니다
 *
 * 2. 기자단 특화 기능
 *    - platform 필드가 선택사항입니다
 *    - 전문적인 리포팅을 위한 옵션들이 있습니다
 */

