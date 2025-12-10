/**
 * ReviewInspectionCard 컴포넌트 스토리북
 *
 * 구매평 검수 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ReviewInspectionCard from "./ReviewInspectionCard";
import type { ExperienceApplicant } from "./ReviewTypes";

const mockApplicant: ExperienceApplicant = {
  id: "1",
  userType: "리뷰어",
  nickname: "리뷰러",
  profileImage: "/images/test_img/profile_test.png",
  channel: "네이버블로그",
  channelId: "blog.naver.com/test",
  registrationDate: "2024-01-15 17:37",
  reviewType: 1, // 리뷰 확인
};

const meta: Meta<typeof ReviewInspectionCard> = {
  title: "Partner/CampaignContents/CardType/PurchaseReview/ReviewInspectionCard",
  component: ReviewInspectionCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "구매평 신청자 정보 객체",
      control: "object",
    },
    onCheckReview: {
      description: "리뷰 확인 버튼 클릭 핸들러",
      action: "review checked",
    },
    onCheckReceipt: {
      description: "구매 영수증 확인 버튼 클릭 핸들러",
      action: "receipt checked",
    },
    onApprove: {
      description: "승인 버튼 클릭 핸들러",
      action: "approved",
    },
    onReject: {
      description: "반려 버튼 클릭 핸들러",
      action: "rejected",
    },
    dateLabel: {
      description: "등록/수정/지각 등록 라벨",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReviewInspectionCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderReviewInspectionCard = (args: any) => {
  return React.createElement(ReviewInspectionCard, args);
};

/**
 * 타입 1: 리뷰 확인
 *
 * 리뷰 확인 버튼이 있는 검수 카드입니다.
 */
export const Type1: Story = {
  render: renderReviewInspectionCard,
  args: {
    applicant: {
      ...mockApplicant,
      reviewType: 1,
    },
    onCheckReview: (id) => console.log("Review checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
    dateLabel: "등록",
  },
};

/**
 * 타입 2: 구매 영수증 확인
 *
 * 구매 영수증 확인 버튼이 있는 검수 카드입니다.
 */
export const Type2: Story = {
  render: renderReviewInspectionCard,
  args: {
    applicant: {
      ...mockApplicant,
      reviewType: 2,
    },
    onCheckReceipt: (id) => console.log("Receipt checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
    dateLabel: "등록",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 구매평 검수 카드 컴포넌트
 *    - 검수탭에서 사용되는 구매평 카드입니다
 *    - reviewType에 따라 다른 버튼을 표시합니다
 *
 * 2. 리뷰 타입별 버튼
 *    - type1: "리뷰 확인" 버튼
 *    - type2: "구매영수증 확인하기" 버튼
 *
 * 3. 승인/반려 기능
 *    - 모든 타입에서 승인/반려 버튼이 표시됩니다
 */

