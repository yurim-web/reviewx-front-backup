/**
 * PasswordConfirmInput 컴포넌트 스토리북
 * 
 * 비밀번호 확인 입력 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import PasswordConfirmInput from "./PasswordConfirmInput";

const meta: Meta<typeof PasswordConfirmInput> = {
  title: "Common/Signup/PasswordConfirmInput",
  component: PasswordConfirmInput,
  tags: ["autodocs"],
  argTypes: {
    value: {
      description: "비밀번호 확인 입력값",
      control: "text",
    },
    password: {
      description: "원본 비밀번호 (일치 여부 확인용)",
      control: "text",
    },
    error: {
      description: "에러 메시지 (선택적)",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PasswordConfirmInput>;

/**
 * 기본 상태
 * 
 * 빈 비밀번호 확인 입력 필드입니다.
 */
export const Default: Story = {
  args: {
    value: "",
    password: "OriginalPass123!",
    error: undefined,
    onValueChange: (value) => console.log("Password confirm changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 일치하는 비밀번호
 * 
 * 원본 비밀번호와 일치하는 경우입니다.
 */
export const MatchingPassword: Story = {
  args: {
    value: "OriginalPass123!",
    password: "OriginalPass123!",
    error: undefined,
    onValueChange: (value) => console.log("Password confirm changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 일치하지 않는 비밀번호
 * 
 * 원본 비밀번호와 일치하지 않을 때 에러 메시지가 표시됩니다.
 */
export const MismatchedPassword: Story = {
  args: {
    value: "DifferentPass123!",
    password: "OriginalPass123!",
    error: "비밀번호가 일치하지 않습니다.",
    onValueChange: (value) => console.log("Password confirm changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 인터랙티브 예시
 * 
 * 실제로 입력할 수 있고 실시간으로 일치 여부를 확인하는 상태입니다.
 */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || "");
    const [error, setError] = useState<string | undefined>(args.error);
    const originalPassword = args.password || "OriginalPass123!";

    return (
      <PasswordConfirmInput
        {...args}
        value={value}
        password={originalPassword}
        error={error}
        onValueChange={(newValue) => {
          setValue(newValue);
          // 간단한 일치 검증 로직
          if (newValue.length > 0 && newValue !== originalPassword) {
            setError("비밀번호가 일치하지 않습니다.");
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
    password: "OriginalPass123!",
    error: undefined,
    onValueChange: (value) => console.log("Password confirm changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 학습 포인트:
 * 
 * 1. 비밀번호 일치 검증
 *    - password prop으로 원본 비밀번호를 받습니다
 *    - value와 password를 비교하여 일치 여부를 확인합니다
 * 
 * 2. 실시간 피드백
 *    - 사용자가 입력하는 동안 실시간으로 검증합니다
 *    - 즉시 피드백을 제공하여 사용자 경험을 향상시킵니다
 * 
 * 3. 의존성 있는 검증
 *    - 원본 비밀번호가 변경되면 확인 비밀번호도 재검증해야 합니다
 *    - 이런 경우 부모 컴포넌트에서 관리합니다
 */

