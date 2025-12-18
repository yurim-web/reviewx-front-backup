/**
 * PointTabNavigation 컴포넌트 스토리북
 *
 * 포인트 탭 네비게이션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 *
 * 참고: 이 컴포넌트는 useRouter를 사용하므로, Storybook에서 안전하게 렌더링하기 위해
 * 래퍼 컴포넌트를 사용합니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

// 원본 컴포넌트 대신 직접 구현한 Storybook용 컴포넌트
// useRouter를 사용하지 않고 props만으로 동작하도록 수정
type PointTab = "all" | "earned" | "withdrawn";

interface PointTabNavigationProps {
  activePointTab: PointTab;
  setActivePointTab: (tab: PointTab) => void;
  basePath: "/user/point" | "/partner/point";
  tabLabels: {
    earned: string;
    withdrawn: string;
  };
}

// Storybook용 래퍼 컴포넌트 - useRouter 없이 동작
function PointTabNavigationWrapper(props: PointTabNavigationProps) {
  const { activePointTab, setActivePointTab, basePath, tabLabels } = props;

  // CSS 모듈 import (Storybook에서도 작동하도록)
  let styles: any = {};
  try {
    styles = require("@/styles/user/point/point.module.css");
  } catch (e) {
    // CSS가 없어도 컴포넌트는 표시되도록 인라인 스타일 사용
    styles = {
      point_tab_navigation: "",
      left_point_tabs: "",
      point_tab: "",
      active: "",
    };
  }

  const handlePointTabClick = (tab: PointTab) => {
    // Storybook에서는 router.push 대신 setActivePointTab만 사용
    setActivePointTab(tab);
    console.log("[Storybook] Tab clicked:", `${basePath}/${tab}`);
  };

  const renderTabButton = (tab: PointTab, label: string) => {
    const isActive = activePointTab === tab;
    return (
      <button
        key={tab}
        className={`${styles.point_tab || ""} ${
          isActive ? styles.active || "" : ""
        }`}
        onClick={() => handlePointTabClick(tab)}
        style={
          !styles.point_tab
            ? {
                fontSize: "16px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#444" : "#848484",
                background: "none",
                border: "none",
                padding: "12px 16px",
                cursor: "pointer",
                borderBottom: isActive
                  ? "2px solid #444"
                  : "2px solid transparent",
              }
            : undefined
        }
      >
        <span>{label}</span>
      </button>
    );
  };

  return (
    <article
      className={styles.point_tab_navigation || ""}
      style={
        !styles.point_tab_navigation
          ? {
              width: "100%",
            }
          : undefined
      }
    >
      <div
        className={styles.left_point_tabs || ""}
        style={
          !styles.left_point_tabs
            ? {
                display: "flex",
                gap: "8px",
                borderBottom: "1px solid #e0e0e0",
              }
            : undefined
        }
      >
        {renderTabButton("all", "전체")}
        {renderTabButton("earned", tabLabels.earned)}
        {renderTabButton("withdrawn", tabLabels.withdrawn)}
      </div>
    </article>
  );
}

const meta: Meta<typeof PointTabNavigationWrapper> = {
  title: "Common/Point/PointTabNavigation",
  component: PointTabNavigationWrapper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    activePointTab: {
      description: "현재 활성화된 탭",
      control: "select",
      options: ["all", "earned", "withdrawn"],
    },
    basePath: {
      description: "기본 경로 (사용자 또는 파트너)",
      control: "select",
      options: ["/user/point", "/partner/point"],
    },
    tabLabels: {
      description: "탭 텍스트 설정 (사용자: 적립/출금, 파트너: 충전/사용)",
      control: "object",
    },
    setActivePointTab: {
      description: "탭 변경 핸들러",
      action: "tab changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PointTabNavigationWrapper>;

/**
 * 사용자 포인트 - 전체 탭
 *
 * 사용자 포인트 페이지에서 "전체" 탭이 활성화된 상태입니다.
 */
export const UserAllTab: Story = {
  args: {
    activePointTab: "all",
    setActivePointTab: (tab) => console.log("Tab changed to:", tab),
    basePath: "/user/point",
    tabLabels: {
      earned: "적립",
      withdrawn: "출금",
    },
  },
};

