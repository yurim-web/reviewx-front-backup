/**
 * BasicSelectedCard 컴포넌트 스토리북
 *
 * 기본 선정자 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 *
 * Storybook이란?
 * - 컴포넌트를 독립적으로 개발하고 테스트할 수 있는 도구입니다
 * - 다양한 props 조합으로 컴포넌트의 동작을 확인할 수 있습니다
 * - 디자이너와 개발자가 협업하기 좋은 도구입니다
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import BasicSelectedCard from "./BasicSelectedCard";
import type { BasicApplicant } from "@/data/partner/campaign_application/delivery_applicants";

// Mock 데이터: 선정된 기본 신청자 정보
const mockSelectedApplicant: BasicApplicant = {
  id: "1",
  Id: "basic_user_1",
  nickname: "홍길동",
  userType: "리뷰어",
  profileImage: "/images/test_img/profile_test.png",
  memberType: "모범 회원",
  memo: "안녕하세요. 열심히 참여하겠습니다.",
  selectionStatus: "선정하기",
  channel: "기본",
  registrationDate: "2024-01-15",
};

// Meta 타입: Storybook에서 컴포넌트의 메타데이터를 정의합니다
const meta: Meta<typeof BasicSelectedCard> = {
  title: "Partner/CampaignApplication/CardType/Basic/BasicSelectedCard",
  component: BasicSelectedCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    applicant: {
      description: "선정된 기본 신청자 정보 객체",
      control: "object",
    },
    onCancel: {
      description: "선택 취소 버튼 클릭 핸들러",
      action: "cancelled",
    },
  },
};

export default meta;

// StoryObj 타입: 개별 스토리의 타입을 정의합니다
type Story = StoryObj<typeof BasicSelectedCard>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderBasicSelectedCard = (args: typeof BasicSelectedCard) => {
  return React.createElement(BasicSelectedCard, args);
};

/**
 * 기본 선정자 카드
 *
 * 선정된 기본 신청자 카드입니다.
 * "선택 취소" 버튼이 표시됩니다.
 */
export const Default: Story = {
  render: (args) => renderBasicSelectedCard(args),
  args: {
    applicant: mockSelectedApplicant,
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

/**
 * 메모가 있는 선정자
 *
 * 자기소개 메모가 작성된 선정자 카드입니다.
 */
export const WithMemo: Story = {
  render: (args) => renderBasicSelectedCard(args),
  args: {
    applicant: {
      ...mockSelectedApplicant,
      memo: "안녕하세요! 제품을 정성스럽게 리뷰하겠습니다. 많은 관심 부탁드립니다.",
    },
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

/**
 * 이용 제한 계정 (선정된 상태)
 *
 * 이용 제한 상태이지만 선정된 상태의 카드입니다.
 */
export const Restricted: Story = {
  render: (args) => renderBasicSelectedCard(args),
  args: {
    applicant: {
      ...mockSelectedApplicant,
      selectionStatus: "이용제한 계정",
      memberType: "이용 제한",
    },
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

/**
 * 인플루언서 타입
 *
 * 인플루언서 타입의 선정자 카드입니다.
 */
export const Influencer: Story = {
  render: (args) => renderBasicSelectedCard(args),
  args: {
    applicant: {
      ...mockSelectedApplicant,
      userType: "인플루언서",
      nickname: "인플루언서_홍길동",
    },
    onCancel: (id) => console.log("Cancelled selection:", id),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 선정자 카드 컴포넌트
 *    - 미션형과 구매평 캠페인에서 선정된 신청자를 표시하는 카드입니다
 *    - BasicCard와 유사하지만 "선택 취소" 버튼이 표시됩니다
 *
 * 2. selected_card 클래스
 *    - 선정된 상태를 시각적으로 구분하기 위해 selected_card 클래스를 추가합니다
 *    - CSS로 선정된 카드를 강조 표시합니다
 *
 * 3. 선택 취소 기능
 *    - onCancel 콜백으로 선택 취소를 처리합니다
 *    - 부모 컴포넌트에서 선정 목록에서 제거합니다
 *
 * 4. BasicCard와의 차이점
 *    - BasicCard: "선정하기" 버튼 (미선택 상태)
 *    - BasicSelectedCard: "선택 취소" 버튼 (선정된 상태)
 *    - 동일한 데이터 구조를 사용하지만 다른 액션을 제공합니다
 */
