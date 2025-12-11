/**
 * RangeCalendar 컴포넌트 스토리북
 * 
 * 스토리북(Storybook)이란?
 * - 컴포넌트를 독립적으로 개발하고 테스트할 수 있는 도구입니다
 * - 실제 앱을 실행하지 않고도 컴포넌트의 다양한 상태를 확인할 수 있습니다
 * - 각 "스토리(Story)"는 컴포넌트의 특정 상태나 사용 사례를 나타냅니다
 * 
 * 이 파일의 구조:
 * 1. Meta: 컴포넌트의 메타데이터 (제목, 컴포넌트, 태그 등)
 * 2. Story: 컴포넌트의 다양한 사용 사례를 보여주는 스토리들
 * 
 * 학습 포인트:
 * - useState: React Hook으로 컴포넌트의 상태를 관리합니다
 * - Storybook의 render 함수: 컴포넌트를 렌더링하는 함수입니다
 * - Date 객체: JavaScript의 날짜 객체입니다
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import RangeCalendar, { type DateRange } from "./RangeCalendar";

// ========================================
// Meta 설정
// ========================================

/**
 * Meta 객체: 스토리북에서 컴포넌트의 메타데이터를 정의합니다
 * 
 * - title: 스토리북 사이드바에 표시될 경로
 *   "Common/DateRangePicker/RangeCalendar" 형식으로 계층 구조를 만듭니다
 * 
 * - component: 스토리북에서 사용할 컴포넌트
 * 
 * - tags: ["autodocs"] - 자동으로 문서를 생성합니다
 */
const meta: Meta<typeof RangeCalendar> = {
  title: "Common/DateRangePicker/RangeCalendar",
  component: RangeCalendar,
  tags: ["autodocs"],
  // 스토리북에서 컴포넌트의 설명을 추가할 수 있습니다
  parameters: {
    docs: {
      description: {
        component:
          "날짜 범위를 선택할 수 있는 캘린더 컴포넌트입니다. Figma 디자인에 맞춘 스타일로 2개월을 동시에 표시하며, 시작일과 종료일을 선택할 수 있습니다.",
      },
    },
  },
};

export default meta;

// ========================================
// Story 타입 정의
// ========================================

/**
 * Story 타입: TypeScript에서 스토리의 타입을 정의합니다
 * StoryObj는 Storybook에서 제공하는 타입입니다
 */
type Story = StoryObj<typeof RangeCalendar>;

// ========================================
// 스토리 1: 기본 상태 (날짜 미선택)
// ========================================

/**
 * Default 스토리: 컴포넌트의 기본 상태를 보여줍니다
 * 
 * useState Hook 설명:
 * - useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
 * - [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
 * - selected_range: 현재 선택된 날짜 범위 (초기값: undefined)
 * - set_selected_range: 날짜 범위를 변경하는 함수
 * 
 * render 함수:
 * - 스토리북에서 컴포넌트를 렌더링하는 함수입니다
 * - 이 함수 내에서 useState를 사용하여 상태를 관리합니다
 * - on_select prop에 set_selected_range를 전달하여 날짜 선택 시 상태를 업데이트합니다
 */
export const Default: Story = {
  render: () => {
    // useState Hook: 컴포넌트의 상태를 관리합니다
    // [현재 값, 값을 변경하는 함수] = useState(초기값)
    const [selected_range, set_selected_range] = useState<
      DateRange | undefined
    >(undefined);

    return (
      <div style={{ padding: "20px" }}>
        {/* 
          선택된 날짜 범위를 표시하는 정보 영역
          조건부 렌더링: selected_range가 있을 때만 표시합니다
        */}
        {selected_range?.from && (
          <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#f5f5f5", borderRadius: "6px" }}>
            <strong>선택된 날짜 범위:</strong>
            <br />
            시작일: {selected_range.from.toLocaleDateString("ko-KR")}
            {selected_range.to && (
              <>
                <br />
                종료일: {selected_range.to.toLocaleDateString("ko-KR")}
              </>
            )}
          </div>
        )}

        {/* 
          RangeCalendar 컴포넌트
          props 설명:
          - selected: 현재 선택된 날짜 범위
          - on_select: 날짜를 선택했을 때 실행되는 함수 (set_selected_range를 전달)
          - number_of_months: 표시할 달의 개수 (기본값: 2)
          - show_outside_days: 이전/다음 달 날짜 표시 여부 (기본값: false)
        */}
        <RangeCalendar
          selected={selected_range}
          on_select={set_selected_range}
        />
      </div>
    );
  },
};

// ========================================
// 스토리 2: 날짜 범위가 선택된 상태
// ========================================

/**
 * WithSelectedRange 스토리: 이미 날짜 범위가 선택된 상태를 보여줍니다
 * 
 * new Date() 설명:
 * - JavaScript의 Date 객체를 생성합니다
 * - new Date(년, 월-1, 일) 형식으로 날짜를 지정할 수 있습니다
 * - 월은 0부터 시작하므로 1월은 0, 2월은 1입니다
 * 
 * 이 스토리는 컴포넌트가 선택된 날짜 범위를 올바르게 표시하는지 확인하기 위한 것입니다
 */
