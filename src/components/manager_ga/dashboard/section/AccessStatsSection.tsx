/* ========================================
   📊 접속 통계 섹션 컴포넌트
   ======================================== */

/**
 * 접속 통계 섹션 컴포넌트
 *
 * 목적: 접속 통계와 디바이스 통계를 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 방문 수와 유입 수 통계 표시
 * - 디바이스별 접속 통계 차트 표시
 
 */

import styles from '@/styles/manager_ga/dashboard/sections/access_stats_section.module.css';
import DeviceStatsChart from '../chart/DeviceStatsChart';
import { accessStats } from '@/data/manager_ga/dashboard/dashboardData';

export default function AccessStatsSection() {
  return (
    <div className={styles.access_stats_section_card}>
      <div className={styles.access_stats_section_header}>
        {/* 섹션 제목 */}
        <h2 className={styles.access_stats_section_title}>접속 통계</h2>
      </div>

      {/* 방문 수와 유입 수 통계 카드 그리드 */}
      <div className={styles.access_stats_section_grid}>
        {/* 방문 수 카드 */}
        <div className={styles.access_stats_section_stat_card}>
          {/* 라벨과 변화율을 같은 줄에 배치 (space-between) */}
          <div className={styles.access_stats_section_stat_card_label_row}>
            <p className={styles.access_stats_section_stat_card_label}>
              {accessStats.visits.label}
            </p>
            {/* 변화율 표시 */}
            <p
              className={
                styles[
                  `access_stats_section_stat_card_change_${accessStats.visits.changeType}`
                ]
              }
            >
              {accessStats.visits.change}
            </p>
          </div>
          {/* 값 표시 */}
          <p className={styles.access_stats_section_stat_card_value}>
            {accessStats.visits.value}
          </p>
        </div>

        {/* 유입 수 카드 */}
        <div className={styles.access_stats_section_stat_card}>
          {/* 라벨과 변화율을 같은 줄에 배치 (space-between) */}
          <div className={styles.access_stats_section_stat_card_label_row}>
            <p className={styles.access_stats_section_stat_card_label}>
              {accessStats.referrals.label}
            </p>
            {/* 변화율 표시 */}
            <p
              className={
                styles[
                  `access_stats_section_stat_card_change_${accessStats.referrals.changeType}`
                ]
              }
            >
              {accessStats.referrals.change}
            </p>
          </div>
          {/* 값 표시 */}
          <p className={styles.access_stats_section_stat_card_value}>
            {accessStats.referrals.value}
          </p>
        </div>
      </div>

      {/* 디바이스 통계 섹션 */}
      <div className={styles.access_stats_section_device_stats_section}>
        <h3 className={styles.access_stats_section_device_stats_title}>
          디바이스 통계
        </h3>
        {/* recharts 라이브러리를 사용한 막대 차트 */}
        <DeviceStatsChart />
      </div>
    </div>
  );
}
