/* ========================================
   코드 필터 상태 훅
   ======================================== */

/**
 * useCodeFilterState
 *
 * 목적: 반려/신고 코드 필터 섹션의 공통 상태 로직(코드 선택·드롭다운·태그)을 제공합니다.
 *
 * 사용 위치:
 * - CampaignRejectedFilterSection (반려 코드 필터 섹션)
 * - CampaignReportedFilterSection (신고 코드 필터 섹션)
 */

import { useState, useEffect, useRef } from "react";
import type { FilterTag } from "@/components/manager/ga/common/filter/BaseFilterSection";

interface UseCodeFilterStateParams<TCode extends string> {
  selected_codes: TCode[];
  on_codes_change?: (codes: TCode[]) => void;
}

interface UseCodeFilterStateResult<TCode extends string> {
  local_selected_codes: TCode[];
  is_code_dropdown_open: boolean;
  filter_button_ref: React.RefObject<HTMLDivElement | null>;
  filter_tags: FilterTag<TCode>[];
  handle_code_filter_click: () => void;
  handle_dropdown_close: () => void;
  handle_code_apply: (codes: TCode[]) => void;
  handle_remove_code: (code: TCode) => void;
}

export function useCodeFilterState<TCode extends string>({
  selected_codes,
  on_codes_change,
}: UseCodeFilterStateParams<TCode>): UseCodeFilterStateResult<TCode> {
  const [local_selected_codes, set_local_selected_codes] = useState<TCode[]>(selected_codes);
  const [is_code_dropdown_open, set_is_code_dropdown_open] = useState<boolean>(false);
  const filter_button_ref = useRef<HTMLDivElement | null>(null);

  // 외부에서 selected_codes가 변경되면 내부 상태도 업데이트
  useEffect(() => {
    set_local_selected_codes(selected_codes);
  }, [selected_codes]);

  const handle_code_filter_click = () => {
    set_is_code_dropdown_open((prev) => !prev);
  };

  const handle_dropdown_close = () => {
    set_is_code_dropdown_open(false);
  };

  const handle_code_apply = (codes: TCode[]) => {
    set_local_selected_codes(codes);
    on_codes_change?.(codes);
  };

  const handle_remove_code = (code: TCode) => {
    const new_codes = local_selected_codes.filter((c) => c !== code);
    set_local_selected_codes(new_codes);
    on_codes_change?.(new_codes);
  };

  const filter_tags: FilterTag<TCode>[] = local_selected_codes.map((code) => ({
    value: code,
    label: code,
  }));

  return {
    local_selected_codes,
    is_code_dropdown_open,
    filter_button_ref,
    filter_tags,
    handle_code_filter_click,
    handle_dropdown_close,
    handle_code_apply,
    handle_remove_code,
  };
}
