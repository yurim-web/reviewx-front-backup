import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  // 정적 파일 디렉토리 설정
  // public 폴더의 이미지와 기타 정적 파일을 Storybook에서 접근할 수 있도록 합니다
  // staticDirs로 설정한 폴더의 내용은 Storybook의 루트 경로(/)에서 제공됩니다
  // 예: public/images/main_banner.png -> /images/main_banner.png
  // 중요: Storybook을 재시작하면 정적 파일 변경사항이 반영됩니다
  staticDirs: ["../public"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-interactions",
    "@storybook/addon-designs",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {
      // React와 webpack5를 직접 사용하여 Next.js webpack 충돌 방지
      // SWC 컴파일러 사용 (TypeScript 지원)
      fastRefresh: true,
    },
  },
  docs: {
    autodocs: true,
  },
  // webpack 설정 - Next.js webpack 충돌을 완전히 우회
  webpackFinal: async (config) => {
    const path = require("path");
    const webpack = require("webpack");
    const CopyWebpackPlugin = require("copy-webpack-plugin");

    // CSS 로더 설정을 가장 먼저 수행
    // Storybook의 기본 CSS 로더를 찾아서 url 옵션을 false로 설정
    if (config.module && config.module.rules) {
      // 모든 규칙을 평탄화하여 처리
      const flattenRules = (rules: any[]): any[] => {
        const result: any[] = [];
        rules.forEach((rule: any) => {
          if (!rule) return;
          result.push(rule);
          if (rule.oneOf && Array.isArray(rule.oneOf)) {
            result.push(...flattenRules(rule.oneOf));
          }
          if (rule.rules && Array.isArray(rule.rules)) {
            result.push(...flattenRules(rule.rules));
          }
        });
        return result;
      };

      const allRules = flattenRules(config.module.rules);

      allRules.forEach((rule: any) => {
        if (!rule || !rule.test) return;

        const testStr = rule.test.toString();
        if (testStr.includes("css")) {
          // CSS 규칙을 찾음
          if (rule.use) {
            const useArray = Array.isArray(rule.use) ? rule.use : [rule.use];
            useArray.forEach((loader: any) => {
              if (typeof loader === "object") {
                const loaderPath = String(loader.loader || loader);
                if (loaderPath.includes("css-loader")) {
                  // CSS 로더를 찾았으므로 url 옵션을 false로 설정
                  loader.options = {
                    ...(loader.options || {}),
                    url: false,
                  };
                  console.log(
                    "[Storybook] CSS loader url disabled:",
                    loaderPath
                  );
                }
              }
            });
          }
        }
      });
    }

    // resolve 설정 - TypeScript 경로 별칭 지원
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // tsconfig.json의 paths 설정과 일치하도록 경로 별칭 설정
      "@": path.resolve(__dirname, "../src"),
      // Next.js 모듈 모킹 - Storybook에서 Next.js 컴포넌트를 사용할 수 있도록
      // alias를 먼저 설정하고, NormalModuleReplacementPlugin으로 보완
      // alias는 resolve 단계에서 먼저 적용되므로 더 우선순위가 높습니다
      // .js 파일을 사용하여 CommonJS 형식으로 더 안정적으로 동작
      "next/link": path.resolve(__dirname, "./mocks/next-link.js"),
      "next/navigation": path.resolve(__dirname, "./mocks/next-navigation.ts"),
      "next/image": path.resolve(__dirname, "./mocks/next-image.tsx"),
    };

    // alias가 제대로 작동하도록 resolve 순서 확인
    // extensions에 .tsx가 포함되어 있는지 확인
    if (
      !config.resolve.extensions ||
      !config.resolve.extensions.includes(".tsx")
    ) {
      config.resolve.extensions = [
        ...(config.resolve.extensions || []),
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
      ];
    }

    // CSS 파일 내의 절대 경로 이미지를 처리하기 위한 alias
    // /images/... 경로를 public/images/...로 매핑
    // 주의: 이 방법은 CSS 로더가 url()을 처리할 때 작동하지 않을 수 있으므로
    // CSS 로더의 url 옵션을 false로 설정하는 것이 더 확실합니다
    if (config.resolve.alias) {
      const publicImagesPath = path.resolve(__dirname, "../public/images");
      config.resolve.alias["/images"] = publicImagesPath;
    }

    // resolve extensions 명시적으로 설정
    config.resolve.extensions = [
      ...(config.resolve.extensions || []),
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".json",
    ];

    // NormalModuleReplacementPlugin을 사용하여 Next.js 모듈을 완전히 교체
    // 이 방법이 alias보다 우선순위가 높아서 실제 Next.js 모듈이 로드되지 않습니다
    config.plugins = config.plugins || [];

    // next/navigation을 여러 패턴으로 교체 (더 확실하게)
    // 모든 가능한 패턴을 커버하도록 설정
    // 경로를 절대 경로로 변환하여 webpack이 올바르게 찾을 수 있도록 함
    const mockNavigationPath = path.resolve(
      __dirname,
      "./mocks/next-navigation.ts"
    );
    // .js 파일을 우선적으로 사용 (CommonJS로 더 안정적)
    const mockLinkPath = path.resolve(__dirname, "./mocks/next-link.js");
    const mockImagePath = path.resolve(__dirname, "./mocks/next-image.tsx");

    // 디버깅: 모킹 파일 경로 확인
    console.log("[Storybook] Mock paths:", {
      navigation: mockNavigationPath,
      link: mockLinkPath,
      image: mockImagePath,
    });

    // next/link를 먼저 처리 - 여러 방법으로 시도
    // NormalModuleReplacementPlugin으로 교체
    config.plugins.push(
      // next/link 교체 - 정확한 매칭 우선
      new webpack.NormalModuleReplacementPlugin(/^next\/link$/, mockLinkPath),
      // next/link 교체 - 다른 패턴
      new webpack.NormalModuleReplacementPlugin(
        /next[\\\/]link$/,
        mockLinkPath
      ),
      // next/link.js 패턴
      new webpack.NormalModuleReplacementPlugin(
        /^next\/link\.js$/,
        mockLinkPath
      ),
      // next/navigation 교체 (여러 패턴으로 시도)
      new webpack.NormalModuleReplacementPlugin(
        /^next\/navigation$/,
        mockNavigationPath
      ),
      new webpack.NormalModuleReplacementPlugin(
        /next[\\\/]navigation/,
        mockNavigationPath
      ),
      // next/image 교체 - 더 강력한 패턴 추가
      new webpack.NormalModuleReplacementPlugin(/^next\/image$/, mockImagePath),
      new webpack.NormalModuleReplacementPlugin(
        /next[\\\/]image/,
        mockImagePath
      ),
      // next/image의 다양한 import 패턴 처리
      new webpack.NormalModuleReplacementPlugin(
        /^next\/image\.js$/,
        mockImagePath
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^next\/image\.tsx?$/,
        mockImagePath
      )
    );

    // Next.js의 내부 모듈을 무시하여 에러 방지
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/router$/,
        contextRegExp: /next\/dist/,
      })
    );

    // resolve.mainFields를 조정하여 alias 우선순위 높이기
    config.resolve.mainFields = ["browser", "module", "main"];

    // resolve.modules에 .storybook/mocks 추가하여 직접 찾을 수 있도록
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, "./mocks"),
    ];

    // public 폴더의 정적 파일을 Storybook 빌드 디렉토리로 복사
    // staticDirs가 작동하지 않는 경우를 대비하여 webpack으로 직접 복사
    // 이미지 파일들이 /images/... 경로로 접근 가능하도록 함
    const publicPath = path.resolve(__dirname, "../public");

    // CopyWebpackPlugin으로 public 폴더 복사
    // Storybook 개발 모드에서도 정적 파일을 제공하기 위해 설정
    // to를 상대 경로로 설정하여 output 디렉토리 기준으로 복사
    // Storybook은 이를 /images/... 경로로 제공함
    const outputDir = config.output?.path;
    if (outputDir) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: publicPath,
              to: outputDir,
              noErrorOnMissing: true,
              globOptions: {
                ignore: ["**/.DS_Store", "**/Thumbs.db"],
              },
            },
          ],
        })
      );
    } else {
      // output path가 없으면 상대 경로로 복사 시도
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: publicPath,
              to: "./",
              noErrorOnMissing: true,
              globOptions: {
                ignore: ["**/.DS_Store", "**/Thumbs.db"],
              },
            },
          ],
        })
      );
    }

    // resolve fallback 설정
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      path: false,
      stream: false,
    };

    // TypeScript 파일 확장자 명시적으로 추가
    config.resolve.extensions = [
      ...(config.resolve.extensions || []),
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
    ];

    // TypeScript 파일을 처리하는 로더 추가
    // Storybook이 자동으로 처리하지 못하는 경우를 대비
    if (config.module && config.module.rules) {
      // 기존 TypeScript 규칙 찾기
      const tsRuleIndex = config.module.rules.findIndex((rule: any) => {
        if (rule && rule.test) {
          const testStr = rule.test.toString();
          return testStr.includes("tsx?");
        }
        return false;
      });

      // TypeScript 규칙이 없거나 제대로 설정되지 않은 경우 추가
      // 배열의 앞에 추가하여 다른 로더보다 먼저 적용되도록 함
      if (tsRuleIndex === -1) {
        config.module.rules.unshift({
          test: /\.(ts|tsx)$/,
          // node_modules만 제외 (.storybook/mocks는 포함됨)
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: {
                presets: [
                  [require.resolve("@babel/preset-env"), { modules: false }],
                  [
                    require.resolve("@babel/preset-react"),
                    { runtime: "automatic" },
                  ],
                  require.resolve("@babel/preset-typescript"),
                ],
                // 캐시를 사용하여 빌드 속도 향상
                cacheDirectory: true,
              },
            },
          ],
        });
      }

      // CSS 모듈 및 일반 CSS 파일 처리는 Storybook이 자동으로 처리합니다
      // Storybook 8은 CSS 모듈을 기본적으로 지원합니다

      // CSS 파일 내의 url() 절대 경로를 처리하기 위한 설정
      // CSS 파일에서 /images/... 같은 절대 경로를 사용할 때 webpack이 이를 모듈로 해석하지 않도록 설정
      // 재귀적으로 모든 규칙을 탐색하여 css-loader를 찾고 수정합니다
      const findAndModifyCssLoader = (rules: any[]): void => {
        rules.forEach((rule: any) => {
          if (!rule) return;

          // 규칙에 use가 있는 경우
          if (rule.use) {
            const useArray = Array.isArray(rule.use) ? rule.use : [rule.use];
            useArray.forEach((loader: any, index: number) => {
              if (typeof loader === "object") {
                // css-loader를 찾아서 옵션 수정
                const loaderPath = loader.loader || loader;
                const loaderString = String(loaderPath);
                const isCssLoader =
                  loaderString.includes("css-loader") ||
                  loaderString.includes("css-loader/dist") ||
                  loaderString.includes("css-loader\\dist");

                if (isCssLoader) {
                  // 기존 옵션 가져오기
                  const existingOptions = loader.options || {};

                  // url 옵션을 false로 설정하여 모든 url() 처리를 비활성화
                  // 이렇게 하면 CSS의 url()이 그대로 유지되어 브라우저에서 정적 파일로 처리됨
                  // 절대 경로(/images/...)는 staticDirs로 제공되는 정적 파일로 처리됨
                  loader.options = {
                    ...existingOptions,
                    url: false, // 모든 url() 처리를 비활성화하여 절대 경로를 그대로 유지
                  };

                  // 디버깅을 위한 로그
                  console.log(
                    "[Storybook] CSS loader url option disabled for:",
                    loaderString
                  );
                }
              }
            });
          }

          // 규칙에 oneOf가 있는 경우 (중첩된 규칙)
          if (rule.oneOf && Array.isArray(rule.oneOf)) {
            findAndModifyCssLoader(rule.oneOf);
          }

          // 규칙에 rules가 있는 경우 (중첩된 규칙)
          if (rule.rules && Array.isArray(rule.rules)) {
            findAndModifyCssLoader(rule.rules);
          }
        });
      };

      if (config.module && config.module.rules) {
        findAndModifyCssLoader(config.module.rules);
      }

      // 추가 보험: 모든 CSS 규칙에 대해 url 옵션을 명시적으로 설정
      // Storybook의 기본 CSS 규칙을 직접 수정
      if (config.module && config.module.rules) {
        config.module.rules.forEach((rule: any) => {
          if (rule && rule.test && rule.test.toString().includes("css")) {
            if (rule.use) {
              const useArray = Array.isArray(rule.use) ? rule.use : [rule.use];
              useArray.forEach((loader: any) => {
                if (typeof loader === "object" && loader.loader) {
                  const loaderPath = String(loader.loader);
                  if (loaderPath.includes("css-loader")) {
                    loader.options = {
                      ...(loader.options || {}),
                      url: false,
                    };
                  }
                }
              });
            }
          }
        });
      }

      // 추가: webpack의 resolve.modules를 사용하여 절대 경로 처리
      // 하지만 이 방법은 CSS 로더가 url()을 처리할 때 작동하지 않을 수 있습니다
      config.resolve = config.resolve || {};
      config.resolve.modules = [
        ...(config.resolve.modules || []),
        path.resolve(__dirname, "../public"),
      ];
    }

    // 정적 파일(이미지 등)을 위한 설정
    // public 폴더의 파일들을 접근할 수 있도록 설정
    // Storybook은 이미 기본적으로 이미지를 처리하지만, 명시적으로 설정합니다
    if (config.module && config.module.rules) {
      // 기존 이미지 파일 규칙이 있는지 확인
      const hasImageRule = config.module.rules.some((rule: any) => {
        if (rule && rule.test) {
          const testStr = rule.test.toString();
          return (
            testStr.includes("png|jpe?g|gif|svg|ico|webp") ||
            testStr.includes("svg") ||
            testStr.includes("png")
          );
        }
        return false;
      });

      // 이미지 파일 규칙이 없으면 추가
      // SVG를 포함한 모든 이미지 파일을 asset/resource로 처리
      if (!hasImageRule) {
        config.module.rules.push({
          test: /\.(png|jpe?g|gif|svg|ico|webp)$/i,
          type: "asset/resource",
          generator: {
            filename: "static/media/[name].[hash:8][ext]",
          },
        });
      }
    }

    return config;
  },
  // TypeScript 설정
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;
