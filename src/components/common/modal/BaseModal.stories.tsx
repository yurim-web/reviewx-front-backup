/**
 * BaseModal 컴포넌트 스토리북
 *
 * 통합 모달 컴포넌트의 다양한 사용 사례를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import BaseModal from "./BaseModal";

const meta: Meta<typeof BaseModal> = {
  title: "Common/Modal/BaseModal",
  component: BaseModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    is_open: {
      description: "모달 열림/닫힘 상태",
      control: "boolean",
    },
    message: {
      description: "모달에 표시할 메시지 텍스트",
      control: "text",
    },
    type: {
      description: "모달 형태",
      control: "select",
      options: ["center", "bottom"],
    },
    close_on_overlay_click: {
      description: "오버레이 클릭으로 닫기 여부",
      control: "boolean",
    },
    close_on_escape: {
      description: "ESC 키로 닫기 여부",
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof BaseModal>;

// 두 개 버튼 모달 (취소/확인)
export const TwoButtons: Story = {
  render: () => {
    const [is_open, setIsOpen] = useState(true);
    return (
      <BaseModal
        is_open={is_open}
        on_close={() => setIsOpen(false)}
        message="차단을 해제하시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={() => {
          console.log("확인 버튼 클릭");
          setIsOpen(false);
        }}
        type="center"
      />
    );
  },
};

// 하나 버튼 모달 (닫기)
export const SingleButton: Story = {
  render: () => {
    const [is_open, setIsOpen] = useState(true);
    return (
      <BaseModal
        is_open={is_open}
        on_close={() => setIsOpen(false)}
        message="접근 권한이 없습니다."
        type="center"
      />
    );
  },
};

// 변수 치환 예제
export const WithReplaceValues: Story = {
  render: () => {
    const [is_open, setIsOpen] = useState(true);
    return (
      <BaseModal
        is_open={is_open}
        on_close={() => setIsOpen(false)}
        message="콘텐츠 등록 기간이 3일 남았습니다. 콘텐츠를 등록해 주세요."
        type="center"
      />
    );
  },
};

// HTML 메시지 예제
export const WithHTMLMessage: Story = {
  render: () => {
    const [is_open, setIsOpen] = useState(true);
    return (
      <BaseModal
        is_open={is_open}
        on_close={() => setIsOpen(false)}
        message="캠페인을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        on_confirm={() => {
          console.log("확인 버튼 클릭");
          setIsOpen(false);
        }}
        type="center"
      />
    );
  },
};

// 오버레이 클릭 비활성화
export const DisableOverlayClick: Story = {
  render: () => {
    const [is_open, setIsOpen] = useState(true);
    return (
      <BaseModal
        is_open={is_open}
        on_close={() => setIsOpen(false)}
        message="차단을 해제하시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={() => {
          console.log("확인 버튼 클릭");
          setIsOpen(false);
        }}
        type="center"
        close_on_overlay_click={false}
      />
    );
  },
};

// ESC 키 비활성화
export const DisableEscapeKey: Story = {
  render: () => {
    const [is_open, setIsOpen] = useState(true);
    return (
      <BaseModal
        is_open={is_open}
        on_close={() => setIsOpen(false)}
        message="차단을 해제하시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={() => {
          console.log("확인 버튼 클릭");
          setIsOpen(false);
        }}
        type="center"
        close_on_escape={false}
      />
    );
  },
};
