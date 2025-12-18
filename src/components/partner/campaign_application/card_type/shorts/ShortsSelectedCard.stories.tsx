/**
 * ShortsSelectedCard 컴포넌트 스토리북
 *
 * 숏츠 선정된 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ShortsSelectedCard from "./ShortsSelectedCard";
import type { YoutubeApplicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockYoutubeApplicant: YoutubeApplicant = {
  id: "1",
  Id: "@test_shorts",
  nickname: "숏츠크리에이터",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  subscribers: 10000,
  videos: 200,
  channel: "숏츠",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof ShortsSelectedCard> = {
  title: "Partner/CampaignApplication/CardType/Shorts/ShortsSelectedCard",
  component: ShortsSelectedCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "선정된 숏츠 신청자 정보 객체",
      control: "object",
    },
    onCancel: {
      description: "선택 취소 버튼 클릭 핸들러",
      action: "cancelled",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ShortsSelectedCard>;

/**
 * 기본 선정 카드
 *
 * 선정된 숏츠 신청자 카드입니다.
 */
export const Default: Story = {
  args: {
    applicant: mockYoutubeApplicant,
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};
