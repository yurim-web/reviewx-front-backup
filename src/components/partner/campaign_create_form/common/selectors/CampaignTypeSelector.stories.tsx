/**
 * CampaignTypeSelector 컴포넌트 스토리북
 *
 * 캠페인 유형 선택 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { CampaignTypeSelector } from "./CampaignTypeSelector";
import type { CampaignType } from "@/types/domain/user";

const meta: Meta<typeof CampaignTypeSelector> = {
  title: "Partner/CampaignCreateForm/Common/CampaignTypeSelector",
  component: CampaignTypeSelector,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    currentType: {
      description: "현재 선택된 캠페인 유형",
      control: "select",
      options: ["배송형", "방문형", "구매평", "기자단", "미션형"],
    },
    onTypeChange: {
      description: "유형 변경 핸들러",
      action: "type changed",
    },
    disabled: {
      description: "버튼 비활성화 여부",
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignTypeSelector>;

/**
 * 기본 캠페인 유형 선택
 *
 * 5가지 캠페인 유형 중 하나를 선택할 수 있습니다.
 */
export const Default: Story = {
  render: (args) => {
    const [currentType, setCurrentType] = useState<CampaignType>(
      (args.currentType as CampaignType) || "배송형"
    );

    return React.createElement(CampaignTypeSelector, {
      ...args,
      currentType,
      onTypeChange: (type: CampaignType) => {
        setCurrentType(type);
        args.onTypeChange?.(type);
      },
    });
  },
  args: {
    currentType: "배송형",
    onTypeChange: (type) => console.log("Type changed:", type),
    disabled: false,
  },
};

/**
 * 비활성화 상태
 *
 * 수정 모드에서 유형 선택이 비활성화된 상태입니다.
 */
export const Disabled: Story = {
  render: (args) => {
    return React.createElement(CampaignTypeSelector, args);
  },
  args: {
    currentType: "배송형",
    onTypeChange: (type) => console.log("Type changed:", type),
    disabled: true,
  },
};

/**
 * 학습 포인트:
 *
 * 1. 캠페인 유형 선택 컴포넌트
 *    - 5가지 캠페인 유형 중 하나를 선택할 수 있습니다
 *    - 배송형, 방문형, 구매평, 기자단, 미션형
 *
 * 2. 활성화 상태 표시
 *    - currentType과 일치하는 버튼에 active 클래스가 적용됩니다
 *    - 시각적으로 선택된 유형을 강조합니다
 *
 * 3. 비활성화 기능
 *    - disabled prop으로 모든 버튼을 비활성화할 수 있습니다
 *    - 수정 모드에서 유형 변경을 막을 때 사용합니다
 *
 * 4. 배열 렌더링
 *    - campaign_types 배열을 map으로 순회하여 버튼을 생성합니다
 *    - 각 유형마다 동일한 스타일의 버튼을 표시합니다
 */

