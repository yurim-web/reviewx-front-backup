/* ========================================
   💰 포인트 세부 탭 네비게이션 컴포넌트 (공통)
   ======================================== */

/**
 * 포인트 세부 탭 네비게이션 컴포넌트
 *
 * 📍 사용 페이지:
 * - /user/point/all (사용자 포인트 전체 페이지)
 * - /user/point/earned (사용자 포인트 적립 페이지)
 * - /user/point/withdrawn (사용자 포인트 출금 페이지)
 * - /partner/point/all (파트너 포인트 전체 페이지)
 * - /partner/point/earned (파트너 포인트 충전 페이지)
 * - /partner/point/withdrawn (파트너 포인트 사용 페이지)
 *
 * 목적: 포인트 페이지에서 전체/적립(충전)/출금(사용) 탭을 전환하는 네비게이션입니다.
 *
 */

"use client";

import { useRouter } from "next/navigation";
import styles from "@/styles/user/point/point.module.css";

/**
 * 포인트 탭 타입
 */
type PointTab = "all" | "earned" | "withdrawn";

/**
 * PointTabNavigation Props 타입
 */
interface PointTabNavigationProps {
  /** 현재 활성화된 탭 */
  activePointTab: PointTab;
  /** 탭 변경 핸들러 (사용하지 않아도 되지만 호환성을 위해 유지) */
  setActivePointTab: (tab: PointTab) => void;
  /** 기본 경로 (예: "/user/point" 또는 "/partner/point") */
  basePath: "/user/point" | "/partner/point";
  /** 탭 텍스트 설정 (user: { earned: "적립", withdrawn: "출금" }, partner: { earned: "충전", withdrawn: "사용" }) */
  tabLabels: {
    earned: string;
    withdrawn: string;
  };
}

/**
 * 포인트 세부 탭 네비게이션 컴포넌트
 */
export default function PointTabNavigation({
  activePointTab,
  setActivePointTab,
  basePath,
  tabLabels,
}: PointTabNavigationProps) {
  const router = useRouter();

  /** 포인트 탭 클릭 핸들러 - 각 탭 클릭 시 해당 페이지로 이동 */
  const handlePointTabClick = (tab: PointTab) => {
    router.push(`${basePath}/${tab}`);
  };

  /** 탭 버튼 렌더링 헬퍼 함수 */
  const renderTabButton = (tab: PointTab, label: string) => (
    <button
      className={`${styles.point_tab} ${activePointTab === tab ? styles.active : ""}`}
      onClick={() => handlePointTabClick(tab)}
    >
      <span>{label}</span>
    </button>
  );

  return (
    <article className={styles.point_tab_navigation}>
      <div className={styles.left_point_tabs}>
        {renderTabButton("all", "전체")}
        {renderTabButton("earned", tabLabels.earned)}
        {renderTabButton("withdrawn", tabLabels.withdrawn)}
      </div>
    </article>
  );
}
