/* ========================================
   
   ======================================== */

/**
 * 캠페인 모집 통계 차트 컴포넌트
 *
 * 목적: 카테고리별 캠페인 모집률, 달성률, 평균 진행 기간을 표시하는 차트입니다.
 *
 
 */

"use client";

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
} from "recharts";
import styles from "@/styles/manager_ga/dashboard/charts.module.css";

// 차트 데이터 타입 정의
interface ChartData {
  category: string; // 카테고리명
  recruitmentRate: number; // 모집률 (%)
  achievementRate: number; // 달성률 (%)
  averageDuration: number; // 평균 진행 기간 (일)
}

// recharts 커스텀 컴포넌트 Props 타입
// tick prop에 JSX element로 전달하면 recharts가 런타임에 props를 주입하므로 선택적으로 정의
interface AxisTickProps {
  x?: number;
  y?: number;
  payload?: { value: string | number };
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartData }>;
  coordinate?: { x: number; y: number };
}

// 차트 데이터 (Figma 디자인 기반)
const chart_data: ChartData[] = [
  {
    category: "생활",
    recruitmentRate: 22,
    achievementRate: 55,
    averageDuration: 55,
  },
  {
    category: "식품",
    recruitmentRate: 38,
    achievementRate: 68,
    averageDuration: 55,
  },
  {
    category: "패션",
    recruitmentRate: 50,
    achievementRate: 69,
    averageDuration: 12,
  },
  {
    category: "뷰티",
    recruitmentRate: 52,
    achievementRate: 65,
    averageDuration: 12,
  },
  {
    category: "가구",
    recruitmentRate: 32,
    achievementRate: 72,
    averageDuration: 55,
  },
  {
    category: "가전",
    recruitmentRate: 28,
    achievementRate: 82,
    averageDuration: 55,
  },
  {
    category: "디지털",
    recruitmentRate: 78,
    achievementRate: 98,
    averageDuration: 28,
  },
  {
    category: "유아동",
    recruitmentRate: 88,
    achievementRate: 60,
    averageDuration: 28,
  },
  {
    category: "문화",
    recruitmentRate: 80,
    achievementRate: 50,
    averageDuration: 55,
  },
  {
    category: "여가",
    recruitmentRate: 88,
    achievementRate: 45,
    averageDuration: 28,
  },
  {
    category: "반려동물",
    recruitmentRate: 88,
    achievementRate: 70,
    averageDuration: 55,
  },
  {
    category: "서비스",
    recruitmentRate: 90,
    achievementRate: 75,
    averageDuration: 55,
  },
  {
    category: "기타",
    recruitmentRate: 64,
    achievementRate: 62,
    averageDuration: 2,
  },
];

// 커스텀 X축 틱 컴포넌트 (카테고리 텍스트 스타일 적용)
const CustomXAxisTick = ({ x, y, payload }: AxisTickProps) => {
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
        lineHeight: "12px",
      }}
    >
      {payload?.value}
    </text>
  );
};

// 커스텀 Y축 틱 컴포넌트 (왼쪽 Y축 숫자 스타일 적용)
const CustomYAxisTick = ({ x, y, payload }: AxisTickProps) => {
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
        lineHeight: "12px",
      }}
    >
      {payload?.value}
    </text>
  );
};

// 커스텀 Y축 틱 컴포넌트 (오른쪽 Y축 숫자 스타일 적용)
const CustomYAxisTickRight = ({ x, y, payload }: AxisTickProps) => {
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
        lineHeight: "12px",
      }}
    >
      {payload?.value}
    </text>
  );
};

