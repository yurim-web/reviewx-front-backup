/**
 * FileUploadAlert 컴포넌트 스토리북
 *
 * 파일 업로드 얼럿 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import FileUploadAlert from "./FileUploadAlert";

// 안정적인 래퍼 컴포넌트
const FileUploadAlertWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  if (!isOpen) return null;
  return <FileUploadAlert {...args} onClose={handleClose} />;
};

const meta: Meta<typeof FileUploadAlert> = {
  title: "Partner/Signup/FileUploadAlert",
  component: FileUploadAlert,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    message: {
      description: "에러 메시지",
      control: "text",
    },
    onClose: {
      description: "모달 닫기 핸들러 함수",
      action: "alert closed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FileUploadAlert>;

/**
 * 기본 얼럿
 *
 * 파일 업로드 에러 메시지를 표시하는 얼럿입니다.
 */
export const Default: Story = {
  render: FileUploadAlertWrapper,
  args: {
    message: "10mb 이하의 파일만 업로드할 수 있습니다.",
  },
};

/**
 * 파일 확장자 에러
 *
 * 파일 확장자 에러 메시지를 표시하는 얼럿입니다.
 */
export const FileExtensionError: Story = {
  render: FileUploadAlertWrapper,
  args: {
    message: "지정된 확장자(PDF, JPG, PNG)만\n업로드할 수 있습니다.",
  },
};
