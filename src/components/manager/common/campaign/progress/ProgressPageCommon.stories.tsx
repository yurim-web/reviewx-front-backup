/**
 * ProgressPageCommon 컴포넌트 스토리북
 *
 * 캠페인 진행 상황 페이지 공통 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import ProgressPageCommon from "./ProgressPageCommon";

const meta: Meta<typeof ProgressPageCommon> = {
  title: "Manager/Common/Campaign/Progress/ProgressPageCommon",
  component: ProgressPageCommon,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
  },
  argTypes: {
    manager_type: {
      description: "관리자 타입 (ga 또는 sa)",
      control: "select",
      options: ["ga", "sa"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProgressPageCommon>;

/**
 * GA 타입 페이지
 *
 * General Admin 타입의 캠페인 진행 상황 페이지입니다.
 */
export const GAType: Story = {
  args: {
    manager_type: "ga",
  },
};

/**
 * SA 타입 페이지
 *
 * Super Admin 타입의 캠페인 진행 상황 페이지입니다.
 */
export const SAType: Story = {
  args: {
    manager_type: "sa",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 공통 컴포넌트 패턴
 *    - GA와 SA 두 가지 관리자 타입에서 공통으로 사용하는 컴포넌트입니다
 *    - manager_type prop으로 데이터 소스와 스타일을 동적으로 결정합니다
 *    - 코드 중복을 제거하고 유지보수성을 높입니다
 *
 * 2. 조건부 데이터/스타일 선택
 *    - 삼항 연산자를 사용하여 manager_type에 따라 다른 데이터와 스타일을 선택합니다
 *    - calculateGAStats / calculateSAStats: 통계 계산 함수
 *    - gaCampaignList / saCampaignList: 캠페인 목록 데이터
 *    - 각종 CSS 모듈 스타일들
 *
 * 3. 컴포넌트 구조
 *    - StatCardsSectionCommon: 통계 카드 섹션 (오픈 예정, 진행 중, 신청 중 등)
 *    - FilterSectionCommon: 필터 섹션 (날짜, 검색, 상태, 유형, 채널 등)
 *    - CampaignTableCommon: 캠페인 목록 테이블
 *
 * 4. Wrapper 함수 패턴
 *    - ReportModal을 wrapper 함수로 생성하여 CampaignTableCommon에 전달합니다
 *    - 컴포넌트 타입을 기대하는 경우에 유용한 패턴입니다
 *
 * 5. Props 기반 제어
 *    - manager_type 하나의 prop으로 전체 페이지의 동작을 제어합니다
 *    - 단순하고 명확한 인터페이스를 제공합니다
 */

