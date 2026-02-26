/* ========================================
   기본 선정자 카드 스토리북
   ======================================== */

/**
 * BasicSelectedCard.stories
 *
 * 목적: 미션형/구매평 캠페인 선정자 카드 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import BasicSelectedCard from "./BasicSelectedCard";
import type { BasicApplicant } from "@/data/partner/campaign_application/delivery_applicants";

// Mock 데이터: 선정된 기본 신청자 정보
const mockSelectedApplicant: BasicApplicant = {
  id: "1",
  Id: "basic_user_1",
  nickname: "홍길동",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  memo: "안녕하세요. 열심히 참여하겠습니다.",
  selectionStatus: "선정하기",
  channel: "기본",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof BasicSelectedCard> = {
  title: "Partner/CampaignApplication/CardType/Basic/BasicSelectedCard",
  component: BasicSelectedCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "선정된 기본 신청자 정보 객체",
      control: "object",
    },
    onCancel: {
      description: "선택 취소 버튼 클릭 핸들러",
      action: "cancelled",
    },
  },
};

export default meta;

type Story = StoryObj<typeof BasicSelectedCard>;

const renderBasicSelectedCard = (args: React.ComponentProps<typeof BasicSelectedCard>) => {
  return React.createElement(BasicSelectedCard, args);
};

/**
 * 기본 선정자 카드
 *
 * 선정된 기본 신청자 카드입니다.
 * "선택 취소" 버튼이 표시됩니다.
 */
export const Default: Story = {
  render: (args) => renderBasicSelectedCard(args),
  args: {
    applicant: mockSelectedApplicant,
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

/**
 * 메모가 있는 선정자
 *
 * 자기소개 메모가 작성된 선정자 카드입니다.
 */
export const WithMemo: Story = {
  render: (args) => renderBasicSelectedCard(args),
  args: {
    applicant: {
      ...mockSelectedApplicant,
      memo: "안녕하세요! 제품을 정성스럽게 리뷰하겠습니다. 많은 관심 부탁드립니다.",
    },
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

/**
 * 이용 제한 계정 (선정된 상태)
 *
 * 이용 제한 상태이지만 선정된 상태의 카드입니다.
 */
export const Restricted: Story = {
  render: (args) => renderBasicSelectedCard(args),
  args: {
    applicant: {
      ...mockSelectedApplicant,
      selectionStatus: "이용제한 계정",
      memberType: "이용 제한",
    },
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

/**
 * 인플루언서 타입
 *
 * 인플루언서 타입의 선정자 카드입니다.
 */
export const Influencer: Story = {
  render: (args) => renderBasicSelectedCard(args),
  args: {
    applicant: {
      ...mockSelectedApplicant,
      userType: "인플루언서",
      nickname: "인플루언서_홍길동",
    },
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};
