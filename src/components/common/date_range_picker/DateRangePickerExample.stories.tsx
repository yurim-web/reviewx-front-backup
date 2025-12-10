/**
 * DateRangePickerExample 컴포넌트 스토리북
 *
 * 날짜 범위 선택기 예시 컴포넌트의 다양한 사용 예시를 보여줍니다.
 *
 * Storybook이란?
 * - 컴포넌트를 독립적으로 개발하고 테스트할 수 있는 도구입니다
 * - 다양한 props 조합으로 컴포넌트의 동작을 확인할 수 있습니다
 * - 디자이너와 개발자가 협업하기 좋은 도구입니다
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DateRangePickerExample from "./DateRangePickerExample";

// Meta 타입: Storybook에서 컴포넌트의 메타데이터를 정의합니다
// title: Storybook 사이드바에서 보이는 경로 (슬래시로 계층 구조 표현)
// component: 스토리를 생성할 컴포넌트
// tags: 자동 문서 생성 등의 기능을 활성화
const meta: Meta<typeof DateRangePickerExample> = {
  title: "Common/DateRangePicker/DateRangePickerExample",
  component: DateRangePickerExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    // react-day-picker 라이브러리를 사용하므로 관련 설명 추가
    docs: {
      description: {
        component:
          "스카이스캐너처럼 이전/다음 달의 날짜를 함께 표시하는 달력 컴포넌트입니다. react-day-picker 라이브러리를 사용합니다.",
      },
    },
  },
};

export default meta;

// StoryObj 타입: 개별 스토리의 타입을 정의합니다
type Story = StoryObj<typeof DateRangePickerExample>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
const renderDateRangePicker = () => {
  return React.createElement(DateRangePickerExample);
};

/**
 * 기본 날짜 범위 선택기
 *
 * DateRangePickerExample 컴포넌트는 props를 받지 않는 단순한 컴포넌트입니다.
 * 내부에서 useState를 사용하여 날짜 범위 선택 상태를 관리합니다.
 */
export const Default: Story = {
  render: renderDateRangePicker,
};

/**
 * 학습 포인트:
 *
 * 1. react-day-picker 라이브러리
 *    - DayPicker 컴포넌트를 사용하여 달력을 구현합니다
 *    - mode="range"로 날짜 범위 선택 모드를 설정합니다
 *    - selected와 onSelect props로 선택된 날짜 범위를 관리합니다
 *
 * 2. useState 훅
 *    - 컴포넌트 내부에서 날짜 범위 선택 상태를 관리합니다
 *    - DateRange 타입을 사용하여 시작일(from)과 종료일(to)을 저장합니다
 *
 * 3. 한국어 로케일
 *    - locale={ko}로 한국어 로케일을 설정합니다
 *    - date-fns 라이브러리의 ko 로케일을 사용합니다
 *
 * 4. 이전/다음 달 날짜 표시
 *    - showOutsideDays={true}로 이전/다음 달의 날짜도 표시합니다
 *    - 회색으로 표시되어 현재 달이 아닌 날짜임을 구분합니다
 *
 * 5. 여러 달 동시 표시
 *    - numberOfMonths={2}로 2개월을 동시에 표시합니다
 *    - 스카이스캐너처럼 여러 달을 한 번에 볼 수 있습니다
 *
 * 6. 제어 컴포넌트 vs 비제어 컴포넌트
 *    - 이 컴포넌트는 내부 상태를 관리하는 비제어 컴포넌트입니다
 *    - 부모 컴포넌트에서 상태를 관리하려면 props로 value와 onChange를 받아야 합니다
 *
 * 7. 날짜 포맷팅
 *    - toLocaleDateString("ko-KR")로 한국어 형식으로 날짜를 표시합니다
 *    - 예: "2024. 1. 15."
 */

