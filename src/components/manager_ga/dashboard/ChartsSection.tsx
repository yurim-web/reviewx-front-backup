/* ========================================
   📊 차트 섹션 컴포넌트
   ======================================== */

/**
 * 차트 섹션 컴포넌트
 *
 * 목적: 캠페인 모집 통계, 반려/신고 통계, 접속 통계를 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 캠페인 모집 통계 차트
 * - 반려/신고 통계 차트
 * - 접속 통계 및 디바이스 통계
 *
 * 학습 포인트:
 * - 컴포넌트 분리: 큰 섹션을 작은 컴포넌트로 나누어 관리
 * - 재사용성: 각 섹션 컴포넌트를 독립적으로 사용
 * - 컴포넌트 조합: 여러 섹션 컴포넌트를 하나의 그리드로 배치
 */

import styles from '@/styles/manager_ga/dashboard/charts.module.css';
import CampaignRecruitmentSection from './section/CampaignRecruitmentSection';
import RejectionReportSection from './section/RejectionReportSection';
import AccessStatsSection from './section/AccessStatsSection';

export default function ChartsSection() {
  return (
    <div className={styles.charts_grid_three}>
      {/* 캠페인 모집 통계 섹션 */}
      <CampaignRecruitmentSection />

      {/* 반려/신고 통계 섹션 */}
      <RejectionReportSection />

      {/* 접속 통계 섹션 */}
      <AccessStatsSection />
    </div>
  );
}
