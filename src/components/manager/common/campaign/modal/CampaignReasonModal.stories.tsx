/**
 * CampaignReasonModal 컴포넌트 스토리북
 *
 * 캠페인 반려/신고 사유 모달 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import CampaignReasonModal from "./CampaignReasonModal";
import type { CodeInfo } from "./CampaignReasonModal";
import { reject_code_info } from "@/data/manager_ga/rejected";
import { report_code_info } from "@/data/manager_ga/reported";

// 반려 코드 정보를 CodeInfo 형식으로 변환
const mockRejectCodeInfoList: CodeInfo[] = reject_code_info.map((info) => ({
  code: info.code,
  category: info.category,
  reason: info.reason,
}));

// 신고 코드 정보를 CodeInfo 형식으로 변환
const mockReportCodeInfoList: CodeInfo[] = report_code_info.map((info) => ({
  code: info.code,
  category: info.category,
  reason: info.reason,
}));

const meta: Meta<typeof CampaignReasonModal> = {
  title: "Manager/Common/Campaign/Modal/CampaignReasonModal",
  component: CampaignReasonModal,
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
    mode: {
      description: "모달 모드 (reject: 반려, report: 신고)",
      control: "select",
      options: ["reject", "report"],
    },
    code: {
      description: "반려/신고 코드",
      control: "text",
    },
    reason_text: {
      description: "반려/신고 사유 텍스트",
      control: "text",
    },
    code_info_list: {
      description: "반려/신고 코드 정보 배열",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignReasonModal>;

// 반려 모드 - 모달이 열려있는 상태
export const RejectModeOpen: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
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
      React.createElement(CampaignReasonModal, {
        ...args,
        mode: "reject",
        is_open: isOpen,
        code: args.code || "R001",
        reason_text: args.reason_text || "구매 정보 불일치",
        code_info_list: mockRejectCodeInfoList,
        on_close: () => {
          setIsOpen(false);
          args.on_close?.();
        },
      })
    );
  },
  args: {
    mode: "reject",
    is_open: true,
    code: "R001",
    reason_text: "구매 정보 불일치",
    on_close: () => console.log("Modal closed"),
  },
};

// 신고 모드 - 모달이 열려있는 상태
export const ReportModeOpen: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
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
      React.createElement(CampaignReasonModal, {
        ...args,
        mode: "report",
        is_open: isOpen,
        code: args.code || "W001",
        reason_text: args.reason_text || "선정 후 취소",
        code_info_list: mockReportCodeInfoList,
        on_close: () => {
          setIsOpen(false);
          args.on_close?.();
        },
      })
    );
  },
  args: {
    mode: "report",
    is_open: true,
    code: "W001",
    reason_text: "선정 후 취소",
    on_close: () => console.log("Modal closed"),
  },
};

// 반려 모드 - 인터랙티브 예시
export const RejectModeInteractive: Story = {
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
        "반려 사유 모달 열기"
      ),
      React.createElement(CampaignReasonModal, {
        ...args,
        mode: "reject",
        is_open: isOpen,
        code: args.code || "R001",
        reason_text: args.reason_text || "구매 정보 불일치",
        code_info_list: mockRejectCodeInfoList,
        on_close: () => {
          setIsOpen(false);
          args.on_close?.();
        },
      })
    );
  },
  args: {
    mode: "reject",
    is_open: false,
    code: "R001",
    reason_text: "구매 정보 불일치",
    on_close: () => console.log("Modal closed"),
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
        "신고 사유 모달 열기"
      ),
      React.createElement(CampaignReasonModal, {
        ...args,
        mode: "report",
        is_open: isOpen,
        code: args.code || "W001",
        reason_text: args.reason_text || "선정 후 취소",
        code_info_list: mockReportCodeInfoList,
        on_close: () => {
          setIsOpen(false);
          args.on_close?.();
        },
      })
    );
  },
  args: {
    mode: "report",
    is_open: false,
    code: "W001",
    reason_text: "선정 후 취소",
    on_close: () => console.log("Modal closed"),
  },
};
