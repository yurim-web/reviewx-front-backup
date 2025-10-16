/**
 * 통계 탭 컴포넌트 (Statistics Tab Component)
 *
 * 📚 학습 포인트:
 * 1. React 이벤트 핸들러와 콜백 함수
 * 2. 템플릿 리터럴을 사용한 동적 CSS 클래스 조합
 * 3. 컴포넌트 간 상태 전달 (props)
 * 4. 조건부 스타일링과 활성화 상태 관리
 *
 * 🎯 기능:
 * - 신청/선정/완료/취소반려/패널티 상태별 개수를 보여주는 탭
 * - 각 탭 클릭 시 상태 변경으로 필터링
 * - 활성화된 탭 스타일 표시
 */

import type { CampaignStats, StatTab } from "@/types/campaignManagement";
import styles from "../../../styles/user/campaign_management/campaign_management.module.css";

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
            onClick={() => setActiveStatTab("신청")} // 상태 변경으로 필터링
          >
            <span>신청</span>
            <span className={styles.stat_number}>{stats.신청}</span>
          </button>

          {/* 선정 탭 - 선정된 캠페인 목록 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "선정" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("선정")} // 상태 변경으로 필터링
          >
            <span>선정</span>
            <span className={styles.stat_number}>{stats.선정}</span>
          </button>

          {/* 완료 탭 - 완료된 캠페인 목록 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "완료" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("완료")} // 상태 변경으로 필터링
          >
            <span>완료</span>
            <span className={styles.stat_number}>{stats.완료}</span>
          </button>

          {/* 취소/반려 탭 - 취소되거나 반려된 캠페인 목록 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "취소/반려" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("취소/반려")} // 상태 변경으로 필터링
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
          onClick={() => setActiveStatTab("패널티")} // 다른 탭들과 동일한 상태 변경 방식
        >
          <span>패널티</span>
          {/* <span className={styles.stat_number}>{stats.패널티}</span> */}
        </button>
      </div>
    </div>
  );
}
