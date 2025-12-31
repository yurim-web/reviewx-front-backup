/**
 * ExperienceInspectionCard 컴포넌트 스토리북
 *
 * 경험형 검수 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ExperienceInspectionCard from "./ExperienceInspectionCard";
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

const meta: Meta<typeof ExperienceInspectionCard> = {
  title: "Partner/CampaignContents/CardType/Experience/ExperienceInspectionCard",
  component: ExperienceInspectionCard,
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
    onExtend: {
      description: "연장 버튼 클릭 핸들러",
      action: "extended",
    },
    onReport: {
      description: "신고 버튼 클릭 핸들러",
      action: "reported",
    },
    dateLabel: {
      description: "등록/수정/지각 등록 라벨",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ExperienceInspectionCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderExperienceInspectionCard = (args: any) => {
  return React.createElement(ExperienceInspectionCard, args);
};

/**
 * 기본 검수 카드
 *
 * 검수탭에서 사용되는 경험형 검수 카드입니다.
 * 연장/신고 버튼이 표시됩니다.
 */
export const Default: Story = {
  render: renderExperienceInspectionCard,
  args: {
    applicant: mockApplicant,
    onContentCheck: (id) => console.log("Content checked:", id),
    onExtend: (id) => console.log("Extended:", id),
    onReport: (id) => console.log("Reported:", id),
    dateLabel: "등록",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 검수 카드 컴포넌트
 *    - 검수탭에서 사용되는 카드입니다
 *    - 하단에 연장/신고 버튼이 함께 노출됩니다
 *
 * 2. 연장/신고 기능
 *    - onExtend: 연장 요청 핸들러
 *    - onReport: 신고 핸들러
 */

