/**
 * CampaignTypeTag 컴포넌트 스토리북
 *
 * 캠페인 유형 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignTypeTag, { type CampaignType } from "./CampaignTypeTag";

// CSS 모듈 import
import tagsStylesModule from "@/styles/manager_ga/campaign/progress/tags.module.css";

// CSS 모듈 객체를 타입 단언하여 사용
const tagsStyles = (tagsStylesModule || {
  type_tag: "type_tag",
}) as Record<string, string> & {
  type_tag: string;
};

const meta: Meta<typeof CampaignTypeTag> = {
  title: "Manager/Common/Campaign/Progress/Tags/CampaignTypeTag",
  component: CampaignTypeTag,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    type: {
      description: "캠페인 유형",
      control: "select",
      options: ["배송형", "방문형", "구매평", "기자단", "미션형"],
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignTypeTag>;

// 배송형
export const Delivery: Story = {
  args: {
    type: "배송형",
    styles: tagsStyles,
  },
};

// 방문형
export const Visit: Story = {
  args: {
    type: "방문형",
    styles: tagsStyles,
  },
};

// 구매평
export const Review: Story = {
  args: {
    type: "구매평",
    styles: tagsStyles,
  },
};

// 기자단
export const Reporter: Story = {
  args: {
    type: "기자단",
    styles: tagsStyles,
  },
};

// 미션형
export const Mission: Story = {
  args: {
    type: "미션형",
    styles: tagsStyles,
  },
};

// 모든 유형 태그 비교
export const AllTypes: Story = {
  render: () => {
    const types: CampaignType[] = ["배송형", "방문형", "구매평", "기자단", "미션형"];

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
      ...types.map((type) =>
        React.createElement(CampaignTypeTag, {
          key: type,
          type,
          styles: tagsStyles,
        })
      )
    );
  },
};

