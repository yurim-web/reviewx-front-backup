/* ========================================
   📊 캠페인 모집 통계 차트 컴포넌트
   ======================================== */

/**
 * 캠페인 모집 통계 차트 컴포넌트
 *
 * 목적: 카테고리별 캠페인 모집률, 달성률, 평균 진행 기간을 표시하는 차트입니다.
 *
 * 주요 기능:
 * - 모집률 라인 차트 (어두운 회색)
 * - 달성률 라인 차트 (밝은 회색)
 * - 평균 진행 기간 막대 차트 (밝은 회색)
 * - 이중 Y축 (왼쪽: %, 오른쪽: 일)
 
 */

'use client';

import {
  ComposedChart,
  Line,
  Bar,
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
  category: string; // 카테고리명
  recruitmentRate: number; // 모집률 (%)
  achievementRate: number; // 달성률 (%)
  averageDuration: number; // 평균 진행 기간 (일)
}

// 차트 데이터 (Figma 디자인 기반)
const chart_data: ChartData[] = [
  {
    category: '생활',
    recruitmentRate: 22,
    achievementRate: 55,
    averageDuration: 55,
  },
  {
    category: '식품',
    recruitmentRate: 38,
    achievementRate: 68,
    averageDuration: 55,
  },
  {
    category: '패션',
    recruitmentRate: 50,
    achievementRate: 69,
    averageDuration: 12,
  },
  {
    category: '뷰티',
    recruitmentRate: 52,
    achievementRate: 65,
    averageDuration: 12,
  },
  {
    category: '가구',
    recruitmentRate: 32,
    achievementRate: 72,
    averageDuration: 55,
  },
  {
    category: '가전',
    recruitmentRate: 28,
    achievementRate: 82,
    averageDuration: 55,
  },
  {
    category: '디지털',
    recruitmentRate: 78,
    achievementRate: 98,
    averageDuration: 28,
  },
  {
    category: '유아동',
    recruitmentRate: 88,
    achievementRate: 60,
    averageDuration: 28,
  },
  {
    category: '문화',
    recruitmentRate: 80,
    achievementRate: 50,
    averageDuration: 55,
  },
  {
    category: '여가',
    recruitmentRate: 88,
    achievementRate: 45,
    averageDuration: 28,
  },
  {
    category: '반려동물',
    recruitmentRate: 88,
    achievementRate: 70,
    averageDuration: 55,
  },
  {
    category: '서비스',
    recruitmentRate: 90,
    achievementRate: 75,
    averageDuration: 55,
  },
  {
    category: '기타',
    recruitmentRate: 64,
    achievementRate: 62,
    averageDuration: 2,
  },
];

// 커스텀 X축 틱 컴포넌트 (카테고리 텍스트 스타일 적용)
const CustomXAxisTick = ({ x, y, payload }: any) => {
  return (
    <text
      x={x}
      y={y}
      dy={17}
      textAnchor="middle"
      fill="#444"
      fontSize={12}
      fontFamily="Pretendard"
      fontStyle="normal"
      fontWeight={500}
      letterSpacing="-0.24px"
      style={{
        lineHeight: '12px',
      }}
    >
      {payload.value}
    </text>
  );
};

// 커스텀 Y축 틱 컴포넌트 (왼쪽 Y축 숫자 스타일 적용)
const CustomYAxisTick = ({ x, y, payload }: any) => {
  return (
    <text
      x={x}
      y={y}
      dx={-16}
      textAnchor="end"
      fill="#999"
      fontSize={12}
      fontFamily="Pretendard"
      fontWeight={500}
      letterSpacing="-0.24px"
      style={{
        lineHeight: '12px',
      }}
    >
      {payload.value}
    </text>
  );
};

