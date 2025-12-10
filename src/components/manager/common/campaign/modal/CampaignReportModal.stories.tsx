/**
 * CampaignReportModal 컴포넌트 스토리북
 *
 * 캠페인 신고/차단 모달 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignReportModal from "./CampaignReportModal";
import type { ReportCode, ReportCodeInfo } from "./CampaignReportModal";
import { report_code_info } from "@/data/manager_ga/reported";

// 실제 CSS 모듈 import
// Storybook에서는 CSS 모듈을 직접 import하여 사용합니다
import campaignReportModalStylesModule from "@/styles/manager_ga/campaign/common/modal/campaign_report_modal.module.css";

// CSS 모듈 객체를 타입 단언하여 사용
// readonly 속성을 제거하기 위해 Record 타입으로 캐스팅
const campaignReportModalStyles = (campaignReportModalStylesModule || {
  modal_overlay: "modal_overlay",
  modal_content: "modal_content",
  modal_title: "modal_title",
  options_list: "options_list",
  option_item: "option_item",
  option_radio: "option_radio",
  option_label: "option_label",
  modal_footer: "modal_footer",
  close_button: "close_button",
  report_button: "report_button",
  block_button: "block_button",
}) as Record<string, string> & {
  modal_overlay: string;
  modal_content: string;
  modal_title: string;
  options_list: string;
  option_item: string;
  option_radio: string;
  option_label: string;
  modal_footer: string;
  close_button: string;
  report_button: string;
  block_button: string;
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

// 차단 사유 옵션
const block_reason_options: string[] = [
  "부적절한 콘텐츠",
  "반복적인 위반",
  "사기 의심",
  "기타",
];

const meta: Meta<typeof CampaignReportModal> = {
  title: "Manager/Common/Campaign/Modal/CampaignReportModal",
  component: CampaignReportModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    is_open: {
      description: "모달 표시 여부",
      control: "boolean",
    },
    on_close: {
      description: "모달 닫기 핸들러",
      action: "modal closed",
    },
    campaign_id: {
      description: "캠페인 ID",
      control: "text",
    },
    mode: {
      description: "모달 모드 (report: 신고, block: 차단)",
      control: "select",
      options: ["report", "block"],
    },
    on_report: {
      description: "신고 처리 핸들러",
      action: "reported",
    },
    on_block: {
      description: "차단 처리 핸들러",
      action: "blocked",
    },
    report_code_info: {
      description: "신고 코드 정보 배열",
      control: false,
    },
    report_code_options: {
      description: "신고 코드 옵션 목록",
      control: false,
    },
    block_reason_options: {
      description: "차단 사유 옵션 목록",
      control: false,
    },
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignReportModal>;

// 신고 모드 - 모달이 열려있는 상태
export const ReportModeOpen: Story = {
  render: (args) => {
    return React.createElement(
      "div",
      {
        style: {
          width: "100vw",
          height: "100vh",
          position: "relative",
          margin: 0,
          padding: 0,
        },
      },
      React.createElement(CampaignReportModal, {
        ...args,
        mode: "report",
        is_open: args.is_open ?? true,
        campaign_id: args.campaign_id || "1",
        report_code_info: report_code_info,
        report_code_options: report_code_options,
        styles: campaignReportModalStyles,
        on_close: args.on_close || (() => console.log("Modal closed")),
        on_report: (reportCode) => {
          args.on_report?.(reportCode);
          console.log("Reported with code:", reportCode);
        },
      })
    );
  },
  args: {
    mode: "report",
    is_open: true,
    campaign_id: "1",
    on_close: () => console.log("Modal closed"),
    on_report: (reportCode) => console.log("Reported with code:", reportCode),
  },
};

// 차단 모드 - 모달이 열려있는 상태
export const BlockModeOpen: Story = {
  render: (args) => {
    return React.createElement(
      "div",
      {
        style: {
          width: "100vw",
          height: "100vh",
          position: "relative",
          margin: 0,
          padding: 0,
        },
      },
      React.createElement(CampaignReportModal, {
        ...args,
        mode: "block",
        is_open: args.is_open ?? true,
        campaign_id: args.campaign_id || "1",
        block_reason_options: block_reason_options,
        styles: campaignReportModalStyles,
        on_close: args.on_close || (() => console.log("Modal closed")),
        on_block: (blockReason) => {
          args.on_block?.(blockReason);
          console.log("Blocked with reason:", blockReason);
        },
      })
    );
  },
  args: {
    mode: "block",
    is_open: true,
    campaign_id: "1",
    on_close: () => console.log("Modal closed"),
    on_block: (blockReason) => console.log("Blocked with reason:", blockReason),
  },
};

// 신고 모드 - 인터랙티브 예시
export const ReportModeInteractive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return React.createElement(
      "div",
      { style: { padding: "20px" } },
      React.createElement(
        "button",
        {
          onClick: () => setIsOpen(true),
          style: {
            padding: "10px 20px",
            marginBottom: "20px",
            cursor: "pointer",
          },
        },
        "신고 모달 열기"
      ),
      React.createElement(CampaignReportModal, {
        ...args,
        mode: "report",
        is_open: isOpen,
        campaign_id: args.campaign_id || "1",
        report_code_info: report_code_info,
        report_code_options: report_code_options,
        styles: campaignReportModalStyles,
        on_close: () => {
          setIsOpen(false);
          args.on_close?.();
        },
        on_report: (reportCode) => {
          args.on_report?.(reportCode);
          console.log("Reported with code:", reportCode);
        },
      })
    );
  },
  args: {
    mode: "report",
    is_open: false,
    campaign_id: "1",
    on_close: () => console.log("Modal closed"),
    on_report: (reportCode) => console.log("Reported with code:", reportCode),
  },
};

// 차단 모드 - 인터랙티브 예시
export const BlockModeInteractive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return React.createElement(
      "div",
      { style: { padding: "20px" } },
      React.createElement(
        "button",
        {
          onClick: () => setIsOpen(true),
          style: {
            padding: "10px 20px",
            marginBottom: "20px",
            cursor: "pointer",
          },
        },
        "차단 모달 열기"
      ),
      React.createElement(CampaignReportModal, {
        ...args,
        mode: "block",
        is_open: isOpen,
        campaign_id: args.campaign_id || "1",
        block_reason_options: block_reason_options,
        styles: campaignReportModalStyles,
        on_close: () => {
          setIsOpen(false);
          args.on_close?.();
        },
        on_block: (blockReason) => {
          args.on_block?.(blockReason);
          console.log("Blocked with reason:", blockReason);
        },
      })
    );
  },
  args: {
    mode: "block",
    is_open: false,
    campaign_id: "1",
    on_close: () => console.log("Modal closed"),
    on_block: (blockReason) => console.log("Blocked with reason:", blockReason),
  },
};
