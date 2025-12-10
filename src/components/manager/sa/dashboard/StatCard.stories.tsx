/**
 * StatCard 컴포넌트 스토리북 (SA 관리자)
 *
 * SA 관리자 대시보드 통계 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import StatCard, { StatCardData } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Manager/SA/Dashboard/StatCard",
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
  title: "예상 수수료",
  value: "₩1,250,000",
  change: "+5.2%",
  changeType: "positive",
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
      title: "카드 결제 총액",
      value: "₩50,000,000",
      change: "-2.1%",
      changeType: "negative",
    },
  },
};

// 변화 없음
export const NeutralChange: Story = {
  render: (args) => React.createElement(StatCard, args),
  args: {
    stat: {
      title: "입금 총액",
      value: "₩45,000,000",
      change: "0%",
      changeType: "neutral",
    },
  },
};

