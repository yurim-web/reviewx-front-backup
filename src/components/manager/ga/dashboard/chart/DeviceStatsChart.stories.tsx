/**
 * DeviceStatsChart 컴포넌트 스토리북
 *
 * 디바이스 통계 차트 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import DeviceStatsChart from "./DeviceStatsChart";

const meta: Meta<typeof DeviceStatsChart> = {
  title: "Manager/GA/Dashboard/Chart/DeviceStatsChart",
  component: DeviceStatsChart,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof DeviceStatsChart>;

/**
 * 기본 차트
 *
 * All, PC, Tablet, Mobile, App 등 디바이스별 접속 통계를 가로 막대 차트로 표시합니다.
 */
export const Default: Story = {
  render: () => (
    <div style={{ width: "100%", minHeight: "300px", padding: "20px" }}>
      <DeviceStatsChart />
    </div>
  ),
};
