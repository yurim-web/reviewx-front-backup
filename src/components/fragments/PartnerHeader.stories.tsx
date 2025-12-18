/**
 * PartnerHeader 컴포넌트 스토리북
 *
 * 파트너 전용 헤더 컴포넌트입니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import PartnerHeader from "./PartnerHeader";

const meta: Meta<typeof PartnerHeader> = {
  title: "Fragments/PartnerHeader",
  component: PartnerHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/partner",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PartnerHeader>;

// 안정적인 render 함수를 컴포넌트 외부에 정의
const renderPartnerHeader = () => {
  return React.createElement(PartnerHeader);
};

/**
 * 기본 파트너 헤더
 *
 * 파트너 페이지에서 사용되는 헤더입니다.
 * "새로운 캠페인 등록" 버튼이 포함되어 있습니다.
 */
export const Default: Story = {
  render: renderPartnerHeader,
};

/**
 * 학습 포인트:
 *
 * 1. 파트너 전용 기능
 *    - 일반 Header와 달리 "새로운 캠페인 등록" 버튼이 있습니다
 *    - 파트너만 사용할 수 있는 기능을 제공합니다
 *
 * 2. 역할별 UI 차별화
 *    - 사용자와 파트너는 다른 헤더를 사용합니다
 *    - 각 역할에 맞는 기능을 제공합니다
 */
