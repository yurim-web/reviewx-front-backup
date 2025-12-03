/* ========================================
   📊 통계 카드 섹션 컴포넌트 (공통)
   ======================================== */

/**
 * 통계 카드 섹션 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 통계 카드 섹션 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 *
 * 주요 기능:
 * - 통계 카드 6개를 직접 렌더링합니다
 * - 각 카드는 StatCard 컴포넌트를 사용합니다
 * - title은 하드코딩으로 작성하고, value만 데이터에서 가져옵니다
 *
 */

import StatCard from './StatCard';

// 통계 카드 값 타입 정의
interface StatCardValues {
  open_scheduled: string;
  in_progress: string;
  applying: string;
  total: string;
  ended: string;
  cancelled: string;
}

interface StatCardsSectionProps {
  stat_card_values: StatCardValues; // 통계 카드 값들
  styles: {
    stat_cards_section: string;
    stat_card: string;
    stat_card_title: string;
    stat_card_value: string;
    stat_card_value_cancelled: string;
  }; // CSS 모듈 스타일 객체
}

export default function StatCardsSection({
  stat_card_values,
  styles: cssStyles,
}: StatCardsSectionProps) {
  return (
    <div className={cssStyles.stat_cards_section}>
      {/* 통계 카드 6개를 직접 렌더링 */}
      {/* title은 하드코딩, value는 테이블 데이터(campaign_list)를 기반으로 계산된 값입니다 */}

      {/* 1. 오픈 예정 캠페인 */}
      <StatCard
        title="오픈 예정 캠페인"
        value={stat_card_values.open_scheduled}
        styles={cssStyles}
      />

      {/* 2. 진행 중인 캠페인 */}
      <StatCard
        title="진행 중인 캠페인"
        value={stat_card_values.in_progress}
        styles={cssStyles}
      />

      {/* 3. 신청 중인 캠페인 */}
      <StatCard
        title="신청 중인 캠페인"
        value={stat_card_values.applying}
        styles={cssStyles}
      />

      {/* 4. 전체 캠페인 */}
      <StatCard title="전체 캠페인" value={stat_card_values.total} styles={cssStyles} />

      {/* 5. 종료된 캠페인 */}
      <StatCard title="종료된 캠페인" value={stat_card_values.ended} styles={cssStyles} />

      {/* 6. 취소된 캠페인 - 빨간색으로 표시 */}
      <StatCard
        title="취소된 캠페인"
        value={stat_card_values.cancelled}
        isCancelled={true}
        styles={cssStyles}
      />
    </div>
  );
}

