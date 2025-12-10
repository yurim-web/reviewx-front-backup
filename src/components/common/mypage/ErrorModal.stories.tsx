/**
 * ErrorModal 컴포넌트 스토리북
 *
 * 에러 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ErrorModal from "./ErrorModal";

const meta: Meta<typeof ErrorModal> = {
  title: "Common/MyPage/ErrorModal",
  component: ErrorModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    message: {
      description: "에러 메시지 (null이면 모달이 표시되지 않음)",
      control: "text",
    },
    onClose: {
      description: "모달 닫기 핸들러",
      action: "modal closed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorModal>;

// 기본 에러 메시지
export const Default: Story = {
  render: (args) => {
    const initialMessage = args.message || "에러가 발생했습니다.";
    const [message, setMessage] = React.useState<string | null>(initialMessage);

    // args가 변경될 때만 상태 업데이트 (깜빡임 방지)
    React.useEffect(() => {
      setMessage(args.message || "에러가 발생했습니다.");
    }, [args.message]);

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
      React.createElement(ErrorModal, {
        ...args,
        message,
        onClose: () => {
          setMessage(null);
          args.onClose?.();
        },
      })
    );
  },
  args: {
    message: "에러가 발생했습니다.",
    onClose: () => console.log("Modal closed"),
  },
};

// 파일 크기 초과 에러
export const FileSizeError: Story = {
  render: (args) => {
    const [message, setMessage] = React.useState<string | null>(
      args.message || "파일 크기가 10MB를 초과합니다."
    );

    React.useEffect(() => {
      setMessage(args.message || "파일 크기가 10MB를 초과합니다.");
    }, [args.message]);

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
      React.createElement(ErrorModal, {
        ...args,
        message,
        onClose: () => {
          setMessage(null);
          args.onClose?.();
        },
      })
    );
  },
  args: {
    message: "파일 크기가 10MB를 초과합니다.",
    onClose: () => console.log("Modal closed"),
  },
};

// 파일 형식 에러
export const FileTypeError: Story = {
  render: (args) => {
    const [message, setMessage] = React.useState<string | null>(
      args.message || "지원하지 않는 파일 형식입니다. (jpg, png, pdf만 가능)"
    );

    React.useEffect(() => {
      setMessage(
        args.message || "지원하지 않는 파일 형식입니다. (jpg, png, pdf만 가능)"
      );
    }, [args.message]);

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
      React.createElement(ErrorModal, {
        ...args,
        message,
        onClose: () => {
          setMessage(null);
          args.onClose?.();
        },
      })
    );
  },
  args: {
    message: "지원하지 않는 파일 형식입니다. (jpg, png, pdf만 가능)",
    onClose: () => console.log("Modal closed"),
  },
};

// 긴 에러 메시지
export const LongErrorMessage: Story = {
  render: (args) => {
    const [message, setMessage] = React.useState<string | null>(
      args.message ||
        "파일 업로드 중 문제가 발생했습니다. 파일 형식과 크기를 확인한 후 다시 시도해주세요."
    );

    React.useEffect(() => {
      setMessage(
        args.message ||
          "파일 업로드 중 문제가 발생했습니다. 파일 형식과 크기를 확인한 후 다시 시도해주세요."
      );
    }, [args.message]);

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
      React.createElement(ErrorModal, {
        ...args,
        message,
        onClose: () => {
          setMessage(null);
          args.onClose?.();
        },
      })
    );
  },
  args: {
    message:
      "파일 업로드 중 문제가 발생했습니다. 파일 형식과 크기를 확인한 후 다시 시도해주세요.",
    onClose: () => console.log("Modal closed"),
  },
};

// 모달이 닫혀있는 상태 (message가 null)
export const Hidden: Story = {
  render: (args) => {
    return React.createElement(
      "div",
      {
        style: {
          width: "100vw",
          height: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f2f2f2",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            padding: "20px",
            textAlign: "center",
            color: "#848484",
          },
        },
        "모달이 닫혀있는 상태입니다 (message가 null)."
      ),
      React.createElement(ErrorModal, {
        ...args,
        message: null,
        onClose: () => console.log("Modal closed"),
      })
    );
  },
  args: {
    message: null,
    onClose: () => console.log("Modal closed"),
  },
};