/**
 * 사용자 포인트 - 적립 탭
 *
 * 사용자 포인트 페이지에서 "적립" 탭이 활성화된 상태입니다.
 */
export const UserEarnedTab: Story = {
  args: {
    activePointTab: "earned",
    setActivePointTab: (tab) => console.log("Tab changed to:", tab),
    basePath: "/user/point",
    tabLabels: {
      earned: "적립",
      withdrawn: "출금",
    },
  },
};

/**
 * 사용자 포인트 - 출금 탭
 *
 * 사용자 포인트 페이지에서 "출금" 탭이 활성화된 상태입니다.
 */
export const UserWithdrawnTab: Story = {
  args: {
    activePointTab: "withdrawn",
    setActivePointTab: (tab) => console.log("Tab changed to:", tab),
    basePath: "/user/point",
    tabLabels: {
      earned: "적립",
      withdrawn: "출금",
    },
  },
};

/**
 * 파트너 포인트 - 전체 탭
 *
 * 파트너 포인트 페이지에서 "전체" 탭이 활성화된 상태입니다.
 * 파트너는 "적립" 대신 "충전", "출금" 대신 "사용"이라는 용어를 사용합니다.
 */
export const PartnerAllTab: Story = {
  args: {
    activePointTab: "all",
    setActivePointTab: (tab) => console.log("Tab changed to:", tab),
    basePath: "/partner/point",
    tabLabels: {
      earned: "충전",
      withdrawn: "사용",
    },
  },
};

/**
 * 파트너 포인트 - 충전 탭
 *
 * 파트너 포인트 페이지에서 "충전" 탭이 활성화된 상태입니다.
 */
export const PartnerEarnedTab: Story = {
  args: {
    activePointTab: "earned",
    setActivePointTab: (tab) => console.log("Tab changed to:", tab),
    basePath: "/partner/point",
    tabLabels: {
      earned: "충전",
      withdrawn: "사용",
    },
  },
};

/**
 * 파트너 포인트 - 사용 탭
 *
 * 파트너 포인트 페이지에서 "사용" 탭이 활성화된 상태입니다.
 */
export const PartnerWithdrawnTab: Story = {
  args: {
    activePointTab: "withdrawn",
    setActivePointTab: (tab) => console.log("Tab changed to:", tab),
    basePath: "/partner/point",
    tabLabels: {
      earned: "충전",
      withdrawn: "사용",
    },
  },
};

/**
 * 인터랙티브 예시
 *
 * 실제로 탭을 클릭하여 전환할 수 있는 상태입니다.
 */
export const Interactive: Story = {
  render: (args) => {
    const [activePointTab, setActivePointTab] = useState<PointTab>(
      args.activePointTab || "all"
    );

    return (
      <PointTabNavigationWrapper
        {...args}
        activePointTab={activePointTab}
        setActivePointTab={(tab) => {
          setActivePointTab(tab);
          args.setActivePointTab?.(tab);
        }}
      />
    );
  },
  args: {
    activePointTab: "all",
    setActivePointTab: (tab) => console.log("Tab changed to:", tab),
    basePath: "/user/point",
    tabLabels: {
      earned: "적립",
      withdrawn: "출금",
    },
  },
};

/**
 * 학습 포인트:
 *
 * 1. 조건부 스타일링
 *    - activePointTab에 따라 active 클래스가 동적으로 적용됩니다
 *    - 삼항 연산자를 사용하여 조건부로 클래스를 추가합니다
 *
 * 2. 동적 라벨
 *    - 사용자와 파트너가 같은 컴포넌트를 사용하지만, 다른 용어를 사용합니다
 *    - tabLabels prop으로 용어를 커스터마이징할 수 있습니다
 *
 * 3. Storybook 래퍼 컴포넌트
 *    - useRouter를 사용하지 않고 props만으로 동작합니다
 *    - Storybook 환경에서 안전하게 렌더링됩니다
 *
 * 4. 재사용성
 *    - 하나의 컴포넌트로 사용자와 파트너 모두에서 사용할 수 있습니다
 *    - basePath와 tabLabels로 차이점을 처리합니다
 */
