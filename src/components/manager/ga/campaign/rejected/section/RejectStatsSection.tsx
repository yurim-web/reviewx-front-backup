/* ========================================
   
   ======================================== */

/**
 * 반려 내역 통계 섹션 컴포넌트
 *
 * 목적: GA 관리자 반려내역 페이지의 반려 내역 통계 섹션을 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/rejected (반려내역 페이지)
 *
 */

"use client";

import { useMemo } from "react";
import styles from "@/styles/manager_ga/campaign/campaign_common.module.css";
import {
  rejected_campaign_list,
  type RejectedCampaignItem,
  type RejectCode,
} from "@/data/manager_ga/rejected";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";

interface RejectStatsSectionProps {
  // API 데이터 (제공 시 정적 데이터 대신 사용)
  rejections?: RejectedCampaignItem[];
  // 검색어 필터
  search_query: string;
  // 선택된 반려 코드 필터
  selected_reject_codes: RejectCode[];
  // 날짜 범위 필터
  selected_date_range?: DateRange | undefined;
}

// 모든 반려 코드 목록
const all_reject_codes: RejectCode[] = [
  "R001",
  "R002",
  "R003",
  "R004",
  "R005",
  "R006",
  "R007",
  "R008",
];

export default function RejectStatsSection({
  rejections,
  search_query,
  selected_reject_codes,
  selected_date_range,
}: RejectStatsSectionProps) {
  const source = rejections ?? rejected_campaign_list;
  // 숫자를 천 단위로 포맷팅하는 함수
  // 예: 19999 -> "19,999"
  const format_number = (num: number): string => {
    return num.toLocaleString("ko-KR");
  };

  // 필터링된 데이터를 기반으로 통계를 계산
  // useMemo: 의존성이 변경될 때만 재계산하여 성능을 최적화합니다
  const filtered_list = useMemo(() => {
    return source.filter((item) => {
      // 검색어 필터
      // includes(): 문자열이 다른 문자열에 포함되어 있는지 확인하는 메서드
      if (
        search_query &&
        !item.campaign_name.includes(search_query) &&
        !item.campaign_number.includes(search_query)
      ) {
        return false;
      }

      // 반려 코드 필터
      // selected_reject_codes가 비어있지 않고, 현재 항목의 반려 코드가 선택된 코드 목록에 없으면 제외
      if (selected_reject_codes.length > 0 && !selected_reject_codes.includes(item.reject_code)) {
        return false;
      }

      // 날짜 범위 필터
      // selected_date_range의 from과 to가 모두 있으면 날짜 범위로 필터링
      if (selected_date_range?.from && selected_date_range?.to) {
        // processed_date 형식: "2025-11-05 14:23"
        const processed_date_str = item.processed_date.split(" ")[0]; // 날짜 부분만 추출
        const processed_date = new Date(processed_date_str);
        const from_date = new Date(selected_date_range.from);
        const to_date = new Date(selected_date_range.to);
        to_date.setHours(23, 59, 59, 999); // 종료일의 끝 시간까지 포함

        // 날짜 비교 시 시간 부분을 제거하여 날짜만 비교
        processed_date.setHours(0, 0, 0, 0);
        from_date.setHours(0, 0, 0, 0);

        // 날짜가 범위 밖이면 제외
        if (processed_date < from_date || processed_date > to_date) {
          return false;
        }
      }

      return true;
    });
  }, [source, search_query, selected_reject_codes, selected_date_range]);

  // 반려 코드별 통계 계산
  // reduce(): 배열을 순회하며 누적값을 계산하는 메서드
  // 각 반려 코드별로 필터링된 목록에서 해당 코드를 가진 항목의 개수를 계산합니다
  const stats_by_code = useMemo(() => {
    const stats: Record<RejectCode, number> = {
      R001: 0,
      R002: 0,
      R003: 0,
      R004: 0,
      R005: 0,
      R006: 0,
      R007: 0,
      R008: 0,
    };

    // 필터링된 목록을 순회하며 각 반려 코드별로 개수를 집계
    filtered_list.forEach((item) => {
      stats[item.reject_code] = (stats[item.reject_code] || 0) + 1;
    });

    return stats;
  }, [filtered_list]);

  return (
    <div className={`${styles.section_box} ${styles.reject_stats_section}`}>
      <div className={styles.reject_stats_grid}>
        {/* 모든 반려 코드에 대해 통계를 동적으로 렌더링 */}
        {/* map 함수: 배열을 순회하며 각 요소를 JSX로 변환합니다 */}
        {all_reject_codes.map((code) => (
          <div key={code} className={styles.reject_stats_item}>
            <span className={styles.code}>{code}</span>
            <span className={styles.reject_stats_separator}>·</span>
            <span className={styles.text}>{format_number(stats_by_code[code])}회</span>
          </div>
        ))}
      </div>
    </div>
  );
}
