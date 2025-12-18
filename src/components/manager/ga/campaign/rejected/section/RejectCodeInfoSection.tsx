/* ========================================
   📋 반려 코드 안내 섹션 컴포넌트
   ======================================== */

/**
 * 반려 코드 안내 섹션 컴포넌트
 *
 * 목적: GA 관리자 반려내역 페이지의 반려 코드 안내 섹션을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/rejected (반려내역 페이지)
 *
 * 주요 기능:
 * - 반려 코드 안내 정보를 그리드 형태로 표시합니다
 * - 각 반려 코드의 코드, 카테고리, 사유를 표시합니다
 *
 */

import styles from '@/styles/manager_ga/campaign/rejected/reject_code_info_section.module.css';

export default function RejectCodeInfoSection() {
  return (
    <section className={styles.reject_code_info_section}>
      {/* 섹션 제목 - 박스 바깥에 배치 */}
      <h2 className={styles.section_title}>반려 코드 안내</h2>

      {/* 반려 코드 안내 박스 - 제목 제외한 내용만 포함 */}
      <div className={styles.reject_code_section}>
        <div className={styles.reject_code_grid}>
          {/* 반려 코드 R001 */}
          <div className={styles.reject_code_item}>
            <span className={styles.reject_code}>R001</span>
            <span className={styles.reject_code_category}>콘텐츠</span>
            <span className={styles.reject_code_reason}>구매 정보 불일치</span>
          </div>

          {/* 반려 코드 R002 */}
          <div className={styles.reject_code_item}>
            <span className={styles.reject_code}>R002</span>
            <span className={styles.reject_code_category}>콘텐츠</span>
            <span className={styles.reject_code_reason}>가이드 불이행</span>
          </div>

          {/* 반려 코드 R003 */}
          <div className={styles.reject_code_item}>
            <span className={styles.reject_code}>R003</span>
            <span className={styles.reject_code_category}>콘텐츠</span>
            <span className={styles.reject_code_reason}>콘텐츠 오류</span>
          </div>

          {/* 반려 코드 R004 */}
          <div className={styles.reject_code_item}>
            <span className={styles.reject_code}>R004</span>
            <span className={styles.reject_code_category}>콘텐츠</span>
            <span className={styles.reject_code_reason}>이미지 도용 의심</span>
          </div>

          {/* 반려 코드 R005 */}
          <div className={styles.reject_code_item}>
            <span className={styles.reject_code}>R005</span>
            <span className={styles.reject_code_category}>리뷰어/파트너</span>
            <span className={styles.reject_code_reason}>반복 반려 의심</span>
          </div>

          {/* 반려 코드 R006 */}
          <div className={styles.reject_code_item}>
            <span className={styles.reject_code}>R006</span>
            <span className={styles.reject_code_category}>캠페인</span>
            <span className={styles.reject_code_reason}>
              부적절한 콘텐츠 요청
            </span>
          </div>

          {/* 반려 코드 R007 */}
          <div className={styles.reject_code_item}>
            <span className={styles.reject_code}>R007</span>
            <span className={styles.reject_code_category}>정산</span>
            <span className={styles.reject_code_reason}>출금 정보 불일치</span>
          </div>

          {/* 반려 코드 R008 */}
          <div className={styles.reject_code_item}>
            <span className={styles.reject_code}>R008</span>
            <span className={styles.reject_code_category}>기타</span>
            <span className={styles.reject_code_reason}>그외 비매너 행위</span>
          </div>
        </div>
      </div>
    </section>
  );
}
