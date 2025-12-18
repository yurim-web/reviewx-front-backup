/**
 * PasswordInput 컴포넌트 스토리북
 * 
 * 비밀번호 입력 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import PasswordInput from "./PasswordInput";

const meta: Meta<typeof PasswordInput> = {
  title: "Common/Signup/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
  argTypes: {
    value: {
      description: "비밀번호 입력값",
      control: "text",
    },
    error: {
      description: "에러 메시지 (선택적)",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PasswordInput>;

/**
 * 기본 상태
 * 
 * 빈 비밀번호 입력 필드입니다.
 */
export const Default: Story = {
  args: {
    value: "",
    error: undefined,
    onValueChange: (value) => console.log("Password changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 입력 중 (유효)
 * 
 * 유효한 비밀번호가 입력 중인 상태입니다.
 */
export const ValidInput: Story = {
  args: {
    value: "ValidPass123!",
    error: undefined,
    onValueChange: (value) => console.log("Password changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 에러 상태
 * 
 * 비밀번호 형식이 올바르지 않을 때 에러 메시지가 표시됩니다.
 */
export const WithError: Story = {
  args: {
    value: "weak",
    error: "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.",
    onValueChange: (value) => console.log("Password changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 비밀번호 표시 모드
 * 
 * 눈 아이콘을 클릭하여 비밀번호를 표시할 수 있습니다.
 * (Storybook에서 직접 클릭하여 확인하세요)
 */
export const ShowPassword: Story = {
  render: (args) => {
    const [value, setValue] = useState("Password123!");
    return (
      <PasswordInput
        {...args}
        value={value}
        onValueChange={(newValue) => {
          setValue(newValue);
          args.onValueChange?.(newValue);
        }}
        onErrorChange={args.onErrorChange}
      />
    );
  },
  args: {
    value: "Password123!",
    error: undefined,
    onValueChange: (value) => console.log("Password changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 인터랙티브 예시
 * 
 * 실제로 입력할 수 있고 실시간 검증이 작동하는 상태입니다.
 */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || "");
    const [error, setError] = useState<string | undefined>(args.error);

    return (
      <PasswordInput
        {...args}
        value={value}
        error={error}
        onValueChange={(newValue) => {
          setValue(newValue);
          // 간단한 검증 로직 (실제로는 validatePassword 함수 사용)
          if (newValue.length > 0 && newValue.length < 8) {
            setError("8자 이상 입력해주세요.");
          } else if (newValue.length > 16) {
            setError("16자 이하로 입력해주세요.");
          } else {
            setError(undefined);
          }
          args.onValueChange?.(newValue);
        }}
        onErrorChange={(newError) => {
          setError(newError);
          args.onErrorChange?.(newError);
        }}
      />
    );
  },
  args: {
    value: "",
    error: undefined,
    onValueChange: (value) => console.log("Password changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 학습 포인트:
 * 
 * 1. 비밀번호 표시/숨김 토글
 *    - showPassword state로 input의 type을 text/password로 전환
 *    - 사용자 경험을 향상시키는 기능입니다
 * 
 * 2. 실시간 검증
 *    - onChange 이벤트에서 비밀번호 형식을 검증합니다
 *    - 유효하지 않으면 에러 메시지를 표시합니다
 * 
 * 3. 접근성
 *    - aria-label로 버튼의 목적을 명확히 합니다
 *    - 스크린 리더 사용자도 기능을 이해할 수 있습니다
 */

