/* ========================================
   🔍 필터 섹션 컴포넌트
   ======================================== */

/**
 * 필터 섹션 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지의 필터 옵션들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - 날짜 필터
 * - 검색 필터
 * - 상태 필터
 * - 유형 필터
 * - 채널 필터
 * - 정렬 필터
 * - 신고 필터
 *
 * 학습 포인트:
 * - CSS 모듈: styles 객체를 통해 클래스명을 참조합니다
 * - JSX: HTML과 유사하지만 JavaScript 표현식을 사용할 수 있습니다
 */

import styles from '@/styles/manager_ga/campaign/progress/filter_section.module.css';

export default function FilterSection() {
  return (
    <div className={styles.filter_section}>
      {/* 날짜 필터 */}
      <div className={styles.filter_item}>
        <div className={styles.filter_icon}></div>
        <span className={styles.filter_text}>2025-10-01 ~ 2025-10-31</span>
      </div>

      {/* 검색 필터 */}
      <div className={styles.filter_item}>
        <div className={styles.search_icon}></div>
        <span className={styles.filter_text}>검색</span>
      </div>

      {/* 상태 필터 */}
      <div className={styles.filter_item}>
        <div className={styles.checkbox_icon}></div>
        <span className={styles.filter_text}>상태</span>
        <div className={styles.dropdown_arrow}></div>
      </div>

      {/* 유형 필터 */}
      <div className={styles.filter_item}>
        <div className={styles.checkbox_icon}></div>
        <span className={styles.filter_text}>유형</span>
        <div className={styles.dropdown_arrow}></div>
      </div>

      {/* 채널 필터 */}
      <div className={styles.filter_item}>
        <div className={styles.checkbox_icon}></div>
        <span className={styles.filter_text}>채널</span>
        <div className={styles.dropdown_arrow}></div>
      </div>

      {/* 정렬 필터 */}
      <div className={styles.filter_item}>
        <span className={styles.filter_text}>최신순</span>
        <div className={styles.dropdown_arrow}></div>
      </div>

      {/* 신고 필터 */}
      <div className={styles.filter_item}>
        <span className={styles.filter_text}>신고</span>
        <div className={styles.report_icon}></div>
      </div>
    </div>
  );
}
