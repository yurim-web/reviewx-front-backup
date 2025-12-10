/**
 * SubHeader 컴포넌트 스토리북
 * 
 * 서브헤더 컴포넌트입니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import SubHeader from "./SubHeader";

const meta: Meta<typeof SubHeader> = {
  title: "Fragments/SubHeader",
  component: SubHeader,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/campaign/delivery/1",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SubHeader>;

/**
 * 기본 서브헤더
 * 
 * 캠페인 상세 페이지에서 사용되는 서브헤더입니다.
 */
export const Default: Story = {};

/**
 * 학습 포인트:
 * 
 * 1. 고정 헤더
 *    - position: fixed로 상단에 고정됩니다
 *    - 스크롤해도 항상 보입니다
 * 
 * 2. useEffect 훅
 *    - 컴포넌트가 마운트될 때 메인 헤더를 숨깁니다
 *    - cleanup 함수로 언마운트 시 다시 표시합니다
 * 
 * 3. 조건부 라우팅
 *    - pathname에 따라 뒤로가기 동작이 다릅니다
 *    - 파트너 캠페인 생성 페이지에서는 홈으로 이동합니다
 */

