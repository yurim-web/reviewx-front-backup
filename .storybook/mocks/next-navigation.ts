/**
 * Next.js navigation 훅 모킹
 *
 * Storybook에서 Next.js의 usePathname, useRouter 등의 훅을 사용할 수 있도록 모킹합니다.
 *
 * 중요: Next.js 15의 useRouter는 내부적으로 App Router Context를 체크하므로,
 * 여기서는 완전히 독립적인 모킹 구현을 제공합니다.
 *
 * 이 파일은 webpack의 NormalModuleReplacementPlugin을 통해
 * 실제 next/navigation 모듈을 완전히 대체합니다.
 */

// 기본 경로 설정 (전역 변수로 관리)
let mockPathname = "/";

// 경로를 설정하는 함수 (스토리에서 사용)
export const setMockPathname = (path: string) => {
  mockPathname = path;
  // 전역 객체에도 저장하여 다른 곳에서 접근 가능하도록
  if (typeof global !== "undefined") {
    (global as any).__STORYBOOK_MOCK_PATHNAME__ = path;
  }
  if (typeof window !== "undefined") {
    (window as any).__STORYBOOK_MOCK_PATHNAME__ = path;
  }
};

// usePathname 훅 모킹
export function usePathname() {
  // 전역 객체에서 먼저 확인
  if (
    typeof window !== "undefined" &&
    (window as any).__STORYBOOK_MOCK_PATHNAME__
  ) {
    return (window as any).__STORYBOOK_MOCK_PATHNAME__;
  }
  if (
    typeof global !== "undefined" &&
    (global as any).__STORYBOOK_MOCK_PATHNAME__
  ) {
    return (global as any).__STORYBOOK_MOCK_PATHNAME__;
  }
  return mockPathname;
}

// Router 객체를 외부에서 생성하여 안정적인 참조 유지 (깜빡임 방지)
// 매번 새로운 객체를 생성하면 React가 리렌더링을 트리거할 수 있습니다
const mockRouter = {
  push: (href: string, options?: any) => {
    console.log("[Storybook] Navigate to:", href, options);
    setMockPathname(href);
    // Storybook에서는 실제 네비게이션이 없으므로 콘솔에만 로그
  },
  replace: (href: string, options?: any) => {
    console.log("[Storybook] Replace with:", href, options);
    setMockPathname(href);
  },
  back: () => {
    console.log("[Storybook] Go back");
  },
  refresh: () => {
    console.log("[Storybook] Refresh");
  },
  prefetch: (href: string, options?: any) => {
    console.log("[Storybook] Prefetch:", href, options);
    return Promise.resolve();
  },
  forward: () => {
    console.log("[Storybook] Forward");
  },
};

// useRouter 훅 모킹
// Next.js 15의 useRouter는 App Router Context를 필요로 하지만,
// Storybook에서는 단순한 모킹 객체를 반환합니다.
//
// 중요: Next.js 15의 useRouter는 내부적으로 AppRouterContext를 체크하므로,
// 이를 우회하기 위해 모킹 객체를 반환합니다.
//
// 참고: 실제 Next.js 15의 useRouter는 다음과 같은 구조를 가집니다:
// - AppRouterContext를 use() 훅으로 가져옴
// - Context가 없으면 "invariant expected app router to be mounted" 에러 발생
//
// Storybook에서는 Context가 없으므로, 모킹된 router 객체를 직접 반환합니다.
export function useRouter() {
  // React.use() 같은 내부 호출을 피하기 위해 직접 객체를 반환
  // Next.js 15는 내부적으로 use()를 사용하여 Context를 가져오므로,
  // Storybook에서는 이를 우회해야 합니다.
  // 외부에서 생성한 안정적인 router 객체를 반환하여 깜빡임 방지
  return mockRouter;
}

// 빈 URLSearchParams 객체를 재사용 (깜빡임 방지)
// 매번 새로운 객체를 생성하면 React가 리렌더링을 트리거할 수 있습니다
const emptySearchParams = new URLSearchParams();

// useSearchParams 훅 모킹
export function useSearchParams() {
  if (typeof window !== "undefined") {
    try {
      // window.location.search가 있으면 새로운 객체 생성 (필요한 경우)
      if (window.location.search) {
        return new URLSearchParams(window.location.search);
      }
    } catch {
      // 에러 발생 시 빈 객체 반환
      return emptySearchParams;
    }
  }
  // 기본적으로 빈 객체 반환 (재사용하여 안정적인 참조 유지)
  return emptySearchParams;
}

// 빈 객체와 배열을 상수로 정의하여 재사용 (깜빡임 방지)
// 매번 새로운 객체/배열을 생성하면 React가 리렌더링을 트리거할 수 있습니다
const emptyParams = {};
const emptySegments: string[] = [];

// useParams 훅 모킹 (필요한 경우)
export function useParams() {
  // 빈 객체를 재사용하여 안정적인 참조 유지
  return emptyParams;
}

// useSelectedLayoutSegment 훅 모킹
export function useSelectedLayoutSegment() {
  return null;
}

// useSelectedLayoutSegments 훅 모킹
export function useSelectedLayoutSegments() {
  // 빈 배열을 재사용하여 안정적인 참조 유지
  return emptySegments;
}
