/* ========================================
   🏠 루트 레이아웃 (Root Layout)
   ======================================== */

/**
 * Next.js App Router의 루트 레이아웃 컴포넌트
 *
 * 목적: 모든 페이지에 공통으로 적용되는 최상위 레이아웃
 *
 * 주요 기능:
 * - 전체 애플리케이션의 HTML 구조 정의
 * - 공통 메타데이터 설정 (title, description)
 * - Pretendard 폰트 로드
 * - 공통 Header 컴포넌트 렌더링
 * - 페이지별 children 컴포넌트 렌더링
 * - 로딩 상태 처리 (Suspense)
 *
 * 적용 범위:
 * - 모든 페이지 (/user/*, /partner/*, / 등)
 * - 각 페이지는 이 레이아웃을 기반으로 렌더링됨
 *
 * 사용 컴포넌트:
 * - ConditionalHeader: 경로에 따라 적절한 헤더를 표시하는 컴포넌트
 * - Loading: 페이지 로딩 중 표시되는 컴포넌트
 *
 * 참고사항:
 * - Next.js 13+ App Router 구조
 * - children prop으로 각 페이지 컴포넌트가 전달됨
 * - 파트너 경로(/partner/*) 또는 캠페인 경로(/campaign/*)에서는 파트너 헤더가 표시됨
 * - 일부 페이지(출금신청 등)에서는 Header를 숨김 처리함
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import "../styles/globals.css";
import ConditionalHeader from "@/components/fragments/ConditionalHeader";
import Loading from "./loading";
import ConsoleFilter from "@/components/dev/ConsoleFilter";
import { AuthProvider } from "@/contexts/AuthContext";

// 전체 애플리케이션의 메타데이터 설정
export const metadata: Metadata = {
  title: "ReviewX | 리뷰 캠페인 플랫폼",
  description: "리뷰 캠페인 플랫폼",
};

/**
 * 루트 레이아웃 컴포넌트
 * @param children - 각 페이지의 컴포넌트
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard 폰트 (CDN) - 한국어 웹폰트 */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>

      {/* 실제 보이는 콘텐츠 영역 */}
      <body className="antialiased">
        <AuthProvider>
          {/* 공통 상단 헤더 (경로에 따라 파트너 헤더 또는 일반 헤더 표시) */}
          <ConditionalHeader />
          {/* 개발환경 콘솔 노이즈 필터 */}
          <ConsoleFilter />

          {/* 메인 콘텐츠 영역 */}
          <main>
            {/* 페이지별 컴포넌트를 Suspense로 감싸서 로딩 처리 */}
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
