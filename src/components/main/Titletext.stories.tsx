/**
 * Titletext 컴포넌트 스토리북
 * 
 * 메인 페이지의 제목 텍스트를 표시하는 간단한 컴포넌트입니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import Titletext from "./Titletext";

const meta: Meta<typeof Titletext> = {
  title: "Main/Titletext",
  component: Titletext,
  tags: ["autodocs"],
  argTypes: {
    main_title: {
      description: "메인 페이지에 표시할 제목 텍스트",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Titletext>;

/**
 * 기본 제목
 * 
 * 가장 일반적인 사용 예시입니다.
 */
export const Default: Story = {
  args: {
    main_title: "리뷰 작성 캠페인",
  },
};

/**
 * 긴 제목
 * 
 * 긴 텍스트가 어떻게 표시되는지 확인합니다.
 */
export const LongTitle: Story = {
  args: {
    main_title: "새로운 제품을 체험하고 솔직한 리뷰를 작성해주세요!",
  },
};

/**
 * 짧은 제목
 * 
 * 짧은 텍스트의 표시를 확인합니다.
 */
export const ShortTitle: Story = {
  args: {
    main_title: "캠페인",
  },
};

/**
 * 특수 문자 포함 제목
 * 
 * 특수 문자나 이모지가 포함된 경우를 테스트합니다.
 */
export const SpecialCharacters: Story = {
  args: {
    main_title: "신제품 출시 기념 🎉 특별 이벤트",
  },
};

/**
 * 학습 포인트:
 * 
 * 1. 간단한 컴포넌트도 스토리 작성
 *    - 간단한 컴포넌트라도 스토리를 만들면 문서화와 테스트에 도움이 됩니다
 *    - 다양한 입력값으로 컴포넌트의 동작을 확인할 수 있습니다
 * 
 * 2. 엣지 케이스 테스트
 *    - 긴 텍스트, 짧은 텍스트, 특수 문자 등 다양한 경우를 테스트합니다
 *    - 실제 사용 시 발생할 수 있는 문제를 미리 발견할 수 있습니다
 * 
 * 3. props 타입
 *    - TypeScript를 사용하면 props의 타입이 명확합니다
 *    - Storybook에서도 타입 정보를 활용하여 자동완성과 검증을 제공합니다
 */

