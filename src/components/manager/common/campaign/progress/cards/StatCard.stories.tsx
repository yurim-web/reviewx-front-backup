/**
 * StatCard 컴포넌트 스토리북
 * 
 * 진행 현황 통계 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import StatCard from "./StatCard";

// CSS 모듈 스타일 객체를 모킹합니다
const mockStyles = {
  stat_card: "stat_card",
  stat_card_title: "stat_card_title",
  stat_card_value: "stat_card_value",
  stat_card_value_cancelled: "stat_card_value_cancelled",
};

const meta: Meta<typeof StatCard> = {
  title: "Manager/Common/Campaign/Progress/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  argTypes: {
    title: {
      description: "카드 제목",
      control: "text",
    },
    value: {
      description: "통계 값",
      control: "text",
    },
    isCancelled: {
      description: "취소된 캠페인 여부",
      control: "boolean",
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatCard>;

/**
 * 기본 통계 카드
 */
export const Default: Story = {
  render: (args) => React.createElement(StatCard, args),
  args: {
    title: "진행 중인 캠페인",
    value: "42",
    isCancelled: false,
    styles: mockStyles,
  },
};

/**
 * 취소된 캠페인 카드
 */
export const Cancelled: Story = {
  render: (args) => React.createElement(StatCard, args),
  args: {
    title: "취소된 캠페인",
    value: "5",
    isCancelled: true,
    styles: mockStyles,
  },
};

/**
 * 다양한 통계 예시
 */
export const CompletedCampaigns: Story = {
  render: (args) => React.createElement(StatCard, args),
  args: {
    title: "완료된 캠페인",
    value: "128",
    isCancelled: false,
    styles: mockStyles,
  },
};

export const TotalApplications: Story = {
  render: (args) => React.createElement(StatCard, args),
  args: {
    title: "총 신청 건수",
    value: "1,234",
    isCancelled: false,
    styles: mockStyles,
  },
};
