/* ========================================
   
   ======================================== */

/**
 * 신고 내역 통계 섹션 컴포넌트
 *
 * 목적: GA 관리자 신고내역 페이지의 신고 내역 통계 섹션을 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/reported (신고내역 페이지)
 *
 */

"use client";

import { useMemo } from "react";
import styles from "@/styles/manager_ga/campaign/campaign_common.module.css";
import {
  reported_campaign_list,
  type ReportedCampaignItem,
  type ReportCode,
} from "@/data/manager_ga/reported";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";

interface ReportStatsSectionProps {
  // API 데이터 (제공 시 정적 데이터 대신 사용)
  reports?: ReportedCampaignItem[];
  // 검색어 필터
  search_query: string;
  // 선택된 신고 코드 필터
  selected_report_codes: ReportCode[];
  // 날짜 범위 필터
  selected_date_range?: DateRange | undefined;
}

// 모든 신고 코드 목록
const all_report_codes: ReportCode[] = [
  "W001",
  "W002",
  "W003",
  "W004",
  "W005",
  "W006",
  "W007",
  "W008",
  "W009",
  "W010",
  "W011",
  "W012",
  "W013",
];

export default function ReportStatsSection({
  reports,
  search_query,
  selected_report_codes,
  selected_date_range,
}: ReportStatsSectionProps) {
  const source = reports ?? reported_campaign_list;
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

      // 신고 코드 필터
      // selected_report_codes가 비어있지 않고, 현재 항목의 신고 코드가 선택된 코드 목록에 없으면 제외
      if (selected_report_codes.length > 0 && !selected_report_codes.includes(item.report_code)) {
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
  }, [source, search_query, selected_report_codes, selected_date_range]);

  // 신고 코드별 통계 계산
  // reduce(): 배열을 순회하며 누적값을 계산하는 메서드
  // 각 신고 코드별로 필터링된 목록에서 해당 코드를 가진 항목의 개수를 계산합니다
  const stats_by_code = useMemo(() => {
    const stats: Record<ReportCode, number> = {
      W001: 0,
      W002: 0,
      W003: 0,
      W004: 0,
      W005: 0,
      W006: 0,
      W007: 0,
      W008: 0,
      W009: 0,
      W010: 0,
      W011: 0,
      W012: 0,
      W013: 0,
    };

    // 필터링된 목록을 순회하며 각 신고 코드별로 개수를 집계
    filtered_list.forEach((item) => {
      stats[item.report_code] = (stats[item.report_code] || 0) + 1;
    });

    return stats;
  }, [filtered_list]);

  return (
    <div className={`${styles.section_box} ${styles.report_stats_section}`}>
      <div className={styles.report_stats_grid}>
        {/* 모든 신고 코드에 대해 통계를 동적으로 렌더링 */}
        {/* map 함수: 배열을 순회하며 각 요소를 JSX로 변환합니다 */}
        {all_report_codes.map((code) => (
          <div key={code} className={styles.report_stats_item}>
            <span className={styles.report_code}>{code}</span>
            <span className={styles.report_stats_separator}>·</span>
            <span className={styles.text}>{format_number(stats_by_code[code])}회</span>
          </div>
        ))}
      </div>
    </div>
  );
}
