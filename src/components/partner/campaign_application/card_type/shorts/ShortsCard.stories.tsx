/**
 * ShortsCard 컴포넌트 스토리북
 *
 * 숏츠 신청자 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ShortsCard from "./ShortsCard";
import type { YoutubeApplicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockShortsApplicant: YoutubeApplicant = {
  id: "1",
  Id: "@shorts_channel",
  nickname: "숏츠러",
  userType: "인플루언서",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  subscribers: 60000,
  memo: "안녕하세요. 유튜브 숏츠에서 활동하는 인플루언서입니다.",
  selectionStatus: "미선택",
  channel: "유튜브",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof ShortsCard> = {
  title: "Partner/CampaignApplication/CardType/Shorts/ShortsCard",
  component: ShortsCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "숏츠 신청자 정보 객체",
      control: "object",
    },
    onSelect: {
      description: "선정하기 버튼 클릭 핸들러",
      action: "selected",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ShortsCard>;

const renderShortsCard = (args: typeof ShortsCard) => {
  return React.createElement(ShortsCard, args);
};

/**
 * 기본 숏츠 신청자 카드
 *
 * 미선택 상태의 숏츠 신청자 카드입니다.
 * 구독자 수가 표시됩니다.
 */
export const Default: Story = {
  render: (args) => renderShortsCard(args),
  args: {
    applicant: mockShortsApplicant,
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 많은 구독자를 가진 신청자
 *
 * 구독자 수가 많은 숏츠 신청자 카드입니다.
 */
export const HighSubscribers: Story = {
  render: (args) => renderShortsCard(args),
  args: {
    applicant: {
      ...mockShortsApplicant,
      subscribers: 500000,
      nickname: "대형_숏츠러",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 숏츠 특화 카드 컴포넌트
 *    - 유튜브 숏츠 채널 신청자 전용 카드입니다
 *    - YoutubeApplicant 타입을 사용합니다 (구독자 수 포함)
 *
 * 2. 숏츠 특화 기능
 *    - 짧은 영상 콘텐츠 중심의 리뷰에 최적화
 *    - 세로형 영상 콘텐츠 활용
 */

