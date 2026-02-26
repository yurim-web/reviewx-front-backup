/* ========================================
   신청자 카드 스토리북
   ======================================== */

/**
 * ApplicantCard.stories
 *
 * 목적: 파트너 캠페인 신청자 카드 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ApplicantCard from "./ApplicantCard";
import type { Applicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockApplicant: Applicant = {
  id: "1",
  Id: "blog_test",
  nickname: "홍길동",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  channel: "네이버블로그",
  memberType: "모범 회원",
  dailyVisits: 500,
  totalVisits: 10000,
  neighbors: 100,
  memo: "안녕하세요. 열심히 참여하겠습니다.",
  selectionStatus: "미선택",
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
      memberType: "이용 제한",
      selectionStatus: "이용제한 계정",
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
      selectionStatus: "선정하기",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};
