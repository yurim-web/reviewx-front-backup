/* ========================================
   AdditionalGuidelines 스토리북
   ======================================== */

/**
 * AdditionalGuidelines.stories
 *
 * 목적: 캠페인 공통 유의사항 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/CampaignDetail/AdditionalGuidelines)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import AdditionalGuidelines from "./AdditionalGuidelines";

const meta: Meta<typeof AdditionalGuidelines> = {
  title: "User/CampaignDetail/AdditionalGuidelines",
  component: AdditionalGuidelines,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof AdditionalGuidelines>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderAdditionalGuidelines = () => {
  return React.createElement(AdditionalGuidelines);
};

/**
 * 기본 유의사항
 *
 * 모든 캠페인 타입에서 공통으로 사용되는 유의사항입니다.
 */
export const Default: Story = {
  render: renderAdditionalGuidelines,
};

/**
 * 학습 포인트:
 *
 * 1. 고정 컴포넌트
 *    - Props 없이 고정된 유의사항을 표시합니다
 *    - 모든 캠페인 타입에서 동일한 내용을 사용합니다
 *
 * 2. 공통 안내사항
 *    - 양도/판매/교환 금지
 *    - 허위·과장 금지
 *    - 변경 불가 안내
 *    - 취소 시 패널티
 *    - 미션 수정 요청
 *    - 단독 촬영/작성
 *    - 기간 내 등록
 *
 * 3. 스타일링
 *    - text_line 클래스로 중요한 텍스트를 강조합니다
 *    - br 태그로 줄바꿈을 처리합니다
 */
