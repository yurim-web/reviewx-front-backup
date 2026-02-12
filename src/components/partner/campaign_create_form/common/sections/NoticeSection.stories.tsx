/**
 * NoticeSection 컴포넌트 스토리북
 *
 * 유의 사항 섹션 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import NoticeSection from "./NoticeSection";

const meta: Meta<typeof NoticeSection> = {
  title: "Partner/CampaignCreateForm/Common/NoticeSection",
  component: NoticeSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof NoticeSection>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderNoticeSection = () => {
  return React.createElement(NoticeSection);
};

/**
 * 기본 유의 사항
 *
 * 모든 캠페인 폼에서 공통으로 사용되는 유의 사항 섹션입니다.
 */
export const Default: Story = {
  render: renderNoticeSection,
};

/**
 * 학습 포인트:
 *
 * 1. 공통 컴포넌트
 *    - 모든 캠페인 폼에서 공통으로 사용되는 유의 사항입니다
 *    - Props 없이 고정된 내용을 표시합니다
 *
 * 2. 유의 사항 내용
 *    - 10개 항목의 규칙 및 정책 안내
 *    - 양도/판매/교환 금지
 *    - 허위·과장 금지
 *    - 변경 불가 안내
 *    - 패널티 관련 안내
 *    - 콘텐츠 유지 기간 안내
 *
 * 3. 스타일링
 *    - highlight 클래스로 중요한 텍스트를 강조합니다
 *    - ul/li 태그로 목록을 구조화합니다
 */

