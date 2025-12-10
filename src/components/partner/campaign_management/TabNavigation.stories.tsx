/**
 * TabNavigation 컴포넌트 스토리북
 *
 * 파트너 상단 탭 네비게이션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 *
 * 참고: 이 컴포넌트는 useRouter를 사용하므로, Storybook에서 안전하게 렌더링하기 위해
 * 래퍼 컴포넌트를 사용합니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import type { PartnerMainTab } from "@/types/partner/partner";

interface TabNavigationWrapperProps {
  activeTab: PartnerMainTab;
  setActiveTab: (tab: PartnerMainTab) => void;
}

/**
 * Storybook용 TabNavigation Wrapper
 *
 * useRouter를 직접 사용하는 대신 setActiveTab을 통해 탭 변경을 처리합니다.
 * Storybook 환경에서 Next.js router를 사용할 수 없기 때문에 wrapper를 사용합니다.
 */
function TabNavigationWrapper({
  activeTab,
  setActiveTab,
}: TabNavigationWrapperProps) {
  // CSS 모듈 import (Storybook에서도 작동하도록)
  let styles: any = {};
  try {
    styles = require("@/styles/partner/tab_navigation.module.css");
  } catch (e) {
    // CSS가 없어도 컴포넌트는 표시되도록 인라인 스타일 사용
    styles = {
      tab_navigation: "",
      tab_navigation_container: "",
      left_tabs: "",
      right_tabs: "",
      tab: "",
      active: "",
    };
  }

  const handleCampaignClick = () => {
    setActiveTab("campaign");
    console.log("[Storybook] Tab clicked: campaign");
    console.log("[Storybook] Would navigate to: /partner/campaign_management");
  };

  const handlePointClick = () => {
    setActiveTab("point");
    console.log("[Storybook] Tab clicked: point");
    console.log("[Storybook] Would navigate to: /partner/point/all");
  };

  const handleAccountClick = () => {
    setActiveTab("account");
    console.log("[Storybook] Tab clicked: account");
    console.log("[Storybook] Would navigate to: /partner/mypage");
  };

  return React.createElement(
    "div",
    {
      className: styles.tab_navigation || "",
      style: !styles.tab_navigation
        ? {
            width: "100%",
            backgroundColor: "#fff",
            borderBottom: "1px solid #d9d9d9",
            paddingTop: "24px",
            paddingBottom: "24px",
          }
        : undefined,
    },
    React.createElement(
      "div",
      {
        className: styles.tab_navigation_container || "",
        style: !styles.tab_navigation_container
          ? {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 40px",
              maxWidth: "1200px",
              margin: "0 auto",
            }
          : undefined,
      },
      // 왼쪽 탭: 캠페인, 포인트
      React.createElement(
        "div",
        {
          className: styles.left_tabs || "",
          style: !styles.left_tabs
            ? {
                display: "flex",
                gap: "24px",
              }
            : undefined,
        },
        React.createElement(
          "button",
          {
            className: `${styles.tab || ""} ${
              activeTab === "campaign" ? styles.active || "" : ""
            }`.trim(),
            onClick: handleCampaignClick,
            style: !styles.tab
              ? {
                  fontSize: "20px",
                  fontWeight: activeTab === "campaign" ? 700 : 500,
                  color: activeTab === "campaign" ? "#444" : "#848484",
                  background: "white",
                  border: "none",
                  padding: "0",
                  cursor: "pointer",
                  lineHeight: "20px",
                  letterSpacing: "-0.4px",
                }
              : undefined,
          },
          "캠페인"
        ),
        React.createElement(
          "button",
          {
            className: `${styles.tab || ""} ${
              activeTab === "point" ? styles.active || "" : ""
            }`.trim(),
            onClick: handlePointClick,
            style: !styles.tab
              ? {
                  fontSize: "20px",
                  fontWeight: activeTab === "point" ? 700 : 500,
                  color: activeTab === "point" ? "#444" : "#848484",
                  background: "white",
                  border: "none",
                  padding: "0",
                  cursor: "pointer",
                  lineHeight: "20px",
                  letterSpacing: "-0.4px",
                }
              : undefined,
          },
          "포인트"
        )
      ),
      // 오른쪽 탭: 계정
      React.createElement(
        "div",
        {
          className: styles.right_tabs || "",
          style: !styles.right_tabs
            ? {
                display: "flex",
                gap: "24px",
              }
            : undefined,
        },
        React.createElement(
          "button",
          {
            className: `${styles.tab || ""} ${
              activeTab === "account" ? styles.active || "" : ""
            }`.trim(),
            onClick: handleAccountClick,
            style: !styles.tab
              ? {
                  fontSize: "20px",
                  fontWeight: activeTab === "account" ? 700 : 500,
                  color: activeTab === "account" ? "#444" : "#848484",
                  background: "white",
                  border: "none",
                  padding: "0",
                  cursor: "pointer",
                  lineHeight: "20px",
                  letterSpacing: "-0.4px",
                }
              : undefined,
          },
          "계정"
        )
      )
    )
  );
}

const meta: Meta<typeof TabNavigationWrapper> = {
  title: "Partner/CampaignManagement/TabNavigation",
  component: TabNavigationWrapper,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/partner/campaign_management",
      },
    },
  },
  argTypes: {
    activeTab: {
      description: "현재 활성화된 탭",
      control: "select",
      options: ["campaign", "point", "account"],
    },
    setActiveTab: {
      description: "탭 변경 핸들러",
      action: "tab changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TabNavigationWrapper>;

/**
 * 캠페인 탭 활성화
 */
export const CampaignTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<PartnerMainTab>("campaign");
    return React.createElement(TabNavigationWrapper, {
      activeTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
      },
    });
  },
  args: {
    activeTab: "campaign",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
};

/**
 * 포인트 탭 활성화
 */
export const PointTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<PartnerMainTab>("point");
    return React.createElement(TabNavigationWrapper, {
      activeTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
      },
    });
  },
  args: {
    activeTab: "point",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
};

/**
 * 계정 탭 활성화
 */
export const AccountTab: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<PartnerMainTab>("account");
    return React.createElement(TabNavigationWrapper, {
      activeTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
      },
    });
  },
  args: {
    activeTab: "account",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
};

/**
 * 인터랙티브 예시
 */
export const Interactive: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<PartnerMainTab>(
      args.activeTab || "campaign"
    );

    return React.createElement(TabNavigationWrapper, {
      activeTab,
      setActiveTab: (tab: PartnerMainTab) => {
        setActiveTab(tab);
        args.setActiveTab?.(tab);
      },
    });
  },
  args: {
    activeTab: "campaign",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
};
