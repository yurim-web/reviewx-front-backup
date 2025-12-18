/**
 * ManagerGAHeader 컴포넌트 스토리북
 *
 * GA 관리자 헤더 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ManagerGAHeader from "./ManagerGAHeader";

const meta: Meta<typeof ManagerGAHeader> = {
  title: "Manager/GA/Common/ManagerGAHeader",
  component: ManagerGAHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/manager_ga",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ManagerGAHeader>;

// 스타일 객체를 컴포넌트 외부로 이동하여 매번 새로 생성되지 않도록 함
const wrapperStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  backgroundColor: "#d9d9d9", // 헤더 배경색 (#d9d9d9) - header.module.css와 일치
  padding: 0,
  margin: 0,
};

// 기본 헤더
export const Default: Story = {
  render: () => {
    // ManagerGAHeader는 props를 받지 않는 컴포넌트입니다
    // 깜빡임 방지를 위해 스타일 객체는 외부에 정의되어 있습니다
    return React.createElement(
      "div",
      { style: wrapperStyle },
      React.createElement(ManagerGAHeader)
    );
  },
};
