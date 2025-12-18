/**
 * ReviewPendingCard 컴포넌트 스토리북
 *
 * 구매평 대기 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ReviewPendingCard from "./ReviewPendingCard";
import type { ExperienceApplicant } from "./ReviewTypes";

const mockApplicant: ExperienceApplicant = {
  id: "1",
  userType: "리뷰어",
  nickname: "리뷰러",
  profileImage: "/images/test_img/profile_test.png",
  channel: "네이버블로그",
  channelId: "blog.naver.com/test",
  registrationDate: "2024-01-15 17:37",
  reviewType: 4, // 구매 영수증 확인 (리뷰 대기 중)
};

const meta: Meta<typeof ReviewPendingCard> = {
  title: "Partner/CampaignContents/CardType/PurchaseReview/ReviewPendingCard",
  component: ReviewPendingCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "구매평 신청자 정보 객체",
      control: "object",
    },
    onCheckReceipt: {
      description: "구매 영수증 확인 버튼 클릭 핸들러",
      action: "receipt checked",
    },
    dateLabel: {
      description: "등록/수정/지각 등록 라벨",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReviewPendingCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderReviewPendingCard = (args: any) => {
  return React.createElement(ReviewPendingCard, args);
};

/**
 * 기본 대기 카드
 *
 * 구매 영수증 확인 후 리뷰를 대기 중인 상태의 카드입니다.
 */
export const Default: Story = {
  render: renderReviewPendingCard,
  args: {
    applicant: mockApplicant,
    onCheckReceipt: (id) => console.log("Receipt checked:", id),
    dateLabel: "등록",
  },
};

/**
 * 수정 라벨
 *
 * 수정된 구매 영수증을 확인하는 대기 카드입니다.
 */
export const WithUpdatedLabel: Story = {
  render: renderReviewPendingCard,
  args: {
    applicant: {
      ...mockApplicant,
      updatedAt: "2024-01-20 10:30",
    },
    onCheckReceipt: (id) => console.log("Receipt checked:", id),
    dateLabel: "수정",
  },
};

/**
 * 지각 등록
 *
 * 지각 등록된 구매 영수증을 확인하는 대기 카드입니다.
 */
export const LateRegistration: Story = {
  render: renderReviewPendingCard,
  args: {
    applicant: mockApplicant,
    onCheckReceipt: (id) => console.log("Receipt checked:", id),
    dateLabel: "지각 등록",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 대기 카드 컴포넌트
 *    - 구매 영수증 확인 후 리뷰를 대기 중인 상태의 카드입니다
 *    - 하단에 비활성화된 "리뷰 대기 중" 버튼이 표시됩니다
 *
 * 2. 구매 영수증 확인 기능
 *    - onCheckReceipt로 구매 영수증을 확인할 수 있습니다
 *    - 구매 영수증 확인 후 리뷰를 기다리는 상태입니다
 *
 * 3. 대기 상태 표시
 *    - "리뷰 대기 중" 버튼은 비활성화되어 있습니다
 *    - 사용자가 리뷰를 작성할 때까지 대기 상태입니다
 *
 * 4. 날짜 라벨
 *    - dateLabel로 "등록", "수정", "지각 등록" 등을 표시합니다
 *    - updatedAt이 있으면 수정일을, 없으면 등록일을 표시합니다
 */

