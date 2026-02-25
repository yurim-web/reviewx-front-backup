/**
 * MemberStatsSection 컴포넌트 스토리북
 *
 * 회원 통계 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberStatsSection, { type MemberStats } from "./MemberStatsSection";
import styles from "@/styles/manager/common/member/partners/partner_stats_section.module.css";

// Mock 통계 데이터
const mockStats: MemberStats = {
  total_members: 1234,
  monthly_active: 856,
  monthly_new: 123,
  dormant: 45,
};

const meta: Meta<typeof MemberStatsSection> = {
  title: "Manager/Common/Member/Stats/MemberStatsSection",
  component: MemberStatsSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    stats: {
      description: "통계 데이터",
      control: "object",
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof MemberStatsSection>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderMemberStatsSection = (args: any) => {
  return <MemberStatsSection {...args} />;
};

/**
 * 기본 통계 섹션
 *
 * 회원 목록 페이지 상단의 통계 섹션입니다.
 */
export const Default: Story = {
  render: renderMemberStatsSection,
  args: {
    stats: mockStats,

    styles: styles as any,
  },
};

/**
 * 큰 숫자 통계
 *
 * 큰 숫자를 가진 통계 섹션입니다.
 */
export const LargeNumbers: Story = {
  render: renderMemberStatsSection,
  args: {
    stats: {
      total_members: 99999,
      monthly_active: 87654,
      monthly_new: 12345,
      dormant: 5678,
    },

    styles: styles as any,
  },
};

/**
 * 작은 숫자 통계
 *
 * 작은 숫자를 가진 통계 섹션입니다.
 */
export const SmallNumbers: Story = {
  render: renderMemberStatsSection,
  args: {
    stats: {
      total_members: 10,
      monthly_active: 5,
      monthly_new: 2,
      dormant: 1,
    },

    styles: styles as any,
  },
};

/**
 * 학습 포인트:
 *
 * 1. 회원 통계 섹션 컴포넌트
 *    - 리뷰어/파트너 목록 페이지 상단에 표시되는 통계 카드들을 표시합니다
 *    - 전체 가입자 수, 월간 활동 회원, 월간 신규 가입자 수, 휴면 회원 통계를 보여줍니다
 *
 * 2. 통계 카드
 *    - MemberStatCard 컴포넌트를 사용하여 각 통계 항목을 표시합니다
 *    - 제목과 값을 표시합니다
 *
 * 3. 숫자 포맷팅
 *    - toLocaleString을 사용하여 천 단위 콤마로 포맷팅합니다
 *    - 예: 1234 -> "1,234명"
 *
 * 4. 재사용성
 *    - 리뷰어와 파트너 목록 페이지에서 공통으로 사용됩니다
 *    - 스타일만 다르게 전달하여 사용합니다
 */
