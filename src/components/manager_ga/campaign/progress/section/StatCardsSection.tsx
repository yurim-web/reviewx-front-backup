/* ========================================
   📊 통계 카드 섹션 컴포넌트
   ======================================== */

/**
 * 통계 카드 섹션 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지의 상단 통계 카드들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - 통계 카드 6개를 직접 렌더링합니다
 * - 공통 StatCardsSection 컴포넌트를 사용하여 중복 코드를 제거합니다
 *
 */

import StatCardsSectionCommon from '@/components/manager_common/campaign/progress/cards/StatCardsSection';
import { calculate_stat_card_values } from '@/data/manager_ga/progress';
import styles from '@/styles/manager_ga/campaign/progress/stat_card.module.css';

export default function StatCardsSection() {
  // 통계 카드 값들을 계산합니다
  // calculate_stat_card_values 함수는 campaign_list를 기반으로 각 상태별 개수를 계산합니다
  const stat_card_values = calculate_stat_card_values();

  return (
    <StatCardsSectionCommon
      stat_card_values={stat_card_values}
      styles={styles}
    />
  );
}