export const WithSelectedRange: Story = {
  render: () => {
    // 초기값으로 날짜 범위를 설정합니다
    // new Date(2024, 0, 15): 2024년 1월 15일
    // new Date(2024, 0, 25): 2024년 1월 25일
    const [selected_range, set_selected_range] = useState<DateRange | undefined>({
      from: new Date(2024, 0, 15), // 2024년 1월 15일
      to: new Date(2024, 0, 25), // 2024년 1월 25일
    });

    return (
      <div style={{ padding: "20px" }}>
        {selected_range?.from && (
          <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#f5f5f5", borderRadius: "6px" }}>
            <strong>선택된 날짜 범위:</strong>
            <br />
            시작일: {selected_range.from.toLocaleDateString("ko-KR")}
            {selected_range.to && (
              <>
                <br />
                종료일: {selected_range.to.toLocaleDateString("ko-KR")}
              </>
            )}
          </div>
        )}

        <RangeCalendar
          selected={selected_range}
          on_select={set_selected_range}
        />
      </div>
    );
  },
};

// ========================================
// 스토리 3: 1개월만 표시
// ========================================

/**
 * SingleMonth 스토리: 1개월만 표시하는 경우를 보여줍니다
 * 
 * number_of_months prop:
 * - 표시할 달의 개수를 지정합니다
 * - 기본값은 2이지만, 1로 설정하면 1개월만 표시됩니다
 */
export const SingleMonth: Story = {
  render: () => {
    const [selected_range, set_selected_range] = useState<
      DateRange | undefined
    >(undefined);

    return (
      <div style={{ padding: "20px" }}>
        {selected_range?.from && (
          <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#f5f5f5", borderRadius: "6px" }}>
            <strong>선택된 날짜 범위:</strong>
            <br />
            시작일: {selected_range.from.toLocaleDateString("ko-KR")}
            {selected_range.to && (
              <>
                <br />
                종료일: {selected_range.to.toLocaleDateString("ko-KR")}
              </>
            )}
          </div>
        )}

        {/* number_of_months={1}: 1개월만 표시 */}
        <RangeCalendar
          selected={selected_range}
          on_select={set_selected_range}
          number_of_months={1}
        />
      </div>
    );
  },
};

// ========================================
// 스토리 4: 이전/다음 달 날짜 표시
// ========================================

/**
 * WithOutsideDays 스토리: 이전/다음 달 날짜도 표시하는 경우를 보여줍니다
 * 
 * show_outside_days prop:
 * - true로 설정하면 현재 달이 아닌 이전/다음 달 날짜도 표시됩니다
 * - 기본값은 false입니다
 */
export const WithOutsideDays: Story = {
  render: () => {
    const [selected_range, set_selected_range] = useState<
      DateRange | undefined
    >(undefined);

    return (
      <div style={{ padding: "20px" }}>
        {selected_range?.from && (
          <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#f5f5f5", borderRadius: "6px" }}>
            <strong>선택된 날짜 범위:</strong>
            <br />
            시작일: {selected_range.from.toLocaleDateString("ko-KR")}
            {selected_range.to && (
              <>
                <br />
                종료일: {selected_range.to.toLocaleDateString("ko-KR")}
              </>
            )}
          </div>
        )}

        {/* show_outside_days={true}: 이전/다음 달 날짜도 표시 */}
        <RangeCalendar
          selected={selected_range}
          on_select={set_selected_range}
          show_outside_days={true}
        />
      </div>
    );
  },
};

// ========================================
// 스토리 5: 시작일만 선택된 상태
// ========================================

/**
 * WithStartDateOnly 스토리: 시작일만 선택되고 종료일은 아직 선택하지 않은 상태를 보여줍니다
 * 
 * 이 상태는 사용자가 첫 번째 날짜를 클릭했지만 아직 두 번째 날짜를 클릭하지 않은 경우입니다
 * RangeCalendar 컴포넌트는 이 상태를 지원하며, to가 undefined일 수 있습니다
 */
export const WithStartDateOnly: Story = {
  render: () => {
    // 시작일만 선택된 상태 (to는 undefined)
    const [selected_range, set_selected_range] = useState<DateRange | undefined>({
      from: new Date(2024, 0, 15), // 2024년 1월 15일
      to: undefined, // 종료일은 아직 선택하지 않음
    });

    return (
      <div style={{ padding: "20px" }}>
        {selected_range?.from && (
          <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#f5f5f5", borderRadius: "6px" }}>
            <strong>선택된 날짜 범위:</strong>
            <br />
            시작일: {selected_range.from.toLocaleDateString("ko-KR")}
            {selected_range.to ? (
              <>
                <br />
                종료일: {selected_range.to.toLocaleDateString("ko-KR")}
              </>
            ) : (
              <>
                <br />
                종료일: 아직 선택하지 않음
              </>
            )}
          </div>
        )}

        <RangeCalendar
          selected={selected_range}
          on_select={set_selected_range}
        />
      </div>
    );
  },
};


