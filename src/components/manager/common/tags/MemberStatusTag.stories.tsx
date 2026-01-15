/**
 * MemberStatusTag 컴포넌트 스토리북
 *
 * 회원 상태 태그 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import MemberStatusTag, {
  type MemberStatus,
} from "@/components/manager/common/tags/MemberStatusTag";

const meta: Meta<typeof MemberStatusTag> = {
  title: "Manager/Common/Tags/MemberStatusTag",
  component: MemberStatusTag,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    status: {
      description: "회원 상태",
      control: "select",
      options: ["정상", "일시 정지", "영구 정지", "탈퇴"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof MemberStatusTag>;

// 정상
export const Normal: Story = {
  args: {
    status: "정상",
  },
};

// 일시 정지
export const Suspended: Story = {
  args: {
    status: "일시 정지",
  },
};

// 영구 정지
export const Permanent: Story = {
  args: {
    status: "영구 정지",
  },
};

// 탈퇴
export const Withdrawn: Story = {
  args: {
    status: "탈퇴",
  },
};

// 모든 상태 태그 비교
export const AllStatuses: Story = {
  render: () => {
    const statuses: MemberStatus[] = ["정상", "일시 정지", "영구 정지", "탈퇴"];

    return React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          padding: "20px",
        },
      },
      ...statuses.map((status) =>
        React.createElement(MemberStatusTag, {
          key: status,
          status,
        })
      )
    );
  },
};

