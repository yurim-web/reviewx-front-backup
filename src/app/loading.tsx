/* ========================================
   ⏳ 로딩 페이지
   ======================================== */

/**
 * 로딩 페이지
 *
 * 목적: 페이지나 컴포넌트가 로딩 중일 때 사용자에게 보여주는 로딩 화면입니다.
 *
 * 페이지 경로:
 * - 자동으로 로딩 중일 때 표시
 *
 * 사용 파일:
 * - CSS: loading.module.css
 *
 * 주요 기능:
 * - 로딩 메시지 표시
 * - 로딩 스피너 애니메이션
 * - 로딩 점 애니메이션
 * - 사용자 친화적인 로딩 UI
 */

import styles from "../styles/error_page/loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loading_container}>
      <div className={styles.loading_content}>
        <h1 className={styles.loading_title}>로딩 중</h1>

        <div className={styles.loading_message}>
          <p>잠시만 기다려주세요.</p>
          <p>페이지를 불러오고 있습니다.</p>
        </div>

        <div className={styles.loading_illustration}>
          <div className={styles.loading_spinner}></div>
        </div>

        <div className={styles.loading_dots}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </div>
  );
}
