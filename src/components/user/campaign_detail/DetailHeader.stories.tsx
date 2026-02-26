/* ========================================
   DetailHeader 스토리북
   ======================================== */

/**
 * DetailHeader.stories
 *
 * 목적: 캠페인 상세 헤더 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/CampaignDetail/DetailHeader)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignHeader from "./DetailHeader";

const meta: Meta<typeof CampaignHeader> = {
  title: "User/CampaignDetail/DetailHeader",
  component: CampaignHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    channel: {
      description: "채널 정보 (예: 네이버블로그, 인스타그램)",
      control: "text",
    },
    category: {
      description: "카테고리 이름",
      control: "text",
    },
    subcategory: {
      description: "서브카테고리 이름",
      control: "text",
    },
    region: {
      description: "지역 정보 (선택적)",
      control: "text",
    },
    points: {
      description: "포인트",
      control: "number",
    },
    altText: {
      description: "이미지 alt 속성",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignHeader>;

/**
 * 기본 캠페인 헤더
 *
 * 배송형 캠페인의 헤더입니다.
 */
export const Default: Story = {
  render: (args) => React.createElement(CampaignHeader, args),
  args: {
    channel: "네이버블로그",
    category: "배송형",
    subcategory: "뷰티",
    points: 5000,
    altText: "배송형 카테고리",
  },
};

/**
 * 지역 정보 포함
 *
 * 지역 정보가 포함된 캠페인 헤더입니다.
 */
export const WithRegion: Story = {
  render: (args) => React.createElement(CampaignHeader, args),
  args: {
    channel: "인스타그램",
    category: "방문형",
    subcategory: "푸드",
    region: "서울 강남/서초",
    points: 3000,
    altText: "방문형 카테고리",
  },
};