// 커스텀 Y축 틱 컴포넌트 (오른쪽 Y축 숫자 스타일 적용)
const CustomYAxisTickRight = ({ x, y, payload }: any) => {
  return (
    <text
      x={x}
      y={y}
      dx={16}
      textAnchor="start"
      fill="#999"
      fontSize={12}
      fontFamily="Pretendard"
      fontWeight={500}
      letterSpacing="-0.24px"
      style={{
        lineHeight: '12px',
      }}
    >
      {payload.value}
    </text>
  );
};

// 커스텀 툴팁 컴포넌트
// coordinate: 마우스 위치 좌표
const CustomTooltip = ({ active, payload, coordinate }: any) => {
  if (active && payload && payload.length && coordinate) {
    // payload에서 달성률과 모집률만 필터링 (평균 진행 기간 제외)
    const lineItems = payload.filter(
      (item: any) =>
        item.value !== null &&
        item.value !== undefined &&
        item.dataKey &&
        (item.dataKey === 'recruitmentRate' ||
          item.dataKey === 'achievementRate'),
    );

    // lineItems가 없으면 (막대에 호버한 경우) 툴팁 표시 안 함
    if (lineItems.length === 0) {
      return null;
    }

    // payload에 하나의 항목만 있으면 그 항목 사용
    if (lineItems.length === 1) {
      const activeItem = lineItems[0];
      return (
        <div
          className={styles.chart_tooltip}
          style={{
            position: 'absolute',
            left: coordinate.x,
            top: coordinate.y,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px',
            pointerEvents: 'none',
          }}
        >
          <p className={styles.chart_tooltip_name}>{activeItem.name}</p>
          <p className={styles.chart_tooltip_value}>{activeItem.value}%</p>
        </div>
      );
    }

    // payload에 여러 항목이 있으면, 각 항목의 value 차이를 비교하여
    // 마우스 Y 좌표에 가장 가까운 항목을 찾습니다
    // Y축 범위는 0-100이고, value가 클수록 차트 상단에 가깝습니다
    if (lineItems.length > 1 && coordinate.y !== undefined) {
      // 각 항목의 value를 사용하여 거리를 계산
      // 실제로는 Recharts가 내부적으로 Y 좌표를 계산하지만,
      // 여기서는 value의 차이를 사용하여 가장 가까운 항목을 찾습니다

      const estimatedChartHeight = 300;
      const yAxisRange = 100; // 0-100

      // 마우스 Y 좌표를 value 범위로 변환 (역변환)
      const mouseValue =
        ((estimatedChartHeight - coordinate.y) / estimatedChartHeight) *
        yAxisRange;

      // 각 항목의 value와 마우스 value의 차이를 계산
      const itemsWithDistance = lineItems.map((item: any) => {
        const distance = Math.abs(item.value - mouseValue);
        return { item, distance };
      });

      // 거리가 가장 가까운 항목 선택
      const closestItem = itemsWithDistance.reduce((prev: any, curr: any) =>
        curr.distance < prev.distance ? curr : prev,
      );

      if (closestItem.item) {
        return (
          <div
            className={styles.chart_tooltip}
            style={{
              position: 'absolute',
              left: coordinate.x,
              top: coordinate.y,
              transform: 'translate(-50%, -100%)',
              marginTop: '-8px',
              pointerEvents: 'none',
            }}
          >
            <p className={styles.chart_tooltip_name}>{closestItem.item.name}</p>
            <p className={styles.chart_tooltip_value}>
              {closestItem.item.value}%
            </p>
          </div>
        );
      }
    }

    // 위의 방법들이 실패하면 첫 번째 항목 사용
    if (lineItems.length > 0) {
      const activeItem = lineItems[0];
      return (
        <div
          className={styles.chart_tooltip}
          style={{
            position: 'absolute',
            left: coordinate.x,
            top: coordinate.y,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px',
            pointerEvents: 'none',
          }}
        >
          <p className={styles.chart_tooltip_name}>{activeItem.name}</p>
          <p className={styles.chart_tooltip_value}>{activeItem.value}%</p>
        </div>
      );
    }
  }

  return null;
};

