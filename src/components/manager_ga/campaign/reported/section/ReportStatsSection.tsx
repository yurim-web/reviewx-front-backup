/* ========================================
   📊 신고 내역 통계 섹션 컴포넌트
   ======================================== */

/**
 * 신고 내역 통계 섹션 컴포넌트
 *
 * 목적: GA 관리자 신고내역 페이지의 신고 내역 통계 섹션을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/reported (신고내역 페이지)
 *
 * 주요 기능:
 * - 신고 코드별 신고 횟수를 표시합니다
 * - 숫자를 천 단위로 포맷팅하여 표시합니다
 *
 * 학습 포인트:
 * - CSS 모듈: styles 객체를 통해 클래스명을 참조합니다
 * - JSX: HTML과 유사하지만 JavaScript 표현식을 사용할 수 있습니다
 * - 반복되는 요소를 하나씩 직접 작성하여 이해하기 쉽게 표현합니다
 * - 숫자 포맷팅: toLocaleString을 사용하여 천 단위 구분자를 추가합니다
 */

import styles from '@/styles/manager_ga/campaign/reported/report_stats_section.module.css';
import { report_stats } from '@/data/manager_ga/reported';

export default function ReportStatsSection() {
  // 숫자를 천 단위로 포맷팅하는 함수
  // 예: 19999 -> "19,999"
  const format_number = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <div className={styles.report_stats_section}>
      <div className={styles.report_stats_grid}>
        {/* 신고 코드 W001 통계 */}
        {/* report_stats[0]: { code: 'W001', count: 3 } */}
        <div className={styles.report_stats_item}>
          <span>W001</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[0].count)}회</span>
        </div>

        {/* 신고 코드 W002 통계 */}
        {/* report_stats[1]: { code: 'W002', count: 3 } */}
        <div className={styles.report_stats_item}>
          <span>W002</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[1].count)}회</span>
        </div>

        {/* 신고 코드 W003 통계 */}
        {/* report_stats[2]: { code: 'W003', count: 10 } */}
        <div className={styles.report_stats_item}>
          <span>W003</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[2].count)}회</span>
        </div>

        {/* 신고 코드 W004 통계 */}
        {/* report_stats[3]: { code: 'W004', count: 1020 } */}
        <div className={styles.report_stats_item}>
          <span>W004</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[3].count)}회</span>
        </div>

        {/* 신고 코드 W005 통계 */}
        {/* report_stats[4]: { code: 'W005', count: 0 } */}
        <div className={styles.report_stats_item}>
          <span>W005</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[4].count)}회</span>
        </div>

        {/* 신고 코드 W006 통계 */}
        {/* report_stats[5]: { code: 'W006', count: 18 } */}
        <div className={styles.report_stats_item}>
          <span>W006</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[5].count)}회</span>
        </div>

        {/* 신고 코드 W007 통계 */}
        {/* report_stats[6]: { code: 'W007', count: 8 } */}
        <div className={styles.report_stats_item}>
          <span>W007</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[6].count)}회</span>
        </div>

        {/* 신고 코드 W008 통계 */}
        {/* report_stats[7]: { code: 'W008', count: 3 } */}
        <div className={styles.report_stats_item}>
          <span>W008</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[7].count)}회</span>
        </div>

        {/* 신고 코드 W009 통계 */}
        {/* report_stats[8]: { code: 'W009', count: 0 } */}
        <div className={styles.report_stats_item}>
          <span>W009</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[8].count)}회</span>
        </div>

        {/* 신고 코드 W010 통계 */}
        {/* report_stats[9]: { code: 'W010', count: 0 } */}
        <div className={styles.report_stats_item}>
          <span>W010</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[9].count)}회</span>
        </div>

        {/* 신고 코드 W011 통계 */}
        {/* report_stats[10]: { code: 'W011', count: 10 } */}
        <div className={styles.report_stats_item}>
          <span>W011</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[10].count)}회</span>
        </div>

        {/* 신고 코드 W012 통계 */}
        {/* report_stats[11]: { code: 'W012', count: 5369 } */}
        <div className={styles.report_stats_item}>
          <span>W012</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[11].count)}회</span>
        </div>

        {/* 신고 코드 W013 통계 */}
        {/* report_stats[12]: { code: 'W013', count: 333 } */}
        <div className={styles.report_stats_item}>
          <span>W013</span>
          <span className={styles.report_stats_separator}>·</span>
          <span>{format_number(report_stats[12].count)}회</span>
        </div>
      </div>
    </div>
  );
}
