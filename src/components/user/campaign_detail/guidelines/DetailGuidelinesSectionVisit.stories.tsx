/**
 * DetailGuidelinesSectionVisit 컴포넌트 스토리북
 *
 * 방문형 캠페인 안내사항 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DetailGuidelinesSectionVisit from "./DetailGuidelinesSectionVisit";

const meta: Meta<typeof DetailGuidelinesSectionVisit> = {
  title: "User/CampaignDetail/Guidelines/DetailGuidelinesSectionVisit",
  component: DetailGuidelinesSectionVisit,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    description: {
      description: "제공내역 설명",
      control: "text",
    },
    visitAddress: {
      description: "방문 주소",
      control: "text",
    },
    addressGuide: {
      description: "주소 상세 안내",
      control: "text",
    },
    visitLink: {
      description: "방문 링크",
      control: "text",
    },
    keyword: {
      description: "키워드",
      control: "text",
    },
    onCopyVisitAddress: {
      description: "방문 주소 복사 핸들러",
      action: "visit address copied",
    },
    onCopyVisitLink: {
      description: "방문 링크 복사 핸들러",
      action: "visit link copied",
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
      description: "상세 가이드 문구 목록",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DetailGuidelinesSectionVisit>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderDetailGuidelinesSectionVisit = (args: any) => {
  return React.createElement(DetailGuidelinesSectionVisit, args);
};

/**
 * 기본 방문형 안내사항
 *
 * 방문형 캠페인의 기본 안내사항 섹션입니다.
 */
export const Default: Story = {
  render: renderDetailGuidelinesSectionVisit,
  args: {
    description: "매장 방문 혜택 제공",
    visitAddress: "서울시 강남구 테헤란로 123",
    addressGuide: "지하철 2호선 강남역 3번 출구에서 도보 5분",
    visitLink: "https://example.com/store",
    keyword: "방문형 캠페인 키워드",
    onCopyVisitAddress: () => console.log("Visit address copied"),
    onCopyVisitLink: () => console.log("Visit link copied"),
    onCopyKeyword: () => console.log("Keyword copied"),
    requirements: ["keyword", "text_1500", "photo_10"],
  },
};

/**
 * 모든 필드 포함
 *
 * 모든 필드가 포함된 방문형 안내사항 섹션입니다.
 */
export const WithAllFields: Story = {
  render: renderDetailGuidelinesSectionVisit,
  args: {
    description: "매장 방문 혜택 및 추가 혜택 제공",
    visitAddress: "서울시 강남구 테헤란로 456",
    addressGuide:
      "지하철 2호선 강남역 4번 출구에서 도보 10분, 주차 가능 (유료)",
    visitLink: "https://example.com/store-visit",
    keyword: "방문형 캠페인 특별 키워드",
    onCopyVisitAddress: () => console.log("Visit address copied"),
    onCopyVisitLink: () => console.log("Visit link copied"),
    onCopyKeyword: () => console.log("Keyword copied"),
    requirements: [
      "keyword",
      "product_link",
      "text_1500",
      "photo_10",
      "video_120",
    ],
    guidelineTexts: [
      "방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "매장 방문 전 영업시간을 확인해주세요.",
    ],
  },
};

/**
 * 최소 필드
 *
 * 최소한의 필드만 포함된 방문형 안내사항 섹션입니다.
 */
export const Minimal: Story = {
  render: renderDetailGuidelinesSectionVisit,
  args: {
    visitAddress: "서울시 강남구 테헤란로 123",
    requirements: ["keyword", "text_1500"],
  },
};

/**
 * 학습 포인트:
 *
 * 1. 방문형 안내사항 섹션 컴포넌트
 *    - 방문형 캠페인의 안내사항을 표시하는 컴포넌트입니다
 *    - 제공내역, 방문 주소, 주소 상세 안내, 방문 링크, 키워드를 표시합니다
 *
 * 2. 방문 주소 정보
 *    - visitAddress로 방문 주소를 표시합니다
 *    - addressGuide로 주소 상세 안내를 표시합니다
 *    - 방문 링크를 통해 매장 정보를 확인할 수 있습니다
 *
 * 3. 복사 기능
 *    - 방문 주소, 방문 링크, 키워드에 복사 버튼이 있습니다
 *    - 각각의 복사 핸들러로 복사 기능을 처리합니다
 *
 * 4. 매장 정보
 *    - 방문형은 매장 정보를 꼭 포함해야 합니다
 *    - 주소, 영업시간, 주차 가능 여부 등을 기재합니다
 */

