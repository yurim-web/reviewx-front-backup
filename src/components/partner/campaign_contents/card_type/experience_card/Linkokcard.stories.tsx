/**
 * Linkokcard (검수카드) 컴포넌트 스토리북
 *
 * 검수카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import NaverBlogReviewCard from "./Linkokcard";
import type { ReviewApplicant } from "@/data/partner/campaign_application/delivery_review_completed";

const mockApplicant: ReviewApplicant = {
  id: "1",
  Id: "blog.naver.com/test",
  nickname: "검수러",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  selectionStatus: "검수중",
  channel: "네이버블로그",
  registrationDate: "2024-01-15 17:37",
};

const meta: Meta<typeof NaverBlogReviewCard> = {
  title: "Partner/CampaignContents/CardType/Experience/Linkokcard",
  component: NaverBlogReviewCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "검수 대상 신청자 정보 객체",
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

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderLinkokcard = (args: any) => {
  return React.createElement(NaverBlogReviewCard, args);
};

/**
 * 기본 검수 카드
 *
 * 콘텐츠 검수가 필요한 신청자의 정보를 표시하는 검수 카드입니다.
 */
export const Default: Story = {
  render: renderLinkokcard,
  args: {
    applicant: mockApplicant,
    onContentCheck: (id) => console.log("Content checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
  },
};

/**
 * 인플루언서 검수 카드
 *
 * 인플루언서 타입의 신청자를 검수하는 카드입니다.
 */
export const Influencer: Story = {
  render: renderLinkokcard,
  args: {
    applicant: {
      ...mockApplicant,
      userType: "인플루언서",
      nickname: "인플루언서",
    },
    onContentCheck: (id) => console.log("Content checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
  },
};

/**
 * 다양한 채널 검수 카드
 *
 * 다른 채널의 신청자를 검수하는 카드입니다.
 */
export const DifferentChannels: Story = {
  render: renderLinkokcard,
  args: {
    applicant: {
      ...mockApplicant,
      channel: "인스타그램",
      Id: "instagram.com/test",
    },
    onContentCheck: (id) => console.log("Content checked:", id),
    onApprove: (id) => console.log("Approved:", id),
    onReject: (id) => console.log("Rejected:", id),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 검수 카드 컴포넌트
 *    - 콘텐츠 검수가 필요한 신청자의 정보를 표시하는 카드입니다
 *    - 배송형 캠페인 검수 대기 목록에서 사용됩니다
 *
 * 2. 검수 워크플로우
 *    - 콘텐츠 확인하기 버튼으로 콘텐츠를 검토합니다
 *    - 승인/반려 버튼으로 검수 결과를 처리합니다
 *    - 등록일 정보로 검수 우선순위를 판단합니다
 *
 * 3. 승인/반려 기능
 *    - onApprove로 승인 처리를 할 수 있습니다
 *    - onReject로 반려 처리를 할 수 있습니다
 *    - 두 버튼이 나란히 배치되어 있습니다
 *
 * 4. 콘텐츠 확인 기능
 *    - onContentCheck로 콘텐츠를 확인할 수 있습니다
 *    - 검수 전에 콘텐츠를 검토하는 용도입니다
 */

