/**
 * ApplicantCard 컴포넌트 스토리북
 *
 * 신청자 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ApplicantCard from "./ApplicantCard";
import type { Applicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockApplicant: Applicant = {
  id: "1",
  nickname: "홍길동",
  userType: "일반",
  profileImage: "/images/test_img/profile_test.png",
  channel: "네이버 블로그",
  channelId: "blog.naver.com/test",
  memberType: "모범 회원",
  dailyVisits: 500,
  totalVisits: 10000,
  neighbors: 100,
  memo: "안녕하세요. 열심히 참여하겠습니다.",
  isSelected: false,
  isRestricted: false,
};

const meta: Meta<typeof ApplicantCard> = {
  title: "Partner/CampaignApplication/ApplicantCard",
  component: ApplicantCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "신청자 정보 객체",
      control: "object",
    },
    onSelect: {
      description: "선정하기 버튼 클릭 핸들러",
      action: "selected",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ApplicantCard>;

// 기본 신청자 카드
export const Default: Story = {
  render: (args) => React.createElement(ApplicantCard, args),
  args: {
    applicant: mockApplicant,
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

// 이용 제한 계정
export const Restricted: Story = {
  render: (args) => React.createElement(ApplicantCard, args),
  args: {
    applicant: {
      ...mockApplicant,
      isRestricted: true,
      memberType: "이용 제한",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

// 선정된 신청자
export const Selected: Story = {
  render: (args) => React.createElement(ApplicantCard, args),
  args: {
    applicant: {
      ...mockApplicant,
      isSelected: true,
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

