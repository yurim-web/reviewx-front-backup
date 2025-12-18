/**
 * Next.js Link 컴포넌트 모킹
 *
 * Storybook에서 Next.js의 Link 컴포넌트를 사용할 수 있도록 모킹합니다.
 * .js 파일로 만들어서 webpack 모듈 해석 문제를 방지합니다.
 * ES6 모듈 형식으로 작성하여 React와 호환성을 보장합니다.
 */

import React from "react";

/**
 * Storybook용 Link 컴포넌트
 *
 * Next.js Link와 동일한 인터페이스를 제공하지만,
 * 실제로는 일반 <a> 태그를 렌더링합니다.
 */
function Link({ href, children, className, onClick, ...props }) {
  const handleClick = (e) => {
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
