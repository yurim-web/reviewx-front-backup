/* ========================================
   🧭 상단 탭 네비게이션 컴포넌트
   ======================================== */

/**
 * 상단 탭 네비게이션 컴포넌트
 *
 * 목적: 캠페인, 포인트, 계정 등 주요 섹션 간 네비게이션을 담당하는 상단 탭입니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 페이지)
 * - /user/point (포인트 페이지)
 * - /user/mypage (마이페이지)
 *
 * 주요 기능:
 * - 캠페인/포인트/계정 탭 전환
 * - 각 탭 클릭 시 해당 페이지로 라우팅
 * - 활성 탭 스타일 표시
 * - 상단 고정으로 스크롤 시에도 접근 가능
 */

import { useRouter } from "next/navigation";
import type { MainTab } from "@/types/campaignManagement";
import styles from "../../../styles/user/campaign_management/tab_navigation.module.css";

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
