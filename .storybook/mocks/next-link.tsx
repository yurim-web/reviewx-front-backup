/**
 * Next.js Link 컴포넌트 모킹
 * 
 * Storybook에서 Next.js의 Link 컴포넌트를 사용할 수 있도록 모킹합니다.
 * 실제 Link 대신 일반 <a> 태그를 반환합니다.
 * 
 * 중요: 이 파일은 webpack의 NormalModuleReplacementPlugin에 의해
 * next/link 모듈을 대체하는 데 사용됩니다.
 */

import React from "react";

interface LinkProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
  locale?: string;
  [key: string]: any;
}

/**
 * Storybook용 Link 컴포넌트
 * 
 * Next.js Link와 동일한 인터페이스를 제공하지만,
 * 실제로는 일반 <a> 태그를 렌더링합니다.
 * 
 * 최대한 단순하게 구현하여 webpack 모듈 로딩 오류를 방지합니다.
 */
function Link({ 
  href, 
  children, 
  className, 
  onClick,
  ...props 
}: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Storybook에서는 실제 네비게이션을 하지 않고 콘솔에만 로그를 남깁니다
    if (onClick) {
      onClick(e);
    } else {
      e.preventDefault();
      console.log("[Storybook] Link clicked:", href);
    }
  };

  return React.createElement(
    "a",
    {
      href: href || "#",
      className: className,
      onClick: handleClick,
      ...props,
    },
    children
  );
}

// default export로 내보내기 (Next.js Link와 동일한 방식)
export default Link;

