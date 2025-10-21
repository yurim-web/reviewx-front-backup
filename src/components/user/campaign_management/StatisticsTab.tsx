/* ========================================
   📊 통계 탭 컴포넌트
   ======================================== */

/**
 * 통계 탭 컴포넌트
 *
 * 목적: 캠페인 상태별 통계를 보여주고 탭 전환을 담당하는 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 페이지 - 상단 고정)
 *
 * 주요 기능:
 * - 신청/선정/완료/취소반려/패널티 상태별 개수 표시
 * - 각 탭 클릭 시 상태 변경으로 캠페인 목록 필터링
 * - 활성화된 탭 스타일 표시 (노란색 밑줄)
 * - 상단 고정으로 스크롤 시에도 접근 가능
 */

import { useRouter } from "next/navigation";
import type { CampaignStats, StatTab } from "@/types/campaignManagement";
import styles from "../../../styles/user/campaign_management/statistics.module.css";

interface StatisticsTabProps {
  activeStatTab: StatTab;
  setActiveStatTab: (tab: StatTab) => void;
  stats: CampaignStats;
}

/**
 * 캠페인 상태별 통계를 보여주는 탭
 * - 각 탭을 클릭하면 해당 상태의 캠페인 목록을 필터링
 * - 패널티 탭 포함한 모든 탭이 상태 변경으로 동작
 */
export default function StatisticsTab({
  activeStatTab,
  setActiveStatTab,
  stats,
}: StatisticsTabProps) {
  // Next.js의 useRouter 훅을 사용하여 라우팅 기능 가져오기
  const router = useRouter();

  /**
   * 통계 탭 클릭 핸들러
   * 각 탭 클릭 시 해당 페이지로 이동
   */
  const handleStatTabClick = (
    tab: "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  ) => {
    switch (tab) {
      case "신청":
        router.push("/user/campaign_management/applied");
        break;
      case "선정":
        router.push("/user/campaign_management/selected");
        break;
      case "완료":
        router.push("/user/campaign_management/completed");
        break;
      case "취소/반려":
        router.push("/user/campaign_management/cancelled");
        break;
      case "패널티":
        router.push("/user/campaign_management/penalty");
        break;
    }
  };
  /* ========================================
     JSX 반환 (JSX Return)
     - 통계 탭 네비게이션 UI 렌더링
  ======================================== */

  return (
    <div className={styles.statistics}>
      <div className={styles.stat_tab_navigation}>
        {/* 
          왼쪽 탭들: 일반 캠페인 상태 탭들
          - 클릭 시 setActiveStatTab으로 상태 변경
          - 각 탭에 해당 상태의 캠페인 개수 표시
        */}
        <div className={styles.left_stat_tabs}>
          {/* 신청 탭 - 신청한 캠페인 목록 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "신청" ? styles.active : ""
            }`}
            onClick={() => handleStatTabClick("신청")} // 페이지 이동
          >
            <span>신청</span>
            <span className={styles.stat_number}>{stats.신청}</span>
          </button>

          {/* 선정 탭 - 선정된 캠페인 목록 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "선정" ? styles.active : ""
            }`}
            onClick={() => handleStatTabClick("선정")} // 페이지 이동
          >
            <span>선정</span>
            <span className={styles.stat_number}>{stats.선정}</span>
          </button>

          {/* 완료 탭 - 완료된 캠페인 목록 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "완료" ? styles.active : ""
            }`}
            onClick={() => handleStatTabClick("완료")} // 페이지 이동
          >
            <span>완료</span>
            <span className={styles.stat_number}>{stats.완료}</span>
          </button>

          {/* 취소/반려 탭 - 취소되거나 반려된 캠페인 목록 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "취소/반려" ? styles.active : ""
            }`}
            onClick={() => handleStatTabClick("취소/반려")} // 페이지 이동
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
          onClick={() => handleStatTabClick("패널티")} // 패널티 전용 페이지로 이동
        >
          <span>패널티</span>
          {/* <span className={styles.stat_number}>{stats.패널티}</span> */}
        </button>
      </div>
    </div>
  );
}
