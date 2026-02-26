/* ========================================
   가로 드래그 스크롤 훅
   ======================================== */

/**
 * useDragScroll
 *
 * 목적: 가로 스크롤 컨테이너에 마우스 드래그로 스크롤하는 기능을 추가합니다.
 *
 * 사용 페이지:
 * - /campaign (FilterBar 활성 필터 태그 영역)
 * - /partner/campaign_management (CampaignFilterBar 활성 필터 태그 영역)
 */

import { useState, useRef, useCallback } from "react";

interface UseDragScrollOptions {
  /** 클릭 시 드래그를 시작하지 않을 대상 CSS 선택자 (예: `.${styles.remove_tag}`) */
  skipSelector?: string;
}

interface UseDragScrollReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  handleDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * 가로 스크롤 컨테이너에 마우스 드래그 스크롤 기능을 추가하는 훅
 *
 * @example
 * ```tsx
 * const { containerRef, isDragging, handleDragStart } = useDragScroll({
 *   skipSelector: `.${styles.remove_tag}`,
 * });
 * <div ref={containerRef} onMouseDown={handleDragStart}>...</div>
 * ```
 */
export function useDragScroll({ skipSelector }: UseDragScrollOptions = {}): UseDragScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const dx = startXRef.current - e.clientX;
    containerRef.current.scrollLeft += dx;
    startXRef.current = e.clientX;
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, [handleDragMove]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (skipSelector && (e.target as HTMLElement).closest(skipSelector)) return;
      if (!containerRef.current) return;
      setIsDragging(true);
      startXRef.current = e.clientX;
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "pointer";
    },
    [handleDragMove, handleDragEnd, skipSelector]
  );

  return { containerRef, isDragging, handleDragStart };
}
