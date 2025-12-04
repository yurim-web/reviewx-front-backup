/* ========================================
   📋 캠페인 테이블 컴포넌트 (공통)
   ======================================== */

/**
 * 캠페인 테이블 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 캠페인 테이블 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 *
 * 주요 기능:
 * - 캠페인 상세 페이지로 이동하는 링크
 * - 캠페인 정보 표시 (번호, 파트너명, 캠페인명, 유형, 채널, 상태, 모집 수, 신청 수, 지급 포인트)
 * - 신고 기능
 *
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { useTableSort } from "@/hooks/table/useTableSort";
import {
  get_sort_arrow_transform,
  get_sort_arrow_alt,
  type SortColumnConfig,
} from "@/utils/table/sort";
import CampaignStatusTag from "../tags/CampaignStatusTag";
import CampaignTypeTag from "../tags/CampaignTypeTag";
import ChannelIcon from "../icons/ChannelIcon";
import type { CampaignStatus } from "../tags/CampaignStatusTag";
import type { CampaignType } from "../tags/CampaignTypeTag";
import type { Channel } from "../icons/ChannelIcon";
import CommonTable, {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";

// 캠페인 진행 아이템 타입 정의
export interface CampaignProgressItem {
  id: string; // 캠페인 ID
  campaign_number: string; // 캠페인 번호
  partner_name: string; // 파트너명
  campaign_name: string; // 캠페인명
  type: CampaignType; // 캠페인 유형
  channel: Channel; // 채널
  status: CampaignStatus; // 상태
  recruit_count: number; // 모집 수
  apply_count: number; // 신청 수
  point: number; // 지급 포인트
  detail_campaign_id?: string; // 상세 페이지에서 사용할 공용 캠페인 ID (옵션)
}

// CampaignProgressItem이 TableRowData를 확장하도록 확장
interface CampaignTableRowData extends CampaignProgressItem, TableRowData {}

// 신고 모달 컴포넌트 타입 (props로 받음)
interface ReportModalComponent {
  is_open: boolean;
  on_close: () => void;
  campaign_id?: string;
  on_report?: (report_code: string) => void;
}

interface CampaignTableProps {
  campaign_list: CampaignProgressItem[]; // 캠페인 목록 데이터
  base_path: string; // 상세 페이지 기본 경로 (예: '/manager_ga/campaign/progress' 또는 '/manager_sa/campaign/progress')
  ReportModal: React.ComponentType<ReportModalComponent>; // 신고 모달 컴포넌트
  styles: Record<string, string>; // CSS 모듈 스타일 객체 (유연한 타입)
  tagStyles: Record<string, string> & { type_tag: string }; // 태그 스타일 객체 (type_tag 포함)
  channelIconStyles: Record<string, string> & {
    channel_icon: string;
    channel_icon_image: string;
  }; // 채널 아이콘 스타일 객체 (channel_icon, channel_icon_image 포함)
}

// 캠페인 타입별 상세 페이지 경로 매핑
const campaign_detail_map: Record<
  CampaignType,
  { slug: string; sample_id: string }
> = {
  배송형: { slug: "delivery", sample_id: "961" },
  방문형: { slug: "visit", sample_id: "1" },
  구매평: { slug: "review", sample_id: "18" },
  기자단: { slug: "reporter", sample_id: "201" },
  미션형: { slug: "mission", sample_id: "16" },
};

// 컬럼 정의
const get_columns = (styles: Record<string, string>): TableColumn[] => [
  {
    key: "campaign_number",
    label: "캠페인 번호",
    sortable: true,
  },
  {
    key: "partner_name",
    label: "파트너명",
  },
  {
    key: "campaign_name",
    label: "캠페인명",
    className: styles.table_cell_campaign_name,
  },
  {
    key: "status",
    label: "상태",
  },
  {
    key: "type",
    label: "유형",
  },
  {
    key: "channel",
    label: "채널",
  },
  {
    key: "apply_count",
    label: "신청 수",
    sortable: true,
  },
  {
    key: "recruit_count",
    label: "모집 수",
    sortable: true,
  },
  {
    key: "point",
    label: "지급 포인트",
    sortable: true,
  },
  {
    key: "report",
    label: "",
    className: styles.table_cell_report,
  },
];

export default function CampaignTable({
  campaign_list,
  base_path,
  ReportModal,
  styles: cssStyles,
  tagStyles,
  channelIconStyles,
}: CampaignTableProps) {
  const [hovered_row_id, set_hovered_row_id] = useState<string | null>(null);

  // 컬럼별 타입 설정
  const column_config: SortColumnConfig = {
    campaign_number: "numeric_string",
    apply_count: "number",
    recruit_count: "number",
    point: "number",
  };

  // 정렬 훅 사용
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_campaign_list,
  } = useTableSort({
    data: campaign_list,
    initial_column_key: "campaign_number",
    initial_direction: "asc",
    column_config,
  });

  const [report_modal_state, set_report_modal_state] = useState<{
    is_open: boolean;
    campaign_id: string | null;
  }>({
    is_open: false,
    campaign_id: null,
  });

  const handle_report_click = (campaign_id: string) => {
    set_report_modal_state({
      is_open: true,
      campaign_id,
    });
  };

  const handle_report_modal_close = () => {
    set_report_modal_state({
      is_open: false,
      campaign_id: null,
    });
  };

  const handle_report_submit = (report_code: string) => {
    handle_report_modal_close();
  };

  const format_number = (num: number): string => {
    return num.toLocaleString("ko-KR");
  };

  const get_detail_href = (campaign: CampaignProgressItem): string | null => {
    const detail_info = campaign_detail_map[campaign.type];
    if (!detail_info) {
      return null;
    }
    const detail_id =
      (campaign.detail_campaign_id &&
        String(campaign.detail_campaign_id).trim()) ||
      detail_info.sample_id;
    return `${base_path}/${detail_info.slug}/${detail_id}`;
  };

  const columns = get_columns(cssStyles);

  // 커스텀 헤더 렌더링 (신고 아이콘용 빈 셀 포함)
  const render_custom_header = () => {
    return (
      <div className={cssStyles.table_header}>
        {columns.map((column) => {
          if (column.key === "report") {
            return (
              <div
                key={column.key}
                className={cssStyles.table_header_cell_report}
              ></div>
            );
          }
          return (
            <div key={column.key} className={cssStyles.table_header_cell}>
              <span>{column.label}</span>
              {column.sortable && (
                <button
                  type="button"
                  onClick={() => handle_sort(column.key)}
                  className={cssStyles.table_header_sort_button}
                  aria-label={`${column.label} 정렬`}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/images/icons/table_arrow.svg"
                    alt={get_sort_arrow_alt(sort_state, column.key)}
                    className={cssStyles.table_header_arrow}
                    style={{
                      transform: get_sort_arrow_transform(
                        sort_state,
                        column.key
                      ),
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <CommonTable<CampaignTableRowData>
        columns={columns}
        data={sorted_campaign_list}
        render_cell={(row, column) => {
          switch (column.key) {
            case "campaign_number":
              return <span>{row.campaign_number}</span>;
            case "partner_name":
              return <span>{row.partner_name}</span>;
            case "campaign_name": {
              const detail_href = get_detail_href(row);
              return detail_href ? (
                <Link
                  href={detail_href}
                  className={cssStyles.table_cell_link}
                  aria-label={`캠페인 상세로 이동: ${row.campaign_name}`}
                >
                  {row.campaign_name}
                </Link>
              ) : (
                row.campaign_name
              );
            }
            case "status":
              return (
                <CampaignStatusTag status={row.status} styles={tagStyles} />
              );
            case "type":
              return <CampaignTypeTag type={row.type} styles={tagStyles} />;
            case "channel":
              return (
                <ChannelIcon channel={row.channel} styles={channelIconStyles} />
              );
            case "apply_count":
              return <span>{format_number(row.apply_count)}</span>;
            case "recruit_count":
              return <span>{format_number(row.recruit_count)}</span>;
            case "point":
              return <span>{format_number(row.point)}</span>;
            case "report": {
              const is_hovered = hovered_row_id === row.id;
              return is_hovered ? (
                <button
                  onClick={() => handle_report_click(row.id)}
                  className={cssStyles.report_button}
                  aria-label={`${row.campaign_name} 신고`}
                >
                  <img
                    src="/images/icons/table_report.svg"
                    alt="신고"
                    className={cssStyles.report_icon}
                  />
                </button>
              ) : null;
            }
            default:
              return null;
          }
        }}
        styles={cssStyles}
        enable_hover={true}
        on_row_hover={set_hovered_row_id}
        render_header={render_custom_header}
        container_class_name=""
        empty_message="캠페인이 없습니다."
      />
      <ReportModal
        is_open={report_modal_state.is_open}
        on_close={handle_report_modal_close}
        campaign_id={report_modal_state.campaign_id || undefined}
        on_report={handle_report_submit}
      />
    </>
  );
}
