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

import { useRouter } from "next/navigation";
import styles from "../../../styles/user/mypage/navigation.module.css";

interface SubTabNavigationProps {
  activeSubTab: "profile" | "channel";
  setActiveSubTab: (tab: "profile" | "channel") => void;
}

export default function SubTabNavigation({
  activeSubTab,
  setActiveSubTab,
}: SubTabNavigationProps) {
  const router = useRouter();

  /**
   * 서브 탭 클릭 핸들러
   * 각 탭 클릭 시 해당 페이지로 이동
   */
  const handleSubTabClick = (tab: "profile" | "channel") => {
    switch (tab) {
      case "profile":
        router.push("/user/mypage/profile");
        break;
      case "channel":
        router.push("/user/mypage/channel");
        break;
    }
  };

  return (
    <div className={styles.sub_tab_container}>
      <button
        className={`${styles.sub_tab_item} ${
          activeSubTab === "profile" ? styles.active : ""
        }`}
        onClick={() => handleSubTabClick("profile")}
      >
        프로필
      </button>
      <button
        className={`${styles.sub_tab_item} ${
          activeSubTab === "channel" ? styles.active : ""
        }`}
        onClick={() => handleSubTabClick("channel")}
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
