/* ========================================
   DetailGuidelinesSectionDelivery 스토리북
   ======================================== */

/**
 * DetailGuidelinesSectionDelivery.stories
 *
 * 목적: 배송형 캠페인 안내사항 섹션 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/CampaignDetail/Guidelines/DetailGuidelinesSectionDelivery)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DetailGuidelinesSectionDelivery from "./DetailGuidelinesSectionDelivery";

const meta: Meta<typeof DetailGuidelinesSectionDelivery> = {
  title: "User/CampaignDetail/Guidelines/DetailGuidelinesSectionDelivery",
  component: DetailGuidelinesSectionDelivery,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    description: {
      description: "제공내역 설명",
      control: "text",
    },
    promotionLink: {
      description: "홍보링크 내용",
      control: "text",
    },
    keyword: {
      description: "키워드 내용",
      control: "text",
    },
    onCopyPromotionLink: {
      description: "홍보링크 복사 버튼 클릭 핸들러",
      action: "promotion link copied",
    },
    onCopyKeyword: {
      description: "키워드 복사 버튼 클릭 핸들러",
      action: "keyword copied",
    },
    requirements: {
      description: "요구사항 코드 목록",
      control: "object",
    },
    guidelineTexts: {
      description: "상세 가이드 문구 목록",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DetailGuidelinesSectionDelivery>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderDetailGuidelinesSectionDelivery = (args: any) => {
  return React.createElement(DetailGuidelinesSectionDelivery, args);
};

/**
 * 기본 배송형 안내사항
 *
 * 배송형 캠페인의 기본 안내사항 섹션입니다.
 */
export const Default: Story = {
  render: renderDetailGuidelinesSectionDelivery,
  args: {
    description: "제품 1개 제공",
    promotionLink: "https://example.com/product",
    keyword: "배송형 캠페인 키워드",
    onCopyPromotionLink: () => console.log("Promotion link copied"),
    onCopyKeyword: () => console.log("Keyword copied"),
    requirements: ["keyword", "product_link", "text_1500", "photo_10"],
  },
};

/**
 * 모든 필드 포함
 *
 * 모든 필드가 포함된 배송형 안내사항 섹션입니다.
 */
export const WithAllFields: Story = {
  render: renderDetailGuidelinesSectionDelivery,
  args: {
    description: "제품 2개 제공, 추가 혜택 포함",
    promotionLink: "https://example.com/promotion",
    keyword: "배송형 캠페인 특별 키워드",
    onCopyPromotionLink: () => console.log("Promotion link copied"),
    onCopyKeyword: () => console.log("Keyword copied"),
    requirements: [
      "keyword",
      "product_link",
      "text_1500",
      "photo_10",
      "video_120",
    ],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "제공된 제품을 모두 활용하여 작성해주세요.",
    ],
  },
};

/**
 * 최소 필드
 *
 * 최소한의 필드만 포함된 배송형 안내사항 섹션입니다.
 */
export const Minimal: Story = {
  render: renderDetailGuidelinesSectionDelivery,
  args: {
    requirements: ["keyword", "text_1500"],
  },
};

/**
 * 학습 포인트:
 *
 * 1. 배송형 안내사항 섹션 컴포넌트
 *    - 배송형 캠페인의 안내사항을 표시하는 컴포넌트입니다
 *    - 제공내역, 홍보링크, 키워드, 안내사항을 표시합니다
 *
 * 2. 복사 기능
 *    - 홍보링크와 키워드에 복사 버튼이 있습니다
 *    - onCopyPromotionLink와 onCopyKeyword로 복사 기능을 처리합니다
 *
 * 3. 요구사항 표시
 *    - requirements 배열로 요구사항 아이콘을 표시합니다
 *    - RequirementIcons 컴포넌트를 사용합니다
 *
 * 4. 가이드라인 텍스트
 *    - guidelineTexts로 상세 가이드 문구를 표시합니다
 *    - HTML 포함 가능하며 dangerouslySetInnerHTML로 렌더링합니다
 */

