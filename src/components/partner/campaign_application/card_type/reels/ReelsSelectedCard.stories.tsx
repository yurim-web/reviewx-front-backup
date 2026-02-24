/**
 * ReelsSelectedCard 컴포넌트 스토리북
 *
 * 릴스 선정된 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import ReelsSelectedCard from "./ReelsSelectedCard";
import type { InstagramApplicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockInstagramApplicant: InstagramApplicant = {
  id: "1",
  Id: "@test_reels",
  nickname: "릴스크리에이터",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  followers: 5000,
  posts: 100,
  channel: "릴스",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof ReelsSelectedCard> = {
  title: "Partner/CampaignApplication/CardType/Reels/ReelsSelectedCard",
  component: ReelsSelectedCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "선정된 릴스 신청자 정보 객체",
      control: "object",
    },
    onCancel: {
      description: "선택 취소 버튼 클릭 핸들러",
      action: "cancelled",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReelsSelectedCard>;

/**
 * 기본 선정 카드
 *
 * 선정된 릴스 신청자 카드입니다.
 */
export const Default: Story = {
  args: {
    applicant: mockInstagramApplicant,
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};
