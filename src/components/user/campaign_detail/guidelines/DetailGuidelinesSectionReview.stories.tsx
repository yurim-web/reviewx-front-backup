/**
 * DetailGuidelinesSectionReview 컴포넌트 스토리북
 *
 * 구매평 캠페인 안내사항 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DetailGuidelinesSectionReview from "./DetailGuidelinesSectionReview";

const meta: Meta<typeof DetailGuidelinesSectionReview> = {
  title: "User/CampaignDetail/Guidelines/DetailGuidelinesSectionReview",
  component: DetailGuidelinesSectionReview,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    description: {
      description: "제공내역 설명",
      control: "text",
    },
    purchaseLink: {
      description: "구매 링크",
      control: "text",
    },
    keyword: {
      description: "키워드",
      control: "text",
    },
    onCopyPurchaseLink: {
      description: "구매 링크 복사 핸들러",
      action: "purchase link copied",
    },
    onCopyKeyword: {
      description: "키워드 복사 핸들러",
      action: "keyword copied",
    },
    requirements: {
      description: "요구사항 코드 목록",
      control: "object",
    },
    guidelineTexts: {
      description: "유의사항 텍스트 목록",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DetailGuidelinesSectionReview>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderDetailGuidelinesSectionReview = (args: any) => {
  return React.createElement(DetailGuidelinesSectionReview, args);
};

/**
 * 기본 구매평 안내사항
 *
 * 구매평 캠페인의 기본 안내사항 섹션입니다.
 */
export const Default: Story = {
  render: renderDetailGuidelinesSectionReview,
  args: {
    description: "페이백 캠페인",
    purchaseLink: "https://example.com/purchase",
    keyword: "구매평 캠페인 키워드",
    onCopyPurchaseLink: () => console.log("Purchase link copied"),
    onCopyKeyword: () => console.log("Keyword copied"),
    requirements: ["keyword", "product_link", "text_1500"],
  },
};

/**
 * 모든 필드 포함
 *
 * 모든 필드가 포함된 구매평 안내사항 섹션입니다.
 */
export const WithAllFields: Story = {
  render: renderDetailGuidelinesSectionReview,
  args: {
    description: "페이백 캠페인 (선구매 후 리뷰)",
    purchaseLink: "https://example.com/purchase-review",
    keyword: "구매평 캠페인 특별 키워드",
    onCopyPurchaseLink: () => console.log("Purchase link copied"),
    onCopyKeyword: () => console.log("Keyword copied"),
    requirements: [
      "keyword",
      "product_link",
      "text_1500",
      "photo_10",
      "video_120",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "제공된 제품을 모두 활용하여 작성해주세요.",
    ],
  },
};

/**
 * 학습 포인트:
 *
 * 1. 구매평 안내사항 섹션 컴포넌트
 *    - 구매평 캠페인의 안내사항을 표시하는 컴포넌트입니다
 *    - 제공내역, 구매 링크, 키워드, 안내사항을 표시합니다
 *
 * 2. 페이백 캠페인
 *    - 구매평은 선구매 후 리뷰를 작성하는 페이백 캠페인입니다
 *    - 구매 링크를 통해 제품을 구매한 후 리뷰를 작성합니다
 *
 * 3. 복사 기능
 *    - 구매 링크와 키워드에 복사 버튼이 있습니다
 *    - onCopyPurchaseLink와 onCopyKeyword로 복사 기능을 처리합니다
 */

