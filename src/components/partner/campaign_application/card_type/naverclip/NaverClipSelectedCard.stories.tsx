/**
 * NaverClipSelectedCard 컴포넌트 스토리북
 *
 * 네이버 클립 선정자 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import NaverClipSelectedCard from "./NaverClipSelectedCard";
import type { NaverClipApplicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockSelectedApplicant: NaverClipApplicant = {
  id: "1",
  Id: "@naverclip_user",
  nickname: "네이버클리퍼",
  userType: "인플루언서",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  followers: 30000,
  memo: "안녕하세요. 네이버 클립에서 활동하는 인플루언서입니다.",
  selectionStatus: "선정하기",
  channel: "네이버클립",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof NaverClipSelectedCard> = {
  title: "Partner/CampaignApplication/CardType/NaverClip/NaverClipSelectedCard",
  component: NaverClipSelectedCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "선정된 네이버 클립 신청자 정보 객체",
      control: "object",
    },
    onCancel: {
      description: "선택 취소 버튼 클릭 핸들러",
      action: "cancelled",
    },
  },
};

export default meta;

type Story = StoryObj<typeof NaverClipSelectedCard>;

const renderNaverClipSelectedCard = (args: typeof NaverClipSelectedCard) => {
  return React.createElement(NaverClipSelectedCard, args);
};

/**
 * 기본 선정자 카드
 *
 * 선정된 네이버 클립 신청자 카드입니다.
 */
export const Default: Story = {
  render: (args) => renderNaverClipSelectedCard(args),
  args: {
    applicant: mockSelectedApplicant,
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

