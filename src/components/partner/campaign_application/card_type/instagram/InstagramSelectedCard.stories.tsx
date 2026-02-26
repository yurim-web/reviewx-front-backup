/* ========================================
   인스타그램 선정자 카드 스토리북
   ======================================== */

/**
 * InstagramSelectedCard.stories
 *
 * 목적: 인스타그램 채널 선정자 카드 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import InstagramSelectedCard from "./InstagramSelectedCard";
import type { InstagramApplicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockSelectedApplicant: InstagramApplicant = {
  id: "1",
  Id: "@instagram_user",
  nickname: "인스타그램러",
  userType: "인플루언서",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  followers: 122838,
  memo: "안녕하세요. 인스타그램에서 활동하는 인플루언서입니다.",
  selectionStatus: "선정하기",
  channel: "인스타그램",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof InstagramSelectedCard> = {
  title: "Partner/CampaignApplication/CardType/Instagram/InstagramSelectedCard",
  component: InstagramSelectedCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "선정된 인스타그램 신청자 정보 객체",
      control: "object",
    },
    onCancel: {
      description: "선택 취소 버튼 클릭 핸들러",
      action: "cancelled",
    },
  },
};

export default meta;

type Story = StoryObj<typeof InstagramSelectedCard>;

const renderInstagramSelectedCard = (args: React.ComponentProps<typeof InstagramSelectedCard>) => {
  return React.createElement(InstagramSelectedCard, args);
};

/**
 * 기본 선정자 카드
 *
 * 선정된 인스타그램 신청자 카드입니다.
 * 점선 테두리로 선정된 상태를 표시합니다.
 */
export const Default: Story = {
  render: (args) => renderInstagramSelectedCard(args),
  args: {
    applicant: mockSelectedApplicant,
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

/**
 * 많은 팔로워를 가진 선정자
 *
 * 팔로워 수가 많은 인플루언서 선정자 카드입니다.
 */
export const HighFollowers: Story = {
  render: (args) => renderInstagramSelectedCard(args),
  args: {
    applicant: {
      ...mockSelectedApplicant,
      followers: 500000,
      nickname: "대형_인플루언서",
    },
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};
