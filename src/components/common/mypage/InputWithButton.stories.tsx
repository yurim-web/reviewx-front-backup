/**
 * InputWithButton 컴포넌트 스토리북
 * 
 * 입력 필드와 버튼을 조합한 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import InputWithButton from "./InputWithButton";

const meta: Meta<typeof InputWithButton> = {
  title: "Common/MyPage/InputWithButton",
  component: InputWithButton,
  tags: ["autodocs"],
  argTypes: {
    input: {
      description: "입력 필드 요소",
      control: false,
    },
    button: {
      description: "버튼 요소 (선택적)",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof InputWithButton>;

/**
 * 입력 필드만
 * 
 * 버튼 없이 입력 필드만 표시합니다.
 */
export const InputOnly: Story = {
  args: {
    input: (
      <input
        type="text"
        placeholder="입력하세요"
        style={{
          padding: "8px",
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
    ),
  },
};

/**
 * 입력 필드 + 버튼
 * 
 * 입력 필드와 버튼이 함께 표시됩니다.
 */
export const WithButton: Story = {
  args: {
    input: (
      <input
        type="text"
        placeholder="우편번호"
        style={{
          padding: "8px",
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
    ),
    button: (
      <button
        type="button"
        onClick={() => console.log("Button clicked")}
        style={{
          padding: "8px 16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          background: "#f5f5f5",
          cursor: "pointer",
          marginLeft: "8px",
        }}
      >
        우편번호 찾기
      </button>
    ),
  },
};

/**
 * 인증 버튼 예시
 * 
 * 휴대폰 인증처럼 사용하는 예시입니다.
 */
export const VerificationButton: Story = {
  args: {
    input: (
      <input
        type="tel"
        placeholder="010-0000-0000"
        style={{
          padding: "8px",
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
    ),
    button: (
      <button
        type="button"
        onClick={() => console.log("Verification requested")}
        style={{
          padding: "8px 16px",
          border: "1px solid #007bff",
          borderRadius: "4px",
          background: "#007bff",
          color: "white",
          cursor: "pointer",
          marginLeft: "8px",
        }}
      >
        인증번호 받기
      </button>
    ),
  },
};

/**
 * 학습 포인트:
 * 
 * 1. 재사용 가능한 컴포넌트
 *    - InputWithButton은 여러 곳에서 사용되는 패턴을 컴포넌트로 추출한 것입니다
 *    - input과 button을 children으로 받아 유연하게 사용할 수 있습니다
 * 
 * 2. children prop
 *    - input과 button을 React.ReactNode 타입으로 받습니다
 *    - 어떤 형태의 input/button이든 받을 수 있어 유연합니다
 * 
 * 3. 조건부 렌더링
 *    - button이 선택적(optional)이므로, 버튼 없이도 사용할 수 있습니다
 *    - 필요에 따라 버튼을 추가하거나 제거할 수 있습니다
 */

