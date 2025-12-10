/**
 * InstagramCard 컴포넌트 스토리북
 *
 * 인스타그램 신청자 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 *
 * Storybook이란?
 * - 컴포넌트를 독립적으로 개발하고 테스트할 수 있는 도구입니다
 * - 다양한 props 조합으로 컴포넌트의 동작을 확인할 수 있습니다
 * - 디자이너와 개발자가 협업하기 좋은 도구입니다
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import InstagramCard from "./InstagramCard";
import type { InstagramApplicant } from "@/data/partner/campaign_application/delivery_applicants";

// Mock 데이터: 인스타그램 신청자 정보
const mockInstagramApplicant: InstagramApplicant = {
  id: "1",
  Id: "@instagram_user",
  nickname: "인스타그램러",
  userType: "인플루언서",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  followers: 122838,
  memo: "안녕하세요. 인스타그램에서 활동하는 인플루언서입니다.",
  selectionStatus: "미선택",
  channel: "인스타그램",
  registrationDate: "2024-01-15",
};

// Meta 타입: Storybook에서 컴포넌트의 메타데이터를 정의합니다
const meta: Meta<typeof InstagramCard> = {
  title: "Partner/CampaignApplication/CardType/Instagram/InstagramCard",
  component: InstagramCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "인스타그램 신청자 정보 객체",
      control: "object",
    },
    onSelect: {
      description: "선정하기 버튼 클릭 핸들러",
      action: "selected",
    },
  },
};

export default meta;

// StoryObj 타입: 개별 스토리의 타입을 정의합니다
type Story = StoryObj<typeof InstagramCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderInstagramCard = (args: typeof InstagramCard) => {
  return React.createElement(InstagramCard, args);
};

/**
 * 기본 인스타그램 신청자 카드
 *
 * 미선택 상태의 인스타그램 신청자 카드입니다.
 * 팔로워 수가 표시됩니다.
 */
export const Default: Story = {
  render: (args) => renderInstagramCard(args),
  args: {
    applicant: mockInstagramApplicant,
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 많은 팔로워를 가진 신청자
 *
 * 팔로워 수가 많은 인플루언서 카드입니다.
 */
export const HighFollowers: Story = {
  render: (args) => renderInstagramCard(args),
  args: {
    applicant: {
      ...mockInstagramApplicant,
      followers: 500000,
      nickname: "대형_인플루언서",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 적은 팔로워를 가진 신청자
 *
 * 팔로워 수가 적은 신청자 카드입니다.
 */
export const LowFollowers: Story = {
  render: (args) => renderInstagramCard(args),
  args: {
    applicant: {
      ...mockInstagramApplicant,
      followers: 500,
      nickname: "소규모_인플루언서",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 이용 제한 계정
 *
 * 이용 제한 상태인 인스타그램 신청자 카드입니다.
 */
export const Restricted: Story = {
  render: (args) => renderInstagramCard(args),
  args: {
    applicant: {
      ...mockInstagramApplicant,
      selectionStatus: "이용제한 계정",
      memberType: "이용 제한",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 리뷰어 타입
 *
 * 리뷰어 타입의 인스타그램 신청자 카드입니다.
 */
export const Reviewer: Story = {
  render: (args) => renderInstagramCard(args),
  args: {
    applicant: {
      ...mockInstagramApplicant,
      userType: "리뷰어",
      nickname: "리뷰어_홍길동",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 인스타그램 특화 카드 컴포넌트
 *    - 인스타그램 채널 신청자 전용 카드입니다
 *    - 팔로워 수를 중심으로 통계를 표시합니다
 *
 * 2. 팔로워 수 표시
 *    - toLocaleString()으로 숫자를 천 단위 콤마로 표시합니다
 *    - 예: 122838 -> "122,838"
 *    - 인스타그램에서는 팔로워 수가 가장 중요한 지표입니다
 *
 * 3. 채널 아이콘
 *    - getChannelLogo() 유틸리티 함수로 인스타그램 로고를 가져옵니다
 *    - 중앙 집중식 관리로 유지보수가 용이합니다
 *
 * 4. 인스타그램 특화 기능
 *    - 시각적 콘텐츠 중심의 리뷰에 최적화
 *    - 스토리/피드 게시물 활용
 *    - 해시태그 및 멘션 기능
 *
 * 5. 조건부 렌더링
 *    - selectionStatus에 따라 다른 버튼을 표시합니다
 *    - "미선택" 상태: "선정하기" 버튼
 *    - "이용제한 계정" 상태: "이용 제한 계정" 버튼 (disabled)
 */
