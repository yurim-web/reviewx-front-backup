/**
 * BusinessDocumentUpload 컴포넌트 스토리북
 *
 * 사업자등록증 업로드 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import BusinessDocumentUpload from "./BusinessDocumentUpload";

const meta: Meta<typeof BusinessDocumentUpload> = {
  title: "Partner/Mypage/BusinessDocumentUpload",
  component: BusinessDocumentUpload,
  tags: ["autodocs"],
  argTypes: {
    fileName: {
      description: "현재 업로드된 파일명",
      control: "text",
    },
    isUploaded: {
      description: "업로드 완료 여부",
      control: "boolean",
    },
    onFileSelect: {
      description: "파일 선택 핸들러",
      action: "file selected",
    },
  },
};

export default meta;

type Story = StoryObj<typeof BusinessDocumentUpload>;

/**
 * 기본 상태
 *
 * 파일이 업로드되지 않은 상태입니다.
 */
export const Default: Story = {
  args: {
    fileName: "",
    isUploaded: false,
    onFileSelect: (file) => {
      console.log("File selected:", file.name);
    },
  },
};

/**
 * 파일 업로드 완료 상태
 *
 * 파일이 업로드되고 검증이 완료된 상태입니다.
 */
export const Uploaded: Story = {
  args: {
    fileName: "사업자등록증.pdf",
    isUploaded: true,
    onFileSelect: (file) => {
      console.log("File selected:", file.name);
    },
  },
};
