/**
 * ExperienceRejectedCard 컴포넌트 스토리북
 *
 * 경험형 반려 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ExperienceRejectedCard from "./ExperienceRejectedCard";
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

const meta: Meta<typeof ExperienceRejectedCard> = {
  title: "Partner/CampaignContents/CardType/Experience/ExperienceRejectedCard",
  component: ExperienceRejectedCard,
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
    onHandleReject: {
      description: "반려 처리 버튼 클릭 핸들러",
      action: "reject handled",
    },
    dateLabel: {
      description: "등록/수정/지각 등록 라벨",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ExperienceRejectedCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderExperienceRejectedCard = (args: any) => {
  return React.createElement(ExperienceRejectedCard, args);
};

/**
 * 기본 반려 카드
 *
 * 검수탭에서 반려 상태로 표시되는 경험형 반려 카드입니다.
 */
export const Default: Story = {
  render: renderExperienceRejectedCard,
  args: {
    applicant: mockApplicant,
    onContentCheck: (id) => console.log("Content checked:", id),
    onHandleReject: (id) => console.log("Reject handled:", id),
    dateLabel: "등록",
  },
};

/**
 * 수정 라벨
 *
 * 수정된 콘텐츠를 반려 처리하는 카드입니다.
 */
export const WithUpdatedLabel: Story = {
  render: renderExperienceRejectedCard,
  args: {
    applicant: {
      ...mockApplicant,
      updatedAt: "2024-01-20 10:30",
    },
    onContentCheck: (id) => console.log("Content checked:", id),
    onHandleReject: (id) => console.log("Reject handled:", id),
    dateLabel: "수정",
  },
};

/**
 * 지각 등록
 *
 * 지각 등록된 콘텐츠를 반려 처리하는 카드입니다.
 */
export const LateRegistration: Story = {
  render: renderExperienceRejectedCard,
  args: {
    applicant: mockApplicant,
    onContentCheck: (id) => console.log("Content checked:", id),
    onHandleReject: (id) => console.log("Reject handled:", id),
    dateLabel: "지각 등록",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 반려 카드 컴포넌트
 *    - 검수탭에서 반려 상태로 표시되는 카드입니다
 *    - 하단에 강조된 빨간색 "반려 처리" 버튼이 표시됩니다
 *
 * 2. 반려 처리 기능
 *    - onHandleReject로 반려 처리를 할 수 있습니다
 *    - 반려 처리 버튼은 빨간색으로 강조되어 있습니다
 *
 * 3. 링크 확인 기능
 *    - onContentCheck로 콘텐츠 링크를 확인할 수 있습니다
 *    - 반려 전에 콘텐츠를 확인하는 용도입니다
 *
 * 4. 날짜 라벨
 *    - dateLabel로 "등록", "수정", "지각 등록" 등을 표시합니다
 *    - updatedAt이 있으면 수정일을, 없으면 등록일을 표시합니다
 */
