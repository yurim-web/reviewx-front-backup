import type { NextConfig } from "next";

/** 빌드 시점마다 새로 설정 (새 빌드 시 클라이언트에서 localStorage 비우는 데 사용) */
const BUILD_ID = String(Date.now());

const nextConfig: NextConfig = {
  // React Strict Mode 활성화 (experimental 밖에 있어야 함)
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },
  experimental: {
    // 실험적 기능은 여기에 추가
  },
  // 개발 환경에서 더 안정적인 렌더링을 위한 설정

  // 컴파일러 최적화
  compiler: {
    // React DevTools와의 호환성 개선
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
