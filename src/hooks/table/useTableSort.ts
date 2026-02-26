/* ========================================
   🪝 테이블 정렬 커스텀 훅
   ======================================== */

/**
 * 테이블 정렬을 위한 커스텀 훅
 *
 * 목적: 테이블 컴포넌트에서 정렬 상태와 정렬된 데이터를 쉽게 관리할 수 있도록 제공
 *
 * 사용 위치:
 * - src/components/manager/common/campaign/progress/table/CampaignTable.tsx
 * - src/components/manager/ga/campaign/rejected/section/RejectedCampaignTable.tsx
 * - 기타 정렬 기능이 필요한 테이블 컴포넌트들
 */

import { useState, useMemo } from "react";
import {
  type SortState,
  type SortDirection,
  type SortColumnConfig,
  sort_table_data,
  create_sort_handler,
} from "@/utils/table/sort";

interface UseTableSortOptions<T> {
  /**
   * 정렬할 데이터 배열
   */
  data: T[];
  /**
   * 초기 정렬 컬럼 키
   */
  initial_column_key?: string;
  /**
   * 초기 정렬 방향 (기본값: "asc")
   */
  initial_direction?: SortDirection;
  /**
   * 컬럼별 타입 설정
   */
  column_config?: SortColumnConfig;
}

interface UseTableSortReturn<T> {
  /**
   * 정렬 상태
   */
  sort_state: SortState;
  /**
   * 정렬 핸들러 함수
   */
  handle_sort: (column_key: string) => void;
  /**
   * 정렬된 데이터
   */
  sorted_data: T[];
}

/**
 * 테이블 정렬을 관리하는 커스텀 훅
 *
 * @param options - 정렬 옵션
 * @returns 정렬 상태, 핸들러, 정렬된 데이터
 *
 * @example
 * ```tsx
 * const { sort_state, handle_sort, sorted_data } = useTableSort({
 *   data: campaign_list,
 *   initial_column_key: "campaign_number",
 *   initial_direction: "asc",
 *   column_config: {
 *     campaign_number: "numeric_string",
 *     apply_count: "number",
 *     campaign_name: "string",
 *   },
 * });
 * ```
 */
export function useTableSort<T extends object>({
  data,
  initial_column_key = undefined,
  initial_direction = "asc",
  column_config,
}: UseTableSortOptions<T>): UseTableSortReturn<T> {
  // 정렬 상태 관리
  const [sort_state, set_sort_state] = useState<SortState>({
    column_key: initial_column_key ?? null,
    direction: initial_direction,
  });

  // 정렬 핸들러 생성
  const handle_sort = useMemo(() => create_sort_handler(set_sort_state), []);

  // 정렬된 데이터 계산
  const sorted_data = useMemo(() => {
    return sort_table_data(data, sort_state, column_config);
  }, [data, sort_state, column_config]);

  return {
    sort_state,
    handle_sort,
    sorted_data,
  };
}
