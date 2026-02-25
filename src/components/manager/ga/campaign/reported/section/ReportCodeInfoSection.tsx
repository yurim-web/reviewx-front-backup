/* ========================================
   
   ======================================== */

/**
 * 신고 코드 안내 섹션 컴포넌트
 *
 * 목적: GA 관리자 신고내역 페이지의 신고 코드 안내 섹션을 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/reported (신고내역 페이지)
 *
 */

import styles from "@/styles/manager_ga/campaign/campaign_common.module.css";

export default function ReportCodeInfoSection() {
  return (
    <section className={styles.report_code_info_section}>
      {/* 섹션 제목 - 박스 바깥에 배치 */}
      <h2 className={styles.section_title}>신고 코드 안내</h2>

      {/* 신고 코드 안내 박스 - 제목 제외한 내용만 포함 */}
      <div className={styles.section_box}>
        <div className={styles.report_code_grid}>
          {/* 신고 코드 W001 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W001</span>
            <span className={styles.text}>리뷰어</span>
            <span className={styles.text}>선정 후 취소</span>
          </div>

          {/* 신고 코드 W002 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W002</span>
            <span className={styles.text}>리뷰어</span>
            <span className={styles.text}>지각 제출</span>
          </div>

          {/* 신고 코드 W003 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W003</span>
            <span className={styles.text}>리뷰어</span>
            <span className={styles.text}>무단 이탈 · 노쇼</span>
          </div>

          {/* 신고 코드 W004 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W004</span>
            <span className={styles.text}>리뷰어</span>
            <span className={styles.text}>노출 기간 불이행</span>
          </div>

          {/* 신고 코드 W005 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W005</span>
            <span className={styles.text}>리뷰어</span>
            <span className={styles.text}>수정 요청 불이행</span>
          </div>

          {/* 신고 코드 W006 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W006</span>
            <span className={styles.text}>파트너</span>
            <span className={styles.text}>게시 후 취소</span>
          </div>

          {/* 신고 코드 W007 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W007</span>
            <span className={styles.text}>파트너</span>
            <span className={styles.text}>부적절한 캠페인 게시</span>
          </div>

          {/* 신고 코드 W008 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W008</span>
            <span className={styles.text}>파트너</span>
            <span className={styles.text}>공정위 위반 요청</span>
          </div>

          {/* 신고 코드 W009 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W009</span>
            <span className={styles.text}>시스템</span>
            <span className={styles.text}>비정상 요청 반복</span>
          </div>

          {/* 신고 코드 W010 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W010</span>
            <span className={styles.text}>시스템</span>
            <span className={styles.text}>중복 계정 탐지</span>
          </div>

          {/* 신고 코드 W011 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W011</span>
            <span className={styles.text}>시스템</span>
            <span className={styles.text}>콘텐츠 중복 탐지</span>
          </div>

          {/* 신고 코드 W012 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W012</span>
            <span className={styles.text}>시스템</span>
            <span className={styles.text}>비정상 접근 기록</span>
          </div>

          {/* 신고 코드 W013 */}
          <div className={styles.report_code_item}>
            <span className={styles.report_code}>W013</span>
            <span className={styles.text}>기타</span>
            <span className={styles.text}>그외 비매너 행위</span>
          </div>
        </div>
      </div>
    </section>
  );
}
