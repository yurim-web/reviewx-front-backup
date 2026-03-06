import type { NextConfig } from "next";
import type { Configuration } from "webpack";

/** 빌드 시점마다 새로 설정 (새 빌드 시 클라이언트에서 localStorage 비우는 데 사용) */
const BUILD_ID = String(Date.now());

const nextConfig: NextConfig = {
  // React Strict Mode 활성화 (experimental 밖에 있어야 함)
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
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

  // 개발 환경 CSS source map 활성화 (Chrome DevTools에서 원본 .module.css 파일 표시)
  webpack: (
    config: Configuration,
    {
      dev,
      webpack,
    }: {
      dev: boolean;
      webpack: {
        SourceMapDevToolPlugin: new (options: Record<string, unknown>) => unknown;
      };
    }
  ) => {
    if (dev) {
      // 1) css-loader에 sourceMap: true 주입
      function applySourceMap(rules: unknown[]): void {
        for (const rule of rules) {
          if (!rule || typeof rule !== "object") continue;
          const r = rule as Record<string, unknown>;
          if (Array.isArray(r.oneOf)) applySourceMap(r.oneOf as unknown[]);
          if (Array.isArray(r.rules)) applySourceMap(r.rules as unknown[]);
          const useList = Array.isArray(r.use)
            ? (r.use as unknown[])
            : r.use
              ? [r.use]
              : [];
          for (const use of useList) {
            if (!use || typeof use !== "object") continue;
            const u = use as Record<string, unknown>;
            if (
              typeof u.loader === "string" &&
              u.loader.includes("css-loader/src/index") &&
              u.options &&
              typeof u.options === "object"
            ) {
              (u.options as Record<string, unknown>).sourceMap = true;
            }
          }
        }
      }
      applySourceMap(config.module?.rules as unknown[] ?? []);

      // 2) SourceMapDevToolPlugin으로 CSS .map 파일 생성
      //    devtool:false를 우회해서 CSS만 별도 source map 출력
      config.plugins = config.plugins ?? [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config.plugins.push(new webpack.SourceMapDevToolPlugin({
        test: /\.css(\?.*)?$/,
        filename: "[file].map",
        moduleFilenameTemplate: "[resource-path]",
        fallbackModuleFilenameTemplate: "[resource-path]?[hash]",
      }) as any);
    }
    return config;
  },
};

export default nextConfig;
