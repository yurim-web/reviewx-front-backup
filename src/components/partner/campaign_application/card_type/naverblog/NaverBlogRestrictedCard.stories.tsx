/**
 * NaverBlogRestrictedCard 컴포넌트 스토리북
 *
 * 네이버블로그 이용제한계정 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import NaverBlogRestrictedCard from "./NaverBlogRestrictedCard";
import type { Applicant } from "@/data/partner/campaign_application/delivery_applicants";

const mockRestrictedApplicant: Applicant = {
  id: "1",
  Id: "blog.naver.com/test",
  nickname: "네이버블로거",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "이용 제한",
  dailyVisits: 500,
  totalVisits: 10000,
  neighbors: 100,
  memo: "안녕하세요. 네이버 블로그에서 활동하는 리뷰어입니다.",
  selectionStatus: "이용제한 계정",
  channel: "네이버블로그",
  registrationDate: "2024-01-15",
};

const meta: Meta<typeof NaverBlogRestrictedCard> = {
  title: "Partner/CampaignApplication/CardType/NaverBlog/NaverBlogRestrictedCard",
  component: NaverBlogRestrictedCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "이용제한 네이버블로그 신청자 정보 객체",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof NaverBlogRestrictedCard>;

/**
 * 기본 이용제한 카드
 *
 * 이용 제한 상태인 네이버블로그 신청자 카드입니다.
 */
export const Default: Story = {
  args: {
    applicant: mockRestrictedApplicant,
  },
};
