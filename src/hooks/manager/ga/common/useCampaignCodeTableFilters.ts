/* ========================================
   캠페인 코드 테이블 필터링 훅
   ======================================== */

/**
 * useCampaignCodeTableFilters
 *
 * 목적: 반려/신고 이력 테이블의 공통 필터링 로직(검색어·코드·날짜)과
 *       Hydration 체크 및 리렌더링 트리거를 제공합니다.
 *
 * 사용 위치:
 * - ReportedCampaignTable (신고 이력 테이블)
 * - RejectedCampaignTable (반려 이력 테이블)
 */

import { useState, useEffect, useMemo } from "react";
import { isDateInRange } from "@/utils/formatting/date";

interface DateRangeParam {
  from?: string;
  to?: string;
}

interface UseCampaignCodeTableFiltersParams<TItem, TCode extends string> {
  /** SSR 시 사용할 정적 데이터 */
  static_data: TItem[];
  /** 클라이언트에서 localStorage 포함 데이터를 가져오는 함수 */
  get_dynamic_data: () => TItem[];
  search_query: string;
  selected_codes: TCode[];
  selected_date_range: DateRangeParam | undefined;
  /** 검색어 매칭에 사용할 이름 반환 */
  get_name: (item: TItem) => string;
  /** 검색어 매칭에 사용할 번호 반환 */
  get_number: (item: TItem) => string;
  /** 코드 필터에 사용할 코드 반환 */
  get_code: (item: TItem) => TCode;
  /** 날짜 필터에 사용할 날짜 문자열 반환 */
  get_date: (item: TItem) => string;
}

interface UseCampaignCodeTableFiltersResult<TItem> {
  filtered_data: TItem[];
  trigger_update: () => void;
}

export function useCampaignCodeTableFilters<TItem, TCode extends string>({
  static_data,
  get_dynamic_data,
  search_query,
  selected_codes,
  selected_date_range,
  get_name,
  get_number,
  get_code,
  get_date,
}: UseCampaignCodeTableFiltersParams<TItem, TCode>): UseCampaignCodeTableFiltersResult<TItem> {
  const [is_mounted, set_is_mounted] = useState<boolean>(false);
  const [update_key, set_update_key] = useState<number>(0);

  useEffect(() => {
    set_is_mounted(true);
  }, []);

  const trigger_update = () => {
    set_update_key((prev) => prev + 1);
  };

  const filtered_data = useMemo(() => {
    const source = is_mounted ? get_dynamic_data() : static_data;

    return source.filter((item) => {
      // 검색어 필터
      if (
        search_query &&
        !get_name(item).includes(search_query) &&
        !get_number(item).includes(search_query)
      ) {
        return false;
      }

      // 코드 필터
      if (selected_codes.length > 0 && !selected_codes.includes(get_code(item))) {
        return false;
      }

      // 날짜 범위 필터
      if (selected_date_range?.from && selected_date_range?.to) {
        if (
          !isDateInRange(
            get_date(item),
            new Date(selected_date_range.from),
            new Date(selected_date_range.to)
          )
        ) {
          return false;
        }
      }

      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search_query, selected_codes, selected_date_range, is_mounted, update_key]);

  return { filtered_data, trigger_update };
}
