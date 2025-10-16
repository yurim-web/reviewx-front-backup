/* ========================================
   💰 포인트 세부 탭 네비게이션 컴포넌트
   ======================================== */

/**
 * 포인트 세부 탭 네비게이션 컴포넌트
 *
 * 목적: 포인트 페이지에서 전체/적립/출금 탭을 전환하는 네비게이션입니다.
 *
 * 주요 기능:
 * - 전체/적립/출금 탭 전환
 * - 활성 탭 표시
 * - 상단 고정으로 스크롤 시에도 접근 가능
 */

"use client";

import styles from "../../../styles/user/point/point.module.css";

interface PointTabNavigationProps {
  activePointTab: "all" | "earned" | "withdrawn";
  setActivePointTab: (tab: "all" | "earned" | "withdrawn") => void;
}

export default function PointTabNavigation({
  activePointTab,
  setActivePointTab,
}: PointTabNavigationProps) {
  return (
    <article className={styles.point_tab_navigation}>
      <div className={styles.left_point_tabs}>
        <button
          className={`${styles.point_tab} ${
            activePointTab === "all" ? styles.active : ""
          }`}
          onClick={() => setActivePointTab("all")}
        >
          <span>전체</span>
        </button>

        <button
          className={`${styles.point_tab} ${
            activePointTab === "earned" ? styles.active : ""
          }`}
          onClick={() => setActivePointTab("earned")}
        >
          <span>적립</span>
        </button>

        <button
          className={`${styles.point_tab} ${
            activePointTab === "withdrawn" ? styles.active : ""
          }`}
          onClick={() => setActivePointTab("withdrawn")}
        >
          <span>출금</span>
        </button>
      </div>
    </article>
  );
}
