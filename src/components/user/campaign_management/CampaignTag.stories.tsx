/* ========================================
   CampaignTag 스토리북
   ======================================== */

/**
 * CampaignTag.stories
 *
 * 목적: 캠페인 태그 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/CampaignManagement/CampaignTag)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CamTag, CamType, CamIcon, CamCateIcon } from "./CampaignTag";

const meta: Meta = {
  title: "User/CampaignManagement/CampaignTag",
  tags: ["autodocs"],
  component: CamTag,
};

export default meta;

/**
 * 마감 임박 태그
 *
 * 긴급 마감 태그가 표시됩니다.
 */
export const UrgentTag: StoryObj = {
  render: () => <CamTag isUrgent={true} remainingDays={1} />,
};

/**
 * 일반 D-day 태그
 *
 * 남은 일수가 표시되는 일반 태그입니다.
 */
export const NormalTag: StoryObj = {
  render: () => <CamTag isUrgent={false} remainingDays={5} />,
};

/**
 * 배송형 태그
 */
export const DeliveryType: StoryObj = {
  render: () => <CamType type="배송형" />,
};

/**
 * 방문형 태그
 */
export const VisitType: StoryObj = {
  render: () => <CamType type="방문형" />,
};

/**
 * 구매평 태그
 */
export const ReviewType: StoryObj = {
  render: () => <CamType type="구매평" />,
};

/**
 * 기자단 태그
 */
export const ReporterType: StoryObj = {
  render: () => <CamType type="기자단" />,
};

/**
 * 미션형 태그
 */
export const MissionType: StoryObj = {
  render: () => <CamType type="미션형" />,
};

/**
 * 브랜드 아이콘
 */
export const BrandIcon: StoryObj = {
  render: () => <CamIcon icon="/images/brand_logo/coupang.svg" />,
};

/**
 * 카테고리 아이콘 + 타입 조합
 *
 * 브랜드 아이콘과 캠페인 타입이 함께 표시됩니다.
 */
export const CategoryWithType: StoryObj = {
  render: () => <CamCateIcon category="쿠팡" type="배송형" />,
};
