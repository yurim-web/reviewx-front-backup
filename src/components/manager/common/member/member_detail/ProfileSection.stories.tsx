/**
 * ProfileSection 컴포넌트 스토리북
 *
 * 프로필 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ProfileSection from "./ProfileSection";

const meta: Meta<typeof ProfileSection> = {
  title: "Manager/Common/Member/MemberDetail/ProfileSection",
  component: ProfileSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    name: {
      description: "이름 또는 상호명",
      control: "text",
    },
    status_type: {
      description: "상태 유형 (모범 회원, 주의 회원 등)",
      control: "text",
    },
    basic_info_items: {
      description: "기본 정보 배열",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProfileSection>;

// 리뷰어 프로필
export const Reviewer: Story = {
  args: {
    name: "홍길동",
    status_type: "모범 회원",
    basic_info_items: [
      "리뷰어",
      "김철수",
      "남성",
      "만 30세",
      "hong@example.com",
      "010-1234-5678",
    ],
  },
};

// 파트너 프로필
export const Partner: Story = {
  args: {
    name: "(주)샘플 브랜드",
    status_type: "정상",
    basic_info_items: [
      "파트너",
      "법인",
      "contact@sample.com",
      "02-1234-5678",
      "서울시 강남구",
    ],
  },
};

// 주의 회원
export const CautionMember: Story = {
  args: {
    name: "이영희",
    status_type: "주의 회원",
    basic_info_items: [
      "리뷰어",
      "이영희",
      "여성",
      "만 25세",
      "lee@example.com",
      "010-9876-5432",
    ],
  },
};




