/* ========================================
   📊 반려 내역 통계 섹션 컴포넌트
   ======================================== */

/**
 * 반려 내역 통계 섹션 컴포넌트
 *
 * 목적: GA 관리자 반려내역 페이지의 반려 내역 통계 섹션을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/rejected (반려내역 페이지)
 *
 * 주요 기능:
 * - 반려 코드별 반려 횟수를 표시합니다
 * - 숫자를 천 단위로 포맷팅하여 표시합니다
 *
 * 학습 포인트:
 * - CSS 모듈: styles 객체를 통해 클래스명을 참조합니다
 * - JSX: HTML과 유사하지만 JavaScript 표현식을 사용할 수 있습니다
 * - 반복되는 요소를 하나씩 직접 작성하여 이해하기 쉽게 표현합니다
 * - 숫자 포맷팅: toLocaleString을 사용하여 천 단위 구분자를 추가합니다
 */

import styles from '@/styles/manager_ga/campaign/rejected/reject_stats_section.module.css';

export default function RejectStatsSection() {
  // 숫자를 천 단위로 포맷팅하는 함수
  // 예: 19999 -> "19,999"
  const format_number = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <div className={styles.reject_stats_section}>
      <div className={styles.reject_stats_grid}>
        {/* 반려 코드 R001 통계 */}
        <div className={styles.reject_stats_item}>
          <span>R001</span>
          <span className={styles.reject_stats_separator}>·</span>
          <span>{format_number(3)}회</span>
        </div>

        {/* 반려 코드 R002 통계 */}
        <div className={styles.reject_stats_item}>
          <span>R002</span>
          <span className={styles.reject_stats_separator}>·</span>
          <span>{format_number(3)}회</span>
        </div>

        {/* 반려 코드 R003 통계 */}
        <div className={styles.reject_stats_item}>
          <span>R003</span>
          <span className={styles.reject_stats_separator}>·</span>
          <span>{format_number(3)}회</span>
        </div>

        {/* 반려 코드 R004 통계 */}
        <div className={styles.reject_stats_item}>
          <span>R004</span>
          <span className={styles.reject_stats_separator}>·</span>
          <span>{format_number(3)}회</span>
        </div>

        {/* 반려 코드 R005 통계 */}
        <div className={styles.reject_stats_item}>
          <span>R005</span>
          <span className={styles.reject_stats_separator}>·</span>
          <span>{format_number(3)}회</span>
        </div>

        {/* 반려 코드 R006 통계 */}
        <div className={styles.reject_stats_item}>
          <span>R006</span>
          <span className={styles.reject_stats_separator}>·</span>
          <span>{format_number(19999)}회</span>
        </div>

        {/* 반려 코드 R007 통계 */}
        <div className={styles.reject_stats_item}>
          <span>R007</span>
          <span className={styles.reject_stats_separator}>·</span>
          <span>{format_number(100)}회</span>
        </div>

        {/* 반려 코드 R008 통계 */}
        <div className={styles.reject_stats_item}>
          <span>R008</span>
          <span className={styles.reject_stats_separator}>·</span>
          <span>{format_number(1100)}회</span>
        </div>
      </div>
    </div>
  );
}
