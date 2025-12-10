/**
 * ExperienceCompletedCard 컴포넌트 스토리북
 *
 * 경험형 완료 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ExperienceCompletedCard from "./ExperienceCompletedCard";
import type { ExperienceApplicant } from "./ExperienceTypes";

const mockApplicant: ExperienceApplicant = {
  id: "1",
  userType: "리뷰어",
  nickname: "경험러",
  profileImage: "/images/test_img/profile_test.png",
  channel: "네이버블로그",
  channelId: "blog.naver.com/test",
  registrationDate: "2024-01-15 17:37",
};

const meta: Meta<typeof ExperienceCompletedCard> = {
  title: "Partner/CampaignContents/CardType/Experience/ExperienceCompletedCard",
  component: ExperienceCompletedCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "경험형 신청자 정보 객체",
      control: "object",
    },
    onContentCheck: {
      description: "링크 확인 버튼 클릭 핸들러",
      action: "content checked",
    },
    dateLabel: {
      description: "등록/수정/지각 등록 라벨",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ExperienceCompletedCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderExperienceCompletedCard = (args: any) => {
  return React.createElement(ExperienceCompletedCard, args);
};

/**
 * 기본 완료 카드
 *
 * 완료탭에서 사용되는 경험형 완료 카드입니다.
 */
export const Default: Story = {
  render: renderExperienceCompletedCard,
  args: {
    applicant: mockApplicant,
    onContentCheck: (id) => console.log("Content checked:", id),
    dateLabel: "등록",
  },
};

/**
 * 수정 라벨
 *
 * 수정된 콘텐츠를 표시하는 완료 카드입니다.
 */
export const WithUpdatedLabel: Story = {
  render: renderExperienceCompletedCard,
  args: {
    applicant: {
      ...mockApplicant,
      updatedAt: "2024-01-20 10:30",
    },
    onContentCheck: (id) => console.log("Content checked:", id),
    dateLabel: "수정",
  },
};

/**
 * 지각 등록
 *
 * 지각 등록된 콘텐츠를 표시하는 완료 카드입니다.
 */
export const LateRegistration: Story = {
  render: renderExperienceCompletedCard,
  args: {
    applicant: mockApplicant,
    onContentCheck: (id) => console.log("Content checked:", id),
    dateLabel: "지각 등록",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 완료 카드 컴포넌트
 *    - 완료탭에서 사용되는 카드입니다
 *    - 하단에 비활성화된 "검수 완료" 버튼이 표시됩니다
 *
 * 2. 링크 확인 기능
 *    - onContentCheck로 콘텐츠 링크를 확인할 수 있습니다
 *    - 완료된 콘텐츠의 링크를 확인하는 용도입니다
 *
 * 3. 날짜 라벨
 *    - dateLabel로 "등록", "수정", "지각 등록" 등을 표시합니다
 *    - updatedAt이 있으면 수정일을, 없으면 등록일을 표시합니다
 */
