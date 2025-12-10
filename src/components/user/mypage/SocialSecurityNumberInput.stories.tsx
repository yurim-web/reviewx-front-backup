/**
 * SocialSecurityNumberInput 컴포넌트 스토리북
 *
 * 주민등록번호 입력 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import SocialSecurityNumberInput from "./SocialSecurityNumberInput";

const meta: Meta<typeof SocialSecurityNumberInput> = {
  title: "User/MyPage/SocialSecurityNumberInput",
  component: SocialSecurityNumberInput,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    ssnFront: {
      description: "생년월일 6자리",
      control: "text",
    },
    ssnBack: {
      description: "뒷자리 7자리",
      control: "text",
    },
    onSsnFrontChange: {
      description: "생년월일 변경 핸들러",
      action: "ssn front changed",
    },
    onSsnBackChange: {
      description: "뒷자리 변경 핸들러",
      action: "ssn back changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SocialSecurityNumberInput>;

// 빈 입력 필드
export const Empty: Story = {
  render: (args) => {
    const [ssnFront, setSsnFront] = useState("");
    const [ssnBack, setSsnBack] = useState("");

    return React.createElement(SocialSecurityNumberInput, {
      ...args,
      ssnFront,
      ssnBack,
      onSsnFrontChange: (value) => {
        setSsnFront(value);
        args.onSsnFrontChange(value);
      },
      onSsnBackChange: (value) => {
        setSsnBack(value);
        args.onSsnBackChange(value);
      },
    });
  },
  args: {
    ssnFront: "",
    ssnBack: "",
  },
};

// 입력된 값
export const Filled: Story = {
  render: (args) => {
    const [ssnFront, setSsnFront] = useState("901010");
    const [ssnBack, setSsnBack] = useState("1234567");

    return React.createElement(SocialSecurityNumberInput, {
      ...args,
      ssnFront,
      ssnBack,
      onSsnFrontChange: (value) => {
        setSsnFront(value);
        args.onSsnFrontChange(value);
      },
      onSsnBackChange: (value) => {
        setSsnBack(value);
        args.onSsnBackChange(value);
      },
    });
  },
  args: {
    ssnFront: "901010",
    ssnBack: "1234567",
  },
};

