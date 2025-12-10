/**
 * StatCard 컴포넌트 스토리북 (GA 관리자)
 *
 * GA 관리자 대시보드 통계 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import StatCard, { StatCardData } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Manager/GA/Dashboard/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    stat: {
      description: "통계 카드 데이터",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatCard>;

const mockStatData: StatCardData = {
  title: "캠페인 모집률",
  value: "75%",
  change: "+5%",
  changeType: "positive",
  progress: 75,
  progressColor: "default",
};

// 기본 통계 카드 (증가)
export const PositiveChange: Story = {
  render: (args) => React.createElement(StatCard, args),
  args: {
    stat: mockStatData,
  },
};

// 감소 통계 카드
export const NegativeChange: Story = {
  render: (args) => React.createElement(StatCard, args),
  args: {
    stat: {
      title: "반려율",
      value: "12%",
      change: "-3%",
      changeType: "negative",
      progress: 12,
      progressColor: "red",
    },
  },
};

// 변화 없음
export const NeutralChange: Story = {
  render: (args) => React.createElement(StatCard, args),
  args: {
    stat: {
      title: "신고율",
      value: "5%",
      change: "0%",
      changeType: "neutral",
      progress: 5,
      progressColor: "default",
    },
  },
};

// 높은 진행률
export const HighProgress: Story = {
  render: (args) => React.createElement(StatCard, args),
  args: {
    stat: {
      title: "달성률",
      value: "95%",
      change: "+10%",
      changeType: "positive",
      progress: 95,
      progressColor: "default",
    },
  },
};
