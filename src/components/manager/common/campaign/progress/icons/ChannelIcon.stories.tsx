/**
 * ChannelIcon 컴포넌트 스토리북
 *
 * 채널 아이콘 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ChannelIcon, { type Channel } from "./ChannelIcon";

// CSS 모듈 import
import channelIconStylesModule from "@/styles/manager_ga/campaign/progress/channel_icon.module.css";

// CSS 모듈 객체를 타입 단언하여 사용
const channelIconStyles = (channelIconStylesModule || {
  channel_icon: "channel_icon",
  channel_icon_image: "channel_icon_image",
}) as Record<string, string> & {
  channel_icon: string;
  channel_icon_image: string;
};

const meta: Meta<typeof ChannelIcon> = {
  title: "Manager/Common/Campaign/Progress/Icons/ChannelIcon",
  component: ChannelIcon,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    channel: {
      description: "채널 타입",
      control: "select",
      options: [
        "Blog",
        "Clip",
        "Instagram",
        "Mission",
        "Reels",
        "Shorts",
        "Store",
        "Youtube",
      ],
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChannelIcon>;

// 네이버 블로그
export const Blog: Story = {
  args: {
    channel: "Blog",
    styles: channelIconStyles,
  },
};

// 클립
export const Clip: Story = {
  args: {
    channel: "Clip",
    styles: channelIconStyles,
  },
};

// 인스타그램
export const Instagram: Story = {
  args: {
    channel: "Instagram",
    styles: channelIconStyles,
  },
};

// 유튜브
export const Youtube: Story = {
  args: {
    channel: "Youtube",
    styles: channelIconStyles,
  },
};

// 릴스
export const Reels: Story = {
  args: {
    channel: "Reels",
    styles: channelIconStyles,
  },
};

// 쇼츠
export const Shorts: Story = {
  args: {
    channel: "Shorts",
    styles: channelIconStyles,
  },
};

// 모든 채널 아이콘 비교
export const AllChannels: Story = {
  render: () => {
    const channels: Channel[] = [
      "Blog",
      "Clip",
      "Instagram",
      "Youtube",
      "Reels",
      "Shorts",
      "Mission",
      "Store",
    ];

    return React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          padding: "20px",
        },
      },
      ...channels.map((channel) =>
        React.createElement(ChannelIcon, {
          key: channel,
          channel,
          styles: channelIconStyles,
        })
      )
    );
  },
};
