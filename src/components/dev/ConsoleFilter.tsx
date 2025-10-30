"use client";

import { useEffect } from "react";

/**
 * 개발 환경에서 Next.js Fast Refresh/Turbopack 콘솔 로그를 숨깁니다.
 * - 예: "[Fast Refresh] rebuilding", "report-hmr-latency", "turbopack-hot-reloader"
 * - "결과보고서"가 포함된 메시지는 항상 통과시킵니다.
 */
export default function ConsoleFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalLog = console.log;

    console.log = (...args: unknown[]) => {
      try {
        const first = args[0];
        const text = typeof first === "string" ? first : "";

        // 허용: 결과보고서 관련 로그는 무조건 출력
        if (text.includes("결과보고서")) {
          return originalLog(...args);
        }

        // 차단: Next.js HMR/Turbopack 노이즈 로그
        if (text.startsWith("[Fast Refresh]")) return;
        if (text.includes("report-hmr-latency")) return;
        if (text.includes("turbopack-hot-reloader")) return;

        return originalLog(...args);
      } catch {
        return originalLog(...args);
      }
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  return null;
}
