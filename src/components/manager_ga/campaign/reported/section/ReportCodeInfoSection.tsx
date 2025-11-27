/* ========================================
   📋 신고 코드 안내 섹션 컴포넌트
   ======================================== */

/**
 * 신고 코드 안내 섹션 컴포넌트
 *
 * 목적: GA 관리자 신고내역 페이지의 신고 코드 안내 섹션을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/reported (신고내역 페이지)
 *
 * 주요 기능:
 * - 신고 코드 안내 정보를 그리드 형태로 표시합니다
 * - 각 신고 코드의 코드, 카테고리, 사유를 표시합니다
 *
 * 학습 포인트:
 * - CSS 모듈: styles 객체를 통해 클래스명을 참조합니다
 * - JSX: HTML과 유사하지만 JavaScript 표현식을 사용할 수 있습니다
 * - 반복되는 요소를 하나씩 직접 작성하여 이해하기 쉽게 표현합니다
 */

import styles from '@/styles/manager_ga/campaign/reported/report_code_info_section.module.css';

export default function ReportCodeInfoSection() {
  return (
    <section className={styles.report_code_info_section}>
      {/* 섹션 제목 - 박스 바깥에 배치 */}
      <h2 className={styles.section_title}>신고 코드 안내</h2>

      {/* 신고 코드 안내 박스 - 제목 제외한 내용만 포함 */}
      <div className={styles.report_code_section}>
        <div className={styles.report_code_grid}>
          {/* 신고 코드 W001 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W001</span>
            <span className={styles.report_code_category}>리뷰어</span>
            <span className={styles.report_code_reason}>선정 후 취소</span>
          </div>

          {/* 신고 코드 W002 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W002</span>
            <span className={styles.report_code_category}>리뷰어</span>
            <span className={styles.report_code_reason}>지각 제출</span>
          </div>

          {/* 신고 코드 W003 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W003</span>
            <span className={styles.report_code_category}>리뷰어</span>
            <span className={styles.report_code_reason}>무단 이탈 · 노쇼</span>
          </div>

          {/* 신고 코드 W004 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W004</span>
            <span className={styles.report_code_category}>리뷰어</span>
            <span className={styles.report_code_reason}>노출 기간 불이행</span>
          </div>

          {/* 신고 코드 W005 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W005</span>
            <span className={styles.report_code_category}>리뷰어</span>
            <span className={styles.report_code_reason}>수정 요청 불이행</span>
          </div>

          {/* 신고 코드 W006 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W006</span>
            <span className={styles.report_code_category}>파트너</span>
            <span className={styles.report_code_reason}>게시 후 취소</span>
          </div>

          {/* 신고 코드 W007 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W007</span>
            <span className={styles.report_code_category}>파트너</span>
            <span className={styles.report_code_reason}>
              부적절한 캠페인 게시
            </span>
          </div>

          {/* 신고 코드 W008 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W008</span>
            <span className={styles.report_code_category}>파트너</span>
            <span className={styles.report_code_reason}>공정위 위반 요청</span>
          </div>

          {/* 신고 코드 W009 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W009</span>
            <span className={styles.report_code_category}>시스템</span>
            <span className={styles.report_code_reason}>비정상 요청 반복</span>
          </div>

          {/* 신고 코드 W010 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W010</span>
            <span className={styles.report_code_category}>시스템</span>
            <span className={styles.report_code_reason}>중복 계정 탐지</span>
          </div>

          {/* 신고 코드 W011 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W011</span>
            <span className={styles.report_code_category}>시스템</span>
            <span className={styles.report_code_reason}>콘텐츠 중복 탐지</span>
          </div>

          {/* 신고 코드 W012 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W012</span>
            <span className={styles.report_code_category}>시스템</span>
            <span className={styles.report_code_reason}>비정상 접근 기록</span>
          </div>

          {/* 신고 코드 W013 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W013</span>
            <span className={styles.report_code_category}>기타</span>
            <span className={styles.report_code_reason}>그외 비매너 행위</span>
          </div>
        </div>
      </div>
    </section>
  );
}
