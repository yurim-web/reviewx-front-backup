/* ========================================
   기본 신청자 카드 스토리북
   ======================================== */

/**
 * BasicCard.stories
 *
 * 목적: 미션형/구매평 캠페인 기본 신청자 카드 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import BasicCard from "./BasicCard";
import type { BasicApplicant } from "@/data/partner/campaign_application/delivery_applicants";

// Mock 데이터: 기본 신청자 정보
const mockBasicApplicant: BasicApplicant = {
  id: "1",
  Id: "basic_user_1",
  nickname: "홍길동",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  memo: "안녕하세요. 열심히 참여하겠습니다.",
  selectionStatus: "미선택",
  channel: "기본",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof BasicCard> = {
  title: "Partner/CampaignApplication/CardType/Basic/BasicCard",
  component: BasicCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "기본 신청자 정보 객체",
      control: "object",
    },
    onSelect: {
      description: "선정하기 버튼 클릭 핸들러",
      action: "selected",
    },
  },
};

export default meta;

type Story = StoryObj<typeof BasicCard>;

const renderBasicCard = (args: React.ComponentProps<typeof BasicCard>) => {
  return React.createElement(BasicCard, args);
};

/**
 * 기본 신청자 카드
 *
 * 미선택 상태의 기본 신청자 카드입니다.
 * 미션형과 구매평 캠페인에서 사용됩니다.
 */
export const Default: Story = {
  render: (args) => renderBasicCard(args),
  args: {
    applicant: mockBasicApplicant,
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 메모가 있는 신청자
 *
 * 자기소개 메모가 작성된 신청자 카드입니다.
 */
export const WithMemo: Story = {
  render: (args) => renderBasicCard(args),
  args: {
    applicant: {
      ...mockBasicApplicant,
      memo: "안녕하세요! 제품을 정성스럽게 리뷰하겠습니다. 많은 관심 부탁드립니다.",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 메모가 없는 신청자
 *
 * 자기소개 메모가 작성되지 않은 신청자 카드입니다.
 */
export const WithoutMemo: Story = {
  render: (args) => renderBasicCard(args),
  args: {
    applicant: {
      ...mockBasicApplicant,
      memo: "",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 이용 제한 계정
 *
 * 이용 제한 상태인 신청자 카드입니다.
 * 선정하기 버튼 대신 "이용 제한 계정" 버튼이 표시됩니다.
 */
export const Restricted: Story = {
  render: (args) => renderBasicCard(args),
  args: {
    applicant: {
      ...mockBasicApplicant,
      selectionStatus: "이용제한 계정",
      memberType: "이용 제한",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 인플루언서 타입
 *
 * 인플루언서 타입의 신청자 카드입니다.
 */
export const Influencer: Story = {
  render: (args) => renderBasicCard(args),
  args: {
    applicant: {
      ...mockBasicApplicant,
      userType: "인플루언서",
      nickname: "인플루언서_홍길동",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};
