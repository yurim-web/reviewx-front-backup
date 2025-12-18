/**
 * EmptyApplicantsList 컴포넌트 스토리북
 *
 * 빈 신청자 목록 컴포넌트의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import EmptyApplicantsList from "./EmptyApplicantsList";

const meta: Meta<typeof EmptyApplicantsList> = {
  title: "Partner/CampaignApplication/EmptyApplicantsList",
  component: EmptyApplicantsList,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof EmptyApplicantsList>;

// 기본 빈 목록 상태
export const Default: Story = {
  render: () => React.createElement(EmptyApplicantsList),
};

