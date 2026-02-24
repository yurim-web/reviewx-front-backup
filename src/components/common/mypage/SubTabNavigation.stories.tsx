/**
 * SubTabNavigation 컴포넌트 스토리북
 *
 * 마이페이지 서브 탭 네비게이션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 *
 * 참고: 이 컴포넌트는 useRouter를 사용하므로, Storybook에서 안전하게 렌더링하기 위해
 * 래퍼 컴포넌트를 사용합니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

// 원본 컴포넌트 대신 직접 구현한 Storybook용 컴포넌트
// useRouter를 사용하지 않고 props만으로 동작하도록 수정
type SubTab = "profile" | "channel";

interface SubTabNavigationProps {
  activeSubTab: SubTab;
  setActiveSubTab: (tab: SubTab) => void;
  basePath: "/user/mypage" | "/partner/mypage";
  availableTabs: SubTab[];
}

// Storybook용 래퍼 컴포넌트 - useRouter 없이 동작
function SubTabNavigationWrapper(props: SubTabNavigationProps) {
  const { activeSubTab, setActiveSubTab, basePath, availableTabs } = props;

  // CSS 모듈 import (Storybook에서도 작동하도록)
  // 동적 import를 사용하여 에러 발생 시 처리
  let styles: Record<string, string> = {};
  try {
    // CSS 모듈을 require로 로드
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    styles = require("@/styles/user/mypage/navigation.module.css");
  } catch (_e) {
    // CSS가 없어도 컴포넌트는 표시되도록 인라인 스타일 사용
    styles = {
      sub_tab_container: "",
      sub_tab_item: "",
      active: "",
      sub_tab_indicator: "",
      sub_tab_indicator_channel: "",
    };
  }

  const TAB_CONFIG: Record<SubTab, { id: SubTab; label: string }> = {
    profile: {
      id: "profile",
      label: "프로필",
    },
    channel: {
      id: "channel",
      label: "채널",
    },
  };

  const handleSubTabClick = (tab: SubTab) => {
    // Storybook에서는 router.push 대신 setActiveSubTab만 사용
    setActiveSubTab(tab);
    console.log("[Storybook] Tab clicked:", `${basePath}/${tab}`);
  };

  const renderTabButton = (tab: SubTab) => {
    const tabInfo = TAB_CONFIG[tab];
    if (!availableTabs.includes(tab)) return null;

    return (
      <button
        key={tab}
        className={`${styles.sub_tab_item || ""} ${
          activeSubTab === tab ? styles.active || "" : ""
        }`}
        onClick={() => handleSubTabClick(tab)}
        style={
          !styles.sub_tab_item
            ? {
                fontSize: "18px",
                fontWeight: activeSubTab === tab ? 700 : 500,
                color: activeSubTab === tab ? "#444" : "#848484",
                background: "none",
                border: "none",
                padding: "0",
                cursor: "pointer",
              }
            : undefined
        }
      >
        {tabInfo.label}
      </button>
    );
  };

  return (
    <div
      className={styles.sub_tab_container || ""}
      style={
        !styles.sub_tab_container
          ? {
              display: "flex",
              gap: "24px",
              padding: "16px 40px",
              borderBottom: "1px solid #e0e0e0",
              position: "relative",
            }
          : undefined
      }
    >
      {renderTabButton("profile")}
      {renderTabButton("channel")}
      {activeSubTab && TAB_CONFIG[activeSubTab] && (
        <div
          className={
            activeSubTab === "profile"
              ? styles.sub_tab_indicator || ""
              : styles.sub_tab_indicator_channel || ""
          }
          style={
            !styles.sub_tab_indicator
              ? {
                  position: "absolute",
                  bottom: "-1px",
                  left: activeSubTab === "profile" ? "40px" : "104px",
                  width: activeSubTab === "profile" ? "46px" : "43px",
                  height: "2px",
                  background: "#444",
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

const meta: Meta<typeof SubTabNavigationWrapper> = {
  title: "Common/MyPage/SubTabNavigation",
  component: SubTabNavigationWrapper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    activeSubTab: {
      description: "현재 활성화된 서브 탭",
      control: "select",
      options: ["profile", "channel"],
    },
    basePath: {
      description: "기본 경로",
      control: "select",
      options: ["/user/mypage", "/partner/mypage"],
    },
    availableTabs: {
      description: "사용 가능한 탭 목록",
      control: "object",
    },
    setActiveSubTab: {
      description: "서브 탭 변경 핸들러",
      action: "tab changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SubTabNavigationWrapper>;

/**
 * 사용자 - 프로필 탭 활성화
 *
 * 사용자 마이페이지에서 "프로필" 탭이 활성화된 상태입니다.
 */
export const UserProfileTab: Story = {
  args: {
    activeSubTab: "profile",
    setActiveSubTab: (tab) => console.log("Tab changed to:", tab),
    basePath: "/user/mypage",
    availableTabs: ["profile", "channel"],
  },
};

/**
 * 사용자 - 채널 탭 활성화
 *
 * 사용자 마이페이지에서 "채널" 탭이 활성화된 상태입니다.
 */
export const UserChannelTab: Story = {
  args: {
    activeSubTab: "channel",
    setActiveSubTab: (tab) => console.log("Tab changed to:", tab),
    basePath: "/user/mypage",
    availableTabs: ["profile", "channel"],
  },
};

/**
 * 파트너 - 프로필 탭만
 *
 * 파트너 마이페이지는 "프로필" 탭만 사용합니다.
 */
export const PartnerProfileOnly: Story = {
  args: {
    activeSubTab: "profile",
    setActiveSubTab: (tab) => console.log("Tab changed to:", tab),
    basePath: "/partner/mypage",
    availableTabs: ["profile"],
  },
};

/**
 * 인터랙티브 예시
 *
 * 실제로 탭을 클릭하여 전환할 수 있는 상태입니다.
 */
export const Interactive: Story = {
  render: (args) => {
    const [activeSubTab, setActiveSubTab] = useState<"profile" | "channel">(
      args.activeSubTab || "profile"
    );

    return (
      <SubTabNavigationWrapper
        {...args}
        activeSubTab={activeSubTab}
        setActiveSubTab={(tab) => {
          setActiveSubTab(tab);
          args.setActiveSubTab?.(tab);
        }}
      />
    );
  },
  args: {
    activeSubTab: "profile",
    setActiveSubTab: (tab) => console.log("Tab changed to:", tab),
    basePath: "/user/mypage",
    availableTabs: ["profile", "channel"],
  },
};
