/* ========================================
   📈 금액 통계 차트 공통 컴포넌트
   ======================================== */

/**
 * 금액 통계 차트 공통 컴포넌트
 *
 * 목적: 정산/결제 금액의 시간별 추이를 라인 차트로 표시하는 재사용 가능한 컴포넌트입니다.
 *
 * 주요 기능:
 * - 날짜별 금액을 라인 차트로 표시
 * - Y축에 금액 범위 표시 (0, 2천, 4천, 6천, 8천, 1억)
 * - X축에 날짜 표시 (11/1, 11/6, 11/11)
 *
 * 사용 위치:
 * - SettlementSummarySection (정산 요약 섹션)
 * - PaymentSummarySection (결제 요약 섹션)
 * - SettlementChartSection (정산 차트 섹션)
 * - PaymentChartSection (결제 차트 섹션)
 *
 */

'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import styles from '@/styles/manager_sa/dashboard/charts.module.css';
import { ChartDataPoint } from '@/data/manager_sa/dashboard/dashboardData';

// AmountChart 컴포넌트의 props 타입 정의
interface AmountChartProps {
  // 차트에 표시할 데이터 배열
  data: ChartDataPoint[];
  // 그라데이션 ID (각 차트마다 고유한 ID 필요)
  gradientId: string;
  // 차트 영역 클래스명 (settlement 또는 payment)
  chartAreaClass: string;
  // 차트 동기화 ID (선택적, 제공하지 않으면 동기화 안 됨)
  syncId?: string;
}

