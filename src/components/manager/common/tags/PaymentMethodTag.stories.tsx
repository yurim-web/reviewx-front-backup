/**
 * PaymentMethodTag 컴포넌트 스토리북
 *
 * 결제 수단 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import PaymentMethodTag, {
  type PaymentMethod,
} from "@/components/manager/common/tags/PaymentMethodTag";

// CSS 모듈 import
import tagsStylesModule from "@/styles/common/tags.module.css";

// CSS 모듈 객체를 타입 단언하여 사용
const tagsStyles = (tagsStylesModule || {
  payment_method_tag: "payment_method_tag",
  payment_method_card: "payment_method_card",
  payment_method_bank: "payment_method_bank",
}) as Record<string, string> & {
  payment_method_tag: string;
  payment_method_card: string;
  payment_method_bank: string;
};

const meta: Meta<typeof PaymentMethodTag> = {
  title: "Manager/Common/Tags/PaymentMethodTag",
  component: PaymentMethodTag,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    method: {
      description: "결제 수단",
      control: "select",
      options: ["카드 결제", "무통장 입금"],
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof PaymentMethodTag>;

// 카드 결제
export const Card: Story = {
  args: {
    method: "카드 결제",
    styles: tagsStyles,
  },
};

// 무통장 입금
export const Bank: Story = {
  args: {
    method: "무통장 입금",
    styles: tagsStyles,
  },
};

// 모든 결제 수단 태그 비교
export const AllMethods: Story = {
  render: () => {
    const methods: PaymentMethod[] = ["카드 결제", "무통장 입금"];

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
      ...methods.map((method) =>
        React.createElement(PaymentMethodTag, {
          key: method,
          method,
          styles: tagsStyles,
        })
      )
    );
  },
};

