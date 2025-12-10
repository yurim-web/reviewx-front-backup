/**
 * PartnerStatsSection 컴포넌트 스토리북
 *
 * 파트너 통계 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import PartnerStatsSection from "./PartnerStatsSection";

const meta: Meta<typeof PartnerStatsSection> = {
  title: "Manager/Common/Member/Partners/PartnerStatsSection",
  component: PartnerStatsSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof PartnerStatsSection>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderPartnerStatsSection = (args: any) => {
  return <PartnerStatsSection {...args} />;
};

/**
 * 기본 통계 섹션
 *
 * 파트너 목록 페이지 상단의 통계 섹션입니다.
 */
export const Default: Story = {
  render: renderPartnerStatsSection,
  args: {},
};

/**
 * 학습 포인트:
 *
 * 1. 파트너 통계 섹션 컴포넌트
 *    - GA/SA 관리자 파트너 목록 페이지에서 공통 MemberStatsSection을 사용합니다
 *    - 스타일과 데이터를 전달하여 렌더링합니다
 *
 * 2. 통계 항목
 *    - 전체 가입자 수
 *    - 월간 활동 회원
 *    - 월간 신규 가입자 수
 *    - 휴면 회원
 *
 * 3. 데이터 소스
 *    - partner_stats 데이터를 사용합니다
 *    - src/data/manager_ga/member/partners.ts에서 가져옵니다
 */


