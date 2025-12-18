/**
 * NaverBlogCompletedCard 컴포넌트 스토리북
 *
 * 네이버블로그 완료 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import NaverBlogCompletedCard from "./NaverBlogCompletedCard";
import type { CompletedApplicant } from "@/data/partner/campaign_application/delivery_review_completed";

const mockCompletedApplicant: CompletedApplicant = {
  id: "1",
  Id: "blog.naver.com/test",
  nickname: "네이버블로거",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  channel: "네이버블로그",
  completedDate: "2024-01-20",
};

const meta: Meta<typeof NaverBlogCompletedCard> = {
  title: "Partner/CampaignApplication/CardType/NaverBlog/NaverBlogCompletedCard",
  component: NaverBlogCompletedCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "완료된 네이버블로그 신청자 정보 객체",
      control: "object",
    },
    onConfirm: {
      description: "완료 확인 버튼 클릭 핸들러",
      action: "confirmed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof NaverBlogCompletedCard>;

/**
 * 기본 완료 카드
 *
 * 검수가 완료된 네이버블로그 신청자 카드입니다.
 */
export const Default: Story = {
  args: {
    applicant: mockCompletedApplicant,
    onConfirm: (id) => console.log("Confirmed applicant:", id),
  },
};
