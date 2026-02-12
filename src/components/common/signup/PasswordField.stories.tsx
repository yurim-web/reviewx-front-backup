/**
 * PasswordField 컴포넌트 스토리북
 *
 * 비밀번호 입력 및 비밀번호 확인 입력 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import PasswordField from "./PasswordField";

const meta: Meta<typeof PasswordField> = {
  title: "Common/Signup/PasswordField",
  component: PasswordField,
  tags: ["autodocs"],
  argTypes: {
    type: {
      description: "입력 필드 타입 ('password' 또는 'confirm')",
      control: "select",
      options: ["password", "confirm"],
    },
    value: {
      description: "입력값",
      control: "text",
    },
    password: {
      description: "원본 비밀번호 (type이 'confirm'일 때만 사용)",
      control: "text",
    },
    error: {
      description: "에러 메시지 (선택적)",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PasswordField>;

/**
 * 비밀번호 입력 - 기본 상태
 *
 * 빈 비밀번호 입력 필드입니다.
 */
export const PasswordDefault: Story = {
  args: {
    type: "password",
    value: "",
    error: undefined,
    onValueChange: (value) => console.log("Password changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 비밀번호 입력 - 유효한 입력
 *
 * 유효한 비밀번호가 입력 중인 상태입니다.
 */
export const PasswordValid: Story = {
  args: {
    type: "password",
    value: "ValidPass123!",
    error: undefined,
    onValueChange: (value) => console.log("Password changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 비밀번호 입력 - 에러 상태
 *
 * 비밀번호 형식이 올바르지 않을 때 에러 메시지가 표시됩니다.
 */
export const PasswordWithError: Story = {
  args: {
    type: "password",
    value: "weak",
    error:
      "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.",
    onValueChange: (value) => console.log("Password changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 비밀번호 입력 - 인터랙티브 예시
 *
 * 실제로 입력할 수 있고 실시간 검증이 작동하는 상태입니다.
 */
export const PasswordInteractive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || "");
    const [error, setError] = useState<string | undefined>(args.error);

    return (
      <PasswordField
        {...args}
        type="password"
        value={value}
        error={error}
        onValueChange={(newValue) => {
          setValue(newValue);
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
    type: "password",
    value: "",
    error: undefined,
    onValueChange: (value) => console.log("Password changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 비밀번호 확인 - 기본 상태
 *
 * 빈 비밀번호 확인 입력 필드입니다.
 */
export const ConfirmDefault: Story = {
  args: {
    type: "confirm",
    value: "",
    password: "OriginalPass123!",
    error: undefined,
    onValueChange: (value) => console.log("Password confirm changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 비밀번호 확인 - 일치하는 비밀번호
 *
 * 원본 비밀번호와 일치하는 경우입니다.
 */
export const ConfirmMatching: Story = {
  args: {
    type: "confirm",
    value: "OriginalPass123!",
    password: "OriginalPass123!",
    error: undefined,
    onValueChange: (value) => console.log("Password confirm changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 비밀번호 확인 - 일치하지 않는 비밀번호
 *
 * 원본 비밀번호와 일치하지 않을 때 에러 메시지가 표시됩니다.
 */
export const ConfirmMismatched: Story = {
  args: {
    type: "confirm",
    value: "DifferentPass123!",
    password: "OriginalPass123!",
    error: "비밀번호가 일치하지 않습니다.",
    onValueChange: (value) => console.log("Password confirm changed:", value),
    onErrorChange: (error) => console.log("Error changed:", error),
  },
};

/**
 * 비밀번호 확인 - 인터랙티브 예시
 *
 * 실제로 입력할 수 있고 실시간으로 일치 여부를 확인하는 상태입니다.
 */
export const ConfirmInteractive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || "");
    const [error, setError] = useState<string | undefined>(args.error);
    const originalPassword = args.password || "OriginalPass123!";

    return (
      <PasswordField
        {...args}
        type="confirm"
        value={value}
        password={originalPassword}
        error={error}
        onValueChange={(newValue) => {
          setValue(newValue);
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
    type: "confirm",
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
 * 1. 통합된 컴포넌트
 *    - type prop으로 'password'와 'confirm' 모드를 구분합니다
 *    - 코드 중복을 줄이고 유지보수를 쉽게 합니다
 *
 * 2. 비밀번호 표시/숨김 토글
 *    - showPassword state로 input의 type을 text/password로 전환
 *    - 사용자 경험을 향상시키는 기능입니다
 *
 * 3. 실시간 검증
 *    - onChange 이벤트에서 비밀번호 형식 또는 일치 여부를 검증합니다
 *    - 즉시 피드백을 제공하여 사용자 경험을 향상시킵니다
 *
 * 4. 접근성
 *    - aria-label로 버튼의 목적을 명확히 합니다
 *    - 스크린 리더 사용자도 기능을 이해할 수 있습니다
 */
