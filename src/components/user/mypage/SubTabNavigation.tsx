/* ========================================
   📑 마이페이지 서브 탭 네비게이션 컴포넌트
   ======================================== */

/**
 * 마이페이지 서브 탭 네비게이션 컴포넌트
 *
 * 목적: 마이페이지에서 프로필과 채널 탭을 전환하는 네비게이션입니다.
 *
 * 사용 페이지:
 * - /user/mypage (서브 탭 네비게이션)
 *
 * 주요 기능:
 * - 프로필/채널 탭 전환
 * - 활성 탭 표시 (밑줄 인디케이터)
 * - 상단 고정으로 스크롤 시에도 접근 가능
 */

"use client";

import styles from "../../../styles/user/mypage/navigation.module.css";

interface SubTabNavigationProps {
  activeSubTab: "profile" | "channel";
  setActiveSubTab: (tab: "profile" | "channel") => void;
}

export default function SubTabNavigation({
  activeSubTab,
  setActiveSubTab,
}: SubTabNavigationProps) {
  return (
    <div className={styles.sub_tab_container}>
      <button
        className={`${styles.sub_tab_item} ${
          activeSubTab === "profile" ? styles.active : ""
        }`}
        onClick={() => setActiveSubTab("profile")}
      >
        프로필
      </button>
      <button
        className={`${styles.sub_tab_item} ${
          activeSubTab === "channel" ? styles.active : ""
        }`}
        onClick={() => setActiveSubTab("channel")}
      >
        채널
      </button>
      {activeSubTab === "profile" && (
        <div className={styles.sub_tab_indicator} />
      )}
      {activeSubTab === "channel" && (
        <div className={styles.sub_tab_indicator_channel} />
      )}
    </div>
  );
}
