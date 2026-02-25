/* ========================================
   ✅ 테이블 체크박스 선택 상태 관리 훅 (공통)
   ======================================== */

/**
 * useTableSelection
 *
 * 목적: 테이블의 체크박스 개별/전체 선택 상태를 관리하는 공통 훅
 *
 * 사용 위치:
 * - ReviewerTable (GA/SA 리뷰어 목록 테이블)
 * - PartnerTable (GA/SA 파트너 목록 테이블)
 */

import { useState } from "react";

export interface UseTableSelectionReturn {
  selected_ids: string[];
  handle_checkbox_toggle: (id: string) => void;
  handle_select_all: (all_ids: string[], is_all_selected: boolean) => void;
  reset_selection: () => void;
}

/**
 * 테이블 체크박스 선택 상태 관리 훅
 *
 * `is_all_selected`는 컴포넌트에서 파생값으로 계산:
 * `selected_ids.length === filtered_items.length && filtered_items.length > 0`
 */
export function useTableSelection(): UseTableSelectionReturn {
  const [selected_ids, set_selected_ids] = useState<string[]>([]);

  // 개별 체크박스 토글
  const handle_checkbox_toggle = (id: string) => {
    set_selected_ids((prev) => {
      if (prev.includes(id)) return prev.filter((item_id) => item_id !== id);
      return [...prev, id];
    });
  };

  // 전체 선택/해제 토글 (현재 전체 선택 여부를 인자로 받아 판단)
  const handle_select_all = (all_ids: string[], is_all_selected: boolean) => {
    if (is_all_selected) {
      set_selected_ids([]);
    } else {
      set_selected_ids(all_ids);
    }
  };

  // 선택 초기화
  const reset_selection = () => set_selected_ids([]);

  return {
    selected_ids,
    handle_checkbox_toggle,
    handle_select_all,
    reset_selection,
  };
}
