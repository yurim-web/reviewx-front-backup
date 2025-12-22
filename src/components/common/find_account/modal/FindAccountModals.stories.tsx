/**
 * FindAccountModals 컴포넌트 스토리북
 *
 * 계정 찾기 모달 관리 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import FindAccountModals from "./FindAccountModals";
import type { AccountInfo } from "../types";

const meta: Meta<typeof FindAccountModals> = {
  title: "Common/FindAccount/Modal/FindAccountModals",
  component: FindAccountModals,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    activeTab: {
      description: "현재 활성화된 탭",
      control: "select",
      options: ["id", "password"],
    },
    isResultModalOpen: {
      description: "아이디 찾기 결과 모달 표시 여부",
      control: "boolean",
    },
    isPhoneAccountModalOpen: {
      description: "SNS 로그인 유도 모달 표시 여부",
      control: "boolean",
    },
    foundAccountInfo: {
      description: "아이디 찾기 결과 데이터",
      control: "object",
    },
    onCloseResultModal: {
      description: "결과 모달 닫기 핸들러",
      action: "result modal closed",
    },
    onClosePhoneAccountModal: {
      description: "SNS 모달 닫기 핸들러",
      action: "phone account modal closed",
    },
    onLogin: {
      description: "로그인 핸들러",
      action: "login clicked",
    },
    onSwitchToPasswordTab: {
      description: "비밀번호 찾기 탭으로 전환 핸들러",
      action: "switch to password tab",
    },
    onKakaoLogin: {
      description: "카카오 로그인 핸들러",
      action: "kakao login clicked",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FindAccountModals>;

const mockAccountInfo: AccountInfo = {
  email: "user@example.com",
  signupDate: "2024-01-15",
};

// 아이디 찾기 결과 모달 열림
export const ResultModalOpen: Story = {
  render: (args) => {
    const [isResultModalOpen, setIsResultModalOpen] = useState(true);
    return React.createElement(
      "div",
      {
        style: {
          width: "100vw",
          height: "100vh",
          position: "relative",
          margin: 0,
          padding: 0,
        },
      },
      React.createElement(FindAccountModals, {
        ...args,
        isResultModalOpen,
        onCloseResultModal: () => {
          setIsResultModalOpen(false);
          args.onCloseResultModal?.();
        },
      })
    );
  },
  args: {
    activeTab: "id",
    isResultModalOpen: true,
    isPhoneAccountModalOpen: false,
    foundAccountInfo: mockAccountInfo,
    onCloseResultModal: () => console.log("Result modal closed"),
    onClosePhoneAccountModal: () => console.log("Phone account modal closed"),
    onLogin: () => console.log("Login clicked"),
    onSwitchToPasswordTab: () => console.log("Switch to password tab"),
    onKakaoLogin: () => console.log("Kakao login clicked"),
  },
};

// SNS 로그인 모달 열림
export const SNSLoginModalOpen: Story = {
  render: (args) => {
    const [isPhoneAccountModalOpen, setIsPhoneAccountModalOpen] =
      useState(true);
    return React.createElement(
      "div",
      {
        style: {
          width: "100vw",
          height: "100vh",
          position: "relative",
          margin: 0,
          padding: 0,
        },
      },
      React.createElement(FindAccountModals, {
        ...args,
        isPhoneAccountModalOpen,
        onClosePhoneAccountModal: () => {
          setIsPhoneAccountModalOpen(false);
          args.onClosePhoneAccountModal?.();
        },
      })
    );
  },
  args: {
    activeTab: "id",
    isResultModalOpen: false,
    isPhoneAccountModalOpen: true,
    foundAccountInfo: null,
    onCloseResultModal: () => console.log("Result modal closed"),
    onClosePhoneAccountModal: () => console.log("Phone account modal closed"),
    onLogin: () => console.log("Login clicked"),
    onSwitchToPasswordTab: () => console.log("Switch to password tab"),
    onKakaoLogin: () => console.log("Kakao login clicked"),
  },
};
