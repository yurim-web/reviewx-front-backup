/* ========================================
   반려/신고 통계 차트 컴포넌트
   ======================================== */

/**
 * RejectionReportChart
 *
 * 목적: 반려·신고 통계를 라인 차트로 표시
 *
 * 사용 페이지:
 * - /manager_ga/dashboard (GA 대시보드)
 */

"use client";

import { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  eachDayOfInterval,
  format,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  parse,
} from "date-fns";
import styles from "@/styles/manager_ga/dashboard/charts.module.css";
import type { DateRange } from "../section/DateRangePickerModal";
import { useAdminRejections } from "@/hooks/manager/ga/useAdminRejections";
import { useAdminReports } from "@/hooks/manager/ga/useAdminReports";

// 차트 데이터 타입 정의
interface ChartData {
  date: string; // 날짜 (예: "11/1")
  rejection: number; // 반려 건수
  report: number; // 신고 건수
}

interface RejectionReportChartProps {
  dateRange: DateRange;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartData }>;
  coordinate?: { x: number; y: number };
}

// 커스텀 툴팁 - 형태/크로스헤어 유지, 툴팁 등장만 캠페인 모집 차트처럼 애니메이션 없음(coordinate 배치)
const CustomTooltip = ({ active, payload, coordinate }: ChartTooltipProps) => {
  if (!active || !payload?.length || !coordinate) return null;

  const rejection_value = payload[0].value ?? 0;
  const report_value = payload[1]?.value ?? 0;

  return (
    <div
      style={{
        position: "absolute",
        left: coordinate.x,
        top: coordinate.y,
        transform: "translate(-50%, -100%)",
        marginTop: "-8px",
        pointerEvents: "none",
      }}
    >
      <div className={styles.chart_tooltip}>
        <p className={styles.chart_tooltip_date}>{payload[0].payload.date}</p>
        <p className={styles.chart_tooltip_item}>반려 {rejection_value}건</p>
        <p className={styles.chart_tooltip_item_last}>신고 {report_value}건</p>
      </div>
    </div>
  );
};

