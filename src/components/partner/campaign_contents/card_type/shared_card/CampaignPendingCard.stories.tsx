/**
 * CampaignPendingCard 컴포넌트 스토리북
 *
 * 구매평/미션형 공통 대기 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 * 
 * 📚 학습 포인트:
 * - 구매평과 미션형 두 가지 캠페인 타입을 모두 지원하는 공통 컴포넌트
 * - campaignType prop으로 구매평/미션형 구분
 * - 구매평: 4가지 상태 유형 (구매 영수증 미등록, 콘텐츠 미등록, 연장 요청, 반려 처리)
 * - 미션형: 대기 탭에서도 승인/반려 버튼 표시
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignPendingCard from "./CampaignPendingCard";
import type { CampaignApplicant } from "./CampaignTypes";

// 구매평 모의 데이터
const mockReviewApplicant: CampaignApplicant = {
  id: "1",
  userType: "리뷰어",
  nickname: "리뷰러",
  profileImage: "/images/test_img/profile_test.png",
  channel: "네이버블로그",
  channelId: "blog.naver.com/test",
  registrationDate: "2024-01-15 17:37",
  campaignType: "review",
  reviewType: 1, // 리뷰 확인
};

// 미션형 모의 데이터
const mockMissionApplicant: CampaignApplicant = {
  id: "2",
  userType: "인플루언서",
  nickname: "미션러",
  profileImage: "/images/test_img/profile_test.png",
  channel: "인스타그램",
  channelId: "@mission_test",
  registrationDate: "2024-01-15 17:37",
  campaignType: "mission",
  missionType: 1, // 이미지 + 링크
};

const meta: Meta<typeof CampaignPendingCard> = {
  title: "Partner/CampaignContents/CardType/SharedCard/CampaignPendingCard",
  component: CampaignPendingCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "구매평/미션형 신청자 정보 객체 (campaignType 필수)",
      control: "object",
    },
    pendingState: {
      description: "대기 탭 상태 유형 (구매평만 해당)",
      control: "select",
      options: [
        "receipt_not_registered",
        "content_not_registered",
        "extension_requested",
        "rejected",
      ],
    },
    onCheckReceipt: {
      description: "구매 영수증 확인 버튼 클릭 핸들러 (구매평)",
      action: "receipt checked",
    },
    onCheckReview: {
      description: "리뷰 확인 버튼 클릭 핸들러 (구매평)",
      action: "review checked",
    },
    onCheckImage: {
      description: "이미지 확인 버튼 클릭 핸들러 (미션형)",
      action: "image checked",
    },
    onCheckLink: {
      description: "링크 확인 버튼 클릭 핸들러 (미션형)",
      action: "link checked",
    },
    onApprove: {
      description: "승인 버튼 클릭 핸들러 (미션형)",
      action: "approved",
    },
    onReject: {
      description: "반려 버튼 클릭 핸들러 (미션형)",
      action: "rejected",
    },
    dateLabel: {
      description: "등록/수정/지각 등록 라벨",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignPendingCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderCampaignPendingCard = (args: any) => {
  return React.createElement(CampaignPendingCard, args);
};

/* ========================================
   구매평 스토리
   ======================================== */

/**
 * 구매평 - 콘텐츠 미등록
 *
 * 구매 영수증 확인 후 콘텐츠가 미등록된 상태입니다.
 */
export const ReviewContentNotRegistered: Story = {
  render: renderCampaignPendingCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 1,
    },
    pendingState: "content_not_registered",
    onCheckReview: (id) => console.log("Review checked:", id),
    dateLabel: "등록",
  },
};

/**
 * 구매평 - 구매 영수증 미등록
 *
 * 구매 영수증이 아직 등록되지 않은 상태입니다.
 */
export const ReviewReceiptNotRegistered: Story = {
  render: renderCampaignPendingCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 4,
    },
    pendingState: "receipt_not_registered",
    onCheckReceipt: (id) => console.log("Receipt checked:", id),
    dateLabel: "등록",
  },
};

