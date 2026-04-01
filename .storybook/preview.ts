/**
 * Storybook Preview 설정
 *
 * 이 파일은 Storybook의 전역 설정을 담당합니다.
 * 모든 스토리에 공통으로 적용되는 설정을 여기에 작성합니다.
 */

import type { Preview } from "@storybook/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../src/contexts/AuthContext";

// 글로벌 CSS 파일 import
// Next.js 앱에서 사용하는 전역 스타일을 Storybook에서도 사용할 수 있도록 합니다
// Tailwind CSS와 기본 스타일이 포함되어 있습니다
import "../src/styles/globals.css";

// 스타일 객체를 외부로 분리하여 매번 새로 생성되지 않도록 함 (깜빡임 방지)
// React에서 객체 참조가 변경되면 리렌더링이 발생하므로, 상수로 정의합니다
const defaultWrapperStyle: React.CSSProperties = {
  padding: "20px",
  minHeight: "100vh",
};

// React Query 클라이언트 — Storybook 전역 공유 (retry 0: API 실패해도 에러 스피너 없이 바로 빈 상태)
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0, staleTime: Infinity } },
});

// 데코레이터 함수를 외부로 분리하여 안정적인 참조 유지 (깜빡임 방지)
// 함수를 상수로 정의하면 매번 새로운 함수가 생성되지 않습니다
const defaultDecorator = (Story: React.ComponentType) => {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(
      AuthProvider,
      null,
      React.createElement(
        "div",
        { style: defaultWrapperStyle },
        React.createElement(Story)
      )
    )
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Next.js 관련 설정
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/",
      },
    },
    // docs 페이지에서 에러 발생 시 처리
    docs: {
      source: {
        type: "dynamic",
      },
    },
    // 정적 파일 경로 설정
    // Storybook에서 /images/... 경로가 올바르게 작동하도록 설정
    backgrounds: {
      default: "light",
    },
  },
  // 모든 스토리에 적용되는 데코레이터
  // 외부에 정의한 함수를 사용하여 매번 새로운 함수가 생성되지 않도록 함
  decorators: [defaultDecorator],
};

export default preview;
