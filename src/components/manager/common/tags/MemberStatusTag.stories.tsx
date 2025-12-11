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

// CSS 모듈 import
import tagsStylesModule from "@/styles/common/tags.module.css";

// CSS 모듈 객체를 타입 단언하여 사용
const tagsStyles = (tagsStylesModule || {
  status_tag: "status_tag",
  status_tag_normal: "status_tag_normal",
  status_tag_suspended: "status_tag_suspended",
  status_tag_permanent: "status_tag_permanent",
  status_tag_withdrawn: "status_tag_withdrawn",
}) as Record<string, string> & {
  status_tag: string;
  status_tag_normal: string;
  status_tag_suspended: string;
  status_tag_permanent: string;
  status_tag_withdrawn: string;
};

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
    styles: {
      description: "CSS 모듈 스타일 객체",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof MemberStatusTag>;

// 정상
export const Normal: Story = {
  args: {
    status: "정상",
    styles: tagsStyles,
  },
};

// 일시 정지
export const Suspended: Story = {
  args: {
    status: "일시 정지",
    styles: tagsStyles,
  },
};

// 영구 정지
export const Permanent: Story = {
  args: {
    status: "영구 정지",
    styles: tagsStyles,
  },
};

// 탈퇴
export const Withdrawn: Story = {
  args: {
    status: "탈퇴",
    styles: tagsStyles,
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
          styles: tagsStyles,
        })
      )
    );
  },
};

