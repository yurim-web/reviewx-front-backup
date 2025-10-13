// 로딩중 일때 뜨는 화면
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
