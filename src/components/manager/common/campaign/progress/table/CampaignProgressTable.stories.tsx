/**
 * CampaignProgressTable 컴포넌트 스토리북
 *
 * 캠페인 진행 현황 테이블 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignProgressTable, { CampaignProgressItem } from "./CampaignProgressTable";
import ManagerReportReasonModal from "../../modal/ManagerReportReasonModal";
import type { ReportCode } from "@/components/manager/common/campaign/modal/ManagerReportReasonModal";

// 실제 CSS 모듈 import
// Storybook에서는 CSS 모듈을 직접 import하여 사용합니다
import tableStylesModule from "@/styles/manager/common/campaign/progress/progress_table.module.css";
import tagStylesModule from "@/styles/common/tags.module.css";
import channelIconStylesModule from "@/styles/manager/common/campaign/progress/channel_icon.module.css";

// CSS 모듈 객체를 타입 단언하여 사용
// readonly 속성을 제거하기 위해 Record 타입으로 캐스팅
const tableStyles = (tableStylesModule || {
  table_container: "table_container",
  table_header: "table_header",
  table_row: "table_row",
  table_cell: "table_cell",
  table_header_cell: "table_header_cell",
  table_header_cell_report: "table_header_cell_report",
  campaign_link: "campaign_link",
  table_cell_link: "table_cell_link",
  table_cell_campaign_name: "table_cell_campaign_name",
  table_cell_report: "table_cell_report",
  report_button: "report_button",
  report_icon: "report_icon",
}) as Record<string, string>;

const tagStyles = (tagStylesModule || {
  type_tag: "type_tag",
  status_tag: "status_tag",
  status_tag_scheduled: "status_tag_scheduled",
  status_tag_applied: "status_tag_applied",
  status_tag_progress: "status_tag_progress",
  status_tag_ended: "status_tag_ended",
  status_tag_cancelled: "status_tag_cancelled",
  status_tag_urgent: "status_tag_urgent",
}) as Record<string, string> & { type_tag: string };

const channelIconStyles = (channelIconStylesModule || {
  channel_icon: "channel_icon",
  channel_icon_image: "channel_icon_image",
}) as Record<string, string> & {
  channel_icon: string;
  channel_icon_image: string;
};

// 신고 코드 옵션 (GA와 SA 모두 동일)
const report_code_options: ReportCode[] = [
  "W001", // 예정 취소
  "W002", // 지급 출출
  "W003", // 무단 탈퇴 · 차단
  "W004", // 출출 기간 불이행
  "W005", // 예정 신청 불이행
  "W006", // 게시 취소
  "W007", // 부적절한 캠페인 게시
  "W009", // 비정상적 신청 반복
  "W010", // 중복 계정 사용
  "W011", // 콘텐츠 중복 사용
  "W013", // 기타 비매너 위반
];

// ReportModal 컴포넌트 wrapper
const ReportModalWrapper = (props: {
  is_open: boolean;
  on_close: () => void;
  campaign_id?: string;
  on_report?: (report_code: string) => void;
}) => {
  return React.createElement(ManagerReportReasonModal, {
    ...props,
    report_code_options: report_code_options,
    on_report: (props.on_report as (report_code: ReportCode) => void) || (() => {}),
  });
};

const mockCampaigns: CampaignProgressItem[] = [
  {
    id: "1",
    campaign_number: "CP-2024-001",
    partner_name: "파트너 A",
    campaign_name: "샘플 캠페인 1",
    type: "배송형",
    channel: "Blog" as const,
    status: "진행" as const,
    recruit_count: 50,
    apply_count: 30,
    point: 5000,
    detail_campaign_id: "961",
  },
  {
    id: "2",
    campaign_number: "CP-2024-002",
    partner_name: "파트너 B",
    campaign_name: "샘플 캠페인 2",
    type: "방문형",
    channel: "Instagram" as const,
    status: "신청" as const,
    recruit_count: 30,
    apply_count: 15,
    point: 3000,
    detail_campaign_id: "1",
  },
];

const meta: Meta<typeof CampaignProgressTable> = {
  title: "Manager/Common/Campaign/Progress/CampaignProgressTable",
  component: CampaignProgressTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/manager_ga/campaign/progress",
      },
    },
  },
  argTypes: {
    campaign_list: {
      description: "캠페인 목록 데이터",
      control: "object",
    },
    base_path: {
      description: "상세 페이지 기본 경로",
      control: "text",
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
    tagStyles: {
      description: "태그 스타일 객체",
      control: false,
    },
    channelIconStyles: {
      description: "채널 아이콘 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignProgressTable>;

// 기본 캠페인 테이블
export const Default: Story = {
  render: (args) =>
    React.createElement(CampaignProgressTable, {
      ...args,
      ReportModal: ReportModalWrapper,
      tagStyles: tagStyles,
      channelIconStyles: channelIconStyles,
    }),
  args: {
    campaign_list: mockCampaigns,
    base_path: "/manager_ga/campaign/progress",
    styles: tableStyles,
    tagStyles: tagStyles,
    channelIconStyles: channelIconStyles,
  },
};

// 빈 테이블
export const Empty: Story = {
  render: (args) =>
    React.createElement(CampaignProgressTable, {
      ...args,
      ReportModal: ReportModalWrapper,
      tagStyles: tagStyles,
      channelIconStyles: channelIconStyles,
    }),
  args: {
    campaign_list: [],
    base_path: "/manager_ga/campaign/progress",
    styles: tableStyles,
    tagStyles: tagStyles,
    channelIconStyles: channelIconStyles,
  },
};

// 다양한 상태가 포함된 테이블
export const MixedStatuses: Story = {
  render: (args) =>
    React.createElement(CampaignProgressTable, {
      ...args,
      ReportModal: ReportModalWrapper,
      tagStyles: tagStyles,
      channelIconStyles: channelIconStyles,
    }),
  args: {
    campaign_list: [
      ...mockCampaigns,
      {
        id: "3",
        campaign_number: "CP-2024-003",
        partner_name: "파트너 C",
        campaign_name: "예정 캠페인",
        type: "방문형",
        channel: "Youtube" as const,
        status: "예정" as const,
        recruit_count: 20,
        apply_count: 0,
        point: 2000,
        detail_campaign_id: "3",
      },
      {
        id: "4",
        campaign_number: "CP-2024-004",
        partner_name: "파트너 D",
        campaign_name: "종료된 캠페인",
        type: "미션형",
        channel: "Instagram" as const,
        status: "종료" as const,
        recruit_count: 40,
        apply_count: 40,
        point: 4000,
        detail_campaign_id: "4",
      },
    ],
    base_path: "/manager_ga/campaign/progress",
    styles: tableStyles,
    tagStyles: tagStyles,
    channelIconStyles: channelIconStyles,
  },
};

// SA 관리자 경로
export const SAAdmin: Story = {
  render: (args) =>
    React.createElement(CampaignProgressTable, {
      ...args,
      ReportModal: ReportModalWrapper,
      tagStyles: tagStyles,
      channelIconStyles: channelIconStyles,
    }),
  args: {
    campaign_list: mockCampaigns,
    base_path: "/manager_sa/campaign/progress",
    styles: tableStyles,
    tagStyles: tagStyles,
    channelIconStyles: channelIconStyles,
  },
};
