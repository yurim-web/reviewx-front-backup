/**
 * SidebarMenu 컴포넌트 스토리북 (SA 관리자)
 *
 * SA 관리자 사이드바 메뉴 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import SidebarMenu from "./SidebarMenu";

const meta: Meta<typeof SidebarMenu> = {
  title: "Manager/SA/Common/SidebarMenu",
  component: SidebarMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/manager_sa",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SidebarMenu>;

// 기본 사이드바
export const Default: Story = {
  render: () => React.createElement(SidebarMenu),
};

