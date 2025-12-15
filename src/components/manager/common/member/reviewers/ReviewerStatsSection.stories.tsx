/**
 * ReviewerStatsSection 컴포넌트 스토리북
 *
 * 리뷰어 통계 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import ReviewerStatsSection from "./ReviewerStatsSection";

const meta: Meta<typeof ReviewerStatsSection> = {
  title: "Manager/Common/Member/Reviewers/ReviewerStatsSection",
  component: ReviewerStatsSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ReviewerStatsSection>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderReviewerStatsSection = (args: any) => {
  return <ReviewerStatsSection {...args} />;
};

/**
 * 기본 통계 섹션
 *
 * 리뷰어 목록 페이지 상단의 통계 섹션입니다.
 */
export const Default: Story = {
  render: renderReviewerStatsSection,
  args: {},
};

/**
 * 학습 포인트:
 *
 * 1. 리뷰어 통계 섹션 컴포넌트
 *    - GA/SA 관리자 리뷰어 목록 페이지에서 공통 MemberStatsSection을 사용합니다
 *    - 스타일과 데이터를 전달하여 렌더링합니다
 *
 * 2. 통계 항목
 *    - 전체 가입자 수
 *    - 월간 활동 회원
 *    - 월간 신규 가입자 수
 *    - 휴면 회원
 *
 * 3. 데이터 소스
 *    - reviewer_stats 데이터를 사용합니다
 *    - src/data/manager_ga/member/reviewers.ts에서 가져옵니다
 */




