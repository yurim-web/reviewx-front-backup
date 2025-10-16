// 공통 레이아웃

// app/layout.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import "../styles/globals.css";
import Header from "@/components/fragments/Header";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "ReviewX | 리뷰 캠페인 플랫폼",
  description: "리뷰 캠페인 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard 폰트 (CDN) */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />

        {/* React DevTools는 브라우저 확장 프로그램으로 사용 */}
      </head>

      {/* 실제 보이는 콘텐츠 영역 */}
      <body className="antialiased">
        <Header />
        <main>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>
      </body>
    </html>
  );
}
