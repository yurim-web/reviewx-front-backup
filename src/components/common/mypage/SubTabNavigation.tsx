/* ========================================
   마이페이지 서브 탭 네비게이션 컴포넌트
   ======================================== */

/**
 * SubTabNavigation
 *
 * 목적: 마이페이지 내 프로필·채널 탭 전환 UI
 *
 * 사용 페이지:
 * - /user/mypage/profile (사용자 마이페이지 프로필)
 * - /user/mypage/channel (사용자 마이페이지 채널)
 * - /partner/mypage/profile (파트너 마이페이지 프로필)
 */

"use client";

import { useRouter } from "next/navigation";
import styles from "@/styles/user/mypage/navigation.module.css";

type SubTab = "profile" | "channel";

interface SubTabNavigationProps {
  /** 현재 활성화된 서브 탭 */
  activeSubTab: SubTab;
  /** 서브 탭 변경 핸들러 */
  setActiveSubTab: (tab: SubTab) => void;
  /** 기본 경로 (예: "/user/mypage" 또는 "/partner/mypage") */
  basePath: "/user/mypage" | "/partner/mypage";
  /** 사용 가능한 탭 목록 (user: ['profile', 'channel'], partner: ['profile']) */
  availableTabs: SubTab[];
}

interface TabInfo {
  id: SubTab;
  label: string;
  indicatorClass: string;
}

const TAB_CONFIG: Record<SubTab, TabInfo> = {
  profile: {
    id: "profile",
    label: "프로필",
    indicatorClass: styles.sub_tab_indicator,
  },
  channel: {
    id: "channel",
    label: "채널",
    indicatorClass: styles.sub_tab_indicator_channel,
  },
};

export default function SubTabNavigation({
  activeSubTab,
  setActiveSubTab: _setActiveSubTab,
  basePath,
  availableTabs,
}: SubTabNavigationProps) {
  const router = useRouter();

  const handleSubTabClick = (tab: SubTab) => {
    router.push(`${basePath}/${tab}`);
  };

  const renderTabButton = (tab: SubTab) => {
    const tabInfo = TAB_CONFIG[tab];
    if (!availableTabs.includes(tab)) return null;

    return (
      <button
        key={tab}
        className={`${styles.sub_tab_item} ${activeSubTab === tab ? styles.active : ""}`}
        onClick={() => handleSubTabClick(tab)}
      >
        {tabInfo.label}
      </button>
    );
  };

  return (
    <div className={styles.sub_tab_container}>
      {renderTabButton("profile")}
      {renderTabButton("channel")}
      {TAB_CONFIG[activeSubTab] && <div className={TAB_CONFIG[activeSubTab].indicatorClass} />}
    </div>
  );
}
