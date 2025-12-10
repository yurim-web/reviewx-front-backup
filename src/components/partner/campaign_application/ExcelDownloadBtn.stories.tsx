/**
 * ExcelDownloadBtn 컴포넌트 스토리북
 *
 * 엑셀 다운로드 버튼 컴포넌트의 다양한 사용 예시를 보여줍니다.
 *
 * Storybook이란?
 * - 컴포넌트를 독립적으로 개발하고 테스트할 수 있는 도구입니다
 * - 다양한 props 조합으로 컴포넌트의 동작을 확인할 수 있습니다
 * - 디자이너와 개발자가 협업하기 좋은 도구입니다
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ExcelDownloadBtn from "./ExcelDownloadBtn";

// Meta 타입: Storybook에서 컴포넌트의 메타데이터를 정의합니다
// title: Storybook 사이드바에서 보이는 경로 (슬래시로 계층 구조 표현)
// component: 스토리를 생성할 컴포넌트
// tags: 자동 문서 생성 등의 기능을 활성화
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

// StoryObj 타입: 개별 스토리의 타입을 정의합니다
type Story = StoryObj<typeof ExcelDownloadBtn>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderExcelDownloadBtn = (args: typeof ExcelDownloadBtn) => {
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

/**
 * 학습 포인트:
 *
 * 1. 선택적 props (Optional Props)
 *    - onDownloadReport는 선택적(optional) prop입니다
 *    - ? 기호로 표시되어 있어서 제공하지 않아도 됩니다
 *    - 조건부 렌더링으로 버튼을 표시하거나 숨깁니다
 *
 * 2. 조건부 렌더링
 *    - onDownloadReport가 제공되면 결과 보고서 버튼을 표시합니다
 *    - 삼항 연산자나 && 연산자를 사용하여 조건부로 렌더링합니다
 *
 * 3. 이벤트 핸들러
 *    - 각 버튼마다 다른 핸들러 함수를 받아서 처리합니다
 *    - console.log로 디버깅 정보를 출력합니다
 *
 * 4. 신청자 vs 선정자
 *    - 신청자: 캠페인에 신청한 모든 사용자
 *    - 선정자: 캠페인에 선정된 사용자
 */