/**
 * 구매평 - 등록 기한 연장 요청
 *
 * 등록 기한 연장 요청이 들어온 상태입니다.
 */
export const ReviewExtensionRequested: Story = {
  render: renderCampaignPendingCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 1,
    },
    pendingState: "extension_requested",
    dateLabel: "등록",
  },
};

/**
 * 구매평 - 콘텐츠 반려 처리
 *
 * 콘텐츠가 반려 처리된 상태입니다.
 */
export const ReviewRejected: Story = {
  render: renderCampaignPendingCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 5,
    },
    pendingState: "rejected",
    dateLabel: "등록",
  },
};

/**
 * 구매평 - 구매 영수증 반려 처리
 *
 * 구매 영수증이 반려 처리된 상태입니다.
 */
export const ReviewReceiptRejected: Story = {
  render: renderCampaignPendingCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 4,
    },
    pendingState: "rejected",
    onCheckReceipt: (id) => console.log("Receipt checked:", id),
    dateLabel: "등록",
  },
};

/**
 * 구매평 - 연장 승인 후
 *
 * 연장이 승인되어 기한이 연장된 상태입니다.
 */
export const ReviewExtensionApproved: Story = {
  render: renderCampaignPendingCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 1,
    },
    pendingState: "content_not_registered",
    isExtensionApproved: true,
    extendedDeadline: "2025-11-05",
    deadlineDate: "2025-10-25",
    dateLabel: "등록",
  },
};

/* ========================================
   미션형 스토리
   ======================================== */

/**
 * 미션형 - 이미지 + 링크 (type1)
 *
 * 이미지 확인과 링크 확인 버튼이 모두 있는 대기 카드입니다.
 */
export const MissionImageAndLink: Story = {
  render: renderCampaignPendingCard,
  args: {
    applicant: {
      ...mockMissionApplicant,
      missionType: 1,
    },
    onCheckImage: (id) => console.log("Image checked:", id),
    onCheckLink: (id) => console.log("Link checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
    dateLabel: "등록",
  },
};

/**
 * 미션형 - 이미지만 (type2)
 *
 * 이미지 확인 버튼만 있는 대기 카드입니다.
 */
export const MissionImageOnly: Story = {
  render: renderCampaignPendingCard,
  args: {
    applicant: {
      ...mockMissionApplicant,
      missionType: 2,
    },
    onCheckImage: (id) => console.log("Image checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
    dateLabel: "등록",
  },
};

/**
 * 미션형 - 링크만 (type3)
 *
 * 링크 확인 버튼만 있는 대기 카드입니다.
 */
export const MissionLinkOnly: Story = {
  render: renderCampaignPendingCard,
  args: {
    applicant: {
      ...mockMissionApplicant,
      missionType: 3,
    },
    onCheckLink: (id) => console.log("Link checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
    dateLabel: "등록",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 공통 컴포넌트
 *    - 구매평과 미션형 두 가지 캠페인 타입을 모두 지원합니다
 *    - campaignType prop으로 구매평/미션형을 구분합니다
 *
 * 2. 구매평 상태 유형
 *    - receipt_not_registered: 구매 영수증 미등록
 *    - content_not_registered: 콘텐츠 미등록
 *    - extension_requested: 등록 기한 연장 요청
 *    - rejected: 반려 처리
 *
 * 3. 미션형 버튼
 *    - type1: 이미지 확인 + 링크 확인
 *    - type2: 이미지 확인만
 *    - type3: 링크 확인만
 *    - 대기 탭에서도 승인/반려 버튼이 표시됩니다
 *
 * 4. 조건부 렌더링
 *    - 구매평일 때만 연장/신고 footer가 표시됩니다
 *    - 미션형일 때는 footer가 표시되지 않습니다
 */

