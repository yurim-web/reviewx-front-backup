/**
 * PaymentStatusTag 컴포넌트 스토리북
 *
 * 결제 상태 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import PaymentStatusTag, {
  type PaymentStatus,
} from "@/components/manager/common/tags/PaymentStatusTag";

// CSS 모듈 import
import tagsStylesModule from "@/styles/common/tags.module.css";

// CSS 모듈 객체를 타입 단언하여 사용
const tagsStyles = (tagsStylesModule || {
  payment_status_tag: "payment_status_tag",
  payment_status_pending: "payment_status_pending",
  payment_status_completed: "payment_status_completed",
  payment_status_cancelled: "payment_status_cancelled",
}) as Record<string, string> & {
  payment_status_tag: string;
  payment_status_pending: string;
  payment_status_completed: string;
  payment_status_cancelled: string;
};

const meta: Meta<typeof PaymentStatusTag> = {
  title: "Manager/Common/Tags/PaymentStatusTag",
  component: PaymentStatusTag,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    status: {
      description: "결제 상태",
      control: "select",
      options: ["대기", "완료", "취소"],
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof PaymentStatusTag>;

// 대기
export const Pending: Story = {
  args: {
    status: "대기",
    styles: tagsStyles,
  },
};

// 완료
export const Completed: Story = {
  args: {
    status: "완료",
    styles: tagsStyles,
  },
};

// 취소
export const Cancelled: Story = {
  args: {
    status: "취소",
    styles: tagsStyles,
  },
};

// 모든 상태 태그 비교
export const AllStatuses: Story = {
  render: () => {
    const statuses: PaymentStatus[] = ["대기", "완료", "취소"];

    return React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          padding: "20px",
        },
      },
      ...statuses.map((status) =>
        React.createElement(PaymentStatusTag, {
          key: status,
          status,
          styles: tagsStyles,
        })
      )
    );
  },
};

