/**
 * PageHeader 컴포넌트 스토리북
 *
 * 캠페인 생성 페이지 헤더 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import PageHeader from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Partner/CampaignCreateForm/Common/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    title: {
      description: "페이지 제목",
      control: "text",
    },
    onUrgentChange: {
      description: "긴급 체크박스 변경 핸들러",
      action: "urgent changed",
    },
    initialUrgent: {
      description: "초기 긴급 상태",
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PageHeader>;

/**
 * 기본 페이지 헤더
 *
 * 페이지 제목과 긴급 체크박스가 있는 기본 헤더입니다.
 */
export const Default: Story = {
  render: (args) => {
    const [isUrgent, setIsUrgent] = useState(args.initialUrgent || false);

    return React.createElement(PageHeader, {
      ...args,
      initialUrgent: isUrgent,
      onUrgentChange: (checked) => {
        setIsUrgent(checked);
        args.onUrgentChange?.(checked);
      },
    });
  },
  args: {
    title: "새 캠페인 등록",
    onUrgentChange: (checked) => console.log("Urgent changed:", checked),
    initialUrgent: false,
  },
};

/**
 * 긴급 체크된 상태
 *
 * 긴급 체크박스가 체크된 상태의 헤더입니다.
 */
export const UrgentChecked: Story = {
  render: (args) => {
    const [isUrgent, setIsUrgent] = useState<boolean>(args.initialUrgent ?? true);

    return React.createElement(PageHeader, {
      ...args,
      initialUrgent: isUrgent,
      onUrgentChange: (checked) => {
        setIsUrgent(checked);
        args.onUrgentChange?.(checked);
      },
    });
  },
  args: {
    title: "새 캠페인 등록",
    onUrgentChange: (checked) => console.log("Urgent changed:", checked),
    initialUrgent: true,
  },
};

/**
 * 커스텀 제목
 *
 * 다른 제목을 사용하는 헤더입니다.
 */
export const CustomTitle: Story = {
  render: (args) => {
    const [isUrgent, setIsUrgent] = useState(args.initialUrgent || false);

    return React.createElement(PageHeader, {
      ...args,
      initialUrgent: isUrgent,
      onUrgentChange: (checked) => {
        setIsUrgent(checked);
        args.onUrgentChange?.(checked);
      },
    });
  },
  args: {
    title: "캠페인 수정",
    onUrgentChange: (checked) => console.log("Urgent changed:", checked),
    initialUrgent: false,
  },
};

/**
 * 학습 포인트:
 *
 * 1. 페이지 헤더 컴포넌트
 *    - 모든 캠페인 생성 페이지에서 공통으로 사용되는 헤더입니다
 *    - 페이지 제목과 긴급 체크박스를 포함합니다
 *
 * 2. 긴급 체크박스
 *    - useState로 긴급 상태를 관리합니다
 *    - 체크되면 빨간색으로 강조 표시됩니다
 *    - onUrgentChange 콜백으로 상태 변경을 알립니다
 *
 * 3. 조건부 스타일링
 *    - isUrgent에 따라 urgent_checked 클래스와 색상을 변경합니다
 *    - 인라인 스타일과 CSS 클래스를 함께 사용합니다
 */
