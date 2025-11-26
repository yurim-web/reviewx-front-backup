/* ========================================
   🥧 채널별 회원 파이 차트 컴포넌트
   ======================================== */

/**
 * 채널별 회원 파이 차트 컴포넌트
 *
 * 목적: 채널별 회원 등록 통계를 파이 차트로 표시합니다.
 *
 * 사용 위치:
 * - MemberStatsSection 컴포넌트 (채널별 회원 통계 카드)
 *
 * 주요 기능:
 * - 블로그 등록: 50% (어두운 회색)
 * - 인스타그램 등록: 25% (중간 회색)
 * - 클립 등록: 20% (밝은 회색)
 * - 유튜브 등록: 5% (가장 밝은 회색)
 
 */

'use client';

import { useEffect, useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  Tooltip,
} from 'recharts';
import styles from '@/styles/manager_ga/member_stats.module.css';

// 차트 데이터 타입 정의
interface ChannelData {
  name: string; // 채널명
  value: number; // 비율 값
  count: number; // 회원 수
}

// 차트 데이터 (이미지 설명 기반)
const channel_data: ChannelData[] = [
  { name: '블로그', value: 50, count: 12589 }, // 블로그 등록 50%
  { name: '인스타그램', value: 25, count: 10124 }, // 인스타그램 등록 25%
  { name: '클립', value: 20, count: 8869 }, // 클립 등록 20%
  { name: '유튜브', value: 5, count: 569 }, // 유튜브 등록 5%
];

// 색상 정의 (이미지 설명 기반 - 회색 계열)
const colors = {
  blog: '#666666', // 어두운 회색 (블로그 50%)
  instagram: '#999999', // 중간 회색 (인스타그램 25%)
  clip: '#d9d9d9', // 밝은 회색 (클립 20%)
  youtube: '#f1f1f1', // 가장 밝은 회색 (유튜브 5%)
};

// 채널별 색상 매핑
const getChannelColor = (channel: string): string => {
  switch (channel) {
    case '블로그':
      return colors.blog;
    case '인스타그램':
      return colors.instagram;
    case '클립':
      return colors.clip;
    case '유튜브':
      return colors.youtube;
    default:
      return colors.blog;
  }
};

// 각 섹션에 퍼센트를 표시하는 커스텀 라벨 컴포넌트
const CustomLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

  // 섹션의 중앙 위치 계산
  const RADIAN = Math.PI / 180;
  // 섹션의 중앙 지점 계산 (반지름의 중간 지점)
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // 퍼센트가 너무 작으면 표시하지 않음 (5% 미만)
  if (percent < 0.05) {
    return null;
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={14}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// 호버 시 표시할 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: '#333333',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          transition: 'none', // 애니메이션 제거
          animation: 'none', // 애니메이션 제거
        }}
      >
        <p style={{ margin: 0 }}>{data.name}</p>
      </div>
    );
  }
  return null;
};

export default function ChannelMemberPieChart() {
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
          <Tooltip
            content={<CustomTooltip />}
            cursor={false}
            animationDuration={0}
            animationEasing="linear"
          />
          <Pie
            data={channel_data as any}
            cx="50%"
            cy="50%"
            innerRadius={0} // 0으로 설정하면 파이 차트 (도넛 차트가 아님)
            outerRadius={80} // 외부 반지름 (더 크게)
            dataKey="value"
            startAngle={90} // 시작 각도 (12시 방향부터 시작)
            endAngle={-270} // 끝 각도 (한 바퀴 돌아서 12시 방향으로)
            paddingAngle={0} // 섹션 간 간격 (0이면 붙어있음)
            label={<CustomLabel />} // 각 섹션에 퍼센트 표시
            stroke="none" // 경계선 제거
            strokeWidth={0} // 경계선 두께 0
            isAnimationActive={false} // 애니메이션 비활성화
          >
            {/* 각 섹션에 색상 적용 */}
            {channel_data.map((entry, index) => {
              const fillColor = getChannelColor(entry.name);
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
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
