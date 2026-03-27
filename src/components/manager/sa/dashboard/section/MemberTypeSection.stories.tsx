/**
 * SA MemberTypeSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberTypeSection from "./MemberTypeSection";
import type { SAMemberType } from "@/types/api/admin";

const dateRange = { from: new Date("2026-03-01"), to: new Date("2026-03-27") };

const meta: Meta<typeof MemberTypeSection> = {
  title: "Manager/SA/Dashboard/Section/MemberTypeSection",
  component: MemberTypeSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof MemberTypeSection>;

/** 빈 상태 (mock 데이터로 렌더) */
export const Default: Story = {
  args: { dateRange, apiData: null },
};

/** API 데이터 있는 상태 */
export const WithData: Story = {
  args: {
    dateRange,
    apiData: {
      totalPartners: 420,
      totalReviewers: 580,
      activePartners: 310,
      activeReviewers: 470,
      partnerPercentage: 42,
      reviewerPercentage: 58,
      activePartnerPercentage: 35,
      activeReviewerPercentage: 65,
      totalPartnersChange: { percentage: 5, type: "positive" },
      totalReviewersChange: { percentage: 4, type: "positive" },
    } satisfies SAMemberType,
  },
};

/** 감소 추세 */
export const DeclineTrend: Story = {
  args: {
    dateRange,
    apiData: {
      totalPartners: 380,
      totalReviewers: 520,
      activePartners: 210,
      activeReviewers: 340,
      partnerPercentage: 42,
      reviewerPercentage: 58,
      activePartnerPercentage: 28,
      activeReviewerPercentage: 38,
      totalPartnersChange: { percentage: 3, type: "negative" },
      totalReviewersChange: { percentage: 2, type: "negative" },
    } satisfies SAMemberType,
  },
};
