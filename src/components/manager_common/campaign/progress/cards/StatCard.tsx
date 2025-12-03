/* ========================================
   📊 진행 현황 통계 카드 컴포넌트 (공통)
   ======================================== */

/**
 * 진행 현황 통계 카드 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 통계 카드 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 *
 * 주요 기능:
 * - 통계 제목과 값을 표시합니다
 * - 특정 통계는 빨간색으로 강조 표시할 수 있습니다
 *
 */

// 스타일 경로를 props로 받아서 manager_ga와 manager_sa 모두에서 사용 가능하도록 함
interface StatCardProps {
  title: string; // 카드 제목
  value: string; // 통계 값
  isCancelled?: boolean; // 취소된 캠페인 여부 (선택적)
  styles: {
    stat_card: string;
    stat_card_title: string;
    stat_card_value: string;
    stat_card_value_cancelled: string;
  }; // CSS 모듈 스타일 객체
}

/**
 * 통계 카드 컴포넌트
 *
 * @param title - 카드 제목
 * @param value - 통계 값
 * @param isCancelled - 취소된 캠페인 여부 (선택적, true일 경우 빨간색으로 표시)
 * @param styles - CSS 모듈 스타일 객체
 */
export default function StatCard({
  title,
  value,
  isCancelled,
  styles: cssStyles,
}: StatCardProps) {
  // 취소된 캠페인인 경우 빨간색 클래스를 추가합니다
  const valueClassName = isCancelled
    ? `${cssStyles.stat_card_value} ${cssStyles.stat_card_value_cancelled}`
    : cssStyles.stat_card_value;

  return (
    <div className={cssStyles.stat_card}>
      {/* 카드 제목 */}
      <p className={cssStyles.stat_card_title}>{title}</p>
      {/* 통계 값 - 취소된 캠페인인 경우 빨간색 클래스 적용 */}
      <p className={valueClassName}>{value}</p>
    </div>
  );
}

