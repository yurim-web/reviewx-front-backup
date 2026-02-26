/* ========================================
   인스타그램 신청자 카드 스토리북
   ======================================== */

/**
 * InstagramCard.stories
 *
 * 목적: 인스타그램 채널 신청자 카드 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import InstagramCard from "./InstagramCard";
import type { InstagramApplicant } from "@/data/partner/campaign_application/delivery_applicants";

// Mock 데이터: 인스타그램 신청자 정보
const mockInstagramApplicant: InstagramApplicant = {
  id: "1",
  Id: "@instagram_user",
  nickname: "인스타그램러",
  userType: "인플루언서",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  followers: 122838,
  memo: "안녕하세요. 인스타그램에서 활동하는 인플루언서입니다.",
  selectionStatus: "미선택",
  channel: "인스타그램",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof InstagramCard> = {
  title: "Partner/CampaignApplication/CardType/Instagram/InstagramCard",
  component: InstagramCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "인스타그램 신청자 정보 객체",
      control: "object",
    },
    onSelect: {
      description: "선정하기 버튼 클릭 핸들러",
      action: "selected",
    },
  },
};

export default meta;

type Story = StoryObj<typeof InstagramCard>;

const renderInstagramCard = (args: React.ComponentProps<typeof InstagramCard>) => {
  return React.createElement(InstagramCard, args);
};

/**
 * 기본 인스타그램 신청자 카드
 *
 * 미선택 상태의 인스타그램 신청자 카드입니다.
 * 팔로워 수가 표시됩니다.
 */
export const Default: Story = {
  render: (args) => renderInstagramCard(args),
  args: {
    applicant: mockInstagramApplicant,
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 많은 팔로워를 가진 신청자
 *
 * 팔로워 수가 많은 인플루언서 카드입니다.
 */
export const HighFollowers: Story = {
  render: (args) => renderInstagramCard(args),
  args: {
    applicant: {
      ...mockInstagramApplicant,
      followers: 500000,
      nickname: "대형_인플루언서",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 적은 팔로워를 가진 신청자
 *
 * 팔로워 수가 적은 신청자 카드입니다.
 */
export const LowFollowers: Story = {
  render: (args) => renderInstagramCard(args),
  args: {
    applicant: {
      ...mockInstagramApplicant,
      followers: 500,
      nickname: "소규모_인플루언서",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 이용 제한 계정
 *
 * 이용 제한 상태인 인스타그램 신청자 카드입니다.
 */
export const Restricted: Story = {
  render: (args) => renderInstagramCard(args),
  args: {
    applicant: {
      ...mockInstagramApplicant,
      selectionStatus: "이용제한 계정",
      memberType: "이용 제한",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 리뷰어 타입
 *
 * 리뷰어 타입의 인스타그램 신청자 카드입니다.
 */
export const Reviewer: Story = {
  render: (args) => renderInstagramCard(args),
  args: {
    applicant: {
      ...mockInstagramApplicant,
      userType: "리뷰어",
      nickname: "리뷰어_홍길동",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};
