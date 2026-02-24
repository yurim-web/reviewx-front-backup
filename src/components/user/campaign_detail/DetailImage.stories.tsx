/* ========================================
   DetailImage 스토리북
   ======================================== */

/**
 * DetailImage.stories
 *
 * 목적: 캠페인 상세 이미지 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/CampaignDetail/DetailImage)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignDetailImage from "./DetailImage";

const meta: Meta<typeof CampaignDetailImage> = {
  title: "User/CampaignDetail/DetailImage",
  component: CampaignDetailImage,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    image: {
      description: "상세 이미지 경로",
      control: "text",
    },
    alt: {
      description: "이미지 alt 속성",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignDetailImage>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderCampaignDetailImage = () => {
  return React.createElement(CampaignDetailImage);
};

/**
 * 기본 상세 이미지
 *
 * 캠페인 상세 이미지입니다.
 * 펼쳐보기/접기 기능이 있습니다.
 */
export const Default: Story = {
  render: renderCampaignDetailImage,
  args: {
    image: "/images/test_img/campaign_detail_test.png",
    alt: "캠페인 상세 사진",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 상태 관리 (useState)
 *    - isImageExpanded 상태로 이미지 확장/축소를 관리합니다
 *    - useState Hook을 사용하여 컴포넌트 내부 상태를 관리합니다
 *
 * 2. 조건부 스타일링
 *    - isImageExpanded에 따라 expanded 클래스를 동적으로 추가합니다
 *    - 템플릿 리터럴과 삼항 연산자를 사용합니다
 *
 * 3. 이벤트 핸들러
 *    - onClick으로 이미지 확장/축소를 토글합니다
 *    - setIsImageExpanded로 상태를 변경합니다
 *
 * 4. "use client" 지시어
 *    - Next.js에서 클라이언트 컴포넌트임을 명시합니다
 *    - useState 같은 클라이언트 전용 기능을 사용할 때 필요합니다
 */
