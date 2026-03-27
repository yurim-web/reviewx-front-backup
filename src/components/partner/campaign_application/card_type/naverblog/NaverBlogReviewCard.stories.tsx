/* ========================================
   네이버블로그 검수 카드 스토리북
   ======================================== */

/**
 * NaverBlogReviewCard.stories
 *
 * 목적: 네이버블로그 콘텐츠 검수 카드 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import NaverBlogReviewCard from "./NaverBlogReviewCard";
import type { ReviewApplicant } from "@/data/partner/campaign_application/delivery_review_completed";

const mockReviewApplicant: ReviewApplicant = {
  id: "1",
  Id: "blog.naver.com/test",
  nickname: "네이버블로거",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  selectionStatus: "검수중",
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

/**
 * 인플루언서 검수 카드
 *
 * 인플루언서 타입의 콘텐츠 검수 카드입니다.
 */
export const Influencer: Story = {
  args: {
    applicant: {
      ...mockReviewApplicant,
      userType: "인플루언서",
      nickname: "인플루언서_블로거",
    },
    onContentCheck: (id) => console.log("Content checked:", id),
    onApprove: (id) => console.log("Approved applicant:", id),
    onReject: (id) => console.log("Rejected applicant:", id),
  },
};

/**
 * 늦은 등록 검수 카드
 *
 * 등록일이 오래된 검수 대기 카드입니다.
 */
export const LateRegistration: Story = {
  args: {
    applicant: {
      ...mockReviewApplicant,
      registrationDate: "2024-01-05",
      nickname: "늦은_등록_블로거",
    },
    onContentCheck: (id) => console.log("Content checked:", id),
    onApprove: (id) => console.log("Approved applicant:", id),
    onReject: (id) => console.log("Rejected applicant:", id),
  },
};
