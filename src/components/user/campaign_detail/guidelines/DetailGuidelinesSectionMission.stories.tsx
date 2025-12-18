/**
 * DetailGuidelinesSectionMission 컴포넌트 스토리북
 *
 * 미션형 캠페인 안내사항 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DetailGuidelinesSectionMission from "./DetailGuidelinesSectionMission";

const meta: Meta<typeof DetailGuidelinesSectionMission> = {
  title: "User/CampaignDetail/Guidelines/DetailGuidelinesSectionMission",
  component: DetailGuidelinesSectionMission,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    description: {
      description: "제공내역 설명",
      control: "text",
    },
    productLink: {
      description: "홍보링크",
      control: "text",
    },
    keyword: {
      description: "키워드",
      control: "text",
    },
    onCopyProductLink: {
      description: "홍보링크 복사 핸들러",
      action: "product link copied",
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

type Story = StoryObj<typeof DetailGuidelinesSectionMission>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderDetailGuidelinesSectionMission = (args: any) => {
  return React.createElement(DetailGuidelinesSectionMission, args);
};

/**
 * 기본 미션형 안내사항
 *
 * 미션형 캠페인의 기본 안내사항 섹션입니다.
 */
export const Default: Story = {
  render: renderDetailGuidelinesSectionMission,
  args: {
    description: "무료 체험 제품 제공",
    productLink: "https://example.com/product",
    keyword: "미션형 캠페인 키워드",
    onCopyProductLink: () => console.log("Product link copied"),
    onCopyKeyword: () => console.log("Keyword copied"),
    requirements: ["keyword", "text_1500", "photo_10"],
  },
};

/**
 * 모든 필드 포함
 *
 * 모든 필드가 포함된 미션형 안내사항 섹션입니다.
 */
export const WithAllFields: Story = {
  render: renderDetailGuidelinesSectionMission,
  args: {
    description: "무료 체험 제품 2개 제공",
    productLink: "https://example.com/mission",
    keyword: "미션형 캠페인 특별 키워드",
    onCopyProductLink: () => console.log("Product link copied"),
    onCopyKeyword: () => console.log("Keyword copied"),
    requirements: [
      "keyword",
      "product_link",
      "text_1500",
      "photo_10",
      "video_120",
    ],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "제공된 제품을 모두 활용하여 작성해주세요.",
    ],
  },
};

/**
 * 학습 포인트:
 *
 * 1. 미션형 안내사항 섹션 컴포넌트
 *    - 미션형 캠페인의 안내사항을 표시하는 컴포넌트입니다
 *    - 제공내역, 홍보링크, 키워드, 안내사항을 표시합니다
 *
 * 2. 무료 체험 캠페인
 *    - 미션형은 무료 체험 캠페인입니다
 *    - 구매 없이 체험 후 리뷰를 작성합니다
 *
 * 3. 복사 기능
 *    - 홍보링크와 키워드에 복사 버튼이 있습니다
 *    - onCopyProductLink와 onCopyKeyword로 복사 기능을 처리합니다
 */

