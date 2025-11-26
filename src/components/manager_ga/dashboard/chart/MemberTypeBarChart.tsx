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

// 차트 데이터 타입 정의
interface MemberTypeData {
  category: string; // 카테고리명 (막대 이름)
  partner: number; // 파트너 비율
  reviewer: number; // 리뷰어 비율
  dormant: number; // 휴면 회원 비율
}

// 차트 데이터 (이미지 설명 기반)
// 전체 회원: 10,155명
// 파트너: 566명 (5.6%), 리뷰어: 9,589명 (94.4%), 휴면: 10명 (0.1%)
const bar_data: MemberTypeData[] = [
  {
    category: '전체',
    partner: 5.6, // 파트너 비율 (566/10155)
    reviewer: 94.4, // 리뷰어 비율 (9589/10155)
    dormant: 0.1, // 휴면 회원 비율 (10/10155)
  },
  {
    category: '활성',
    partner: 2.6, // 활성 파트너 비율 (267/10155)
    reviewer: 74.7, // 활성 리뷰어 비율 (7589/10155)
    dormant: 22.7, // 나머지
  },
];

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
  // 클릭 이벤트 완전히 막기
  const handleClick = (data?: any, index?: number, e?: any) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    return false;
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
      onClick={handleClick}
      onMouseDown={handleClick}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={bar_data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          barCategoryGap="30%"
          onClick={handleClick} // 클릭 이벤트 완전히 막기
          onMouseDown={handleClick} // 마우스 다운 이벤트도 막기
        >
          {/* X축 숨김 (세로 막대 차트에서는 카테고리 축) */}
          <XAxis
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={false}
            hide={true}
          />
          {/* Y축 숨김 (세로 막대 차트에서는 숫자 축) */}
          <YAxis type="number" domain={[0, 100]} hide={true} />

          {/* 파트너 막대 (어두운 회색) */}
          <Bar dataKey="partner" stackId="a" radius={[0, 0, 0, 0]}>
            {bar_data.map((entry, index) => (
              <Cell
                key={`partner-${index}`}
                fill={colors.partner}
                style={{ fill: colors.partner }} // 호버 시에도 색상 유지
              />
            ))}
          </Bar>

          {/* 리뷰어 막대 (밝은 회색) */}
          <Bar dataKey="reviewer" stackId="a" radius={[0, 0, 0, 0]}>
            {bar_data.map((entry, index) => (
              <Cell
                key={`reviewer-${index}`}
                fill={colors.reviewer}
                style={{ fill: colors.reviewer }} // 호버 시에도 색상 유지
              />
            ))}
          </Bar>

          {/* 휴면 회원 막대 (매우 밝은 회색) */}
          <Bar dataKey="dormant" stackId="a" radius={[0, 0, 0, 0]}>
            {bar_data.map((entry, index) => (
              <Cell
                key={`dormant-${index}`}
                fill={colors.dormant}
                style={{ fill: colors.dormant }} // 호버 시에도 색상 유지
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {/* 범례 */}
      <CustomLegend />
    </div>
  );
}
