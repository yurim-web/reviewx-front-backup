// 404 페이지
import Link from "next/link";
import styles from "../styles/error_page/not_found.module.css";

export default function NotFound() {
  return (
    <div className={styles.not_found_container}>
      <div className={styles.not_found_content}>
        <h1 className={styles.error_title}>404 ERROR</h1>

        <div className={styles.error_message}>
          <p>죄송합니다. 페이지를 찾을 수 없습니다.</p>
          <p>존재하지 않는 주소를 입력하셨거나,</p>
          <p>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</p>
        </div>

        <div className={styles.error_illustration}>
          <svg
            width="200"
            height="120"
            viewBox="0 0 200 120"
            className={styles.house_tree_svg}
          >
            {/* 나무 */}
            <line
              x1="70"
              y1="100"
              x2="70"
              y2="60"
              stroke="black"
              strokeWidth="2"
            />
            <circle
              cx="70"
              cy="50"
              r="15"
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
            <circle
              cx="65"
              cy="45"
              r="8"
              fill="none"
              stroke="black"
              strokeWidth="1.5"
            />
            <circle
              cx="75"
              cy="45"
              r="8"
              fill="none"
              stroke="black"
              strokeWidth="1.5"
            />
            <circle
              cx="70"
              cy="40"
              r="6"
              fill="none"
              stroke="black"
              strokeWidth="1.5"
            />

            {/* 집 */}
            <rect
              x="120"
              y="80"
              width="40"
              height="30"
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
            <polygon
              points="120,80 140,65 160,80"
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
            <rect
              x="135"
              y="90"
              width="8"
              height="15"
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
          </svg>
        </div>

        <Link href="/" className={styles.home_link}>
          홈으로
        </Link>
      </div>
    </div>
  );
}
