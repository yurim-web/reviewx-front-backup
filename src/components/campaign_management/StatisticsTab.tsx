// 통계 탭 컴포넌트
// 신청/선정/완료/취소반려/패널티 상태별 개수를 보여주는 탭

import type { CampaignStats, StatTab } from "@/types/campaignManagement";
import styles from "../../styles/campaign_management/campaign_management.module.css";

interface StatisticsTabProps {
  activeStatTab: StatTab;
  setActiveStatTab: (tab: StatTab) => void;
  stats: CampaignStats;
}

/**
 * 캠페인 상태별 통계를 보여주는 탭
 * 각 탭을 클릭하면 해당 상태의 캠페인 목록을 필터링
 */
export default function StatisticsTab({
  activeStatTab,
  setActiveStatTab,
  stats,
}: StatisticsTabProps) {
  return (
    <div className={styles.statistics}>
      <div className={styles.stat_tab_navigation}>
        {/* 왼쪽 탭들: 신청, 선정, 완료, 취소/반려 */}
        <div className={styles.left_stat_tabs}>
          {/* 신청 탭 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "신청" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("신청")}
          >
            <span>신청</span>
            <span className={styles.stat_number}>{stats.신청}</span>
          </button>

          {/* 선정 탭 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "선정" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("선정")}
          >
            <span>선정</span>
            <span className={styles.stat_number}>{stats.선정}</span>
          </button>

          {/* 완료 탭 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "완료" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("완료")}
          >
            <span>완료</span>
            <span className={styles.stat_number}>{stats.완료}</span>
          </button>

          {/* 취소/반려 탭 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "취소/반려" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("취소/반려")}
          >
            <span>취소/반려</span>
            <span className={styles.stat_number}>{stats["취소/반려"]}</span>
          </button>
        </div>

        {/* 오른쪽: 패널티 탭 */}
        <button
          className={`${styles.stat_tab} ${
            activeStatTab === "패널티" ? styles.active : ""
          }`}
          onClick={() => setActiveStatTab("패널티")}
        >
          <span>패널티</span>
        </button>
      </div>
    </div>
  );
}
