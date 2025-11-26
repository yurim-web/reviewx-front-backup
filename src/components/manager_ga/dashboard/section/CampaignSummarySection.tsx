/* ========================================
   📈 캠페인 관리 요약 섹션 컴포넌트
   ======================================== */

/**
 * 캠페인 관리 요약 섹션 컴포넌트
 *
 * 목적: 캠페인 관리 요약 통계를 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 캠페인 모집률, 달성률, 반려율, 신고율 통계 표시
 * - 4개의 통계 카드를 그리드로 배치
 *
 * 학습 포인트:
 * - props: 부모 컴포넌트에서 통계 데이터를 전달받음
 * - 배열의 map 함수: 통계 데이터 배열을 순회하며 StatCard 컴포넌트 렌더링
 * - key prop: React에서 리스트 렌더링 시 각 항목을 구분하기 위한 고유 키
 */

import styles from '@/styles/manager_ga/campaign_summary.module.css';
import StatCard, { StatCardData } from '../StatCard';

// CampaignSummarySection 컴포넌트의 props 타입 정의
interface CampaignSummarySectionProps {
  // 캠페인 통계 데이터 배열
  stats: StatCardData[];
}

export default function CampaignSummarySection({
  stats,
}: CampaignSummarySectionProps) {
  return (
    <div className={styles.campaign_summary_container}>
      <h2 className={styles.campaign_summary_title}>캠페인 관리 요약</h2>
      <div className={styles.stats_grid}>
        {/* map 함수를 사용하여 통계 카드 배열을 순회하며 렌더링 */}
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
    </div>
  );
}

