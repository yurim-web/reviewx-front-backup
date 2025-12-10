/**
 * NaverBlogReviewCard 컴포넌트 스토리북
 *
 * 네이버블로그 검수 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import NaverBlogReviewCard from "./NaverBlogReviewCard";
import type { ReviewApplicant } from "@/data/partner/campaign_application/delivery_review_completed";

const mockReviewApplicant: ReviewApplicant = {
  id: "1",
  Id: "blog.naver.com/test",
  nickname: "네이버블로거",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  channel: "네이버블로그",
  registrationDate: "2024-01-18",
};

const meta: Meta<typeof NaverBlogReviewCard> = {
  title: "Partner/CampaignApplication/CardType/NaverBlog/NaverBlogReviewCard",
  component: NaverBlogReviewCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "검수 대상 네이버블로그 신청자 정보 객체",
      control: "object",
    },
    onContentCheck: {
      description: "콘텐츠 확인하기 버튼 클릭 핸들러",
      action: "content checked",
    },
    onApprove: {
      description: "승인 버튼 클릭 핸들러",
      action: "approved",
    },
    onReject: {
      description: "반려 버튼 클릭 핸들러",
      action: "rejected",
    },
  },
};

export default meta;

type Story = StoryObj<typeof NaverBlogReviewCard>;

/**
 * 기본 검수 카드
 *
 * 콘텐츠 검수가 필요한 네이버블로그 신청자 카드입니다.
 */
export const Default: Story = {
  args: {
    applicant: mockReviewApplicant,
    onContentCheck: (id) => console.log("Content checked:", id),
    onApprove: (id) => console.log("Approved applicant:", id),
    onReject: (id) => console.log("Rejected applicant:", id),
  },
};
