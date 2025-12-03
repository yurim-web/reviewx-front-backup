/* ========================================
   📊 리뷰어 통계 섹션 컴포넌트 (래퍼)
   ======================================== */

/**
 * 리뷰어 통계 섹션 컴포넌트 (래퍼)
 *
 * 목적: GA 관리자 리뷰어 목록 페이지에서 공통 MemberStatsSection을 사용합니다.
 *       스타일과 데이터를 전달하여 manager_ga에 맞게 렌더링합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers (리뷰어 목록 페이지)
 *
 */

import MemberStatsSectionCommon from '@/components/manager_common/member/stats/MemberStatsSection';
import styles from '@/styles/manager_ga/member/reviewers/reviewer_stats_section.module.css';
import { reviewer_stats } from '@/data/manager_ga/member/reviewers';

export default function ReviewerStatsSection() {
  return (
    <MemberStatsSectionCommon
      stats={reviewer_stats}
      styles={
        styles as {
          stats_section: string;
          stat_card: string;
          stat_card_label: string;
          stat_card_value: string;
        }
      }
    />
  );
}
