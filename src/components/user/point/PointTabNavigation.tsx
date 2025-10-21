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

import { useRouter } from "next/navigation";
import styles from "../../../styles/user/point/point.module.css";

interface PointTabNavigationProps {
  activePointTab: "all" | "earned" | "withdrawn";
  setActivePointTab: (tab: "all" | "earned" | "withdrawn") => void;
}

export default function PointTabNavigation({
  activePointTab,
  setActivePointTab,
}: PointTabNavigationProps) {
  const router = useRouter();

  /**
   * 포인트 탭 클릭 핸들러
   * 각 탭 클릭 시 해당 페이지로 이동
   */
  const handlePointTabClick = (tab: "all" | "earned" | "withdrawn") => {
    switch (tab) {
      case "all":
        router.push("/user/point/all");
        break;
      case "earned":
        router.push("/user/point/earned");
        break;
      case "withdrawn":
        router.push("/user/point/withdrawn");
        break;
    }
  };

  return (
    <article className={styles.point_tab_navigation}>
      <div className={styles.left_point_tabs}>
        <button
          className={`${styles.point_tab} ${
            activePointTab === "all" ? styles.active : ""
          }`}
          onClick={() => handlePointTabClick("all")}
        >
          <span>전체</span>
        </button>

        <button
          className={`${styles.point_tab} ${
            activePointTab === "earned" ? styles.active : ""
          }`}
          onClick={() => handlePointTabClick("earned")}
        >
          <span>적립</span>
        </button>

        <button
          className={`${styles.point_tab} ${
            activePointTab === "withdrawn" ? styles.active : ""
          }`}
          onClick={() => handlePointTabClick("withdrawn")}
        >
          <span>출금</span>
        </button>
      </div>
    </article>
  );
}
