/**
 * YoutubeCard 컴포넌트 스토리북
 *
 * 유튜브 신청자 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
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

const renderYoutubeCard = (args: typeof YoutubeCard) => {
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

/**
 * 학습 포인트:
 *
 * 1. 유튜브 특화 카드 컴포넌트
 *    - 유튜브 채널 신청자 전용 카드입니다
 *    - 구독자 수를 중심으로 통계를 표시합니다
 *
 * 2. 구독자 수 표시
 *    - toLocaleString()으로 숫자를 천 단위 콤마로 표시합니다
 *    - 예: 50000 -> "50,000"
 *
 * 3. 유튜브 특화 기능
 *    - 비디오 콘텐츠 중심의 리뷰에 최적화
 *    - 썸네일과 영상 링크 활용
 */

