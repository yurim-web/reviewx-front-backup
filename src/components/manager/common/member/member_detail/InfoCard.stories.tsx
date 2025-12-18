/**
 * InfoCard 컴포넌트 스토리북
 *
 * 정보 카드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import InfoCard from "./InfoCard";

const meta: Meta<typeof InfoCard> = {
  title: "Manager/Common/Member/MemberDetail/InfoCard",
  component: InfoCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    label: {
      description: "라벨 텍스트",
      control: "text",
    },
    value: {
      description: "값 텍스트 또는 커스텀 요소",
      control: false,
    },
    on_button_click: {
      description: "버튼 클릭 핸들러",
      action: "button clicked",
    },
    button_aria_label: {
      description: "버튼 aria-label",
      control: "text",
    },
    children: {
      description: "추가 요소 (배지 등)",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof InfoCard>;

// 기본 정보 카드
export const Default: Story = {
  args: {
    label: "이메일",
    value: "hong@example.com",
  },
};

// 버튼이 있는 정보 카드
export const WithButton: Story = {
  args: {
    label: "캠페인 진행",
    value: "5건",
    on_button_click: () => console.log("Button clicked"),
    button_aria_label: "캠페인 진행 상세 보기",
  },
};

// 다양한 라벨 예시
export const MultipleCards: Story = {
  render: () => {
    return React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          padding: "20px",
        },
      },
      React.createElement(InfoCard, {
        label: "이메일",
        value: "hong@example.com",
      }),
      React.createElement(InfoCard, {
        label: "전화번호",
        value: "010-1234-5678",
      }),
      React.createElement(InfoCard, {
        label: "캠페인 진행",
        value: "5건",
        on_button_click: () => console.log("Campaign clicked"),
        button_aria_label: "캠페인 진행 상세 보기",
      }),
      React.createElement(InfoCard, {
        label: "캠페인 완료",
        value: "10건",
        on_button_click: () => console.log("Completed clicked"),
        button_aria_label: "캠페인 완료 상세 보기",
      }),
      React.createElement(InfoCard, {
        label: "보유 포인트",
        value: "50,000P",
      }),
      React.createElement(InfoCard, {
        label: "사용 포인트",
        value: "30,000P",
      })
    );
  },
};




