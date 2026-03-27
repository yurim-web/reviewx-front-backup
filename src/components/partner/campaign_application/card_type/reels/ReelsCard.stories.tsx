/* ========================================
   릴스 신청자 카드 스토리북
   ======================================== */

/**
 * ReelsCard.stories
 *
 * 목적: 인스타그램 릴스 채널 신청자 카드 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ReelsCard from "./ReelsCard";
import type { InstagramApplicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockReelsApplicant: InstagramApplicant = {
  id: "1",
  Id: "@reels_user",
  nickname: "릴스러",
  userType: "인플루언서",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  followers: 80000,
  memo: "안녕하세요. 릴스에서 활동하는 인플루언서입니다.",
  selectionStatus: "미선택",
  channel: "인스타그램",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof ReelsCard> = {
  title: "Partner/CampaignApplication/CardType/Reels/ReelsCard",
  component: ReelsCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "릴스 신청자 정보 객체",
      control: "object",
    },
    onSelect: {
      description: "선정하기 버튼 클릭 핸들러",
      action: "selected",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReelsCard>;

const renderReelsCard = (args: React.ComponentProps<typeof ReelsCard>) => {
  return React.createElement(ReelsCard, args);
};

/**
 * 기본 릴스 신청자 카드
 *
 * 미선택 상태의 릴스 신청자 카드입니다.
 * 팔로워 수가 표시됩니다.
 */
export const Default: Story = {
  render: (args) => renderReelsCard(args),
  args: {
    applicant: mockReelsApplicant,
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 많은 팔로워를 가진 신청자
 *
 * 팔로워 수가 많은 릴스 신청자 카드입니다.
 */
export const HighFollowers: Story = {
  render: (args) => renderReelsCard(args),
  args: {
    applicant: {
      ...mockReelsApplicant,
      followers: 300000,
      nickname: "대형_릴스러",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 이용 제한 계정
 *
 * 이용 제한 상태인 릴스 신청자 카드입니다.
 */
export const Restricted: Story = {
  render: (args) => renderReelsCard(args),
  args: {
    applicant: {
      ...mockReelsApplicant,
      selectionStatus: "이용제한 계정",
      memberType: "이용 제한",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 리뷰어 타입
 *
 * 리뷰어 타입의 릴스 신청자 카드입니다.
 */
export const Reviewer: Story = {
  render: (args) => renderReelsCard(args),
  args: {
    applicant: {
      ...mockReelsApplicant,
      userType: "리뷰어",
      nickname: "리뷰어_릴스러",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};
