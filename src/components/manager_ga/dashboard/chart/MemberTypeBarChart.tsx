/* ========================================
   📊 회원 유형 막대 차트 컴포넌트
   ======================================== */

/**
 * 회원 유형 막대 차트 컴포넌트
 *
 * 목적: 파트너, 리뷰어, 휴면 회원의 비율을 세로 스택 막대 차트로 표시합니다.
 *
 * 사용 위치:
 * - MemberStatsSection 컴포넌트 (전체 회원 통계 카드 2)
 *
 * 주요 기능:
 * - 두 개의 세로 막대 차트
 * - 각 막대는 파트너, 리뷰어, 휴면 회원으로 구성
 * - 범례: 파트너(어두운 회색), 리뷰어(밝은 회색), 휴면 회원(매우 밝은 회색)
 */

'use client';

import { useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import styles from '@/styles/manager_ga/device_stats.module.css';

import { memberTypeBarData, MemberTypeBarData } from '@/data/manager_ga/dashboard/dashboardData';
import { use_bar_chart_click_handler } from './chart_event_handlers';

// 색상 정의 (이미지 설명 기반)
const colors = {
  partner: '#666666', // 어두운 회색 (파트너)
  reviewer: '#d9d9d9', // 밝은 회색 (리뷰어)
  dormant: '#f1f1f1', // 매우 밝은 회색 (휴면 회원)
};

// 범례 컴포넌트
const CustomLegend = () => {
  return (
    <div className={styles.member_type_legend}>
      <div className={styles.legend_item}>
        <div
          className={styles.legend_color}
          style={{ backgroundColor: colors.partner }}
        ></div>
        <span className={styles.legend_text}>파트너</span>
      </div>
      <div className={styles.legend_item}>
        <div
          className={styles.legend_color}
          style={{ backgroundColor: colors.reviewer }}
        ></div>
        <span className={styles.legend_text}>리뷰어</span>
      </div>
      <div className={styles.legend_item}>
        <div
          className={styles.legend_color}
          style={{ backgroundColor: colors.dormant }}
        ></div>
        <span className={styles.legend_text}>휴면 회원</span>
      </div>
    </div>
  );
};

export default function MemberTypeBarChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ========================================
     🔧 부가 기능 처리 (공용 유틸리티 사용)
     ======================================== */

  // 클릭 시 검정색 선 제거
  // 공용 유틸리티 함수를 사용하여 코드 중복 제거
  use_bar_chart_click_handler(containerRef);

  return (
    <div ref={containerRef} className={styles.member_type_bar_chart_container}>
      <div className={styles.member_type_chart_wrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={memberTypeBarData}
            margin={{ top: 12, right: 0, left: 0, bottom: 0 }}
            barCategoryGap="30%"
          >
            {/* X축 - 하단 선만 표시 */}
            <XAxis
              dataKey="category"
              axisLine={{ stroke: '#F2F2F2' }}
              tickLine={false}
              tick={false}
              hide={false}
              height={1}
              padding={{ left: 0, right: 0 }}
            />
            {/* Y축 숨김 (세로 막대 차트에서는 숫자 축) */}
            <YAxis type="number" domain={[0, 100]} hide={true} />

            {/* 휴면 회원 막대 (매우 밝은 회색) - 맨 아래, 하단만 둥글게 */}
            <Bar dataKey="dormant" stackId="a" radius={[8, 8, 0, 0]}>
              {memberTypeBarData.map((entry, index) => (
                <Cell
                  key={`dormant-${index}`}
                  fill={colors.dormant}
                  style={{ fill: colors.dormant }} // 호버 시에도 색상 유지
                />
              ))}
            </Bar>

            {/* 리뷰어 막대 (밝은 회색) - 중간, 둥글지 않음 */}
            <Bar dataKey="reviewer" stackId="a" radius={[8, 8, 0, 0]}>
              {memberTypeBarData.map((entry, index) => (
                <Cell
                  key={`reviewer-${index}`}
                  fill={colors.reviewer}
                  style={{ fill: colors.reviewer }} // 호버 시에도 색상 유지
                />
              ))}
            </Bar>

            {/* 파트너 막대 (어두운 회색) - 맨 위, 상단만 둥글게 */}
            <Bar dataKey="partner" stackId="a" radius={[8, 8, 0, 0]}>
              {memberTypeBarData.map((entry, index) => (
                <Cell
                  key={`partner-${index}`}
                  fill={colors.partner}
                  style={{ fill: colors.partner }} // 호버 시에도 색상 유지
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* 범례 */}
      <CustomLegend />
    </div>
  );
}
