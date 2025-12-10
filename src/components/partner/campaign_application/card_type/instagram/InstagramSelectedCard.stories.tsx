/**
 * InstagramSelectedCard 컴포넌트 스토리북
 *
 * 인스타그램 선정자 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
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

const renderInstagramSelectedCard = (args: typeof InstagramSelectedCard) => {
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

/**
 * 학습 포인트:
 *
 * 1. 선정된 카드 컴포넌트
 *    - 이미 선정된 상태의 신청자를 표시하는 카드입니다
 *    - selected_card 클래스로 점선 테두리와 배경색 변경
 *
 * 2. 선택 취소 기능
 *    - onCancel 콜백으로 선정 해제를 처리합니다
 *    - 부모 컴포넌트에서 선정 목록에서 제거합니다
 *
 * 3. InstagramCard와의 차이점
 *    - InstagramCard: "선정하기" 버튼 (미선택 상태)
 *    - InstagramSelectedCard: "선택 취소" 버튼 (선정된 상태)
 */

