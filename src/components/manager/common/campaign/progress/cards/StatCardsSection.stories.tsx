/**
 * StatCardsSection 컴포넌트 스토리북
 *
 * 통계 카드 섹션 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import StatCardsSection from "./StatCardsSection";
import styles from "@/styles/manager/common/campaign/progress/stat_card.module.css";

const mockStatCardValues = {
  open_scheduled: "10",
  in_progress: "25",
  applying: "15",
  total: "100",
  ended: "50",
  cancelled: "5",
};

const meta: Meta<typeof StatCardsSection> = {
  title: "Manager/Common/Campaign/Progress/Cards/StatCardsSection",
  component: StatCardsSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    stat_card_values: {
      description: "통계 카드 값들",
      control: "object",
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatCardsSection>;

// 기본 통계 카드 섹션
export const Default: Story = {
  render: (args) => React.createElement(StatCardsSection, args),
  args: {
    stat_card_values: mockStatCardValues,
    styles: styles,
  },
};
