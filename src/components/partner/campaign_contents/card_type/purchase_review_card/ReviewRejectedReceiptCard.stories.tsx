/**
 * ReviewRejectedReceiptCard 컴포넌트 스토리북
 *
 * 구매평 반려 카드 (구매 영수증 확인) 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ReviewRejectedReceiptCard from "./ReviewRejectedReceiptCard";
import type { ExperienceApplicant } from "./ReviewTypes";

const mockApplicant: ExperienceApplicant = {
  id: "1",
  userType: "리뷰어",
  nickname: "리뷰러",
  profileImage: "/images/test_img/profile_test.png",
  channel: "네이버블로그",
  channelId: "blog.naver.com/test",
  registrationDate: "2024-01-15 17:37",
  reviewType: 6, // 구매 영수증 확인 (반려 처리)
};

const meta: Meta<typeof ReviewRejectedReceiptCard> = {
  title: "Partner/CampaignContents/CardType/PurchaseReview/ReviewRejectedReceiptCard",
  component: ReviewRejectedReceiptCard,
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
    onHandleReject: {
      description: "반려 처리 버튼 클릭 핸들러",
      action: "reject handled",
    },
    dateLabel: {
      description: "등록/수정/지각 등록 라벨",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReviewRejectedReceiptCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderReviewRejectedReceiptCard = (args: any) => {
  return React.createElement(ReviewRejectedReceiptCard, args);
};

/**
 * 기본 반려 카드 (구매 영수증 확인)
 *
 * 구매 영수증 확인 후 반려 처리하는 카드입니다.
 */
export const Default: Story = {
  render: renderReviewRejectedReceiptCard,
  args: {
    applicant: mockApplicant,
    onCheckReceipt: (id) => console.log("Receipt checked:", id),
    onHandleReject: (id) => console.log("Reject handled:", id),
    dateLabel: "등록",
  },
};

/**
 * 수정 라벨
 *
 * 수정된 구매 영수증을 확인하고 반려 처리하는 카드입니다.
 */
export const WithUpdatedLabel: Story = {
  render: renderReviewRejectedReceiptCard,
  args: {
    applicant: {
      ...mockApplicant,
      updatedAt: "2024-01-20 10:30",
    },
    onCheckReceipt: (id) => console.log("Receipt checked:", id),
    onHandleReject: (id) => console.log("Reject handled:", id),
    dateLabel: "수정",
  },
};

/**
 * 지각 등록
 *
 * 지각 등록된 구매 영수증을 확인하고 반려 처리하는 카드입니다.
 */
export const LateRegistration: Story = {
  render: renderReviewRejectedReceiptCard,
  args: {
    applicant: mockApplicant,
    onCheckReceipt: (id) => console.log("Receipt checked:", id),
    onHandleReject: (id) => console.log("Reject handled:", id),
    dateLabel: "지각 등록",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 반려 카드 컴포넌트 (구매 영수증 확인)
 *    - 구매 영수증 확인 후 반려 처리하는 카드입니다
 *    - 하단에 강조된 빨간색 "반려 처리" 버튼이 표시됩니다
 *
 * 2. 구매 영수증 확인 기능
 *    - onCheckReceipt로 구매 영수증을 확인할 수 있습니다
 *    - 구매 영수증 확인 후 반려 처리를 할 수 있습니다
 *
 * 3. 반려 처리 기능
 *    - onHandleReject로 반려 처리를 할 수 있습니다
 *    - 반려 처리 버튼은 빨간색으로 강조되어 있습니다
 *
 * 4. 날짜 라벨
 *    - dateLabel로 "등록", "수정", "지각 등록" 등을 표시합니다
 *    - updatedAt이 있으면 수정일을, 없으면 등록일을 표시합니다
 */

