// 상단 탭 네비게이션 컴포넌트
// 캠페인/포인트, 계정/커뮤니티 탭

import { useRouter } from "next/navigation";
import type { MainTab } from "@/types/campaignManagement";
import styles from "../../../styles/user/campaign_management/campaign_management.module.css";

interface TabNavigationProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
}

/**
 * 상단 메인 탭 네비게이션
 * 캠페인, 포인트, 계정, 커뮤니티 탭을 표시
 */
export default function TabNavigation({
  activeTab,
  setActiveTab,
}: TabNavigationProps) {
  const router = useRouter();

  const handleCampaignClick = () => {
    setActiveTab("campaign");
    router.push("/user/campaign_management");
  };

  const handlePointClick = () => {
    setActiveTab("point");
    router.push("/user/point");
  };

  const handleAccountClick = () => {
    setActiveTab("account");
    router.push("/user/mypage");
  };

  return (
    <div className={styles.tab_navigation}>
      <div className={styles.tab_navigation_container}>
        {/* 왼쪽 탭: 캠페인, 포인트 */}
        <div className={styles.left_tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "campaign" ? styles.active : ""
            }`}
            onClick={handleCampaignClick}
          >
            캠페인
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "point" ? styles.active : ""
            }`}
            onClick={handlePointClick}
          >
            포인트
          </button>
        </div>

        {/* 오른쪽 탭: 계정, 커뮤니티 (추후 구현) */}
        <div className={styles.right_tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "account" ? styles.active : ""
            }`}
            onClick={handleAccountClick}
          >
            계정
          </button>
        </div>
      </div>
    </div>
  );
}
