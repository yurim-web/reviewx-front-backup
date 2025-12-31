/**
 * CampaignCompletedCard 컴포넌트 스토리북
 *
 * 구매평/미션형 공통 완료 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 * 
 * 📚 학습 포인트:
 * - 구매평과 미션형 두 가지 캠페인 타입을 모두 지원하는 공통 컴포넌트
 * - campaignType prop으로 구매평/미션형 구분
 * - 구매평: 리뷰 확인 또는 구매 영수증 확인 버튼
 * - 미션형: 이미지 확인 또는 링크 확인 버튼
 * - 검수 완료 상태로 더 이상 승인/반려 불가능
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignCompletedCard from "./CampaignCompletedCard";
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
  reviewType: 3, // 리뷰 확인 (검수 완료)
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
  missionType: 7, // 이미지 + 링크 (검수 완료)
};

const meta: Meta<typeof CampaignCompletedCard> = {
  title: "Partner/CampaignContents/CardType/SharedCard/CampaignCompletedCard",
  component: CampaignCompletedCard,
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
    dateLabel: {
      description: "등록/수정/지각 등록 라벨",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignCompletedCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderCampaignCompletedCard = (args: any) => {
  return React.createElement(CampaignCompletedCard, args);
};

/* ========================================
   구매평 스토리
   ======================================== */

/**
 * 구매평 - 리뷰 확인 (type3)
 *
 * 리뷰 확인 버튼이 있는 완료 카드입니다.
 */
export const ReviewType3: Story = {
  render: renderCampaignCompletedCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 3,
    },
    onCheckReview: (id) => console.log("Review checked:", id),
    dateLabel: "수정",
  },
};

/**
 * 구매평 - 구매 영수증 확인 (type2)
 *
 * 구매 영수증 확인 버튼이 있는 완료 카드입니다.
 */
export const ReviewReceiptType: Story = {
  render: renderCampaignCompletedCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 2,
    },
    onCheckReceipt: (id) => console.log("Receipt checked:", id),
    dateLabel: "수정",
  },
};

/**
 * 구매평 - 등록 라벨
 *
 * 등록 라벨이 있는 완료 카드입니다.
 */
export const ReviewWithRegistrationLabel: Story = {
  render: renderCampaignCompletedCard,
  args: {
    applicant: {
      ...mockReviewApplicant,
      reviewType: 3,
    },
    onCheckReview: (id) => console.log("Review checked:", id),
    dateLabel: "등록",
  },
};

/* ========================================
   미션형 스토리
   ======================================== */

/**
 * 미션형 - 이미지 확인 + 링크 확인 (type7)
 *
 * 이미지 확인과 링크 확인 버튼이 모두 있는 완료 카드입니다.
 */
export const MissionType7: Story = {
  render: renderCampaignCompletedCard,
  args: {
    applicant: {
      ...mockMissionApplicant,
      missionType: 7,
    },
    onCheckImage: (id) => console.log("Image checked:", id),
    onCheckLink: (id) => console.log("Link checked:", id),
    dateLabel: "수정",
  },
};

/**
 * 미션형 - 이미지 확인만 (type8)
 *
 * 이미지 확인 버튼만 있는 완료 카드입니다.
 */
export const MissionType8: Story = {
  render: renderCampaignCompletedCard,
  args: {
    applicant: {
      ...mockMissionApplicant,
      missionType: 8,
    },
    onCheckImage: (id) => console.log("Image checked:", id),
    dateLabel: "수정",
  },
};

/**
 * 미션형 - 링크 확인만 (type9)
 *
 * 링크 확인 버튼만 있는 완료 카드입니다.
 */
export const MissionType9: Story = {
  render: renderCampaignCompletedCard,
  args: {
    applicant: {
      ...mockMissionApplicant,
      missionType: 9,
    },
    onCheckLink: (id) => console.log("Link checked:", id),
    dateLabel: "수정",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 공통 완료 카드 컴포넌트
 *    - 구매평과 미션형 두 가지 캠페인 타입을 모두 지원합니다
 *    - campaignType prop으로 구매평/미션형을 구분합니다
 *
 * 2. 구매평 버튼
 *    - type1, 3, 5: "리뷰 확인" 버튼
 *    - type2, 4, 6: "구매영수증 확인하기" 버튼
 *
 * 3. 미션형 버튼
 *    - type7: "이미지 확인" + "링크 확인" 버튼 두 개
 *    - type8: "이미지 확인" 버튼만
 *    - type9: "링크 확인" 버튼만
 *
 * 4. 검수 완료 상태
 *    - "검수 완료" 버튼이 비활성화되어 있습니다
 *    - 더 이상 승인/반려가 불가능한 상태입니다
 *
 * 5. 조건부 렌더링
 *    - 구매평일 때만 연장/신고 footer가 표시됩니다
 *    - 미션형일 때는 footer가 표시되지 않습니다
 */

