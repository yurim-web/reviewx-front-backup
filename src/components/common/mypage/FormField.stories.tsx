/**
 * FormField 컴포넌트 스토리북
 *
 * 폼 필드 래퍼 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import FormField from "./FormField";

const meta: Meta<typeof FormField> = {
  title: "Common/MyPage/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    label: {
      description: "필드 라벨 텍스트",
      control: "text",
    },
    htmlFor: {
      description: "라벨의 htmlFor 속성 (input의 id와 연결)",
      control: "text",
    },
    required: {
      description: "필수 필드 여부 (true일 때 * 표시)",
      control: "boolean",
    },
    children: {
      description: "필드 내부에 표시할 자식 요소 (input 등)",
      control: false, // children은 직접 제어할 수 없으므로 false
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormField>;

/**
 * 기본 필드 (선택적)
 *
 * required가 false이므로 필수 표시(*)가 없습니다.
 */
export const Optional: Story = {
  render: (args) => {
    const inputStyle = {
      padding: "8px",
      width: "100%",
      border: "1px solid #ccc",
      borderRadius: "4px",
    };
    return React.createElement(FormField, {
      ...args,
      children: React.createElement("input", {
        id: "nickname",
        type: "text",
        placeholder: "닉네임을 입력하세요",
        style: inputStyle,
      }),
    });
  },
  args: {
    label: "닉네임",
    htmlFor: "nickname",
    required: false,
  },
};

/**
 * 필수 필드
 *
 * required가 true이므로 필수 표시(*)가 표시됩니다.
 */
export const Required: Story = {
  render: (args) => {
    const inputStyle = {
      padding: "8px",
      width: "100%",
      border: "1px solid #ccc",
      borderRadius: "4px",
    };
    return React.createElement(FormField, {
      ...args,
      children: React.createElement("input", {
        id: "name",
        type: "text",
        placeholder: "이름을 입력하세요",
        required: true,
        style: inputStyle,
      }),
    });
  },
  args: {
    label: "이름",
    htmlFor: "name",
    required: true,
  },
};

/**
 * 이메일 필드
 *
 * 이메일 입력 필드 예시입니다.
 */
export const EmailField: Story = {
  render: (args) => {
    const inputStyle = {
      padding: "8px",
      width: "100%",
      border: "1px solid #ccc",
      borderRadius: "4px",
    };
    return React.createElement(FormField, {
      ...args,
      children: React.createElement("input", {
        id: "email",
        type: "email",
        placeholder: "example@email.com",
        required: true,
        style: inputStyle,
      }),
    });
  },
  args: {
    label: "이메일",
    htmlFor: "email",
    required: true,
  },
};

/**
 * 전화번호 필드
 *
 * 전화번호 입력 필드 예시입니다.
 */
export const PhoneField: Story = {
  render: (args) => {
    const inputStyle = {
      padding: "8px",
      width: "100%",
      border: "1px solid #ccc",
      borderRadius: "4px",
    };
    return React.createElement(FormField, {
      ...args,
      children: React.createElement("input", {
        id: "phone",
        type: "tel",
        placeholder: "010-1234-5678",
        required: true,
        style: inputStyle,
      }),
    });
  },
  args: {
    label: "전화번호",
    htmlFor: "phone",
    required: true,
  },
};

/**
 * 주소 필드
 *
 * 주소 입력 필드 예시입니다.
 */
export const AddressField: Story = {
  render: (args) => {
    const inputStyle = {
      padding: "8px",
      flex: 1,
      border: "1px solid #ccc",
      borderRadius: "4px",
    };
    const buttonStyle = {
      padding: "8px 16px",
      border: "1px solid #ccc",
      background: "#f5f5f5",
      cursor: "pointer",
      borderRadius: "4px",
    };
    return React.createElement(FormField, {
      ...args,
      children: React.createElement(
        "div",
        { style: { display: "flex", gap: "8px" } },
        React.createElement("input", {
          id: "address",
          type: "text",
          placeholder: "주소를 입력하세요",
          required: true,
          style: inputStyle,
        }),
        React.createElement(
          "button",
          {
            type: "button",
            style: buttonStyle,
          },
          "검색"
        )
      ),
    });
  },
  args: {
    label: "주소",
    htmlFor: "address",
    required: true,
  },
};

/**
 * 학습 포인트:
 *
 * 1. children prop
 *    - children은 React에서 특별한 prop으로, 컴포넌트 태그 사이의 내용을 받습니다
 *    - Storybook에서 children을 전달할 때는 JSX를 직접 작성합니다
 *
 * 2. htmlFor 속성
 *    - label의 htmlFor는 input의 id와 연결되어 접근성을 향상시킵니다
 *    - label을 클릭하면 연결된 input에 포커스가 이동합니다
 *
 * 3. required 속성
 *    - HTML의 required 속성과 별개로, UI에서 필수 표시(*)를 보여주는 용도입니다
 *    - 실제 폼 검증은 input의 required 속성으로 처리합니다
 *
 * 4. 재사용 가능한 컴포넌트
 *    - FormField는 여러 곳에서 사용되는 공통 패턴을 컴포넌트로 만든 것입니다
 *    - 이런 패턴을 찾아서 컴포넌트로 추출하면 코드 중복을 줄일 수 있습니다
 */