// 금액을 천만 단위로 포맷팅하는 함수
// 예: 20000000 → "2천" (2천만), 100000000 → "1억"
const format_amount = (value: number): string => {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(0)}억`;
  } else if (value >= 10000000) {
    // 천만 단위로 표시 (2천 = 2천만)
    return `${(value / 10000000).toFixed(0)}천`;
  } else if (value === 0) {
    return '0';
  }
  // 작은 값도 처리
  return value.toString();
};

// 커스텀 Y축 틱 컴포넌트
const CustomYAxisTick = ({ x, y, payload }: any) => {
  // 표시할 틱 값들 (정확한 값)
  const displayTicks = [0, 20000000, 40000000, 60000000, 80000000, 100000000];

  // payload.value를 정수로 반올림
  const value = Math.round(payload.value);

  // 가장 가까운 틱 찾기 (오차 허용 범위: 5000)
  const matchedTick = displayTicks.find(
    (tick) => Math.abs(tick - value) <= 5000,
  );

  // 매칭된 틱이 있으면 표시
  if (matchedTick !== undefined) {
    return (
      <text
        x={x}
        y={y}
        dx={-16}
        textAnchor="end"
        fill="#ababab"
        fontSize={12}
        fontFamily="Pretendard"
        fontWeight={500}
        letterSpacing="-0.24px"
        style={{
          lineHeight: '12px',
        }}
      >
        {format_amount(matchedTick)}
      </text>
    );
  }

  // 매칭되지 않으면 빈 텍스트 반환 (공간은 차지하지만 보이지 않음)
  return (
    <text
      x={x}
      y={y}
      dx={-16}
      textAnchor="end"
      fill="transparent"
      fontSize={12}
      fontFamily="Pretendard"
      fontWeight={500}
      letterSpacing="-0.24px"
      style={{
        lineHeight: '12px',
      }}
    >
      {''}
    </text>
  );
};

// 커스텀 X축 틱 컴포넌트
const CustomXAxisTick = ({ x, y, payload }: any) => {
  // 표시할 날짜들
  const displayDates = ['11/1', '11/6', '11/11'];

  // 표시할 날짜인지 확인
  const shouldDisplay = displayDates.includes(payload.value);

  if (shouldDisplay) {
    return (
      <text
        x={x}
        y={y}
        dy={17}
        textAnchor="middle"
        fill="#ababab"
        fontSize={12}
        fontFamily="Pretendard"
        fontWeight={500}
        letterSpacing="-0.24px"
        style={{
          lineHeight: '12px',
          textTransform: 'uppercase',
        }}
      >
        {payload.value}
      </text>
    );
  }

  // 표시하지 않는 날짜는 빈 텍스트 반환
  return (
    <text
      x={x}
      y={y}
      dy={17}
      textAnchor="middle"
      fill="transparent"
      fontSize={12}
      fontFamily="Pretendard"
      fontWeight={500}
      letterSpacing="-0.24px"
      style={{
        lineHeight: '12px',
        textTransform: 'uppercase',
      }}
    >
      {''}
    </text>
  );
};

// 커스텀 툴팁 컴포넌트
// - 결제(payment) 차트: 흰색 배경(#ffffff), 날짜(#848484), 금액(#ff5694)
// - 정산(settlement) 차트: 어두운 배경(#444444), 날짜(#d9d9d9), 금액(#ffffff)
// - 위치에 따라 말풍선 꼭지(삼각형) 방향 자동 변경
const CustomTooltip = ({ active, payload, coordinate, is_payment_chart }: any) => {
  if (active && payload && payload.length && coordinate) {
    const data = payload[0].payload;
    
    // 차트 영역의 중간 지점 계산 (차트 높이 280px, margin top 10px 고려하여 대략 135px)
    // coordinate.y가 중간보다 작으면 (차트 상단) → 툴팁을 위에 표시하고 화살표는 아래로
    // coordinate.y가 중간보다 크면 (차트 하단) → 툴팁을 아래에 표시하고 화살표는 위로
    const chart_midpoint = 135;
    const is_tooltip_below = coordinate.y > chart_midpoint;

    // 차트 종류에 따라 툴팁 테마 결정
    const tooltip_background_color = is_payment_chart ? '#ffffff' : '#444444';
    const tooltip_date_color = is_payment_chart ? '#848484' : '#d9d9d9';
    const tooltip_value_color = is_payment_chart ? '#ff5694' : '#ffffff';
    const tooltip_box_shadow = is_payment_chart
      ? '0 2px 8px rgba(0, 0, 0, 0.15)'
      : 'none';
    
    // 툴팁 위치 스타일 결정
    const tooltip_transform = is_tooltip_below 
      ? 'translate(-50%, 0)' // 툴팁이 데이터 포인트 아래에 위치
      : 'translate(-50%, -100%)'; // 툴팁이 데이터 포인트 위에 위치
    
    const tooltip_margin = is_tooltip_below
      ? '8px 0 0 0' // 아래쪽 여백
      : '0 0 -8px 0'; // 위쪽 여백
    
    // 화살표 스타일 결정
    const arrow_style = is_tooltip_below
      ? {
          // 위쪽 화살표 (툴팁이 아래에 있을 때)
          position: 'absolute' as const,
          top: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderBottom: `4px solid ${tooltip_background_color}`,
        }
      : {
          // 아래쪽 화살표 (툴팁이 위에 있을 때)
          position: 'absolute' as const,
          bottom: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: `4px solid ${tooltip_background_color}`,
        };
    
    return (
      <div
        className={styles.chart_tooltip}
        style={{
          position: 'absolute',
          left: coordinate.x,
          top: coordinate.y,
          transform: tooltip_transform,
          margin: tooltip_margin,
          pointerEvents: 'none',
          backgroundColor: tooltip_background_color,
          borderRadius: '6px',
          padding: '8px',
          minWidth: 'fit-content',
          boxShadow: tooltip_box_shadow,
        }}
      >
        {/* 날짜 텍스트 */}
        <p
          style={{
            color: tooltip_date_color,
            fontSize: '13px',
            fontWeight: 500,
            margin: 0,
            padding: 0,
            lineHeight: '13px',
            letterSpacing: '-0.26px',
          }}
        >
          {data.date}
        </p>
        {/* 금액 텍스트 */}
        <p
          style={{
            color: tooltip_value_color,
            fontSize: '13px',
            fontWeight: is_payment_chart ? 600 : 500, // 결제 차트는 600, 정산 차트는 500
            margin: '4px 0 0 0',
            padding: 0,
            lineHeight: '13px',
            letterSpacing: '-0.26px',
          }}
        >
          {data.value.toLocaleString()}
        </p>
        {/* 위치에 따라 방향이 바뀌는 삼각형 화살표 */}
        <div style={arrow_style} />
      </div>
    );
  }
  return null;
};

export default function AmountChart({
  data,
  gradientId,
  chartAreaClass,
  syncId,
}: AmountChartProps) {
  // Y축 최대값은 1억으로 고정 (Figma 디자인 기준)
  const y_axis_max = 100000000;

  // gradientId를 기반으로 차트 색상 결정
  // paymentGradient → 핑크색 (#ff5694), settlementGradient → 검은색 (#444444)
  const chart_color =
    gradientId === 'paymentGradient' ? '#ff5694' : '#444444';

  // 결제 차트 여부
  const is_payment_chart = gradientId === 'paymentGradient';

  return (
    <div
      className={`${styles.chart_area} ${styles[chartAreaClass]}`}
      tabIndex={-1}
      onFocus={(e) => e.target.blur()}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          {...(syncId ? { syncId } : {})}
        >
          {/* 그리드 라인 - 수평선만 표시 */}
          <CartesianGrid stroke="#F2F2F2" vertical={false} horizontal={true} />

          {/* X축 (날짜) - 11/1, 11/6, 11/11만 표시 */}
          <XAxis
            dataKey="date"
            tick={<CustomXAxisTick />}
            tickLine={false}
            axisLine={false}
            interval={0}
          />

          {/* Y축 (금액) - 0, 2천, 4천, 6천, 8천, 1억 표시 */}
          <YAxis
            domain={[0, 100000000]}
            ticks={[0, 20000000, 40000000, 60000000, 80000000, 100000000]}
            tick={<CustomYAxisTick />}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            type="number"
            scale="linear"
            interval={0}
          />

          {/* 그라데이션 정의 - gradientId에 따라 색상 결정 */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chart_color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={chart_color} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* 툴팁 */}
          <Tooltip content={<CustomTooltip is_payment_chart={is_payment_chart} />} />

          {/* 영역 채우기 - 그라데이션으로 투명하게, 뾰족뾰족한 형태 */}
          <Area
            type="linear"
            dataKey="value"
            stroke={chart_color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            // 활성 점(동그라미) - 결제/정산 모두 흰색 테두리 적용
            activeDot={{ r: 6, fill: chart_color, stroke: '#ffffff', strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
