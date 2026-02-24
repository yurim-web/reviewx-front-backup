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
import CampaignHeader from "./DetailHeader";

const meta: Meta<typeof CampaignHeader> = {
  title: "User/CampaignDetail/DetailHeader",
  component: CampaignHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    categoryIcon: {
      description: "카테고리 아이콘 이미지 경로",
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

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달합니다
const renderCampaignHeader = (args: any) => {
  return <CampaignHeader {...args} />;
};

/**
 * 기본 캠페인 헤더
 *
 * 배송형 캠페인의 헤더입니다.
 */
export const Default: Story = {
  render: renderCampaignHeader,
  args: {
    categoryIcon: "/images/icons/delivery_icon.svg",
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
  render: renderCampaignHeader,
  args: {
    categoryIcon: "/images/icons/visit_icon.svg",
    category: "방문형",
    subcategory: "푸드",
    region: "서울 강남/서초",
    points: 3000,
    altText: "방문형 카테고리",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 캠페인 헤더 컴포넌트
 *    - 캠페인 상세 페이지 상단의 태그와 포인트 정보를 표시합니다
 *    - 카테고리 아이콘, 태그, 서브카테고리, 포인트를 표시합니다
 *
 * 2. 선택적 props
 *    - region과 altText는 선택적(optional) props입니다
 *    - ? 기호로 표시되어 있어서 제공하지 않아도 됩니다
 *
 * 3. 시맨틱 HTML
 *    - article 태그를 사용하여 의미있는 구조로 마크업합니다
 */
