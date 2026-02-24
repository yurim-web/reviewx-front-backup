/* ========================================
   ChannelSection 스토리북
   ======================================== */

/**
 * ChannelSection.stories
 *
 * 목적: 채널 섹션 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/MyPage/ChannelSection)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ChannelSection from "./ChannelSection";

// 채널 데이터를 컴포넌트 외부로 이동하여 매번 새로 생성되지 않도록 함
const mockChannels = [
  { name: "네이버 블로그", url: "https://blog.naver.com/test", status: "connected" as const },
  { name: "인스타그램", url: undefined, status: "disconnected" as const },
  { name: "유튜브", url: "https://youtube.com/@test", status: "connected" as const },
];

const allConnectedChannels = [
  { name: "네이버 블로그", url: "https://blog.naver.com/test", status: "connected" as const },
  { name: "인스타그램", url: "https://instagram.com/test", status: "connected" as const },
  { name: "유튜브", url: "https://youtube.com/@test", status: "connected" as const },
];

const allDisconnectedChannels = [
  { name: "네이버 블로그", url: undefined, status: "disconnected" as const },
  { name: "인스타그램", url: undefined, status: "disconnected" as const },
  { name: "유튜브", url: undefined, status: "disconnected" as const },
];

// 핸들러를 컴포넌트 외부로 이동하여 매번 새로 생성되지 않도록 함
const handleChannelUpdate = (channelName: string, channelInfo: { url: string }) => {
  console.log("Channel updated:", channelName, channelInfo);
};

// 스타일 객체를 컴포넌트 외부로 이동
const wrapperStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  position: "relative",
  margin: 0,
  padding: "20px",
  backgroundColor: "#f5f5f5",
};

const meta: Meta<typeof ChannelSection> = {
  title: "User/MyPage/ChannelSection",
  component: ChannelSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen", // 모달이 포함되어 있으므로 fullscreen 레이아웃 사용
  },
  argTypes: {
    channels: {
      description: "채널 정보 배열",
      control: "object",
    },
    onChannelUpdate: {
      description: "채널 정보 업데이트 핸들러",
      action: "channel updated",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChannelSection>;

// 기본 상태 (일부 연결, 일부 미연결)
export const Default: Story = {
  render: () => {
    // render 함수를 최대한 단순화
    return React.createElement(
      "div",
      { style: wrapperStyle },
      React.createElement(ChannelSection, {
        channels: mockChannels,
        onChannelUpdate: handleChannelUpdate,
      })
    );
  },
};

// 모두 연결된 상태
export const AllConnected: Story = {
  render: () => {
    return React.createElement(
      "div",
      { style: wrapperStyle },
      React.createElement(ChannelSection, {
        channels: allConnectedChannels,
        onChannelUpdate: handleChannelUpdate,
      })
    );
  },
};

// 모두 미연결된 상태
export const AllDisconnected: Story = {
  render: () => {
    return React.createElement(
      "div",
      { style: wrapperStyle },
      React.createElement(ChannelSection, {
        channels: allDisconnectedChannels,
        onChannelUpdate: handleChannelUpdate,
      })
    );
  },
};

