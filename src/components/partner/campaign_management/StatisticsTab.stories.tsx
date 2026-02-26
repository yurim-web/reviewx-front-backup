/**
 * StatisticsTab 컴포넌트 스토리북 (파트너)
 *
 * 파트너 캠페인 관리 통계 탭 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import StatisticsTab from "./StatisticsTab";
import type { PartnerStatTab } from "@/types/domain/partner";

const mockStats = {
  전체: 10,
  예정: 1,
  신청: 3,
  진행: 5,
  종료: 1,
  취소: 0,
  "연장 요청": 0,
  패널티: 0,
};

const meta: Meta<typeof StatisticsTab> = {
  title: "Partner/CampaignManagement/StatisticsTab",
  component: StatisticsTab,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/partner/campaign_management",
      },
    },
  },
  argTypes: {
    activeStatTab: {
      description: "현재 활성화된 통계 탭",
      control: "select",
      options: ["전체", "예정", "신청", "진행", "종료", "취소", "연장 요청", "패널티"],
    },
    stats: {
      description: "캠페인 통계 데이터",
      control: "object",
    },
    setActiveStatTab: {
      description: "통계 탭 변경 핸들러",
      action: "stat tab changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatisticsTab>;

// 전체 탭 활성화
export const AllTab: Story = {
  render: (args) => {
    const [activeStatTab, setActiveStatTab] = useState<PartnerStatTab>("전체");
    return React.createElement(StatisticsTab, {
      ...args,
      activeStatTab,
      setActiveStatTab: (tab) => {
        setActiveStatTab(tab);
        args.setActiveStatTab?.(tab);
      },
    });
  },
  args: {
    activeStatTab: "전체",
    stats: mockStats,
    setActiveStatTab: (_tab) => {},
  },
};

// 진행 탭 활성화
export const OngoingTab: Story = {
  render: (args) => {
    const [activeStatTab, setActiveStatTab] = useState<PartnerStatTab>("진행");
    return React.createElement(StatisticsTab, {
      ...args,
      activeStatTab,
      setActiveStatTab: (tab) => {
        setActiveStatTab(tab);
        args.setActiveStatTab?.(tab);
      },
    });
  },
  args: {
    activeStatTab: "진행",
    stats: mockStats,
    setActiveStatTab: (_tab) => {},
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  render: (args) => {
    const [activeStatTab, setActiveStatTab] = useState<PartnerStatTab>(
      args.activeStatTab || "전체"
    );
    return React.createElement(StatisticsTab, {
      ...args,
      activeStatTab,
      setActiveStatTab: (tab) => {
        setActiveStatTab(tab);
        args.setActiveStatTab?.(tab);
      },
    });
  },
  args: {
    activeStatTab: "전체",
    stats: mockStats,
    setActiveStatTab: (_tab) => {},
  },
};