export default function RejectionReportChart({ dateRange }: RejectionReportChartProps) {
  // React Query 훅으로 데이터 로드 (API 우선, 정적 데이터 fallback)
  const { rejections: rejected_list_data } = useAdminRejections();
  const { reports: reported_list_data } = useAdminReports();

  // 데이터 로딩 상태 관리
  const [is_loading, setIsLoading] = useState<boolean>(true);
  const [error_message, setErrorMessage] = useState<string | null>(null);
  const [chart_data, setChartData] = useState<ChartData[]>([]);
  const [y_axis_max, setYAxisMax] = useState<number>(4);

  // 날짜 범위에 따라 X축 틱을 생성하는 useMemo
  const x_axis_ticks = useMemo(() => {
    if (!dateRange.from || !dateRange.to) {
      return [];
    }

    // 날짜 범위의 일수 계산
    const days_count = differenceInDays(dateRange.to, dateRange.from) + 1;

    // 오늘(1일)을 선택했을 경우 이번 주 범위로 확장
    let chart_start_date: Date;
    let chart_end_date: Date;
    if (days_count === 1) {
      chart_start_date = startOfWeek(dateRange.from, { weekStartsOn: 0 });
      chart_end_date = endOfWeek(dateRange.from, { weekStartsOn: 0 });
    } else {
      chart_start_date = dateRange.from;
      chart_end_date = dateRange.to;
    }

    // 날짜 범위의 모든 날짜 생성
    const all_dates = eachDayOfInterval({
      start: chart_start_date,
      end: chart_end_date,
    });

    // X축 틱 생성 - 항상 3개만 표시 (시작일, 중간일, 종료일)
    // 예: 11/1~30이라면, 11/1 - 11/15 - 11/30
    const ticks: string[] = [];
    if (all_dates.length > 0) {
      // 시작일
      ticks.push(format(all_dates[0], "M/d"));

      // 중간일 (날짜 범위의 정중앙)
      if (all_dates.length > 2) {
        const middle_index = Math.floor(all_dates.length / 2);
        ticks.push(format(all_dates[middle_index], "M/d"));
      } else if (all_dates.length === 2) {
        // 날짜가 2개일 경우 중간일은 시작일과 동일하게 처리
        ticks.push(format(all_dates[0], "M/d"));
      }

      // 종료일
      if (all_dates.length > 1) {
        const last_date = format(all_dates[all_dates.length - 1], "M/d");
        // 중복 제거
        if (!ticks.includes(last_date)) {
          ticks.push(last_date);
        }
      }
    }

    return ticks;
  }, [dateRange]);

  // 데이터 로딩 (실제로는 API 호출)
  useEffect(() => {
    const load_data = async () => {
      if (!dateRange.from || !dateRange.to) {
        setChartData([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        // 날짜 범위의 일수 계산
        const days_count = differenceInDays(dateRange.to, dateRange.from) + 1;

        // 오늘(1일)을 선택했을 경우 이번 주 범위로 확장
        let chart_start_date: Date;
        let chart_end_date: Date;
        if (days_count === 1) {
          chart_start_date = startOfWeek(dateRange.from, { weekStartsOn: 0 });
          chart_end_date = endOfWeek(dateRange.from, { weekStartsOn: 0 });
        } else {
          chart_start_date = dateRange.from;
          chart_end_date = dateRange.to;
        }

        // 날짜 범위의 모든 날짜 생성
        const all_dates = eachDayOfInterval({
          start: chart_start_date,
          end: chart_end_date,
        });

        // 반려 내역과 신고 내역 데이터 (API 우선, 정적 fallback)
        const rejected_list = rejected_list_data;
        const reported_list = reported_list_data;

        // 날짜별로 반려/신고 건수 집계
        const data_map = new Map<string, { rejection: number; report: number }>();

        // 모든 날짜를 초기화 (0으로 시작)
        all_dates.forEach((date) => {
          const date_key = format(date, "M/d");
          data_map.set(date_key, { rejection: 0, report: 0 });
        });

        // 반려 내역 집계
        rejected_list.forEach((item) => {
          // processed_date 형식: "2026-02-01 14:23"
          const processed_date_str = item.processed_date.split(" ")[0]; // 날짜 부분만 추출
          const processed_date = parse(processed_date_str, "yyyy-MM-dd", new Date());
          // 시간 부분 제거하여 날짜만 비교
          processed_date.setHours(0, 0, 0, 0);

          // 날짜 범위 내에 있는지 확인 (시간 부분 제거)
          const start_date = new Date(chart_start_date);
          start_date.setHours(0, 0, 0, 0);
          const end_date = new Date(chart_end_date);
          end_date.setHours(23, 59, 59, 999);

          if (processed_date >= start_date && processed_date <= end_date) {
            const date_key = format(processed_date, "M/d");
            const current = data_map.get(date_key) || {
              rejection: 0,
              report: 0,
            };
            data_map.set(date_key, {
              ...current,
              rejection: current.rejection + (item.reject_count || 1),
            });
          }
        });

        // 신고 내역 집계
        // 신고내역 테이블에서는 항목 개수를 세는 방식이므로, report_count가 아닌 항목 개수로 집계
        reported_list.forEach((item) => {
          // processed_date 형식: "2026-02-01 18:56"
          const processed_date_str = item.processed_date.split(" ")[0]; // 날짜 부분만 추출
          const processed_date = parse(processed_date_str, "yyyy-MM-dd", new Date());
          // 시간 부분 제거하여 날짜만 비교
          processed_date.setHours(0, 0, 0, 0);

          // 날짜 범위 내에 있는지 확인 (시간 부분 제거)
          const start_date = new Date(chart_start_date);
          start_date.setHours(0, 0, 0, 0);
          const end_date = new Date(chart_end_date);
          end_date.setHours(23, 59, 59, 999);

          if (processed_date >= start_date && processed_date <= end_date) {
            const date_key = format(processed_date, "M/d");
            const current = data_map.get(date_key) || {
              rejection: 0,
              report: 0,
            };
            // 신고내역은 항목 개수로 집계 (테이블과 동일하게)
            data_map.set(date_key, {
              ...current,
              report: current.report + 1,
            });
          }
        });

        // Map을 배열로 변환하고 날짜 순으로 정렬
        const data: ChartData[] = all_dates.map((date) => {
          const date_key = format(date, "M/d");
          const counts = data_map.get(date_key) || { rejection: 0, report: 0 };
          return {
            date: date_key,
            rejection: counts.rejection,
            report: counts.report,
          };
        });

        // Y축 최대값 계산 (데이터의 최대값을 4의 배수로 올림, 최소 4)
        const max_rejection = Math.max(...data.map((d) => d.rejection), 0);
        const max_report = Math.max(...data.map((d) => d.report), 0);
        const max_value = Math.max(max_rejection, max_report);
        const y_max = Math.max(4, Math.ceil(max_value / 4) * 4);
        setYAxisMax(y_max);

        // 데이터가 없을 경우 에러 메시지 설정
        if (!data || data.length === 0) {
          setErrorMessage("데이터를 불러오지 못 했습니다.");
          setChartData([]);
        } else {
          setChartData(data);
        }
      } catch (_error) {
        setErrorMessage("데이터를 불러오지 못 했습니다.");
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    load_data();
  }, [dateRange, rejected_list_data, reported_list_data]);

  // 데이터가 없거나 에러가 발생한 경우 에러 메시지 표시
  if (error_message || (!is_loading && chart_data.length === 0)) {
    return (
      <div
        className={`${styles.chart_area} ${styles.chart_area_rejection_report}`}
        tabIndex={-1}
        onFocus={(e) => e.target.blur()}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999999",
          fontSize: "14px",
        }}
      >
        데이터를 불러오지 못 했습니다.
      </div>
    );
  }

  // 로딩 중일 때
  if (is_loading) {
    return (
      <div
        className={`${styles.chart_area} ${styles.chart_area_rejection_report}`}
        tabIndex={-1}
        onFocus={(e) => e.target.blur()}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999999",
          fontSize: "14px",
        }}
      >
        로딩 중...
      </div>
    );
  }

  return (
    <div
      className={`${styles.chart_area} ${styles.chart_area_rejection_report}`}
      tabIndex={-1} // 포커스 불가능하게 설정
      onFocus={(e) => e.target.blur()} // 포커스 시 즉시 블러 처리
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chart_data} margin={{ top: 20, right: 28, left: 12, bottom: 10 }}>
          {/* 그리드 라인 - 수평선만 표시 (Y축 구분선 5개, 일반 선) */}
          <CartesianGrid stroke="#F2F2F2" vertical={false} horizontal={true} />

          {/* X축 (날짜) - scale point + padding 0으로 그리드(12~344)와 선·축 끝 일치 */}
          <XAxis
            dataKey="date"
            scale="point"
            tick={{ fontSize: 12, fill: "#999999", dy: 10 }}
            tickLine={false}
            axisLine={false}
            ticks={x_axis_ticks}
            interval={0}
            angle={0}
            padding={{ left: 0, right: 0 }}
          />

          {/* Y축 (건수) - 동적으로 최대값 계산, 라벨은 숨김 */}
          <YAxis
            hide={true}
            domain={[0, y_axis_max]}
            ticks={Array.from({ length: y_axis_max / 4 + 1 }, (_, i) => i * 4)}
            allowDecimals={true}
          />

          {/* 범례 숨김 - 섹션 컴포넌트에서 커스텀 범례로 표시 */}
          <Legend wrapperStyle={{ display: "none" }} />

          {/* 툴팁 - 등장만 캠페인 모집 차트와 동일(애니메이션 없음), 형태/크로스헤어 유지 */}
          <Tooltip
            content={<CustomTooltip />}
            shared={true}
            filterNull={true}
            allowEscapeViewBox={{ x: true, y: true }}
            cursor={{
              stroke: "#d9d9d9",
              strokeWidth: 1,
              strokeDasharray: "8 8",
            }}
          />

          {/* 반려 라인 (오렌지색) - 로드 시 애니메이션 없음 */}
          <Line
            type="monotone"
            dataKey="rejection"
            name="반려"
            stroke="#FF6600"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: "#ffffff",
              stroke: "#FF6600",
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />

          {/* 신고 라인 (빨간색) - 로드 시 애니메이션 없음 */}
          <Line
            type="monotone"
            dataKey="report"
            name="신고"
            stroke="#FF2626"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: "#ffffff",
              stroke: "#FF2626",
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
