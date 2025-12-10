/**
 * BlockedUserPage 컴포넌트 스토리북
 *
 * 차단된 회원 페이지 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import BlockedUserPage from "./BlockedUserPage";

const meta: Meta<typeof BlockedUserPage> = {
  title: "Common/BlockedUserPage",
  component: BlockedUserPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/user/blocked",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof BlockedUserPage>;

// 기본 차단 페이지
export const Default: Story = {
  render: () => {
    // Storybook에서 컴포넌트를 렌더링할 때
    // next-navigation 모킹이 자동으로 적용됩니다.
    return React.createElement(BlockedUserPage);
  },
};
