/**
 * NaverBlogCard 컴포넌트 스토리북
 *
 * 네이버블로그 신청자/선정자 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import NaverBlogCard from "./NaverBlogCard";
import type { Applicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockApplicant: Applicant = {
  id: "1",
  Id: "blog.naver.com/test",
  nickname: "네이버블로거",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  dailyVisits: 500,
  totalVisits: 10000,
  neighbors: 100,
  memo: "안녕하세요. 네이버 블로그에서 활동하는 리뷰어입니다.",
  selectionStatus: "미선택",
  channel: "네이버블로그",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof NaverBlogCard> = {
  title: "Partner/CampaignApplication/CardType/NaverBlog/NaverBlogCard",
  component: NaverBlogCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "네이버블로그 신청자 정보 객체",
      control: "object",
    },
    variant: {
      description: "카드 타입 (신청/선정)",
      control: "select",
      options: ["applicant", "selected"],
    },
    onSelect: {
      description: "선정하기 버튼 클릭 핸들러",
      action: "selected",
    },
    onCancel: {
      description: "선택 취소 버튼 클릭 핸들러",
      action: "cancelled",
    },
  },
};

export default meta;

type Story = StoryObj<typeof NaverBlogCard>;

const renderNaverBlogCard = (args: typeof NaverBlogCard) => {
  return React.createElement(NaverBlogCard, args);
};

/**
 * 신청자 카드
 *
 * 미선택 상태의 네이버블로그 신청자 카드입니다.
 * 일방문, 총방문, 이웃수 통계가 표시됩니다.
 */
export const Applicant: Story = {
  render: (args) => renderNaverBlogCard(args),
  args: {
    applicant: mockApplicant,
    variant: "applicant",
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 선정자 카드
 *
 * 선정된 네이버블로그 신청자 카드입니다.
 * 점선 테두리와 "선택 취소" 버튼이 표시됩니다.
 */
export const Selected: Story = {
  render: (args) => renderNaverBlogCard(args),
  args: {
    applicant: {
      ...mockApplicant,
      selectionStatus: "선정하기",
    },
    variant: "selected",
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

/**
 * 인플루언서 신청자
 *
 * 인플루언서 타입의 네이버블로그 신청자 카드입니다.
 * 인플루언서 전용 스타일이 적용됩니다.
 */
export const InfluencerApplicant: Story = {
  render: (args) => renderNaverBlogCard(args),
  args: {
    applicant: {
      ...mockApplicant,
      userType: "인플루언서",
      nickname: "인플루언서_네이버블로거",
    },
    variant: "applicant",
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 인플루언서 선정자
 *
 * 인플루언서 타입의 선정자 카드입니다.
 * 인플루언서 전용 취소 버튼 스타일이 적용됩니다.
 */
export const InfluencerSelected: Story = {
  render: (args) => renderNaverBlogCard(args),
  args: {
    applicant: {
      ...mockApplicant,
      userType: "인플루언서",
      nickname: "인플루언서_네이버블로거",
      selectionStatus: "선정하기",
    },
    variant: "selected",
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

/**
 * 이용 제한 계정
 *
 * 이용 제한 상태인 네이버블로그 신청자 카드입니다.
 */
export const Restricted: Story = {
  render: (args) => renderNaverBlogCard(args),
  args: {
    applicant: {
      ...mockApplicant,
      selectionStatus: "이용제한 계정",
      memberType: "이용 제한",
    },
    variant: "applicant",
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 통합 카드 컴포넌트
 *    - 신청자와 선정자 카드를 하나의 컴포넌트로 통합했습니다
 *    - variant prop으로 "applicant" 또는 "selected"를 구분합니다
 *
 * 2. 네이버블로그 특화 통계
 *    - 일방문, 총방문, 이웃수 통계를 표시합니다
 *    - toLocaleString()으로 숫자를 천 단위 콤마로 표시합니다
 *
 * 3. 인플루언서 전용 스타일
 *    - userType이 "인플루언서"일 때 특별한 스타일이 적용됩니다
 *    - selected_card_influencer 클래스로 선정된 인플루언서를 강조합니다
 *
 * 4. 조건부 렌더링
 *    - variant에 따라 다른 버튼을 표시합니다
 *    - "applicant": "선정하기" 버튼
 *    - "selected": "선택 취소" 버튼
 */

