/**
 * RejectionReportSection 컴포넌트 스토리북
 *
 * 반려/신고 통계 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import RejectionReportSection from "./RejectionReportSection";
import styles from "@/styles/manager_ga/dashboard/sections/rejection_report_section.module.css";

const meta: Meta<typeof RejectionReportSection> = {
  title: "Manager/GA/Dashboard/Section/RejectionReportSection",
  component: RejectionReportSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof RejectionReportSection>;

/**
 * 기본 섹션
 *
 * 반려와 신고 통계 차트를 표시하는 섹션입니다.
 */
export const Default: Story = {
  render: () => (
    <div
      style={{
        width: "100%",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "356px", // 섹션 카드의 max-height와 동일하게 설정
        }}
      >
        {/* 섹션 카드에 직접 높이를 설정하기 위해 스타일 오버라이드 */}
        <style>{`
          .${styles.rejection_report_section_card} {
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
          }
        `}</style>
        <RejectionReportSection
          dateRange={{ from: new Date("2026-02-01"), to: new Date("2026-02-25") }}
        />
      </div>
    </div>
  ),
};
