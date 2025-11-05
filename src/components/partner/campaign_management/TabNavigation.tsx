/* ========================================
   🧭 상단 탭 네비게이션 컴포넌트
   ======================================== */

/**
 * 상단 탭 네비게이션 컴포넌트
 *
 * 목적: 캠페인, 포인트, 계정 등 주요 섹션 간 네비게이션을 담당하는 상단 탭입니다.
 *
 * 사용 페이지:
 * - /partner (파트너 캠페인 관리 페이지)
 *
 * 주요 기능:
 * - 캠페인/포인트/계정 탭 전환
 * - 각 탭 클릭 시 해당 페이지로 라우팅
 * - 활성 탭 스타일 표시
 * - 상단 고정으로 스크롤 시에도 접근 가능
 */

import { useRouter } from "next/navigation";
import type { PartnerMainTab } from "@/types/partner/partner";
import styles from "../../../styles/partner/tab_navigation.module.css";

interface TabNavigationProps {
  activeTab: PartnerMainTab;
  setActiveTab: (tab: PartnerMainTab) => void;
}

/**
 * 상단 메인 탭 네비게이션
 * 캠페인, 포인트, 계정 탭을 표시
 */
export default function TabNavigation({
  activeTab,
  setActiveTab,
}: TabNavigationProps) {
  const router = useRouter();

  const handleCampaignClick = () => {
    setActiveTab("campaign");
    router.push("/partner/campaign_management");
  };

  const handlePointClick = () => {
    setActiveTab("point");
    router.push("/partner/point/all");
  };

  const handleAccountClick = () => {
    setActiveTab("account");
    router.push("/partner/mypage");
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

        {/* 오른쪽: 새 캠페인 등록 버튼과 계정 탭 */}
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
