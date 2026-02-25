/* ========================================
   SA 관리자 로딩 페이지
   ======================================== */

/**
 * Loading
 *
 * 목적: SA 관리자 페이지가 로딩 중일 때 사용자에게 보여주는 로딩 화면입니다.
 *
 * 사용 페이지:
 * - /manager_sa 및 하위 페이지들
 */

import styles from "@/styles/error_page/loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loading_container} style={{ backgroundColor: "white" }}>
      <div className={styles.loading_content}>
        <div className={styles.loading_illustration}>
          <div className={styles.loading_container_wrapper}>
            <div className={styles.white_circle}>
              <img src="/images/loading_icon.svg" alt="Loading" className={styles.loading_icon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
