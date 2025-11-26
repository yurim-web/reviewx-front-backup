/* ========================================
   🍩 회원 활성화 도넛 차트 컴포넌트
   ======================================== */

/**
 * 회원 활성화 도넛 차트 컴포넌트
 *
 * 목적: 전체 회원의 활성화 비율을 도넛 차트로 표시합니다.
 *
 * 사용 위치:
 * - MemberStatsSection 컴포넌트 (전체 회원 통계 카드)
 *
 * 주요 기능:
 * - 활성화 비율: 68% (어두운 회색)
 * - 비활성화 비율: 32% (밝은 회색)
 * - 중앙에 "활성화" 텍스트와 "68%" 값 표시
 
 */

'use client';

import { useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import styles from '@/styles/manager_ga/member_stats.module.css';

// 차트 데이터 타입 정의
interface DonutData {
  name: string; // 섹션 이름 (활성화, 비활성화)
  value: number; // 비율 값
}

// 차트 데이터 (Figma 디자인 기반)
const donut_data: DonutData[] = [
  { name: '활성화', value: 68 }, // 활성화 비율 68%
  { name: '비활성화', value: 32 }, // 비활성화 비율 32%
];

// 색상 정의 (Figma 디자인 기반)
// 이미지에서 활성화는 어두운 회색, 비활성화는 밝은 회색으로 표시됨
const colors = {
  active: '#666666', // 어두운 회색 (활성화 68%)
  inactive: '#d9d9d9', // 밝은 회색 (비활성화 32%)
};

// 중앙 라벨 컴포넌트
// 도넛 차트 중앙에 "활성화"와 "68%"를 표시합니다
const CustomLabel = ({ viewBox }: { viewBox?: { cx: number; cy: number } }) => {
  if (!viewBox) return null;
  const { cx, cy } = viewBox;

  return (
    <g>
      {/* "활성화" 텍스트 */}
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="middle"
        className={styles.donut_chart_label}
        style={{
          fontSize: '18px',
          fontWeight: 500,
          fill: '#848484',
          letterSpacing: '-0.36px',
        }}
      >
        활성화
      </text>
      {/* "68%" 값 */}
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        dominantBaseline="middle"
        className={styles.donut_chart_value}
        style={{
          fontSize: '18px',
          fontWeight: 600,
          fill: '#444444',
          letterSpacing: '-0.36px',
        }}
      >
        68%
      </text>
    </g>
  );
};

export default function MemberActivationDonutChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 클릭 시 검정색 선 제거
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 클릭 이벤트 막기
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // 클릭 시 나타나는 검정색 선 제거
      const paths = container.querySelectorAll<SVGPathElement>(
        'path.recharts-pie-sector, path.recharts-sector',
      );
      paths.forEach((path) => {
        // stroke 제거
        path.setAttribute('stroke', 'none');
        path.style.setProperty('stroke', 'none', 'important');
        path.style.setProperty('stroke-width', '0', 'important');
        // outline 제거
        path.style.setProperty('outline', 'none', 'important');
      });
      return false;
    };

    // 마우스 다운 이벤트도 막기
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    container.addEventListener('click', handleClick, true);
    container.addEventListener('mousedown', handleMouseDown, true);

    // 주기적으로 stroke 제거 (클릭 후에도 유지)
    const checkInterval = setInterval(() => {
      const paths = container.querySelectorAll<SVGPathElement>(
        'path.recharts-pie-sector, path.recharts-sector',
      );
      paths.forEach((path) => {
        const stroke = path.getAttribute('stroke');
        const strokeWidth = path.getAttribute('stroke-width');
        if (stroke && stroke !== 'none') {
          path.setAttribute('stroke', 'none');
        }
        if (strokeWidth && strokeWidth !== '0') {
          path.setAttribute('stroke-width', '0');
        }
        path.style.setProperty('stroke', 'none', 'important');
        path.style.setProperty('stroke-width', '0', 'important');
        path.style.setProperty('outline', 'none', 'important');
      });
    }, 100);

    return () => {
      container.removeEventListener('click', handleClick, true);
      container.removeEventListener('mousedown', handleMouseDown, true);
      clearInterval(checkInterval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={donut_data as any}
            cx="50%"
            cy="50%"
            innerRadius={45} // 내부 반지름 (도넛 차트의 구멍 크기 - 더 크게)
            outerRadius={70} // 외부 반지름 (도넛 차트의 전체 크기 - 더 크게)
            dataKey="value"
            startAngle={90} // 시작 각도 (12시 방향부터 시작)
            endAngle={-270} // 끝 각도 (한 바퀴 돌아서 12시 방향으로)
            paddingAngle={0} // 섹션 간 간격 (0이면 붙어있음)
            stroke="none" // 경계선 제거
            strokeWidth={0} // 경계선 두께 0
            isAnimationActive={false} // 애니메이션 비활성화
            activeShape={false} // 호버 시 모양 변경 비활성화
          >
            {/* 각 섹션에 색상 적용 */}
            {donut_data.map((entry, index) => {
              const fillColor =
                entry.name === '활성화' ? colors.active : colors.inactive;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={fillColor}
                  stroke="none" // 경계선 완전히 제거
                  strokeWidth={0} // 경계선 두께 0
                  style={{ fill: fillColor }} // 호버 시에도 색상 유지
                />
              );
            })}
            {/* 중앙 라벨 */}
            <Label content={<CustomLabel />} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
