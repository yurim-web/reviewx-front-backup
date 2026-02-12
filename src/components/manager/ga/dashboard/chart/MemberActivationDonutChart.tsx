/* ========================================
   🍩 회원 활성화 도넛 차트 컴포넌트 (원형 프로그래스 바)
   ======================================== */

/**
 * 회원 활성화 도넛 차트 컴포넌트
 *
 * 목적: 전체 회원의 활성화 비율을 원형 프로그래스 바로 표시합니다.
 *
 * 사용 위치:
 * - MemberStatsSection 컴포넌트 (전체 회원 통계 카드)
 *
 * 주요 기능:
 * - 활성화 비율을 원형 프로그래스 바로 표시
 * - 위에서부터 채워지는 프로그래스 바 효과
 * - 중앙에 "활성화" 텍스트와 퍼센트 값 표시
 */

'use client';

import styles from '@/styles/manager/common/dashboard/chart/member_stats.module.css';

interface MemberActivationDonutChartProps {
  activePercentage: number;
}

export default function MemberActivationDonutChart({
  activePercentage,
}: MemberActivationDonutChartProps) {
  // 활성화 비율 사용
  const activeValue = activePercentage;

  // 원형 프로그래스 바 설정 (200x200, 컨테이너와 동일)
  const size = 200; // 전체 크기
  const center = size / 2; // 중심점 100
  const radius = 86.1; // 반지름 (비율 유지: 77.5 * 200/180)
  const strokeWidth = 25; // 도넛 두께
  const circumference = 2 * Math.PI * radius; // 원주

  // 활성화 비율에 따른 stroke-dasharray 계산
  const activeLength = (activeValue / 100) * circumference;
  const inactiveLength = circumference - activeLength;

  // 12시(상단)에서 시작해서 시계방향·오른쪽으로 채우기 (12→3→6→9)
  const groupTransform = `rotate(-90 ${center} ${center}) translate(${center} ${center}) scale(-1 1) translate(${-center} ${-center})`;

  return (
    <div className={styles.donut_progress_container}>
      <svg width={size} height={size} className={styles.donut_progress_svg}>
        <g transform={groupTransform}>
          {/* 배경 원 (비활성화 부분) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            className={styles.donut_progress_background}
          />
          {/* 활성화 프로그래스 원 - 12시부터 오른쪽(3시)으로 시계방향 */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            className={styles.donut_progress_active}
            strokeDasharray={`${activeLength} ${inactiveLength}`}
            strokeDashoffset={0}
          />
        </g>
      </svg>

      {/* 중앙 텍스트 (HTML 요소로 배치) */}
      <div className={styles.donut_progress_text_wrapper}>
        <p className={styles.donut_chart_label}>활성화</p>
        <p className={styles.donut_chart_value}>{activeValue}%</p>
      </div>
    </div>
  );
}
