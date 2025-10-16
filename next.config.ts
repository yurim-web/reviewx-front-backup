import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React 18의 Concurrent Features 안정화
  experimental: {
    // React 18의 새로운 렌더링 모드 안정화
    reactStrictMode: true,
  },
  // 개발 환경에서 더 안정적인 렌더링을 위한 설정
  swcMinify: true,
  // 컴파일러 최적화
  compiler: {
    // React DevTools와의 호환성 개선
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
