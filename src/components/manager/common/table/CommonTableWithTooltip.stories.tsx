/**
 * CommonTableWithTooltip 컴포넌트 스토리북
 *
 * 범용 테이블 컴포넌트(툴팁 기능 포함)의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import CommonTableWithTooltip, { type TooltipConfig } from "./CommonTableWithTooltip";
import type { TableColumn, TableRowData } from "./CommonTable";
import type { CommonTableWithTooltipProps } from "./CommonTableWithTooltip";

// Mock 데이터 타입 정의
interface MockData extends TableRowData {
  id: string;
  name: string;
  description: string;
  status: string;
}

// Mock 컬럼 정의
const mockColumns: TableColumn[] = [
  { key: "name", label: "이름" },
  { key: "description", label: "설명" },
  { key: "status", label: "상태" },
];

// Mock 데이터
const mockData: MockData[] = [
  {
    id: "1",
    name: "짧은 이름",
    description: "짧은 설명",
    status: "활성",
  },
  {
    id: "2",
    name: "매우 긴 이름입니다. 이 이름은 테이블 셀의 너비를 초과할 수 있습니다.",
    description: "매우 긴 설명입니다. 이 설명은 테이블 셀의 너비를 초과하여 툴팁이 표시되어야 합니다.",
    status: "비활성",
  },
];

// Mock 스타일
const mockStyles = {
  table: "table",
  table_header: "table-header",
  table_row: "table-row",
  table_cell: "table-cell",
  table_row_wrapper: "table-row-wrapper",
  tooltip_box: "tooltip-box",
  tooltip_text: "tooltip-text",
  campaign_name_text: "campaign-name-text",
};

// 제네릭 컴포넌트를 위한 래퍼 컴포넌트
const CommonTableWithTooltipWrapper = (props: CommonTableWithTooltipProps<MockData>) => {
  return <CommonTableWithTooltip<MockData> {...props} />;
};

const meta: Meta<typeof CommonTableWithTooltipWrapper> = {
  title: "Manager/Common/Table/CommonTableWithTooltip",
  component: CommonTableWithTooltipWrapper,
  tags: ["autodocs"],
  argTypes: {
    columns: {
      description: "테이블 컬럼 정의",
      control: "object",
    },
    data: {
      description: "테이블 데이터",
      control: "object",
    },
    tooltip_config: {
      description: "툴팁 설정",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CommonTableWithTooltipWrapper>;

/**
 * 기본 테이블 (툴팁 없음)
 *
 * 툴팁 기능이 없는 기본 테이블입니다.
 */
export const Default: Story = {
  args: {
    columns: mockColumns,
    data: mockData,
    styles: mockStyles,
    render_cell: (row, column) => {
      return <span>{String(row[column.key])}</span>;
    },
  },
};

/**
 * 툴팁이 있는 테이블
 *
 * 설명 컬럼에 툴팁이 표시되는 테이블입니다.
 */
export const WithTooltip: Story = {
  args: {
    columns: mockColumns,
    data: mockData,
    styles: mockStyles,
    tooltip_config: {
      column_key: "description",
    } as TooltipConfig,
    render_cell: (row, column) => {
      return <span>{String(row[column.key])}</span>;
    },
  },
};
