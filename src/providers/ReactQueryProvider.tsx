/* ========================================
   React Query 클라이언트 프로바이더
   ======================================== */

/**
 * ReactQueryProvider
 *
 * 목적: @tanstack/react-query QueryClientProvider를 앱 전체에 제공
 *       Next.js App Router는 Server Component가 기본이므로
 *       "use client"로 분리해야 QueryClient 생성 가능
 *
 * 사용 위치:
 * - src/app/layout.tsx (루트 레이아웃에서 children 감싸기)
 */

"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
