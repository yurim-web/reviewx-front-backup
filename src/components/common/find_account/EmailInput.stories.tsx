/**
 * EmailInput 컴포넌트 스토리북
 * 
 * 이메일 입력 필드 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import EmailInput from "./EmailInput";

const meta: Meta<typeof EmailInput> = {
  title: "Common/FindAccount/EmailInput",
  component: EmailInput,
  tags: ["autodocs"],
  argTypes: {
    value: {
      description: "이메일 입력값",
      control: "text",
    },
    onChange: {
      description: "이메일 변경 핸들러",
      action: "changed",
    },
    error: {
      description: "에러 메시지 (선택적)",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof EmailInput>;

/**
 * 기본 상태
 * 
 * 빈 입력 필드입니다.
 */
export const Default: Story = {
  args: {
    value: "",
    onChange: (value) => console.log("Email changed:", value),
  },
};

/**
 * 입력값이 있는 상태
 * 
 * 이메일이 입력된 상태입니다.
 */
export const WithValue: Story = {
  args: {
    value: "user@example.com",
    onChange: (value) => console.log("Email changed:", value),
  },
};

/**
 * 에러 상태
 * 
 * 에러 메시지가 표시되는 상태입니다.
 */
export const WithError: Story = {
  args: {
    value: "invalid-email",
    onChange: (value) => console.log("Email changed:", value),
    error: "올바른 이메일 형식이 아닙니다",
  },
};

/**
 * 인터랙티브 예시
 * 
 * 실제로 입력할 수 있는 상태입니다.
 * Storybook의 Controls 패널에서 값을 변경할 수 있습니다.
 */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || "");
    return (
      <EmailInput
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    );
  },
  args: {
    value: "",
    onChange: (value) => console.log("Email changed:", value),
  },
};

/**
 * 학습 포인트:
 * 
 * 1. 제어 컴포넌트 (Controlled Component)
 *    - value와 onChange를 모두 props로 받는 제어 컴포넌트입니다
 *    - 부모 컴포넌트가 상태를 관리하고, 자식은 표시만 담당합니다
 * 
 * 2. 에러 처리
 *    - error prop이 있을 때만 에러 메시지를 표시합니다
 *    - 조건부 렌더링으로 UI를 동적으로 변경합니다
 * 
 * 3. 이벤트 핸들러
 *    - onChange는 함수를 받아서 호출합니다
 *    - Storybook의 action을 사용하면 이벤트를 로그로 확인할 수 있습니다
 * 
 * 4. 인터랙티브 스토리
 *    - render 함수를 사용하면 컴포넌트 내부 상태를 관리할 수 있습니다
 *    - 실제 사용자 경험과 유사하게 테스트할 수 있습니다
 */

