/* ========================================
   유튜브 신청자 카드 스토리북
   ======================================== */

/**
 * YoutubeCard.stories
 *
 * 목적: 유튜브 채널 신청자 카드 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import YoutubeCard from "./YoutubeCard";
import type { YoutubeApplicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockYoutubeApplicant: YoutubeApplicant = {
  id: "1",
  Id: "@youtube_channel",
  nickname: "유튜버",
  userType: "인플루언서",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  subscribers: 50000,
  memo: "안녕하세요. 유튜브에서 활동하는 인플루언서입니다.",
  selectionStatus: "미선택",
  channel: "유튜브",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof YoutubeCard> = {
  title: "Partner/CampaignApplication/CardType/Youtube/YoutubeCard",
  component: YoutubeCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "유튜브 신청자 정보 객체",
      control: "object",
    },
    onSelect: {
      description: "선정하기 버튼 클릭 핸들러",
      action: "selected",
    },
  },
};

export default meta;

type Story = StoryObj<typeof YoutubeCard>;

const renderYoutubeCard = (args: React.ComponentProps<typeof YoutubeCard>) => {
  return React.createElement(YoutubeCard, args);
};

/**
 * 기본 유튜브 신청자 카드
 *
 * 미선택 상태의 유튜브 신청자 카드입니다.
 * 구독자 수가 표시됩니다.
 */
export const Default: Story = {
  render: (args) => renderYoutubeCard(args),
  args: {
    applicant: mockYoutubeApplicant,
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 많은 구독자를 가진 신청자
 *
 * 구독자 수가 많은 유튜버 카드입니다.
 */
export const HighSubscribers: Story = {
  render: (args) => renderYoutubeCard(args),
  args: {
    applicant: {
      ...mockYoutubeApplicant,
      subscribers: 1000000,
      nickname: "대형_유튜버",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 이용 제한 계정
 *
 * 이용 제한 상태인 유튜브 신청자 카드입니다.
 */
export const Restricted: Story = {
  render: (args) => renderYoutubeCard(args),
  args: {
    applicant: {
      ...mockYoutubeApplicant,
      selectionStatus: "이용제한 계정",
      memberType: "이용 제한",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};
