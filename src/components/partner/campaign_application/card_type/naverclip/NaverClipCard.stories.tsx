/**
 * NaverClipCard 컴포넌트 스토리북
 *
 * 네이버 클립 신청자 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
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

const renderNaverClipCard = (args: typeof NaverClipCard) => {
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
 * 학습 포인트:
 *
 * 1. 네이버 클립 특화 카드 컴포넌트
 *    - 네이버 클립 채널 신청자 전용 카드입니다
 *    - 팔로워 수를 중심으로 통계를 표시합니다
 *
 * 2. 팔로워 수 표시
 *    - toLocaleString()으로 숫자를 천 단위 콤마로 표시합니다
 *    - 예: 30000 -> "30,000"
 *
 * 3. 네이버 클립 특화 기능
 *    - 짧은 영상 콘텐츠 중심의 리뷰에 최적화
 *    - 클립 형태의 콘텐츠 활용
 */

