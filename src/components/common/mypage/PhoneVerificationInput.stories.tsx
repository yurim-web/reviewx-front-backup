/**
 * PhoneVerificationInput 컴포넌트 스토리북
 * 
 * 휴대폰 번호 인증 입력 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import PhoneVerificationInput from "./PhoneVerificationInput";

const meta: Meta<typeof PhoneVerificationInput> = {
  title: "Common/MyPage/PhoneVerificationInput",
  component: PhoneVerificationInput,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    phone: {
      description: "휴대폰 번호 (자동 하이픈 포맷팅)",
      control: "text",
    },
    isVerified: {
      description: "인증 완료 여부",
      control: "boolean",
    },
    onPhoneChange: {
      description: "휴대폰 번호 변경 핸들러",
      action: "phone changed",
    },
    onVerificationRequest: {
      description: "인증번호 요청 핸들러",
      action: "verification requested",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PhoneVerificationInput>;

/**
 * 기본 상태
 * 
 * 빈 휴대폰 번호 입력 필드입니다.
 */
export const Default: Story = {
  render: (args) => React.createElement(PhoneVerificationInput, args),
  args: {
    phone: "",
    onPhoneChange: (value: string) => console.log("Phone changed:", value),
    isVerified: false,
    onVerificationRequest: () => console.log("Verification requested"),
  },
};

/**
 * 번호 입력 중
 * 
 * 휴대폰 번호가 입력 중인 상태입니다. (자동 하이픈 포맷팅)
 */
export const EnteringNumber: Story = {
  render: (args) => React.createElement(PhoneVerificationInput, args),
  args: {
    phone: "010-1234",
    onPhoneChange: (value: string) => console.log("Phone changed:", value),
    isVerified: false,
    onVerificationRequest: () => console.log("Verification requested"),
  },
};

/**
 * 번호 입력 완료 (미인증)
 * 
 * 휴대폰 번호가 입력되었지만 아직 인증되지 않은 상태입니다.
 */
export const NumberEntered: Story = {
  render: (args) => React.createElement(PhoneVerificationInput, args),
  args: {
    phone: "010-1234-5678",
    onPhoneChange: (value: string) => console.log("Phone changed:", value),
    isVerified: false,
    onVerificationRequest: () => console.log("Verification requested"),
  },
};

/**
 * 인증 완료
 * 
 * 휴대폰 번호가 인증 완료된 상태입니다. (인증 체크 아이콘 표시)
 */
export const Verified: Story = {
  render: (args) => React.createElement(PhoneVerificationInput, args),
  args: {
    phone: "010-1234-5678",
    onPhoneChange: (value: string) => console.log("Phone changed:", value),
    isVerified: true,
    onVerificationRequest: () => console.log("Verification requested"),
  },
};

/**
 * 인터랙티브 예시
 * 
 * 실제로 입력할 수 있는 상태입니다.
 */
export const Interactive: Story = {
  render: (args) => {
    const [phone, setPhone] = useState<string>(args.phone || "");
    const [isVerified, setIsVerified] = useState<boolean>(args.isVerified || false);

    return React.createElement(PhoneVerificationInput, {
      ...args,
      phone: phone,
      isVerified: isVerified,
      onPhoneChange: (value: string) => {
        setPhone(value);
        args.onPhoneChange?.(value);
      },
      onVerificationRequest: () => {
        console.log("Verification requested");
        // 인증 요청 후 성공 시 인증 완료 처리
        setTimeout(() => {
          setIsVerified(true);
        }, 1000);
        args.onVerificationRequest?.();
      },
    });
  },
  args: {
    phone: "",
    onPhoneChange: (value: string) => console.log("Phone changed:", value),
    isVerified: false,
    onVerificationRequest: () => console.log("Verification requested"),
  },
};

/**
 * 학습 포인트:
 * 
 * 1. 자동 포맷팅
 *    - 사용자가 숫자만 입력해도 자동으로 하이픈(-)이 추가됩니다
 *    - formatPhoneNumber 함수가 이 역할을 담당합니다
 * 
 * 2. 조건부 렌더링
 *    - isVerified가 true일 때만 인증 체크 아이콘이 표시됩니다
 *    - 인증 상태를 시각적으로 명확하게 표시합니다
 * 
 * 3. 제어 컴포넌트
 *    - phone 값을 prop으로 받아서 표시합니다
 *    - onChange 이벤트로 부모 컴포넌트에 변경사항을 알립니다
 */

