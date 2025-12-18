/**
 * AmountChart 컴포넌트 스토리북
 *
 * 금액 통계 차트 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import AmountChart from "./AmountChart";

const meta: Meta<typeof AmountChart> = {
  title: "Manager/SA/Dashboard/Chart/AmountChart",
  component: AmountChart,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
  },
  argTypes: {
    data: {
      description: "차트에 표시할 데이터 배열",
      control: "object",
    },
    gradientId: {
      description: "그라데이션 ID (각 차트마다 고유한 ID 필요)",
      control: "text",
    },
    chartAreaClass: {
      description: "차트 영역 클래스명 (settlement 또는 payment)",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AmountChart>;

/**
 * 기본 차트
 *
 * 날짜별 금액을 라인 차트로 표시하는 차트입니다.
 */
export const Default: Story = {
  render: (args) => (
    <div style={{ width: "100%", height: "400px", padding: "20px" }}>
      <AmountChart {...args} />
    </div>
  ),
  args: {
    data: [
      { date: "11/1", value: 20000000 },
      { date: "11/2", value: 85000000 },
      { date: "11/3", value: 10000000 },
      { date: "11/4", value: 35000000 },
      { date: "11/5", value: 40000000 },
      { date: "11/6", value: 25000000 },
      { date: "11/7", value: 50000000 },
      { date: "11/8", value: 55000000 },
      { date: "11/9", value: 60000000 },
      { date: "11/10", value: 65000000 },
      { date: "11/11", value: 30000000 },
    ],
    gradientId: "testGradient",
    chartAreaClass: "chart_area_settlement", // CSS 모듈 클래스 이름 전체를 사용
  },
};
