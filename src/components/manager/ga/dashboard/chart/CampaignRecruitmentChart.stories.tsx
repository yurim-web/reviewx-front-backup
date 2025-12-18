/**
 * CampaignRecruitmentChart 컴포넌트 스토리북
 *
 * 캠페인 모집 통계 차트 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import CampaignRecruitmentChart from "./CampaignRecruitmentChart";

const meta: Meta<typeof CampaignRecruitmentChart> = {
  title: "Manager/GA/Dashboard/Chart/CampaignRecruitmentChart",
  component: CampaignRecruitmentChart,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof CampaignRecruitmentChart>;

/**
 * 기본 차트
 *
 * 카테고리별 캠페인 모집률, 달성률, 평균 진행 기간을 표시하는 차트입니다.
 */
export const Default: Story = {
  render: () => (
    <div style={{ width: "100%", height: "400px", padding: "20px" }}>
      <CampaignRecruitmentChart />
    </div>
  ),
};
