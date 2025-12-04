/**
 * 통계 카드 섹션 컴포넌트
 *
 * manager_ga와 manager_sa에서 공통으로 사용하는 통계 카드 섹션 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 */

import StatCard from "./StatCard";

interface StatCardValues {
  open_scheduled: string;
  in_progress: string;
  applying: string;
  total: string;
  ended: string;
  cancelled: string;
}

interface StatCardsSectionProps {
  /** 통계 카드 값들 */
  stat_card_values: StatCardValues;
  /** CSS 모듈 스타일 객체 */
  styles: {
    stat_cards_section: string;
    stat_card: string;
    stat_card_title: string;
    stat_card_value: string;
    stat_card_value_cancelled: string;
  };
}

export default function StatCardsSection({
  stat_card_values,
  styles: cssStyles,
}: StatCardsSectionProps) {
  return (
    <div className={cssStyles.stat_cards_section}>
      <StatCard
        title="오픈 예정 캠페인"
        value={stat_card_values.open_scheduled}
        styles={cssStyles}
      />
      <StatCard
        title="진행 중인 캠페인"
        value={stat_card_values.in_progress}
        styles={cssStyles}
      />
      <StatCard
        title="신청 중인 캠페인"
        value={stat_card_values.applying}
        styles={cssStyles}
      />
      <StatCard
        title="전체 캠페인"
        value={stat_card_values.total}
        styles={cssStyles}
      />
      <StatCard
        title="종료된 캠페인"
        value={stat_card_values.ended}
        styles={cssStyles}
      />
      <StatCard
        title="취소된 캠페인"
        value={stat_card_values.cancelled}
        isCancelled={true}
        styles={cssStyles}
      />
    </div>
  );
}
