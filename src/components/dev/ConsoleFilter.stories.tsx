/**
 * ConsoleFilter 컴포넌트 스토리북
 *
 * 개발 환경에서 Next.js Fast Refresh/Turbopack 콘솔 로그를 필터링하는 유틸리티 컴포넌트입니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import ConsoleFilter from "./ConsoleFilter";

const meta: Meta<typeof ConsoleFilter> = {
  title: "Dev/ConsoleFilter",
  component: ConsoleFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: false,
    },
  },
  argTypes: {
    // 이 컴포넌트는 props가 없습니다
  },
};

export default meta;

type Story = StoryObj<typeof ConsoleFilter>;

/**
 * 기본 사용 예시
 *
 * 개발 환경에서 Next.js Fast Refresh/Turbopack 관련 콘솔 로그를 필터링합니다.
 * "결과보고서"가 포함된 메시지는 항상 통과시킵니다.
 *
 * 주의: 이 컴포넌트는 시각적으로 렌더링되는 요소가 없습니다 (null 반환).
 * 개발 환경에서만 동작하며, 프로덕션 환경에서는 아무 동작도 하지 않습니다.
 */
export const Default: Story = {
  render: () => {
    return (
      <div style={{ padding: "20px" }}>
        <ConsoleFilter />
        <p style={{ color: "#666", fontSize: "14px" }}>
          이 컴포넌트는 시각적으로 렌더링되는 요소가 없습니다.
          <br />
          개발 환경에서 콘솔 로그를 필터링하는 기능만 수행합니다.
        </p>
      </div>
    );
  },
};
