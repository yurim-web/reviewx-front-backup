/**
 * Next.js Image 컴포넌트 모킹
 *
 * Storybook에서 Next.js의 Image 컴포넌트를 사용할 수 있도록 모킹합니다.
 * 실제 Image 최적화 대신 일반 img 태그를 반환합니다.
 *
 * 중요: Storybook에서 정적 파일은 staticDirs로 설정한 public 폴더에서 제공됩니다.
 * /images/... 경로는 public/images/... 파일을 가리킵니다.
 *
 * React.createElement를 사용하여 JSX 파싱 문제를 방지합니다.
 */

import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  [key: string]: any;
}

export default function Image({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  quality,
  ...props
}: ImageProps) {
  // src가 상대 경로로 시작하면 절대 경로로 변환
  // Storybook에서는 staticDirs로 설정한 public 폴더가 루트로 제공됨
  const imageSrc = src.startsWith("/")
    ? src // 이미 절대 경로면 그대로 사용
    : src.startsWith("./")
    ? src.replace("./", "/") // ./images/... -> /images/...
    : `/${src}`; // images/... -> /images/...

  // fill prop이 있으면 스타일을 조정
  if (fill) {
    return React.createElement("img", {
      src: imageSrc,
      alt: alt,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        ...(props.style || {}),
      },
      ...props,
    });
  }

  return React.createElement("img", {
    src: imageSrc,
    alt: alt,
    width: width,
    height: height,
    ...props,
  });
}
