/**
 * YoutubeSelectedCard 컴포넌트 스토리북
 *
 * 유튜브 선정자 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import YoutubeSelectedCard from "./YoutubeSelectedCard";
import type { YoutubeApplicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockSelectedApplicant: YoutubeApplicant = {
  id: "1",
  Id: "@youtube_channel",
  nickname: "유튜버",
  userType: "인플루언서",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  subscribers: 50000,
  memo: "안녕하세요. 유튜브에서 활동하는 인플루언서입니다.",
  selectionStatus: "선정하기",
  channel: "유튜브",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof YoutubeSelectedCard> = {
  title: "Partner/CampaignApplication/CardType/Youtube/YoutubeSelectedCard",
  component: YoutubeSelectedCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "선정된 유튜브 신청자 정보 객체",
      control: "object",
    },
    onCancel: {
      description: "선택 취소 버튼 클릭 핸들러",
      action: "cancelled",
    },
  },
};

export default meta;

type Story = StoryObj<typeof YoutubeSelectedCard>;

const renderYoutubeSelectedCard = (args: typeof YoutubeSelectedCard) => {
  return React.createElement(YoutubeSelectedCard, args);
};

/**
 * 기본 선정자 카드
 *
 * 선정된 유튜브 신청자 카드입니다.
 */
export const Default: Story = {
  render: (args) => renderYoutubeSelectedCard(args),
  args: {
    applicant: mockSelectedApplicant,
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

