/**
 * CampaignInspectionCard 컴포넌트 스토리북
 *
 * 구매평/미션형 공통 검수 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 * 
 * 📚 학습 포인트:
 * - 구매평과 미션형 두 가지 캠페인 타입을 모두 지원하는 공통 컴포넌트
 * - campaignType prop으로 구매평/미션형 구분
 * - 구매평: 리뷰 확인 또는 구매 영수증 확인 버튼
 * - 미션형: 이미지 확인 또는 링크 확인 버튼
 * - 모든 타입에서 승인/반려 버튼 표시
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignInspectionCard from "./CampaignInspectionCard";
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

const meta: Meta<typeof CampaignInspectionCard> = {
  title: "Partner/CampaignContents/CardType/SharedCard/CampaignInspectionCard",
  component: CampaignInspectionCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "구매평/미션형 신청자 정보 객체 (campaignType 필수)",
      control: "object",
    },
    onCheckReview: {
      description: "리뷰 확인 버튼 클릭 핸들러 (구매평)",
      action: "review checked",
    },
    onCheckReceipt: {
      description: "구매 영수증 확인 버튼 클릭 핸들러 (구매평)",
      action: "receipt checked",
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
      description: "승인 버튼 클릭 핸들러 (필수)",
      action: "approved",
    },
    onReject: {
      description: "반려 버튼 클릭 핸들러 (필수)",
      action: "rejected",
    },
    contentType: {
      description: "콘텐츠 타입 (구매평만, 'both'일 때 이미지 확인 + 링크 확인 버튼 두 개)",
      control: "select",
      options: ["link", "image", "both"],
    },
    dateLabel: {
      description: "등록/수정/지각 등록 라벨",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignInspectionCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderCampaignInspectionCard = (args: any) => {
  return React.createElement(CampaignInspectionCard, args);
};

/* ========================================
   구매평 스토리
   ======================================== */

/**
 * 구매평 - 리뷰 확인 (type1)
 *
 * 리뷰 확인 버튼이 있는 검수 카드입니다.
 */
export const ReviewType1: Story = {
  render: renderCampaignInspectionCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 1,
    },
    onCheckReview: (id) => console.log("Review checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
    contentType: "link",
    dateLabel: "등록",
  },
};

/**
 * 구매평 - 구매 영수증 확인 (type2)
 *
 * 구매 영수증 확인 버튼이 있는 검수 카드입니다.
 */
export const ReviewType2: Story = {
  render: renderCampaignInspectionCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 2,
    },
    onCheckReceipt: (id) => console.log("Receipt checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
    dateLabel: "등록",
  },
};

/**
 * 구매평 - 이미지 확인 + 링크 확인 (contentType: "both")
 *
 * contentType이 "both"일 때 이미지 확인과 링크 확인 버튼 두 개가 표시됩니다.
 */
export const ReviewBothContentType: Story = {
  render: renderCampaignInspectionCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 1,
    },
    onCheckReview: (id) => console.log("Review checked:", id),
    onCheckLink: (id) => console.log("Link checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
    contentType: "both",
    dateLabel: "등록",
  },
};

/**
 * 구매평 - 수정 라벨
 *
 * 수정된 콘텐츠를 확인하는 검수 카드입니다.
 */
export const ReviewWithUpdatedLabel: Story = {
  render: renderCampaignInspectionCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 1,
      updatedAt: "2024-01-20 10:30",
    },
    onCheckReview: (id) => console.log("Review checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
    dateLabel: "수정",
  },
};

/* ========================================
   미션형 스토리
   ======================================== */

/**
 * 미션형 - 이미지 확인 + 링크 확인 (type1)
 *
 * 이미지 확인과 링크 확인 버튼이 모두 있는 검수 카드입니다.
 */
export const MissionType1: Story = {
  render: renderCampaignInspectionCard,
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
 * 미션형 - 이미지 확인만 (type2)
 *
 * 이미지 확인 버튼만 있는 검수 카드입니다.
 */
export const MissionType2: Story = {
  render: renderCampaignInspectionCard,
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
 * 미션형 - 링크 확인만 (type3)
 *
 * 링크 확인 버튼만 있는 검수 카드입니다.
 */
export const MissionType3: Story = {
  render: renderCampaignInspectionCard,
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
 * 1. 공통 검수 카드 컴포넌트
 *    - 구매평과 미션형 두 가지 캠페인 타입을 모두 지원합니다
 *    - campaignType prop으로 구매평/미션형을 구분합니다
 *
 * 2. 구매평 버튼
 *    - type1: "리뷰 확인" 버튼
 *    - type2: "구매영수증 확인하기" 버튼
 *    - contentType이 "both"일 때: "이미지 확인" + "링크 확인" 버튼 두 개
 *
 * 3. 미션형 버튼
 *    - type1: "이미지 확인" + "링크 확인" 버튼 두 개
 *    - type2: "이미지 확인" 버튼만
 *    - type3: "링크 확인" 버튼만
 *
 * 4. 승인/반려 기능
 *    - 모든 타입에서 승인/반려 버튼이 표시됩니다
 *    - 반려 버튼 클릭 시 반려 사유 입력 모달이 열립니다
 *
 * 5. 조건부 렌더링
 *    - 구매평일 때만 연장/신고 footer가 표시됩니다
 *    - 미션형일 때는 footer가 표시되지 않습니다
 */

