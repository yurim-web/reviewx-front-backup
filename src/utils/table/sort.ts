/* ========================================
   🛠️ 테이블 정렬 유틸리티 함수
   ======================================== */

/**
 * 테이블 정렬 관련 유틸리티 함수 모음
 *
 * 목적: 여러 테이블 컴포넌트에서 공통으로 사용하는 정렬 로직을 재사용 가능한 함수로 제공
 *
 * 사용 위치:
 * - src/components/manager/common/campaign/progress/table/CampaignTable.tsx
 * - src/components/manager/ga/campaign/rejected/section/RejectedCampaignTable.tsx
 * - 기타 정렬 기능이 필요한 테이블 컴포넌트들
 */

// 정렬 방향 타입 정의
export type SortDirection = "asc" | "desc" | null;

// 정렬 상태 타입 정의
export interface SortState {
  column_key: string | null;
  direction: SortDirection;
}

// 컬럼 타입 정의 (숫자, 문자열, 날짜 등)
export type ColumnType = "number" | "string" | "date" | "numeric_string";

// 컬럼별 타입 매핑 옵션
export interface SortColumnConfig {
  [column_key: string]: ColumnType;
}

/**
 * 두 값을 비교하는 함수
 *
 * @param a_value - 첫 번째 값
 * @param b_value - 두 번째 값
 * @param direction - 정렬 방향 ("asc" | "desc")
 * @param column_type - 컬럼 타입 ("number" | "string" | "date" | "numeric_string")
 * @returns 비교 결과 (-1, 0, 1)
 */
export function compare_values(
  a_value: unknown,
  b_value: unknown,
  direction: "asc" | "desc",
  column_type: ColumnType
): number {
  let a_parsed: number | string;
  let b_parsed: number | string;

  switch (column_type) {
    case "number":
      a_parsed = Number(a_value) || 0;
      b_parsed = Number(b_value) || 0;
      return direction === "asc" ? a_parsed - b_parsed : b_parsed - a_parsed;

    case "numeric_string":
      // 문자열 형식이지만 숫자 의미 (예: "000001", "1,500,000")
      // 쉼표를 제거한 후 숫자로 변환
      const a_cleaned = String(a_value || "").replace(/,/g, "");
      const b_cleaned = String(b_value || "").replace(/,/g, "");
      a_parsed = Number(a_cleaned) || 0;
      b_parsed = Number(b_cleaned) || 0;
      return direction === "asc" ? a_parsed - b_parsed : b_parsed - a_parsed;

    case "date":
      // 날짜 문자열 비교
      a_parsed = String(a_value || "");
      b_parsed = String(b_value || "");
      if (direction === "asc") {
        return a_parsed.localeCompare(b_parsed, "ko-KR");
      } else {
        return b_parsed.localeCompare(a_parsed, "ko-KR");
      }

    case "string":
    default:
      // 문자열 비교
      a_parsed = String(a_value || "");
      b_parsed = String(b_value || "");
      if (direction === "asc") {
        return a_parsed.localeCompare(b_parsed, "ko-KR");
      } else {
        return b_parsed.localeCompare(a_parsed, "ko-KR");
      }
  }
}

/**
 * 데이터 배열을 정렬하는 함수
 *
 * @param data - 정렬할 데이터 배열
 * @param sort_state - 정렬 상태
 * @param column_config - 컬럼별 타입 설정 (옵션)
 * @returns 정렬된 데이터 배열
 */
export function sort_table_data<T extends object>(
  data: T[],
  sort_state: SortState,
  column_config?: SortColumnConfig
): T[] {
  if (!sort_state.column_key || !sort_state.direction) {
    return data;
  }

  const sorted = [...data];
  const { column_key, direction } = sort_state;

  sorted.sort((a, b) => {
    const a_value = (a as Record<string, unknown>)[column_key];
    const b_value = (b as Record<string, unknown>)[column_key];

    // 컬럼 타입 확인
    let column_type: ColumnType = "string";
    if (column_config && column_config[column_key]) {
      column_type = column_config[column_key];
    } else {
      // 자동 타입 감지 (간단한 경우)
      if (typeof a_value === "number" || typeof b_value === "number") {
        column_type = "number";
      } else if (
        column_key.includes("count") ||
        column_key.includes("point") ||
        column_key.includes("number") ||
        column_key.includes("id")
      ) {
        // 숫자처럼 보이는 키워드가 포함된 경우
        column_type = "numeric_string";
      }
    }

    return compare_values(a_value, b_value, direction, column_type);
  });

  return sorted;
}

/**
 * 정렬 핸들러 함수 생성
 *
 * @param set_sort_state - 정렬 상태 업데이트 함수
 * @returns 정렬 핸들러 함수
 */
export function create_sort_handler(
  set_sort_state: (prev: SortState | ((prev: SortState) => SortState)) => void
) {
  return (column_key: string) => {
    set_sort_state((prev) => {
      // 같은 컬럼을 클릭하면: 내림차순 -> 오름차순 -> 내림차순 (토글)
      if (prev.column_key === column_key) {
        if (prev.direction === "desc") {
          // 내림차순에서 오름차순으로
          return { column_key, direction: "asc" };
        } else if (prev.direction === "asc") {
          // 오름차순에서 다시 내림차순으로
          return { column_key, direction: "desc" };
        } else {
          return { column_key, direction: "desc" };
        }
      } else {
        // 다른 컬럼을 클릭하면 내림차순으로 시작 (첫 클릭 시 내림차순으로 정렬)
        return { column_key, direction: "desc" };
      }
    });
  };
}

/**
 * 정렬 화살표의 transform 스타일 값을 계산하는 함수
 *
 * @param sort_state - 현재 정렬 상태
 * @param column_key - 컬럼 키
 * @returns CSS transform 값
 */
export function get_sort_arrow_transform(sort_state: SortState, column_key: string): string {
  const is_current_sorted = sort_state.column_key === column_key;
  const is_asc = sort_state.direction === "asc";

  if (is_current_sorted) {
    // 정렬 중인 경우 (아이콘 기본이 "위" 방향일 때)
    // 내림차순(최신순) = 위 화살표, 오름차순(등록순) = 아래 화살표로 통일
    if (is_asc) {
      // 오름차순(등록순): 아래 방향
      return "rotate(180deg)";
    } else {
      // 내림차순(최신순): 위 방향
      return "rotate(0deg)";
    }
  } else {
    return "rotate(0deg)";
  }
}

/**
 * 정렬 화살표의 alt 텍스트를 생성하는 함수
 *
 * @param sort_state - 현재 정렬 상태
 * @param column_key - 컬럼 키
 * @returns alt 텍스트
 */
export function get_sort_arrow_alt(sort_state: SortState, column_key: string): string {
  if (sort_state.column_key === column_key) {
    return sort_state.direction === "asc" ? "오름차순 정렬" : "내림차순 정렬";
  }
  return "정렬";
}
