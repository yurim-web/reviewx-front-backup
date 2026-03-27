/* ========================================
   숏츠 선정자 카드 스토리북
   ======================================== */

/**
 * ShortsSelectedCard.stories
 *
 * 목적: 유튜브 숏츠 채널 선정자 카드 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
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
  memo: "",
  selectionStatus: "미선택",
  channel: "유튜브",
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

/**
 * 인플루언서 선정자
 *
 * 인플루언서 타입의 선정된 숏츠 신청자 카드입니다.
 */
export const Influencer: Story = {
  args: {
    applicant: {
      ...mockYoutubeApplicant,
      userType: "인플루언서",
      nickname: "인플루언서_숏츠러",
    },
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

/**
 * 메모 없는 선정자
 *
 * 메모가 없는 선정된 숏츠 신청자 카드입니다.
 */
export const WithoutMemo: Story = {
  args: {
    applicant: {
      ...mockYoutubeApplicant,
      memo: "",
    },
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};
