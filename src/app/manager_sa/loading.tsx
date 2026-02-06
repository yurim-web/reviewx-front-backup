/* ========================================
   ⏳ SA 관리자 로딩 페이지
   ======================================== */

/**
 * SA 관리자 로딩 페이지
 *
 * 목적: SA 관리자 페이지가 로딩 중일 때 사용자에게 보여주는 로딩 화면입니다.
 *
 * 페이지 경로:
 * - /manager_sa 및 하위 페이지들
 *
 * 사용 파일:
 * - CSS: loading.module.css
 *
 * 주요 기능:
 * - 로딩 메시지 표시
 * - 로딩 스피너 애니메이션
 * - 로딩 애니메이션
 * - 사용자 친화적인 로딩 UI
 * - 레이아웃 깜빡임 방지를 위한 전체 화면 커버
 */

import styles from "@/styles/error_page/loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loading_container} style={{ backgroundColor: 'white' }}>
      <div className={styles.loading_content}>
        <div className={styles.loading_illustration}>
          <div className={styles.loading_container_wrapper}>
            <div className={styles.white_circle}>
              <img
                src="/images/loading_icon.svg"
                alt="Loading"
                className={styles.loading_icon}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

