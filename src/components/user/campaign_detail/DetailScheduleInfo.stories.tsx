/**
 * DetailScheduleInfo (CampaignScheduleInfo) 컴포넌트 스토리북
 *
 * 캠페인 일정 정보 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignScheduleInfo from "./DetailScheduleInfo";

const meta: Meta<typeof CampaignScheduleInfo> = {
  title: "User/CampaignDetail/DetailScheduleInfo",
  component: CampaignScheduleInfo,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    currentRecruitment: {
      description: "현재 모집 인원",
      control: "number",
    },
    totalRecruitment: {
      description: "전체 모집 인원",
      control: "number",
    },
    applicationStart: {
      description: "모집 시작일",
      control: "text",
    },
    applicationEnd: {
      description: "모집 종료일",
      control: "text",
    },
    announcement: {
      description: "선정 발표일",
      control: "text",
    },
    additionalSchedules: {
      description: "추가 일정 (선택적)",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignScheduleInfo>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderCampaignScheduleInfo = () => {
  return React.createElement(CampaignScheduleInfo);
};

/**
 * 기본 일정 정보
 *
 * 모집 인원, 모집 기간, 선정 발표일을 표시하는 기본 일정 정보입니다.
 */
export const Default: Story = {
  render: renderCampaignScheduleInfo,
  args: {
    currentRecruitment: 25,
    totalRecruitment: 50,
    applicationStart: "2024-01-15",
    applicationEnd: "2024-01-30",
    announcement: "2024-02-05",
  },
};

/**
 * 추가 일정 포함
 *
 * 추가 일정 정보가 포함된 일정 정보입니다.
 */
export const WithAdditionalSchedules: Story = {
  render: renderCampaignScheduleInfo,
  args: {
    currentRecruitment: 25,
    totalRecruitment: 50,
    applicationStart: "2024-01-15",
    applicationEnd: "2024-01-30",
    announcement: "2024-02-05",
    additionalSchedules: [
      {
        label: "구매 기간",
        value: "2024-02-10 ~ 2024-02-25",
      },
      {
        label: "등록 기간",
        value: "2024-02-26 ~ 2024-03-10",
      },
    ],
  },
};

/**
 * 학습 포인트:
 *
 * 1. 일정 정보 컴포넌트
 *    - 캠페인의 모집 인원, 일정 등의 정보를 표시합니다
 *    - 동적으로 추가 일정을 포함할 수 있습니다
 *
 * 2. 배열 렌더링
 *    - additionalSchedules 배열을 map으로 순회하여 렌더링합니다
 *    - 각 항목을 동적으로 표시합니다
 *
 * 3. 선택적 props
 *    - additionalSchedules는 선택적이므로 기본값으로 빈 배열을 사용합니다
 */
