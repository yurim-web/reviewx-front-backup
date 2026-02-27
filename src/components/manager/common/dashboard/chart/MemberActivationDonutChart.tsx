/* ========================================
   회원 활성화 도넛 차트 컴포넌트 (GA/SA 공통)
   ======================================== */

/**
 * MemberActivationDonutChart
 *
 * 목적: 전체 회원의 활성화 비율을 원형 프로그래스 바로 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/dashboard (GA 대시보드)
 * - /manager_sa/dashboard (SA 대시보드)
 */

"use client";

import styles from "@/styles/manager/common/dashboard/chart/member_stats.module.css";

interface MemberActivationDonutChartProps {
  activePercentage: number;
}

export default function MemberActivationDonutChart({
  activePercentage,
}: MemberActivationDonutChartProps) {
  const activeValue = activePercentage;

  const size = 200;
  const center = size / 2;
  const radius = 86.1;
  const _strokeWidth = 25;
  const circumference = 2 * Math.PI * radius;

  const activeLength = (activeValue / 100) * circumference;
  const inactiveLength = circumference - activeLength;

  const groupTransform = `rotate(-90 ${center} ${center}) translate(${center} ${center}) scale(-1 1) translate(${-center} ${-center})`;

  return (
    <div className={styles.donut_progress_container}>
      <svg width={size} height={size} className={styles.donut_progress_svg}>
        <g transform={groupTransform}>
          <circle cx={center} cy={center} r={radius} className={styles.donut_progress_background} />
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

      <div className={styles.donut_progress_text_wrapper}>
        <p className={styles.donut_chart_label}>활성화</p>
        <p className={styles.donut_chart_value}>{activeValue}%</p>
      </div>
    </div>
  );
}
