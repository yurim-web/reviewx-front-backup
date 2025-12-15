/**
 * ActivityInfoSection 컴포넌트 스토리북
 *
 * 활동 정보 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ActivityInfoSection, {
  type ActivityInfoItem,
} from "./ActivityInfoSection";

const meta: Meta<typeof ActivityInfoSection> = {
  title: "Manager/Common/Member/MemberDetail/ActivityInfoSection",
  component: ActivityInfoSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    items: {
      description: "활동 정보 아이템 배열",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ActivityInfoSection>;

// 리뷰어 활동 정보
export const Reviewer: Story = {
  args: {
    items: [
      {
        label: "캠페인 진행",
        value: "5건",
        on_button_click: () => console.log("Campaign progress clicked"),
        button_aria_label: "캠페인 진행 상세 보기",
      },
      {
        label: "캠페인 완료",
        value: "10건",
        on_button_click: () => console.log("Campaign completed clicked"),
        button_aria_label: "캠페인 완료 상세 보기",
      },
      {
        label: "패널티",
        value: "1건",
        on_button_click: () => console.log("Penalty clicked"),
        button_aria_label: "패널티 상세 보기",
      },
      {
        label: "최근 접속일",
        value: "2025-01-15",
      },
      {
        label: "가입일",
        value: "2024-01-01",
      },
      {
        label: "보유 포인트",
        value: "50,000P",
      },
      {
        label: "인출 포인트",
        value: "30,000P",
      },
    ],
  },
};

// 파트너 활동 정보
export const Partner: Story = {
  args: {
    items: [
      {
        label: "캠페인 진행",
        value: "3건",
        on_button_click: () => console.log("Campaign progress clicked"),
        button_aria_label: "캠페인 진행 상세 보기",
      },
      {
        label: "캠페인 완료",
        value: "20건",
        on_button_click: () => console.log("Campaign completed clicked"),
        button_aria_label: "캠페인 완료 상세 보기",
      },
      {
        label: "패널티",
        value: "0건",
        on_button_click: () => console.log("Penalty clicked"),
        button_aria_label: "패널티 상세 보기",
      },
      {
        label: "최근 접속일",
        value: "2025-01-20",
      },
      {
        label: "가입일",
        value: "2023-06-01",
      },
    ],
  },
};

// 빈 활동 정보
export const Empty: Story = {
  args: {
    items: [
      {
        label: "캠페인 진행",
        value: "0건",
      },
      {
        label: "캠페인 완료",
        value: "0건",
      },
      {
        label: "패널티",
        value: "0건",
      },
      {
        label: "최근 접속일",
        value: "-",
      },
      {
        label: "가입일",
        value: "2025-01-01",
      },
    ],
  },
};




