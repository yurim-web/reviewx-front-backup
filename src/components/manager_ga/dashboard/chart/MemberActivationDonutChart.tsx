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

import styles from '@/styles/manager_ga/member_stats.module.css';
import {
  memberActivationDonutData,
  DonutData,
} from '@/data/manager_ga/dashboard/dashboardData';

export default function MemberActivationDonutChart() {
  // 활성화 비율 가져오기
  const activeValue =
    memberActivationDonutData.find((entry) => entry.name === '활성화')?.value ||
    70;

  // 원형 프로그래스 바 설정
  const size = 180; // 전체 크기
  const center = size / 2; // 중심점
  const radius = 77.5; // 반지름 (outerRadius 90 - innerRadius 65) / 2 + innerRadius
  const strokeWidth = 25; // 도넛 두께 (90 - 65)
  const circumference = 2 * Math.PI * radius; // 원주

  // 활성화 비율에 따른 stroke-dasharray 계산
  // 왼쪽부터 채워지도록 (9시 방향부터 시작)
  const activeLength = (activeValue / 100) * circumference;
  const inactiveLength = circumference - activeLength;

  // stroke-dashoffset: 왼쪽(9시 방향)부터 시작하도록 조정
  // SVG circle은 기본적으로 3시 방향부터 시작하므로 -180도 회전
  const offset = circumference * 0.5; // 180도 = 50% of circumference

  return (
    <div className={styles.donut_progress_container}>
      <svg width={size} height={size} className={styles.donut_progress_svg}>
        {/* 배경 원 (비활성화 부분) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={styles.donut_progress_background}
        />

        {/* 활성화 프로그래스 원 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={styles.donut_progress_active}
          strokeDasharray={`${activeLength} ${inactiveLength}`}
          strokeDashoffset={offset}
        />
      </svg>

      {/* 중앙 텍스트 (HTML 요소로 배치) */}
      <div className={styles.donut_progress_text_wrapper}>
        <p className={styles.donut_chart_label}>활성화</p>
        <p className={styles.donut_chart_value}>{activeValue}%</p>
      </div>
    </div>
  );
}
