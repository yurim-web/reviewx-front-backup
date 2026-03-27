/* ========================================
   네이버클립 신청자 카드 스토리북
   ======================================== */

/**
 * NaverClipCard.stories
 *
 * 목적: 네이버클립 채널 신청자 카드 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import NaverClipCard from "./NaverClipCard";
import type { NaverClipApplicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockNaverClipApplicant: NaverClipApplicant = {
  id: "1",
  Id: "@naverclip_user",
  nickname: "네이버클리퍼",
  userType: "인플루언서",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  followers: 30000,
  memo: "안녕하세요. 네이버 클립에서 활동하는 인플루언서입니다.",
  selectionStatus: "미선택",
  channel: "네이버클립",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof NaverClipCard> = {
  title: "Partner/CampaignApplication/CardType/NaverClip/NaverClipCard",
  component: NaverClipCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "네이버 클립 신청자 정보 객체",
      control: "object",
    },
    onSelect: {
      description: "선정하기 버튼 클릭 핸들러",
      action: "selected",
    },
  },
};

export default meta;

type Story = StoryObj<typeof NaverClipCard>;

const renderNaverClipCard = (args: React.ComponentProps<typeof NaverClipCard>) => {
  return React.createElement(NaverClipCard, args);
};

/**
 * 기본 네이버 클립 신청자 카드
 *
 * 미선택 상태의 네이버 클립 신청자 카드입니다.
 * 팔로워 수가 표시됩니다.
 */
export const Default: Story = {
  render: (args) => renderNaverClipCard(args),
  args: {
    applicant: mockNaverClipApplicant,
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 많은 팔로워를 가진 신청자
 *
 * 팔로워 수가 많은 네이버 클립 신청자 카드입니다.
 */
export const HighFollowers: Story = {
  render: (args) => renderNaverClipCard(args),
  args: {
    applicant: {
      ...mockNaverClipApplicant,
      followers: 200000,
      nickname: "대형_네이버클리퍼",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 이용 제한 계정
 *
 * 이용 제한 상태인 네이버 클립 신청자 카드입니다.
 */
export const Restricted: Story = {
  render: (args) => renderNaverClipCard(args),
  args: {
    applicant: {
      ...mockNaverClipApplicant,
      selectionStatus: "이용제한 계정",
      memberType: "이용 제한",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 리뷰어 타입
 *
 * 리뷰어 타입의 네이버 클립 신청자 카드입니다.
 */
export const Reviewer: Story = {
  render: (args) => renderNaverClipCard(args),
  args: {
    applicant: {
      ...mockNaverClipApplicant,
      userType: "리뷰어",
      nickname: "리뷰어_네이버클리퍼",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};
