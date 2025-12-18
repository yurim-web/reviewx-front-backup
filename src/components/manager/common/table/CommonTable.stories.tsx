/**
 * CommonTable 컴포넌트 스토리북
 *
 * 범용 테이블 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CommonTable, {
  type TableColumn,
  type TableRowData,
} from "./CommonTable";

// 체크박스 셀 스타일 개선을 위한 CSS 추가
// blacklist_table.module.css의 table_cell_checkbox에는 padding이 없어서 Storybook에서 추가
// CSS 모듈 클래스명에 직접 스타일을 적용하기 위해 전역 스타일 추가
// Storybook이 브라우저 환경에서 실행될 때만 스타일 추가
if (typeof window !== "undefined" && typeof document !== "undefined") {
  try {
    const styleId = "common-table-checkbox-cell-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* 체크박스 셀에 padding 추가 - CSS 모듈 클래스명에 매칭 */
        [class*="table_cell_checkbox"] {
          padding: 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-sizing: border-box !important;
        }
      `;
      document.head.appendChild(style);
    }
  } catch (error) {
    // 에러 발생 시 무시 (SSR 환경 등)
    console.warn("Failed to add checkbox cell styles:", error);
  }
}

// 실제 CSS 모듈 import
// Storybook에서는 CSS 모듈을 직접 import하여 사용합니다
// CommonTable은 범용 컴포넌트이므로 progress_table.module.css를 예시로 사용합니다
// 실제 CSS 모듈 import
// Storybook에서는 CSS 모듈을 직접 import하여 사용합니다
// CommonTable은 범용 컴포넌트이므로 모든 필수 클래스를 포함하는 blacklist_table.module.css를 사용합니다
// (progress_table.module.css에는 table_body, table_container 등이 없어서 더 완전한 파일 사용)
import progressTableStylesModule from "@/styles/manager_ga/campaign/progress_table.module.css";
import blacklistTableStylesModule from "@/styles/manager_ga/member/blacklist/blacklist_table.module.css";

// 두 CSS 모듈을 병합하여 모든 필수 클래스를 포함
const progressTableStyles = (progressTableStylesModule || {}) as Record<
  string,
  string
>;
const blacklistTableStyles = (blacklistTableStylesModule || {}) as Record<
  string,
  string
>;

// CommonTable이 필요로 하는 모든 클래스명이 있는지 확인하고 병합
// progress_table.module.css에는 일부 클래스가 없을 수 있으므로 blacklist_table.module.css에서 보완
const commonTableStyles: Record<string, string> = {
  ...progressTableStyles, // progress_table 스타일을 기본으로
  ...blacklistTableStyles, // blacklist_table 스타일로 누락된 클래스 보완
  // 명시적으로 필요한 클래스들이 모두 있는지 확인
  table_container:
    progressTableStyles.table_container ||
    blacklistTableStyles.table_container ||
    progressTableStyles.table_section ||
    "table_container",
  table_section:
    progressTableStyles.table_section ||
    blacklistTableStyles.table_section ||
    "table_section",
  table_header:
    progressTableStyles.table_header ||
    blacklistTableStyles.table_header ||
    "table_header",
  table_row:
    progressTableStyles.table_row ||
    blacklistTableStyles.table_row ||
    "table_row",
  table_body:
    progressTableStyles.table_body ||
    blacklistTableStyles.table_body ||
    "table_body",
  table_cell:
    progressTableStyles.table_cell ||
    blacklistTableStyles.table_cell ||
    "table_cell",
  table_header_cell:
    progressTableStyles.table_header_cell ||
    blacklistTableStyles.table_header_cell ||
    "table_header_cell",
  // 체크박스 셀은 padding이 필요하므로 기본 스타일 포함
  table_cell_checkbox:
    progressTableStyles.table_cell_checkbox ||
    blacklistTableStyles.table_cell_checkbox ||
    "table_cell_checkbox",
  checkbox:
    progressTableStyles.checkbox || blacklistTableStyles.checkbox || "checkbox",
  empty_message:
    progressTableStyles.empty_message ||
    blacklistTableStyles.empty_message ||
    "empty_message",
  table_header_arrow:
    progressTableStyles.table_header_arrow ||
    blacklistTableStyles.table_header_arrow ||
    "table_header_arrow",
  sort_icon:
    progressTableStyles.sort_icon ||
    progressTableStyles.table_header_arrow ||
    blacklistTableStyles.sort_icon ||
    "sort_icon",
};

interface MockRowData extends TableRowData {
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  { key: "name", label: "이름", sortable: true },
  { key: "email", label: "이메일", sortable: true },
  { key: "role", label: "역할" },
  { key: "status", label: "상태" },
];

const mockData: MockRowData[] = [
  {
    id: "1",
    name: "홍길동",
    email: "hong@example.com",
    role: "관리자",
    status: "활성",
  },
  {
    id: "2",
    name: "김철수",
    email: "kim@example.com",
    role: "사용자",
    status: "활성",
  },
  {
    id: "3",
    name: "이영희",
    email: "lee@example.com",
    role: "사용자",
    status: "비활성",
  },
];

// render_cell 함수를 상수로 빼서 매번 새로 생성되지 않도록 함
const defaultRenderCell = (row: MockRowData, column: TableColumn) => {
  return React.createElement("div", null, String(row[column.key] || ""));
};

const meta: Meta<typeof CommonTable> = {
  title: "Manager/Common/Table/CommonTable",
  component: CommonTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "범용 테이블 컴포넌트입니다. 다양한 테이블 구조를 제공하는 재사용 가능한 컴포넌트입니다.",
      },
    },
  },
  argTypes: {
    columns: {
      description: "테이블 컬럼 정의",
      control: "object",
    },
    data: {
      description: "테이블 데이터 배열",
      control: "object",
    },
    render_cell: {
      description: "셀 렌더링 함수",
      control: false,
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
    enable_checkbox: {
      description: "체크박스 활성화 여부",
      control: "boolean",
    },
    empty_message: {
      description: "데이터 없을 때 메시지",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CommonTable<MockRowData>>;

// 기본 테이블
export const Default: Story = {
  render: (args) => {
    // props를 useMemo로 메모이제이션하여 불필요한 리렌더링 방지
    const tableProps = React.useMemo(
      () => ({
        columns: args.columns || columns,
        data: args.data || mockData,
        render_cell: args.render_cell || defaultRenderCell,
        styles: args.styles || commonTableStyles,
        enable_checkbox: args.enable_checkbox ?? false,
        empty_message: args.empty_message || "데이터가 없습니다.",
      }),
      [
        args.columns,
        args.data,
        args.render_cell,
        args.styles,
        args.enable_checkbox,
        args.empty_message,
      ]
    );

    return React.createElement(CommonTable<MockRowData>, tableProps);
  },
  args: {
    columns,
    data: mockData,
    render_cell: defaultRenderCell,
    styles: commonTableStyles,
    enable_checkbox: false,
    empty_message: "데이터가 없습니다.",
  },
};

// 체크박스 활성화
export const WithCheckbox: Story = {
  render: (args) => {
    // useState 초기값을 빈 배열로 고정 (깜빡임 방지)
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    // 핸들러를 useCallback으로 메모이제이션
    const handleSelectChange = React.useCallback(
      (ids: string[]) => {
        setSelectedIds(ids);
        args.on_select_change?.(ids);
      },
      [args.on_select_change]
    );

    const handleSelectAll = React.useCallback(
      (isAll: boolean) => {
        args.on_select_all?.(isAll);
      },
      [args.on_select_all]
    );

    // props를 useMemo로 메모이제이션하여 불필요한 리렌더링 방지
    const tableProps = React.useMemo(
      () => ({
        columns: args.columns || columns,
        data: args.data || mockData,
        render_cell: args.render_cell || defaultRenderCell,
        styles: args.styles || commonTableStyles,
        enable_checkbox: args.enable_checkbox ?? true,
        empty_message: args.empty_message || "데이터가 없습니다.",
        selected_ids: selectedIds,
        on_select_change: handleSelectChange,
        on_select_all: handleSelectAll,
      }),
      [
        args.columns,
        args.data,
        args.render_cell,
        args.styles,
        args.enable_checkbox,
        args.empty_message,
        selectedIds,
        handleSelectChange,
        handleSelectAll,
      ]
    );

    return React.createElement(CommonTable<MockRowData>, tableProps);
  },
  args: {
    columns,
    data: mockData,
    render_cell: defaultRenderCell,
    styles: commonTableStyles,
    enable_checkbox: true,
    empty_message: "데이터가 없습니다.",
    selected_ids: [],
    on_select_change: (ids) => console.log("Selected IDs:", ids),
    on_select_all: (isAll) => console.log("All selected:", isAll),
  },
};

// 빈 데이터
export const Empty: Story = {
  render: (args) => {
    // props를 useMemo로 메모이제이션하여 불필요한 리렌더링 방지
    const tableProps = React.useMemo(
      () => ({
        columns: args.columns || columns,
        data: args.data || [],
        render_cell: args.render_cell || defaultRenderCell,
        styles: args.styles || commonTableStyles,
        enable_checkbox: args.enable_checkbox ?? false,
        empty_message: args.empty_message || "데이터가 없습니다.",
      }),
      [
        args.columns,
        args.data,
        args.render_cell,
        args.styles,
        args.enable_checkbox,
        args.empty_message,
      ]
    );

    return React.createElement(CommonTable<MockRowData>, tableProps);
  },
  args: {
    columns,
    data: [],
    render_cell: defaultRenderCell,
    styles: commonTableStyles,
    enable_checkbox: false,
    empty_message: "데이터가 없습니다.",
  },
};