export default function CampaignRecruitmentChart() {
  return (
    <div
      className={`${styles.chart_area} ${styles.chart_area_campaign_recruitment}`}
      tabIndex={-1}
      onFocus={(e) => e.target.blur()}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chart_data}
          margin={{ top: 50, right: -10, left: -10, bottom: 80 }}
          barCategoryGap="8%"
        >
          {/* 그리드 라인 - 수평선만 표시 (왼쪽 Y축 숫자에 맞춰) */}
          <CartesianGrid
            stroke="#F2F2F2"
            vertical={false}
            horizontal={true}
            yAxisId="left"
          />

          {/* X축 (카테고리) */}
          <XAxis
            dataKey="category"
            tick={<CustomXAxisTick />}
            tickLine={false}
            axisLine={false}
            interval={0}
          />

          {/* 왼쪽 Y축 (단위: %) */}
          <YAxis
            yAxisId="left"
            orientation="left"
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tick={<CustomYAxisTick />}
            tickLine={false}
            axisLine={false}
            label={{
              value: '단위 (%)',
              angle: 0,
              position: 'top',
              offset: 35,
              dx: -15,
              style: {
                textAnchor: 'start',
                fill: '#999',
                fontSize: '12px',
                fontFamily: 'Pretendard',
                fontWeight: 500,
                lineHeight: '12px',
                letterSpacing: '-0.24px',
              },
            }}
          />

          {/* 오른쪽 Y축 (단위: 일) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 60]}
            ticks={[0, 12, 24, 36, 48, 60]}
            tick={<CustomYAxisTickRight />}
            tickLine={false}
            axisLine={false}
            label={{
              value: '단위 (일)',
              angle: 0,
              position: 'top',
              offset: 35,
              dx: 15,
              style: {
                textAnchor: 'end',
                fill: '#999',
                fontSize: '12px',
                fontFamily: 'Pretendard',
                fontWeight: 500,
                lineHeight: '12px',
                letterSpacing: '-0.24px',
              },
            }}
          />

          {/* 범례 숨김 - 섹션 컴포넌트에서 커스텀 범례로 표시 */}
          <Legend wrapperStyle={{ display: 'none' }} />

          {/* 툴팁 - 각 라인별로 개별 표시 */}
          <Tooltip
            content={<CustomTooltip />}
            shared={false}
            filterNull={true}
            allowEscapeViewBox={{ x: true, y: true }}
          />

          {/* 달성률 라인 (밝은 회색) - 막대 뒤에 표시되도록 먼저 렌더링 */}
          <Line
            yAxisId="left"
            type="linear"
            dataKey="achievementRate"
            name="달성률"
            stroke="#ABABAB"
            strokeWidth={2}
            dot={{ r: 3, fill: '#ABABAB' }}
            activeDot={{
              r: 4,
              fill: '#ABABAB',
              stroke: '#ABABAB',
              strokeWidth: 1,
            }}
          />

          {/* 모집률 라인 (어두운 회색) - 막대 뒤에 표시되도록 먼저 렌더링 */}
          <Line
            yAxisId="left"
            type="linear"
            dataKey="recruitmentRate"
            name="모집률"
            stroke="#444444"
            strokeWidth={2}
            dot={{ r: 3, fill: '#444444' }}
            activeDot={{
              r: 4,
              fill: '#444444',
              stroke: '#444444',
              strokeWidth: 1,
            }}
          />

          {/* 평균 진행 기간 막대 (밝은 회색) - 라인 앞에 표시되도록 나중에 렌더링 */}
          {/* Recharts에서는 나중에 렌더링된 컴포넌트가 앞에 표시됩니다 */}
          <Bar
            yAxisId="right"
            dataKey="averageDuration"
            name="평균 진행 기간"
            fill="#E5E5E5"
            radius={[4, 4, 0, 0]}
            barSize={16}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
