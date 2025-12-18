/**
 * BusinessRegistrationUpload 컴포넌트 스토리북
 *
 * 사업자등록증 업로드 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import BusinessRegistrationUpload from "./BusinessRegistrationUpload";

const meta: Meta<typeof BusinessRegistrationUpload> = {
  title: "Partner/Signup/BusinessRegistrationUpload",
  component: BusinessRegistrationUpload,
  tags: ["autodocs"],
  argTypes: {
    fileName: {
      description: "업로드된 파일명",
      control: "text",
    },
    error: {
      description: "에러 메시지 (선택적)",
      control: "text",
    },
    onFileSelect: {
      description: "파일 선택 핸들러",
      action: "file selected",
    },
    onError: {
      description: "에러 핸들러",
      action: "error occurred",
    },
  },
};

export default meta;

type Story = StoryObj<typeof BusinessRegistrationUpload>;

/**
 * 기본 상태
 *
 * 파일이 선택되지 않은 상태입니다.
 */
export const Default: Story = {
  args: {
    fileName: null,
    onFileSelect: (file) => {
      console.log("File selected:", file?.name);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  },
};

/**
 * 파일이 선택된 상태
 *
 * 파일이 업로드된 상태입니다.
 */
export const WithFile: Story = {
  args: {
    fileName: "사업자등록증.pdf",
    onFileSelect: (file) => {
      console.log("File selected:", file?.name);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  },
};

/**
 * 에러 상태
 *
 * 에러 메시지가 표시되는 상태입니다.
 */
export const WithError: Story = {
  args: {
    fileName: null,
    error: "10mb 이하의 파일만 업로드할 수 있습니다.",
    onFileSelect: (file) => {
      console.log("File selected:", file?.name);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  },
};
