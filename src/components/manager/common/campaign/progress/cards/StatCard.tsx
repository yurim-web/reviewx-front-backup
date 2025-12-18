/**
 * 진행 현황 통계 카드 컴포넌트
 *
 * manager_ga와 manager_sa에서 공통으로 사용하는 통계 카드 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 */

interface StatCardProps {
  /** 카드 제목 */
  title: string;
  /** 통계 값 */
  value: string;
  /** 취소된 캠페인 여부 (true일 경우 빨간색으로 표시) */
  isCancelled?: boolean;
  /** CSS 모듈 스타일 객체 */
  styles: {
    stat_card: string;
    stat_card_title: string;
    stat_card_value: string;
    stat_card_value_cancelled: string;
  };
}

export default function StatCard({
  title,
  value,
  isCancelled,
  styles: cssStyles,
}: StatCardProps) {
  const valueClassName = isCancelled
    ? `${cssStyles.stat_card_value} ${cssStyles.stat_card_value_cancelled}`
    : cssStyles.stat_card_value;

  return (
    <div className={cssStyles.stat_card}>
      <p className={cssStyles.stat_card_title}>{title}</p>
      <p className={valueClassName}>{value}</p>
    </div>
  );
}
