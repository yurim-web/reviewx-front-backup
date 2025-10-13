// 에러 났을 때 화면
"use client"; // 에러 UI는 클라이언트 컴포넌트

import Link from "next/link";
import styles from "../styles/error_page/error.module.css";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.error_container}>
      <div className={styles.error_content}>
        <h1 className={styles.error_title}>ERROR</h1>

        <div className={styles.error_message}>
          <p>죄송합니다. 예기치 않은 오류가 발생했습니다.</p>
          <p>잠시 후 다시 시도해주세요.</p>
        </div>

        <div className={styles.error_details}>
          <strong>오류 정보:</strong>
          <br />
          {error.message}
          {error.digest && (
            <>
              <br />
              <strong>오류 코드:</strong> {error.digest}
            </>
          )}
        </div>

        <div className={styles.error_illustration}>
          <svg
            width="200"
            height="120"
            viewBox="0 0 200 120"
            className={styles.error_icon_svg}
          >
            {/* 경고 아이콘 */}
            <circle
              cx="100"
              cy="60"
              r="40"
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
            <line
              x1="100"
              y1="30"
              x2="100"
              y2="70"
              stroke="black"
              strokeWidth="3"
            />
            <line
              x1="100"
              y1="75"
              x2="100"
              y2="85"
              stroke="black"
              strokeWidth="2"
            />

            {/* 깨진 화면 효과 */}
            <rect
              x="20"
              y="20"
              width="160"
              height="80"
              fill="none"
              stroke="black"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            <line
              x1="50"
              y1="40"
              x2="150"
              y2="80"
              stroke="red"
              strokeWidth="2"
            />
            <line
              x1="150"
              y1="40"
              x2="50"
              y2="80"
              stroke="red"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div>
          <button onClick={reset} className={styles.retry_button}>
            다시 시도
          </button>
          <Link href="/" className={styles.home_link}>
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
