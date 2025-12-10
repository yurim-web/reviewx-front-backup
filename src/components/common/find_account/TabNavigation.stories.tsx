/**
 * TabNavigation 컴포넌트 스토리북
 * 
 * 아이디 찾기 / 비밀번호 찾기 탭 네비게이션 컴포넌트입니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import TabNavigation from "./TabNavigation";

const meta: Meta<typeof TabNavigation> = {
  title: "Common/FindAccount/TabNavigation",
  component: TabNavigation,
  tags: ["autodocs"],
  argTypes: {
    activeTab: {
      description: "현재 활성화된 탭",
      control: "select",
      options: ["id", "password"],
    },
    onTabChange: {
      description: "탭 변경 핸들러",
      action: "tab changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TabNavigation>;

/**
 * 아이디 찾기 탭 활성화
 * 
 * "아이디 찾기" 탭이 활성화된 상태입니다.
 */
export const IdTabActive: Story = {
  args: {
    activeTab: "id",
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
};

/**
 * 비밀번호 찾기 탭 활성화
 * 
 * "비밀번호 찾기" 탭이 활성화된 상태입니다.
 */
export const PasswordTabActive: Story = {
  args: {
    activeTab: "password",
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
};

/**
 * 인터랙티브 예시
 * 
 * 실제로 탭을 클릭하여 전환할 수 있는 상태입니다.
 */
export const Interactive: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<"id" | "password">(
      args.activeTab || "id"
    );
    return (
      <TabNavigation
        {...args}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          args.onTabChange?.(tab);
        }}
      />
    );
  },
  args: {
    activeTab: "id",
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
};

/**
 * 학습 포인트:
 * 
 * 1. 탭 네비게이션 패턴
 *    - 두 개의 버튼으로 탭을 구현합니다
 *    - activeTab prop으로 현재 활성 탭을 제어합니다
 * 
 * 2. 접근성 (Accessibility)
 *    - aria-label: 스크린 리더를 위한 설명
 *    - aria-selected: 현재 선택된 탭을 명시
 *    - 접근성을 고려한 컴포넌트는 모든 사용자가 사용할 수 있습니다
 * 
 * 3. 조건부 스타일링
 *    - activeTab에 따라 active 클래스를 동적으로 추가합니다
 *    - 템플릿 리터럴과 삼항 연산자를 사용합니다
 * 
 * 4. 상태 관리
 *    - 부모 컴포넌트가 activeTab 상태를 관리합니다
 *    - onTabChange 콜백으로 상태 변경을 알립니다
 */

