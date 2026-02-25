/* ========================================
   🖱️ 드롭다운 외부 클릭 감지 커스텀 훅
   ======================================== */

/**
 * 드롭다운 외부 클릭 감지 커스텀 훅
 *
 * 목적: 드롭다운 영역 외부를 클릭했을 때 드롭다운을 닫는 기능
 *
 * 사용 위치:
 * - /partner/point/charge
 */

import { RefObject, useEffect } from "react";

/**
 * 드롭다운 외부 클릭 감지 훅
 *
 * @param refs - 감지할 요소들의 ref 배열
 * @param handler - 외부 클릭 시 실행할 핸들러
 */
export function useOutsideClick(
  refs: Array<RefObject<HTMLElement | null> | null>,
  handler: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // 모든 ref를 확인하여 클릭이 외부에서 발생했는지 체크
      const isOutside = refs.every((ref) => ref && ref.current && !ref.current.contains(target));

      if (isOutside) {
        handler();
      }
    };

    // 클릭 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, handler]);
}
