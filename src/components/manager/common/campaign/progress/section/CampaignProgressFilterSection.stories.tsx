/**
 * CampaignProgressFilterSection 컴포넌트 스토리북
 *
 * 캠페인 진행 상황 필터 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useMemo } from "react";
import CampaignProgressFilterSection from "./CampaignProgressFilterSection";

// CSS 모듈 import
import filterSectionStylesModule from "@/styles/manager/common/section/filter_section.module.css";

// CSS 모듈 객체를 타입 단언하여 사용
const filterSectionStyles = (filterSectionStylesModule || {
  filter_item: "filter_item",
  filter_icon: "filter_icon",
  filter_text: "filter_text",
  checkbox_icon: "checkbox_icon",
  dropdown_arrow: "dropdown_arrow",
  report_icon: "report_icon",
}) as Record<string, string> & {
  filter_item: string;
  filter_icon: string;
  filter_text: string;
  checkbox_icon: string;
  dropdown_arrow: string;
  report_icon: string;
};

const meta: Meta<typeof CampaignProgressFilterSection> = {
  title:
    "Manager/Common/Campaign/Progress/Section/CampaignProgressFilterSection",
  component: CampaignProgressFilterSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignProgressFilterSection>;

// 기본 필터 섹션
export const Default: Story = {
  render: () => {
    const props = useMemo(
      () => ({
        styles: filterSectionStyles,
      }),
      []
    );

    return React.createElement(CampaignProgressFilterSection, props);
  },
};
