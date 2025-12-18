/* ========================================
   📊 반려/신고 통계 차트 컴포넌트
   ======================================== */

/**
 * 반려/신고 통계 차트 컴포넌트
 *
 * 목적: 반려와 신고 통계를 라인 차트로 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * - 반려 건수 라인 차트 (오렌지색)
 * - 신고 건수 라인 차트 (빨간색)
 * - 날짜별 데이터 표시
 * - 툴팁으로 상세 정보 표시
 */

'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import styles from '@/styles/manager_ga/dashboard/charts.module.css';

// 차트 데이터 타입 정의
interface ChartData {
  date: string; // 날짜 (예: "11/1")
  rejection: number; // 반려 건수
  report: number; // 신고 건수
}

// 차트 데이터 (이미지 기반)
// 오렌지 라인 (반려): 11/1 중간 높이 → 11/4-11/5 낮은 지점 → 11/7 피크 (가장 높음) → 11/11 크게 하락
// 빨간 라인 (신고): 11/1 낮은 높이 → 11/3 피크 → 11/5 최저점 → 11/9 두 번째 피크 → 11/11 하락
const chart_data: ChartData[] = [
  { date: '11/1', rejection: 2, report: 1 }, // 반려: 중간 높이, 신고: 낮은 높이
  { date: '11/2', rejection: 2, report: 1.5 }, // 중간 값
  { date: '11/3', rejection: 1.5, report: 3 }, // 반려: 하락 시작, 신고: 첫 피크
  { date: '11/4', rejection: 1, report: 2 }, // 반려: 낮은 지점, 신고: 하락
  { date: '11/5', rejection: 0.5, report: 0.5 }, // 반려: 낮은 지점, 신고: 최저점
  { date: '11/6', rejection: 0.5, report: 1 }, // 신고: 상승 시작
  { date: '11/7', rejection: 4, report: 2 }, // 반려: 피크 (가장 높음), 신고: 중간
  { date: '11/8', rejection: 3, report: 2.5 }, // 반려: 하락, 신고: 상승
  { date: '11/9', rejection: 2, report: 3 }, // 반려: 하락, 신고: 두 번째 피크
  { date: '11/10', rejection: 1.5, report: 2 }, // 둘 다 하락
  { date: '11/11', rejection: 1, report: 1 }, // 낮은 값
];

// 커스텀 툴팁 컴포넌트
// Tooltip 컴포넌트에서 호출되는 함수형 컴포넌트
const CustomTooltip = ({ active, payload }: any) => {
  // active: 툴팁이 활성화되어 있는지 여부
  // payload: 차트 데이터 정보
  if (active && payload && payload.length) {
    return (
      <div className={styles.chart_tooltip}>
        {/* 날짜 표시 */}
        <p className={styles.chart_tooltip_date}>{payload[0].payload.date}</p>
        {/* 반려 건수 표시 */}
        <p className={styles.chart_tooltip_item}>반려 {payload[0].value}건</p>
        {/* 신고 건수 표시 */}
        <p className={styles.chart_tooltip_item_last}>
          신고 {payload[1].value}건
        </p>
      </div>
    );
  }
  return null;
};

export default function RejectionReportChart() {
  return (
    <div
      className={`${styles.chart_area} ${styles.chart_area_rejection_report}`}
      tabIndex={-1} // 포커스 불가능하게 설정
      onFocus={(e) => e.target.blur()} // 포커스 시 즉시 블러 처리
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chart_data}
          margin={{ top: 20, right: 12, left: 12, bottom: 10 }}
        >
          {/* 그리드 라인 - 수평선만 표시 (Y축 구분선 5개, 일반 선) */}
          <CartesianGrid stroke="#F2F2F2" vertical={false} horizontal={true} />

          {/* X축 (날짜) - 11/1, 11/6, 11/11만 표시 */}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#999999', dy: 10 }}
            tickLine={false}
            axisLine={false}
            ticks={['11/1', '11/6', '11/11']}
            interval={0}
            angle={0}
          />

          {/* Y축 (건수) - 5개 구분선 표시, 라벨은 숨김 */}
          <YAxis
            hide={true}
            domain={[0, 4]}
            ticks={[0, 1, 2, 3, 4]}
            allowDecimals={true}
          />

          {/* 범례 숨김 - 섹션 컴포넌트에서 커스텀 범례로 표시 */}
          <Legend wrapperStyle={{ display: 'none' }} />

          {/* 툴팁 */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: '#d9d9d9',
              strokeWidth: 1,
              strokeDasharray: '3 3',
            }}
          />

          {/* 반려 라인 (오렌지색) - 부드러운 곡선 */}
          <Line
            type="monotone"
            dataKey="rejection"
            name="반려"
            stroke="#FF6600"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: '#ffffff',
              stroke: '#FF6600',
              strokeWidth: 2,
            }}
          />

          {/* 신고 라인 (빨간색) - 부드러운 곡선 */}
          <Line
            type="monotone"
            dataKey="report"
            name="신고"
            stroke="#FF2626"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: '#ffffff',
              stroke: '#FF2626',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
