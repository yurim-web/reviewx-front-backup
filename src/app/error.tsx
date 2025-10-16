/* ========================================
   ⚠️ 에러 페이지
   ======================================== */

/**
 * 에러 페이지
 *
 * 목적: 애플리케이션에서 예기치 않은 오류가 발생했을 때 사용자에게 보여주는 에러 페이지입니다.
 *
 * 페이지 경로:
 * - 자동으로 에러 발생 시 표시
 *
 * 사용 파일:
 * - CSS: error.module.css
 *
 * 주요 기능:
 * - 에러 메시지 표시
 * - 에러 코드 표시 (digest가 있는 경우)
 * - 다시 시도 버튼 (reset 함수 호출)
 * - 홈으로 이동 링크
 * - 에러 일러스트레이션 (SVG)
 */

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
