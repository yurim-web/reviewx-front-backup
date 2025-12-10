/**
 * MissionCompletedCard 컴포넌트 스토리북
 *
 * 미션형 완료 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import MissionCompletedCard from "./MissionCompletedCard";
import type { ExperienceApplicant } from "./MissionTypes";

const mockApplicant: ExperienceApplicant = {
  id: "1",
  userType: "리뷰어",
  nickname: "미션러",
  profileImage: "/images/test_img/profile_test.png",
  channel: "네이버블로그",
  channelId: "blog.naver.com/test",
  registrationDate: "2024-01-15 17:37",
  missionType: 7, // 이미지 확인 + 링크 확인
};

const meta: Meta<typeof MissionCompletedCard> = {
  title: "Partner/CampaignContents/CardType/Mission/MissionCompletedCard",
  component: MissionCompletedCard,
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
    dateLabel: {
      description: "등록/수정/지각 등록 라벨",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof MissionCompletedCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderMissionCompletedCard = (args: any) => {
  return React.createElement(MissionCompletedCard, args);
};

/**
 * 타입 7: 이미지 확인 + 링크 확인
 *
 * 이미지와 링크를 모두 확인할 수 있는 완료 카드입니다.
 */
export const Type7: Story = {
  render: renderMissionCompletedCard,
  args: {
    applicant: {
      ...mockApplicant,
      missionType: 7,
    },
    onCheckLink: (id) => console.log("Link checked:", id),
    onCheckImage: (id) => console.log("Image checked:", id),
    dateLabel: "수정",
  },
};

/**
 * 타입 8: 이미지 확인만
 *
 * 이미지만 확인할 수 있는 완료 카드입니다.
 */
export const Type8: Story = {
  render: renderMissionCompletedCard,
  args: {
    applicant: {
      ...mockApplicant,
      missionType: 8,
    },
    onCheckImage: (id) => console.log("Image checked:", id),
    dateLabel: "수정",
  },
};

/**
 * 타입 9: 링크 확인만
 *
 * 링크만 확인할 수 있는 완료 카드입니다.
 */
export const Type9: Story = {
  render: renderMissionCompletedCard,
  args: {
    applicant: {
      ...mockApplicant,
      missionType: 9,
    },
    onCheckLink: (id) => console.log("Link checked:", id),
    dateLabel: "수정",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 미션형 완료 카드 컴포넌트
 *    - 완료탭에서 사용되는 미션형 카드입니다
 *    - missionType에 따라 다른 버튼 조합을 표시합니다
 *
 * 2. 미션 타입별 버튼
 *    - type7: 이미지 확인 + 링크 확인
 *    - type8: 이미지 확인만
 *    - type9: 링크 확인만
 *
 * 3. getPrimaryButtons 함수
 *    - missionType에 따라 적절한 버튼 배열을 반환합니다
 *    - switch 문으로 타입별 분기 처리합니다
 */
