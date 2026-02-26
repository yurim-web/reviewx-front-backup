/* ========================================
   콘텐츠 엑셀 다운로드 버튼 스토리북
   ======================================== */

/**
 * ContentExcelDownloadBtn.stories
 *
 * 목적: 파트너 콘텐츠 내역 엑셀 다운로드 버튼 컴포넌트 문서화
 *
 * 사용 페이지:
 * - Storybook (개발 환경 컴포넌트 문서)
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ContentExcelDownloadBtn from "./ContentExcelDownloadBtn";

const meta: Meta<typeof ContentExcelDownloadBtn> = {
  title: "Partner/CampaignApplication/ContentExcelDownloadBtn",
  component: ContentExcelDownloadBtn,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    onDownloadReview: {
      description: "검수 중인 콘텐츠 목록 다운로드 핸들러",
      action: "download review clicked",
    },
    onDownloadCompleted: {
      description: "완료된 콘텐츠 목록 다운로드 핸들러",
      action: "download completed clicked",
    },
    onDownloadReport: {
      description: "결과 보고서 다운로드 핸들러",
      action: "download report clicked",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ContentExcelDownloadBtn>;

const renderContentExcelDownloadBtn = (
  args: React.ComponentProps<typeof ContentExcelDownloadBtn>
) => {
  return React.createElement(ContentExcelDownloadBtn, args);
};

/**
 * 기본 엑셀 다운로드 버튼
 *
 * 검수 중인 콘텐츠, 완료된 콘텐츠, 결과 보고서를 다운로드할 수 있는 버튼 그룹입니다.
 */
export const Default: Story = {
  render: (args) => renderContentExcelDownloadBtn(args),
  args: {
    onDownloadReview: () => console.log("검수 중인 콘텐츠 다운로드"),
    onDownloadCompleted: () => console.log("완료된 콘텐츠 다운로드"),
    onDownloadReport: () => console.log("결과 보고서 다운로드"),
  },
};
