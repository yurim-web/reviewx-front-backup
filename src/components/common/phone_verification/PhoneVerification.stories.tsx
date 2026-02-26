/**
 * PhoneVerification 컴포넌트 스토리북
 *
 * 휴대폰 인증 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import PhoneVerification from "./PhoneVerification";

const meta: Meta<typeof PhoneVerification> = {
  title: "Common/PhoneVerification/PhoneVerification",
  component: PhoneVerification,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    phone: {
      description: "휴대폰 번호",
      control: "text",
    },
    verificationCode: {
      description: "인증번호",
      control: "text",
    },
    isVerificationRequested: {
      description: "인증번호 요청 여부",
      control: "boolean",
    },
    isPhoneVerified: {
      description: "휴대폰 인증 완료 여부",
      control: "boolean",
    },
    timer: {
      description: "타이머 (초)",
      control: "number",
    },
    error: {
      description: "휴대폰 번호 에러 메시지",
      control: "text",
    },
    verificationCodeError: {
      description: "인증번호 에러 메시지",
      control: "text",
    },
    onPhoneChange: {
      description: "휴대폰 번호 변경 핸들러",
      action: "phone changed",
    },
    onVerificationRequest: {
      description: "인증번호 요청 핸들러",
      action: "verification requested",
    },
    onResend: {
      description: "인증번호 재전송 핸들러",
      action: "resend",
    },
    onVerify: {
      description: "인증번호 확인 핸들러",
      action: "verified",
    },
    onVerificationCodeChange: {
      description: "인증번호 변경 핸들러",
      action: "verification code changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PhoneVerification>;

// 초기 상태 (인증 요청 전)
export const Initial: Story = {
  render: (args) => {
    const [phone, setPhone] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    return React.createElement(PhoneVerification, {
      ...args,
      phone,
      verificationCode,
      onPhoneChange: (value) => {
        setPhone(value);
        args.onPhoneChange?.(value);
      },
      onVerificationCodeChange: (value) => {
        setVerificationCode(value);
        args.onVerificationCodeChange?.(value);
      },
    });
  },
  args: {
    phone: "",
    verificationCode: "",
    isVerificationRequested: false,
    isPhoneVerified: false,
    timer: 0,
    onPhoneChange: (phone) => console.log("Phone changed:", phone),
    onVerificationRequest: () => console.log("Verification requested"),
    onVerify: () => console.log("Verify"),
    onVerificationCodeChange: (code) => console.log("Code changed:", code),
  },
};

// 인증번호 요청 후
export const AfterRequest: Story = {
  render: (args) => {
    const [phone, setPhone] = useState("010-1234-5678");
    const [verificationCode, setVerificationCode] = useState("");
    return React.createElement(PhoneVerification, {
      ...args,
      phone,
      verificationCode,
      onPhoneChange: (value) => {
        setPhone(value);
        args.onPhoneChange?.(value);
      },
      onVerificationCodeChange: (value) => {
        setVerificationCode(value);
        args.onVerificationCodeChange?.(value);
      },
    });
  },
  args: {
    phone: "010-1234-5678",
    verificationCode: "",
    isVerificationRequested: true,
    isPhoneVerified: false,
    timer: 240,
    onPhoneChange: (phone) => console.log("Phone changed:", phone),
    onVerificationRequest: () => console.log("Verification requested"),
    onResend: () => console.log("Resend"),
    onVerify: () => console.log("Verify"),
    onVerificationCodeChange: (code) => console.log("Code changed:", code),
  },
};

// 인증 완료
export const Verified: Story = {
  render: (args) => {
    const [phone, setPhone] = useState("010-1234-5678");
    const [verificationCode, setVerificationCode] = useState("123456");
    return React.createElement(PhoneVerification, {
      ...args,
      phone,
      verificationCode,
      onPhoneChange: (value) => {
        setPhone(value);
        args.onPhoneChange?.(value);
      },
      onVerificationCodeChange: (value) => {
        setVerificationCode(value);
        args.onVerificationCodeChange?.(value);
      },
    });
  },
  args: {
    phone: "010-1234-5678",
    verificationCode: "123456",
    isVerificationRequested: true,
    isPhoneVerified: true,
    timer: 0,
    onPhoneChange: (phone) => console.log("Phone changed:", phone),
    onVerificationRequest: () => console.log("Verification requested"),
    onVerify: () => console.log("Verify"),
    onVerificationCodeChange: (code) => console.log("Code changed:", code),
  },
};

// 에러 상태
export const WithError: Story = {
  render: (args) => {
    const [phone, setPhone] = useState("010-1234-567");
    const [verificationCode, setVerificationCode] = useState("");
    return React.createElement(PhoneVerification, {
      ...args,
      phone,
      verificationCode,
      onPhoneChange: (value) => {
        setPhone(value);
        args.onPhoneChange?.(value);
      },
      onVerificationCodeChange: (value) => {
        setVerificationCode(value);
        args.onVerificationCodeChange?.(value);
      },
    });
  },
  args: {
    phone: "010-1234-567",
    verificationCode: "",
    isVerificationRequested: false,
    isPhoneVerified: false,
    timer: 0,
    error: "올바른 휴대폰 번호를 입력해주세요",
    onPhoneChange: (phone) => console.log("Phone changed:", phone),
    onVerificationRequest: () => console.log("Verification requested"),
    onVerify: () => console.log("Verify"),
    onVerificationCodeChange: (code) => console.log("Code changed:", code),
  },
};
