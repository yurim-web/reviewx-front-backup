/**
 * ContentExcelDownloadBtn 컴포넌트 스토리북
 *
 * 콘텐츠 내역 엑셀 다운로드 버튼 컴포넌트의 다양한 사용 예시를 보여줍니다.
 *
 * Storybook이란?
 * - 컴포넌트를 독립적으로 개발하고 테스트할 수 있는 도구입니다
 * - 다양한 props 조합으로 컴포넌트의 동작을 확인할 수 있습니다
 * - 디자이너와 개발자가 협업하기 좋은 도구입니다
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ContentExcelDownloadBtn from "./ContentExcelDownloadBtn";

// Meta 타입: Storybook에서 컴포넌트의 메타데이터를 정의합니다
// title: Storybook 사이드바에서 보이는 경로 (슬래시로 계층 구조 표현)
// component: 스토리를 생성할 컴포넌트
// tags: 자동 문서 생성 등의 기능을 활성화
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

// StoryObj 타입: 개별 스토리의 타입을 정의합니다
type Story = StoryObj<typeof ContentExcelDownloadBtn>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderContentExcelDownloadBtn = (args: typeof ContentExcelDownloadBtn) => {
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

/**
 * 학습 포인트:
 *
 * 1. 버튼 그룹 컴포넌트
 *    - 여러 개의 관련된 버튼을 하나의 그룹으로 묶어서 표시합니다
 *    - 일관된 스타일과 레이아웃을 제공합니다
 *
 * 2. 이벤트 핸들러 props
 *    - 각 버튼마다 다른 핸들러 함수를 받아서 처리합니다
 *    - 부모 컴포넌트에서 실제 다운로드 로직을 구현합니다
 *
 * 3. 이미지 아이콘
 *    - img 태그를 사용하여 엑셀 아이콘을 표시합니다
 *    - alt 속성으로 접근성을 고려합니다
 *
 * 4. 콘텐츠 내역 특화 기능
 *    - 검수 중인 콘텐츠: 아직 검수가 완료되지 않은 콘텐츠 목록
 *    - 완료된 콘텐츠: 검수가 완료된 콘텐츠 목록
 *    - 결과 보고서: 캠페인 결과를 요약한 보고서
 */