// 커스텀 툴팁: 모집률, 달성률, 진행 기간 (60일 이상이면 "60일+"), 항목 간 8px
const CustomTooltip = ({ active, payload, coordinate }: ChartTooltipProps) => {
  if (!active || !payload?.length || !coordinate) return null;

  const data = payload[0]?.payload as ChartData | undefined;
  if (!data) return null;

  const durationText = data.averageDuration >= 60 ? "60일+" : `${data.averageDuration}일`;

  return (
    <div
      className={`${styles.chart_tooltip} ${styles.chart_tooltip_campaign_recruitment}`}
      style={{
        position: "absolute",
        left: coordinate.x,
        top: coordinate.y,
        transform: "translate(-50%, -100%)",
        marginTop: "-8px",
        pointerEvents: "none",
      }}
    >
      <div className={styles.chart_tooltip_row}>
        <span className={styles.chart_tooltip_campaign_label}>모집률</span>
        <span className={styles.chart_tooltip_campaign_value}>{data.recruitmentRate}%</span>
      </div>
      <div className={styles.chart_tooltip_row}>
        <span className={styles.chart_tooltip_campaign_label}>달성률</span>
        <span className={styles.chart_tooltip_campaign_value}>{data.achievementRate}%</span>
      </div>
      <div className={styles.chart_tooltip_row}>
        <span className={styles.chart_tooltip_campaign_label}>진행 기간</span>
        <span className={styles.chart_tooltip_campaign_value}>{durationText}</span>
      </div>
    </div>
  );
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
          {/* 애니메이션 설정 */}
          {/* 그리드 라인 - 수평선만 표시 (왼쪽 Y축 숫자에 맞춰) */}
          <CartesianGrid stroke="#F2F2F2" vertical={false} horizontal={true} yAxisId="left" />

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
              value: "단위 (%)",
              angle: 0,
              position: "top",
              offset: 35,
              dx: -15,
              style: {
                textAnchor: "start",
                fill: "#999",
                fontSize: "12px",
                fontFamily: "Pretendard",
                fontWeight: 500,
                lineHeight: "12px",
                letterSpacing: "-0.24px",
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
              value: "단위 (일)",
              angle: 0,
              position: "top",
              offset: 35,
              dx: 15,
              style: {
                textAnchor: "end",
                fill: "#999",
                fontSize: "12px",
                fontFamily: "Pretendard",
                fontWeight: 500,
                lineHeight: "12px",
                letterSpacing: "-0.24px",
              },
            }}
          />

          {/* 범례 숨김 - 섹션 컴포넌트에서 커스텀 범례로 표시 */}
          <Legend wrapperStyle={{ display: "none" }} />

          {/* 툴팁 - 세로 크로스헤어 표시, 포인트 중앙 위에 배치 */}
          <Tooltip
            content={<CustomTooltip />}
            shared={true}
            filterNull={true}
            allowEscapeViewBox={{ x: true, y: true }}
            cursor={{ stroke: "#d9d9d9", strokeWidth: 1 }}
          />

          {/* 달성률 라인 (핑크색) - 막대 뒤에 표시, 로드 시 선·점 동시 표시 */}
          <Line
            yAxisId="left"
            type="linear"
            dataKey="achievementRate"
            name="달성률"
            stroke="#FF5694"
            strokeWidth={2}
            dot={{ r: 3, fill: "#FF5694" }}
            activeDot={{
              r: 4,
              fill: "#FF5694",
              stroke: "#FF5694",
              strokeWidth: 1,
            }}
            isAnimationActive={false}
          />

          {/* 모집률 라인 (어두운 회색) - 막대 뒤에 표시, 로드 시 선·점 동시 표시 */}
          <Line
            yAxisId="left"
            type="linear"
            dataKey="recruitmentRate"
            name="모집률"
            stroke="#444444"
            strokeWidth={2}
            dot={{ r: 3, fill: "#444444" }}
            activeDot={{
              r: 4,
              fill: "#444444",
              stroke: "#444444",
              strokeWidth: 1,
            }}
            isAnimationActive={false}
          />

          {/* 평균 진행 기간 막대 (밝은 회색) - 라인 앞에 표시, 로드 시 동시 표시 */}
          <Bar
            yAxisId="right"
            dataKey="averageDuration"
            name="평균 진행 기간"
            fill="#E5E5E5"
            radius={[4, 4, 0, 0]}
            barSize={16}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
