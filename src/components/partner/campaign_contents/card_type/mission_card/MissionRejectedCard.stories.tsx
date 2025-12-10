/**
 * MissionRejectedCard 컴포넌트 스토리북
 *
 * 미션형 반려 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import MissionRejectedCard from "./MissionRejectedCard";
import type { ExperienceApplicant } from "./MissionTypes";

const mockApplicant: ExperienceApplicant = {
  id: "1",
  userType: "리뷰어",
  nickname: "미션러",
  profileImage: "/images/test_img/profile_test.png",
  channel: "네이버블로그",
  channelId: "blog.naver.com/test",
  registrationDate: "2024-01-15 17:37",
  missionType: 4, // 이미지 확인 + 링크 확인 (반려 처리)
};

const meta: Meta<typeof MissionRejectedCard> = {
  title: "Partner/CampaignContents/CardType/Mission/MissionRejectedCard",
  component: MissionRejectedCard,
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

type Story = StoryObj<typeof MissionRejectedCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderMissionRejectedCard = (args: any) => {
  return React.createElement(MissionRejectedCard, args);
};

/**
 * 타입 4: 이미지 확인 + 링크 확인 (반려 처리)
 *
 * 이미지와 링크를 모두 확인할 수 있는 반려 카드입니다.
 */
export const Type4: Story = {
  render: renderMissionRejectedCard,
  args: {
    applicant: {
      ...mockApplicant,
      missionType: 4,
    },
    onCheckLink: (id) => console.log("Link checked:", id),
    onCheckImage: (id) => console.log("Image checked:", id),
    onHandleReject: (id) => console.log("Reject handled:", id),
    dateLabel: "등록",
  },
};

/**
 * 타입 5: 이미지 확인만 (반려 처리)
 *
 * 이미지만 확인할 수 있는 반려 카드입니다.
 */
export const Type5: Story = {
  render: renderMissionRejectedCard,
  args: {
    applicant: {
      ...mockApplicant,
      missionType: 5,
    },
    onCheckImage: (id) => console.log("Image checked:", id),
    onHandleReject: (id) => console.log("Reject handled:", id),
    dateLabel: "등록",
  },
};

/**
 * 타입 6: 링크 확인만 (반려 처리)
 *
 * 링크만 확인할 수 있는 반려 카드입니다.
 */
export const Type6: Story = {
  render: renderMissionRejectedCard,
  args: {
    applicant: {
      ...mockApplicant,
      missionType: 6,
    },
    onCheckLink: (id) => console.log("Link checked:", id),
    onHandleReject: (id) => console.log("Reject handled:", id),
    dateLabel: "등록",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 미션형 반려 카드 컴포넌트
 *    - 검수탭에서 반려 상태로 표시되는 미션형 카드입니다
 *    - missionType에 따라 다른 버튼 조합을 표시합니다
 *    - 하단에 강조된 빨간색 "반려 처리" 버튼이 표시됩니다
 *
 * 2. 미션 타입별 버튼
 *    - type4: 이미지 확인 + 링크 확인
 *    - type5: 이미지 확인만
 *    - type6: 링크 확인만
 *
 * 3. 반려 처리 기능
 *    - onHandleReject로 반려 처리를 할 수 있습니다
 *    - 반려 처리 버튼은 빨간색으로 강조되어 있습니다
 *
 * 4. getPrimaryButtons 함수
 *    - missionType에 따라 적절한 버튼 배열을 반환합니다
 *    - switch 문으로 타입별 분기 처리합니다
 */

