/**
 * ManagerPageTitle 컴포넌트 스토리북
 * 
 * 관리자 페이지 제목 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import ManagerPageTitle from "./ManagerPageTitle";

const meta: Meta<typeof ManagerPageTitle> = {
  title: "Manager/Common/Fragments/ManagerPageTitle",
  component: ManagerPageTitle,
  tags: ["autodocs"],
  argTypes: {
    title: {
      description: "페이지 제목 텍스트",
      control: "text",
    },
    no_padding: {
      description: "하단 여백 제거 여부",
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ManagerPageTitle>;

/**
 * 기본 페이지 제목
 * 
 * 일반적인 페이지 제목입니다.
 */
export const Default: Story = {
  args: {
    title: "캠페인 진행 현황",
  },
};

/**
 * 하단 여백 없는 제목
 * 
 * no_padding이 true인 경우입니다.
 */
export const NoPadding: Story = {
  args: {
    title: "대시보드",
    no_padding: true,
  },
};

/**
 * 다양한 페이지 제목 예시
 */
export const CampaignProgress: Story = {
  args: {
    title: "캠페인 진행 현황",
  },
};

export const MemberManagement: Story = {
  args: {
    title: "회원 관리",
  },
};

export const CommunityManagement: Story = {
  args: {
    title: "커뮤니티 관리",
  },
};
