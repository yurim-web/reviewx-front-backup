/**
 * BasicCard 컴포넌트 스토리북
 *
 * 기본 신청자 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 *
 * Storybook이란?
 * - 컴포넌트를 독립적으로 개발하고 테스트할 수 있는 도구입니다
 * - 다양한 props 조합으로 컴포넌트의 동작을 확인할 수 있습니다
 * - 디자이너와 개발자가 협업하기 좋은 도구입니다
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import BasicCard from "./BasicCard";
import type { BasicApplicant } from "@/data/partner/campaign_application/delivery_applicants";

// Mock 데이터: 기본 신청자 정보
const mockBasicApplicant: BasicApplicant = {
  id: "1",
  Id: "basic_user_1",
  nickname: "홍길동",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  memo: "안녕하세요. 열심히 참여하겠습니다.",
  selectionStatus: "미선택",
  channel: "기본",
  registrationDate: "2024-01-15",
};

// Meta 타입: Storybook에서 컴포넌트의 메타데이터를 정의합니다
// title: Storybook 사이드바에서 보이는 경로 (슬래시로 계층 구조 표현)
// component: 스토리를 생성할 컴포넌트
// tags: 자동 문서 생성 등의 기능을 활성화
const meta: Meta<typeof BasicCard> = {
  title: "Partner/CampaignApplication/CardType/Basic/BasicCard",
  component: BasicCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "기본 신청자 정보 객체",
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
type Story = StoryObj<typeof BasicCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderBasicCard = (args: typeof BasicCard) => {
  return React.createElement(BasicCard, args);
};

/**
 * 기본 신청자 카드
 *
 * 미선택 상태의 기본 신청자 카드입니다.
 * 미션형과 구매평 캠페인에서 사용됩니다.
 */
export const Default: Story = {
  render: (args) => renderBasicCard(args),
  args: {
    applicant: mockBasicApplicant,
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 메모가 있는 신청자
 *
 * 자기소개 메모가 작성된 신청자 카드입니다.
 */
export const WithMemo: Story = {
  render: (args) => renderBasicCard(args),
  args: {
    applicant: {
      ...mockBasicApplicant,
      memo: "안녕하세요! 제품을 정성스럽게 리뷰하겠습니다. 많은 관심 부탁드립니다.",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 메모가 없는 신청자
 *
 * 자기소개 메모가 작성되지 않은 신청자 카드입니다.
 */
export const WithoutMemo: Story = {
  render: (args) => renderBasicCard(args),
  args: {
    applicant: {
      ...mockBasicApplicant,
      memo: "",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 이용 제한 계정
 *
 * 이용 제한 상태인 신청자 카드입니다.
 * 선정하기 버튼 대신 "이용 제한 계정" 버튼이 표시됩니다.
 */
export const Restricted: Story = {
  render: (args) => renderBasicCard(args),
  args: {
    applicant: {
      ...mockBasicApplicant,
      selectionStatus: "이용제한 계정",
      memberType: "이용 제한",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 인플루언서 타입
 *
 * 인플루언서 타입의 신청자 카드입니다.
 */
export const Influencer: Story = {
  render: (args) => renderBasicCard(args),
  args: {
    applicant: {
      ...mockBasicApplicant,
      userType: "인플루언서",
      nickname: "인플루언서_홍길동",
    },
    onSelect: (id) => console.log("Selected applicant:", id),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 기본 카드 컴포넌트
 *    - 미션형과 구매평 캠페인에서 사용되는 기본 신청자 카드입니다
 *    - 채널별 특화 정보 없이 기본 정보만 표시합니다
 *
 * 2. 조건부 렌더링
 *    - selectionStatus에 따라 다른 버튼을 표시합니다
 *    - "미선택" 상태: "선정하기" 버튼
 *    - "이용제한 계정" 상태: "이용 제한 계정" 버튼 (disabled)
 *
 * 3. 메모 처리
 *    - 메모가 있으면 메모를 표시하고, 없으면 "메모 미작성"을 표시합니다
 *    - trim()으로 공백만 있는 경우도 처리합니다
 *
 * 4. 프로필 이미지 처리
 *    - profileImage가 있으면 이미지를 표시하고, 없으면 placeholder를 표시합니다
 *    - 조건부 렌더링으로 처리합니다
 *
 * 5. CSS 모듈 사용
 *    - applicant_card_shared.module.css를 사용하여 스타일을 관리합니다
 *    - restricted_card 클래스로 이용 제한 계정을 시각적으로 구분합니다
 *
 * 6. 접근성 (Accessibility)
 *    - aria-label로 버튼의 목적을 명시합니다
 *    - 시맨틱 HTML(article)을 사용합니다
 */
