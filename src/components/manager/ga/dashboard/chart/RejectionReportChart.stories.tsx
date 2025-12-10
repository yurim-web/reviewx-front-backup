/**
 * RejectionReportChart 컴포넌트 스토리북
 *
 * 반려/신고 통계 차트 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import RejectionReportChart from "./RejectionReportChart";

const meta: Meta<typeof RejectionReportChart> = {
  title: "Manager/GA/Dashboard/Chart/RejectionReportChart",
  component: RejectionReportChart,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof RejectionReportChart>;

/**
 * 기본 차트
 *
 * 반려와 신고 통계를 라인 차트로 표시하는 차트입니다.
 */
export const Default: Story = {
  render: () => (
    <div style={{ width: "100%", height: "400px", padding: "20px" }}>
      <RejectionReportChart />
    </div>
  ),
};
