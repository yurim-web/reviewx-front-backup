/* ========================================
   📊 통계 카드 섹션 컴포넌트
   ======================================== */

/**
 * 통계 카드 섹션 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지의 상단 통계 카드들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - 통계 카드 6개를 직접 렌더링합니다
 * - 각 카드는 StatCard 컴포넌트를 사용합니다
 * - title은 하드코딩으로 작성하고, value만 데이터에서 가져옵니다
 *
 * 학습 포인트:
 * - JSX에서 컴포넌트를 여러 개 직접 작성하는 방법
 * - props 전달: 각 StatCard 컴포넌트에 title, value를 전달합니다
 * - 조건부 prop 전달: isCancelled는 취소된 캠페인에만 전달합니다
 */

import StatCard from '../StatCard';
import { calculate_stat_card_values } from '@/data/manager_ga/progress';
import styles from '@/styles/manager_ga/campaign/progress/stat_card.module.css';

export default function StatCardsSection() {
  // 통계 카드 값들을 계산합니다
  // calculate_stat_card_values 함수는 campaign_list를 기반으로 각 상태별 개수를 계산합니다
  const stat_card_values = calculate_stat_card_values();

  return (
    <div className={styles.stat_cards_section}>
      {/* 통계 카드 6개를 직접 렌더링 */}
      {/* title은 하드코딩, value는 테이블 데이터(campaign_list)를 기반으로 계산된 값입니다 */}

      {/* 1. 오픈 예정 캠페인 */}
      <StatCard
        title="오픈 예정 캠페인"
        value={stat_card_values.open_scheduled}
      />

      {/* 2. 진행 중인 캠페인 */}
      <StatCard title="진행 중인 캠페인" value={stat_card_values.in_progress} />

      {/* 3. 신청 중인 캠페인 */}
      <StatCard title="신청 중인 캠페인" value={stat_card_values.applying} />

      {/* 4. 전체 캠페인 */}
      <StatCard title="전체 캠페인" value={stat_card_values.total} />

      {/* 5. 종료된 캠페인 */}
      <StatCard title="종료된 캠페인" value={stat_card_values.ended} />

      {/* 6. 취소된 캠페인 - 빨간색으로 표시 */}
      <StatCard
        title="취소된 캠페인"
        value={stat_card_values.cancelled}
        isCancelled={true}
      />
    </div>
  );
}
