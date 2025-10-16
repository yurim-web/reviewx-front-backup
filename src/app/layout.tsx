// 공통 레이아웃

import type { Metadata } from "next";
// 프리텐다드 폰트는 CDN으로 로드
import "../styles/globals.css";
import Header from "@/components/fragments/Header";

// 프리텐다드 폰트는 CSS에서 CDN으로 로드

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
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      {/* 실제 보이는 콘텐츠 영역! */}
      <body className="antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
