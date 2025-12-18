/**
 * Header 컴포넌트 스토리북
 *
 * 이 파일은 Storybook에서 Header 컴포넌트를 시각화하고 테스트하기 위한 스토리 파일입니다.
 *
 * Storybook이란?
 * - 컴포넌트를 독립적으로 개발하고 테스트할 수 있는 도구입니다
 * - 다양한 props 조합으로 컴포넌트의 동작을 확인할 수 있습니다
 * - 디자이너와 개발자가 협업하기 좋은 도구입니다
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Header from "./Header";

// Meta 타입: Storybook에서 컴포넌트의 메타데이터를 정의합니다
// title: Storybook 사이드바에서 보이는 경로 (슬래시로 계층 구조 표현)
// component: 스토리를 생성할 컴포넌트
// tags: 자동 문서 생성 등의 기능을 활성화
const meta: Meta<typeof Header> = {
  title: "Fragments/Header",
  component: Header,
  tags: ["autodocs"],
  // Next.js Link 컴포넌트를 모킹하기 위한 설정
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/",
      },
    },
  },
};

export default meta;

// StoryObj 타입: 개별 스토리의 타입을 정의합니다
type Story = StoryObj<typeof Header>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// PartnerHeader.stories.tsx와 동일한 패턴 사용
const renderHeader = () => {
  return React.createElement(Header);
};

/**
 * 기본 Header 스토리
 *
 * Header 컴포넌트는 props를 받지 않는 단순한 컴포넌트입니다.
 * 따라서 args가 필요 없습니다.
 */
export const Default: Story = {
  render: renderHeader,
};

/**
 * 학습 포인트:
 *
 * 1. Storybook 스토리 구조
 *    - Meta: 컴포넌트의 전역 설정
 *    - Story: 개별 테스트 케이스
 *
 * 2. title 속성
 *    - "Fragments/Header"는 Storybook 사이드바에서 "Fragments" 폴더 안에 "Header"로 표시됩니다
 *    - 슬래시(/)로 계층 구조를 만들 수 있습니다
 *
 * 3. tags: ["autodocs"]
 *    - 이 태그가 있으면 Storybook이 자동으로 컴포넌트 문서를 생성합니다
 *    - 컴포넌트의 props, 사용 예시 등을 자동으로 보여줍니다
 *
 * 4. Next.js 컴포넌트 모킹
 *    - Storybook은 Next.js 환경이 아니므로, Link 같은 Next.js 컴포넌트를 모킹해야 합니다
 *    - preview.ts에서 전역적으로 처리하거나, 각 스토리에서 개별적으로 처리할 수 있습니다
 */
