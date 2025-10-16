// 공통 레이아웃

// app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css";
import Header from "@/components/fragments/Header";

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

        {/* ✅ 개발 환경에서만 react-devtools standalone 연결 */}
        {process.env.NODE_ENV === "development" && (
          <script src="http://localhost:8097"></script>
        )}
      </head>

      {/* 실제 보이는 콘텐츠 영역 */}
      <body className="antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

