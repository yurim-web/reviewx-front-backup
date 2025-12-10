/**
 * FindAccountPage 컴포넌트 스토리북
 *
 * 아이디/비밀번호 찾기 페이지 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import FindAccountPage from "./FindAccountPage";

const meta: Meta<typeof FindAccountPage> = {
  title: "Common/FindAccountPage",
  component: FindAccountPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/find-account",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FindAccountPage>;

// 기본 찾기 페이지
export const Default: Story = {
  render: () => React.createElement(FindAccountPage),
};

