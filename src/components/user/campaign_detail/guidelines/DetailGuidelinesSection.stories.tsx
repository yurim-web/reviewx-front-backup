/**
 * DetailGuidelinesSection 컴포넌트 스토리북
 *
 * 캠페인 안내사항 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DetailGuidelinesSection from "./DetailGuidelinesSection";

const meta: Meta<typeof DetailGuidelinesSection> = {
  title: "User/CampaignDetail/Guidelines/DetailGuidelinesSection",
  component: DetailGuidelinesSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    description: {
      description: "제공내역 설명",
      control: "text",
    },
    showDescription: {
      description: "제공내역 섹션 표시 여부",
      control: "boolean",
    },
    showKeyword: {
      description: "키워드 섹션 표시 여부",
      control: "boolean",
    },
    keyword: {
      description: "키워드 내용",
      control: "text",
    },
    requirements: {
      description: "요구사항 코드 목록",
      control: "object",
    },
    onCopyKeyword: {
      description: "키워드 복사 핸들러",
      action: "keyword copied",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DetailGuidelinesSection>;

// 기본 안내사항 섹션
export const Default: Story = {
  render: (args) => React.createElement(DetailGuidelinesSection, args),
  args: {
    description: "제공 품목: 상품명, 수량, 가격 등",
    showDescription: true,
    showKeyword: true,
    keyword: "샘플 키워드",
    requirements: ["keyword", "product_link", "text_1500"],
    onCopyKeyword: () => console.log("Keyword copied"),
  },
};

/**
 * 배송형 캠페인
 *
 * 배송형 캠페인의 안내사항 섹션입니다.
 * 홍보링크와 키워드를 포함합니다.
 */
export const DeliveryType: Story = {
  render: (args) => React.createElement(DetailGuidelinesSection, args),
  args: {
    description: "제품 1개 제공",
    showDescription: true,
    showKeyword: true,
    showPromotionLink: true,
    promotionLink: "https://example.com/product",
    keyword: "배송형 캠페인 키워드",
    requirements: ["keyword", "product_link", "text_1500", "photo_10"],
    onCopyKeyword: () => console.log("Keyword copied"),
    onCopyPromotionLink: () => console.log("Promotion link copied"),
  },
};

/**
 * 미션형 캠페인
 *
 * 미션형 캠페인의 안내사항 섹션입니다.
 * 무료 체험 제품을 제공하는 캠페인입니다.
 */
export const MissionType: Story = {
  render: (args) => React.createElement(DetailGuidelinesSection, args),
  args: {
    description: "무료 체험 제품 제공",
    showDescription: true,
    showKeyword: true,
    showPromotionLink: true,
    promotionLink: "https://example.com/product",
    keyword: "미션형 캠페인 키워드",
    requirements: ["keyword", "text_1500", "photo_10"],
    onCopyKeyword: () => console.log("Keyword copied"),
    onCopyPromotionLink: () => console.log("Promotion link copied"),
  },
};

/**
 * 기자단 캠페인
 *
 * 기자단 캠페인의 안내사항 섹션입니다.
 * 전문적이고 객관적인 시각으로 작성해야 합니다.
 */
export const ReporterType: Story = {
  render: (args) => React.createElement(DetailGuidelinesSection, args),
  args: {
    description: "기자단 활동 혜택 제공",
    showDescription: true,
    showKeyword: true,
    showPromotionLink: true,
    promotionLink: "https://example.com/reporter",
    keyword: "기자단 캠페인 키워드",
    requirements: ["keyword", "text_1500", "photo_10"],
    onCopyKeyword: () => console.log("Keyword copied"),
    onCopyPromotionLink: () => console.log("Promotion link copied"),
  },
};

/**
 * 구매평 캠페인
 *
 * 구매평 캠페인의 안내사항 섹션입니다.
 * 선구매 후 리뷰를 작성하는 페이백 캠페인입니다.
 */
export const ReviewType: Story = {
  render: (args) => React.createElement(DetailGuidelinesSection, args),
  args: {
    description: "페이백 캠페인",
    showDescription: true,
    showKeyword: true,
    showPromotionLink: true,
    promotionLink: "https://example.com/purchase",
    keyword: "구매평 캠페인 키워드",
    requirements: ["keyword", "product_link", "text_1500"],
    onCopyKeyword: () => console.log("Keyword copied"),
    onCopyPromotionLink: () => console.log("Promotion link copied"),
  },
};

/**
 * 방문형 캠페인
 *
 * 방문형 캠페인의 안내사항 섹션입니다.
 * 방문 주소와 주소 상세 안내를 포함합니다.
 */
export const VisitType: Story = {
  render: (args) => React.createElement(DetailGuidelinesSection, args),
  args: {
    description: "제공 품목: 방문 체험",
    showDescription: true,
    showKeyword: true,
    keyword: "방문형 키워드",
    visitAddress: "서울시 강남구 테헤란로 123",
    addressGuide: "지하철 2호선 강남역 3번 출구",
    visitLink: "https://example.com",
    requirements: ["keyword", "photo_10"],
    onCopyKeyword: () => console.log("Keyword copied"),
    onCopyVisitAddress: () => console.log("Visit address copied"),
    onCopyVisitLink: () => console.log("Visit link copied"),
  },
};
