/**
 * MissionInspectionCard 컴포넌트 스토리북
 *
 * 미션형 검수 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import MissionInspectionCard from "./MissionInspectionCard";
import type { ExperienceApplicant } from "./MissionTypes";

const mockApplicant: ExperienceApplicant = {
  id: "1",
  userType: "리뷰어",
  nickname: "미션러",
  profileImage: "/images/test_img/profile_test.png",
  channel: "네이버블로그",
  channelId: "blog.naver.com/test",
  registrationDate: "2024-01-15 17:37",
  missionType: 1, // 이미지 확인 + 링크 확인
};

const meta: Meta<typeof MissionInspectionCard> = {
  title: "Partner/CampaignContents/CardType/Mission/MissionInspectionCard",
  component: MissionInspectionCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "미션형 신청자 정보 객체",
      control: "object",
    },
    onCheckLink: {
      description: "링크 확인 버튼 클릭 핸들러",
      action: "link checked",
    },
    onCheckImage: {
      description: "이미지 확인 버튼 클릭 핸들러",
      action: "image checked",
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

type Story = StoryObj<typeof MissionInspectionCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderMissionInspectionCard = (args: any) => {
  return React.createElement(MissionInspectionCard, args);
};

/**
 * 타입 1: 이미지 확인 + 링크 확인
 *
 * 이미지와 링크를 모두 확인할 수 있는 검수 카드입니다.
 */
export const Type1: Story = {
  render: renderMissionInspectionCard,
  args: {
    applicant: {
      ...mockApplicant,
      missionType: 1,
    },
    onCheckLink: (id) => console.log("Link checked:", id),
    onCheckImage: (id) => console.log("Image checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
    dateLabel: "등록",
  },
};

/**
 * 타입 2: 이미지 확인만
 *
 * 이미지만 확인할 수 있는 검수 카드입니다.
 */
export const Type2: Story = {
  render: renderMissionInspectionCard,
  args: {
    applicant: {
      ...mockApplicant,
      missionType: 2,
    },
    onCheckImage: (id) => console.log("Image checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
    dateLabel: "등록",
  },
};

/**
 * 타입 3: 링크 확인만
 *
 * 링크만 확인할 수 있는 검수 카드입니다.
 */
export const Type3: Story = {
  render: renderMissionInspectionCard,
  args: {
    applicant: {
      ...mockApplicant,
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
 * 1. 미션형 검수 카드 컴포넌트
 *    - 검수탭에서 사용되는 미션형 카드입니다
 *    - missionType에 따라 다른 버튼 조합을 표시합니다
 *
 * 2. 미션 타입별 버튼
 *    - type1: 이미지 확인 + 링크 확인
 *    - type2: 이미지 확인만
 *    - type3: 링크 확인만
 *
 * 3. 승인/반려 기능
 *    - 모든 타입에서 승인/반려 버튼이 표시됩니다
 */

