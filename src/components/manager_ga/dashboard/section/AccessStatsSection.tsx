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
 *
 * 학습 포인트:
 * - 컴포넌트 분리: 각 섹션을 독립적인 컴포넌트로 분리하여 재사용성 향상
 * - CSS 모듈: styles.chart_card를 사용하여 일관된 스타일 적용
 * - 그리드 레이아웃: styles.access_stats_grid로 통계 카드들을 나란히 배치
 * - 조건부 스타일: 변화율에 따라 positive/negative 스타일 적용
 */

import chartStyles from '@/styles/manager_ga/charts.module.css';
import deviceStatsStyles from '@/styles/manager_ga/device_stats.module.css';
import memberStatsStyles from '@/styles/manager_ga/member_stats.module.css';
import campaignSummaryStyles from '@/styles/manager_ga/campaign_summary.module.css';
import DeviceStatsChart from '../chart/DeviceStatsChart';

export default function AccessStatsSection() {
  return (
    <div className={chartStyles.chart_card}>
      <div className={chartStyles.chart_header}>
        {/* 섹션 제목 */}
        <h2 className={chartStyles.chart_card_title}>접속 통계</h2>
      </div>

      {/* 방문 수와 유입 수 통계 카드 그리드 */}
      <div className={deviceStatsStyles.access_stats_grid}>
        {/* 방문 수 카드 */}
        <div className={deviceStatsStyles.access_stat_card}>
          {/* 라벨과 변화율을 같은 줄에 배치 (space-between) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p className={memberStatsStyles.member_info_label}>방문 수</p>
            {/* 변화율 표시 - positive 클래스로 증가 표시 */}
            <p className={campaignSummaryStyles.stat_card_change_positive}>
              ↑ 50%
            </p>
          </div>
          {/* 값 표시 */}
          <p className={memberStatsStyles.member_info_value}>11,150회</p>
        </div>

        {/* 유입 수 카드 */}
        <div className={deviceStatsStyles.access_stat_card}>
          {/* 라벨과 변화율을 같은 줄에 배치 (space-between) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p className={memberStatsStyles.member_info_label}>유입 수</p>
            {/* 변화율 표시 - negative 클래스로 감소 표시 */}
            <p className={campaignSummaryStyles.stat_card_change_negative}>
              ↓ 50%
            </p>
          </div>
          {/* 값 표시 */}
          <p className={memberStatsStyles.member_info_value}>150회</p>
        </div>
      </div>

      {/* 디바이스 통계 섹션 */}
      <div className={deviceStatsStyles.device_stats_section}>
        <h3 className={deviceStatsStyles.device_stats_title}>디바이스 통계</h3>
        {/* recharts 라이브러리를 사용한 막대 차트 */}
        <DeviceStatsChart />
      </div>
    </div>
  );
}
