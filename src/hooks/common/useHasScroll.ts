/* ========================================
   스크롤 유무 감지 훅
   ======================================== */

/**
 * 사용처:
 * - ModalFilter.tsx (카테고리/채널 필터 모달 - options_grid/options_vertical)
 * - RegionFilter.tsx (지역 필터 모달 - sub_regions_container)
 *
 * 요소에 스크롤이 생겼는지 감지합니다.
 * ResizeObserver를 사용해 크기 변경 시에도 재검사합니다.
 *
 * @param ref - 감지할 요소의 ref
 * @param enabled - 감지 활성화 여부 (모달 열림 시 true)
 * @param deps - 재검사 트리거 (옵션 변경 등)
 * @returns 스크롤이 있으면 true, 없으면 false
 */

"use client";

import { useEffect, useState } from "react";

export function useHasScroll<T extends HTMLElement | null>(
  ref: React.RefObject<T>,
  enabled = true,
  deps: unknown[] = [],
) {
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const el = ref.current;
    if (!el) return;

    const checkScroll = () => {
      setHasScroll(el.scrollHeight > el.clientHeight);
    };

    checkScroll();

    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ref, ...deps]);

  return hasScroll;
}
