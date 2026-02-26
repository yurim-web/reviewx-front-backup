/* ========================================
   엑셀 다운로드 버튼 스토리북
   ======================================== */

/**
 * ExcelDownloadBtn.stories
 *
 * 목적: 파트너 캠페인 신청 엑셀 다운로드 버튼 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ExcelDownloadBtn from "./ExcelDownloadBtn";

const meta: Meta<typeof ExcelDownloadBtn> = {
  title: "Partner/CampaignApplication/ExcelDownloadBtn",
  component: ExcelDownloadBtn,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    onDownloadApplicants: {
      description: "신청자 목록 다운로드 핸들러",
      action: "download applicants clicked",
    },
    onDownloadSelected: {
      description: "선정자 목록 다운로드 핸들러",
      action: "download selected clicked",
    },
    onDownloadReport: {
      description: "결과 보고서 다운로드 핸들러 (선택적)",
      action: "download report clicked",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ExcelDownloadBtn>;

const renderExcelDownloadBtn = (args: React.ComponentProps<typeof ExcelDownloadBtn>) => {
  return React.createElement(ExcelDownloadBtn, args);
};

/**
 * 기본 엑셀 다운로드 버튼
 *
 * 신청자 목록과 선정자 목록을 다운로드할 수 있는 버튼 그룹입니다.
 */
export const Default: Story = {
  render: (args) => renderExcelDownloadBtn(args),
  args: {
    onDownloadApplicants: () => console.log("신청자 목록 다운로드"),
    onDownloadSelected: () => console.log("선정자 목록 다운로드"),
  },
};

/**
 * 결과 보고서 포함
 *
 * 결과 보고서 다운로드 버튼이 포함된 버튼 그룹입니다.
 */
export const WithReport: Story = {
  render: (args) => renderExcelDownloadBtn(args),
  args: {
    onDownloadApplicants: () => console.log("신청자 목록 다운로드"),
    onDownloadSelected: () => console.log("선정자 목록 다운로드"),
    onDownloadReport: () => console.log("결과 보고서 다운로드"),
  },
};
