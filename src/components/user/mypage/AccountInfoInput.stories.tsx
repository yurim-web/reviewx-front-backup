/* ========================================
   AccountInfoInput 스토리북
   ======================================== */

/**
 * AccountInfoInput.stories
 *
 * 목적: 계좌 정보 입력 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/MyPage/AccountInfoInput)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useCallback, useMemo } from "react";
import AccountInfoInput from "./AccountInfoInput";

// 은행 옵션을 컴포넌트 외부로 이동하여 매번 새로 생성되지 않도록 함
const bankOptions = [
  "은행 선택",
  "KB국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "NH농협은행",
  "카카오뱅크",
  "토스뱅크",
];

const meta: Meta<typeof AccountInfoInput> = {
  title: "User/MyPage/AccountInfoInput",
  component: AccountInfoInput,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    accountHolder: {
      description: "예금주",
      control: "text",
    },
    bank: {
      description: "선택된 은행",
      control: "text",
    },
    accountNumber: {
      description: "계좌번호",
      control: "text",
    },
    onAccountHolderChange: {
      description: "예금주 변경 핸들러",
      action: "account holder changed",
    },
    onBankChange: {
      description: "은행 변경 핸들러",
      action: "bank changed",
    },
    onAccountNumberChange: {
      description: "계좌번호 변경 핸들러",
      action: "account number changed",
    },
    bankOptions: {
      description: "은행 옵션 목록",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AccountInfoInput>;

// 기본 상태
export const Default: Story = {
  render: (args) => {
    // 초기값을 args에서 가져오되, undefined일 경우 빈 문자열 사용
    const [accountHolder, setAccountHolder] = useState(args.accountHolder || "");
    const [bank, setBank] = useState(args.bank || "");
    const [accountNumber, setAccountNumber] = useState(args.accountNumber || "");

    // 핸들러를 useCallback으로 메모이제이션하여 불필요한 리렌더링 방지
    const handleAccountHolderChange = useCallback(
      (value: string) => {
        setAccountHolder(value);
        args.onAccountHolderChange?.(value);
      },
      [args.onAccountHolderChange]
    );

    const handleBankChange = useCallback(
      (value: string) => {
        setBank(value);
        args.onBankChange?.(value);
      },
      [args.onBankChange]
    );

    const handleAccountNumberChange = useCallback(
      (value: string) => {
        setAccountNumber(value);
        args.onAccountNumberChange?.(value);
      },
      [args.onAccountNumberChange]
    );

    // props를 useMemo로 메모이제이션
    const props = useMemo(
      () => ({
        accountHolder,
        bank,
        accountNumber,
        bankOptions: args.bankOptions || bankOptions,
        onAccountHolderChange: handleAccountHolderChange,
        onBankChange: handleBankChange,
        onAccountNumberChange: handleAccountNumberChange,
      }),
      [
        accountHolder,
        bank,
        accountNumber,
        args.bankOptions,
        handleAccountHolderChange,
        handleBankChange,
        handleAccountNumberChange,
      ]
    );

    return React.createElement(AccountInfoInput, props);
  },
  args: {
    accountHolder: "",
    bank: "",
    accountNumber: "",
    bankOptions,
    onAccountHolderChange: (value) => console.log("Account holder changed:", value),
    onBankChange: (value) => console.log("Bank changed:", value),
    onAccountNumberChange: (value) => console.log("Account number changed:", value),
  },
};

// 입력된 상태
export const Filled: Story = {
  render: (args) => {
    // 초기값을 args에서 가져오되, undefined일 경우 기본값 사용
    const [accountHolder, setAccountHolder] = useState(args.accountHolder || "홍길동");
    const [bank, setBank] = useState(args.bank || "KB국민은행");
    const [accountNumber, setAccountNumber] = useState(args.accountNumber || "1234567890");

    // 핸들러를 useCallback으로 메모이제이션
    const handleAccountHolderChange = useCallback(
      (value: string) => {
        setAccountHolder(value);
        args.onAccountHolderChange?.(value);
      },
      [args.onAccountHolderChange]
    );

    const handleBankChange = useCallback(
      (value: string) => {
        setBank(value);
        args.onBankChange?.(value);
      },
      [args.onBankChange]
    );

    const handleAccountNumberChange = useCallback(
      (value: string) => {
        setAccountNumber(value);
        args.onAccountNumberChange?.(value);
      },
      [args.onAccountNumberChange]
    );

    // props를 useMemo로 메모이제이션
    const props = useMemo(
      () => ({
        accountHolder,
        bank,
        accountNumber,
        bankOptions: args.bankOptions || bankOptions,
        onAccountHolderChange: handleAccountHolderChange,
        onBankChange: handleBankChange,
        onAccountNumberChange: handleAccountNumberChange,
      }),
      [
        accountHolder,
        bank,
        accountNumber,
        args.bankOptions,
        handleAccountHolderChange,
        handleBankChange,
        handleAccountNumberChange,
      ]
    );

    return React.createElement(AccountInfoInput, props);
  },
  args: {
    accountHolder: "홍길동",
    bank: "KB국민은행",
    accountNumber: "1234567890",
    bankOptions,
    onAccountHolderChange: (value) => console.log("Account holder changed:", value),
    onBankChange: (value) => console.log("Bank changed:", value),
    onAccountNumberChange: (value) => console.log("Account number changed:", value),
  },
};

