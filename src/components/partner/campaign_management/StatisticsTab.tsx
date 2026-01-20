/* ========================================
   📊 통계 탭 컴포넌트
   ======================================== */

/**
 * 통계 탭 컴포넌트
 *
 * 목적: 캠페인 상태별 통계를 보여주고 탭 전환을 담당하는 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /partner (파트너 캠페인 관리 페이지 - 상단 고정)
 *
 * 주요 기능:
 * - 전체/예정/신청/진행/종료/취소/연장 요청/패널티 상태별 개수 표시
 * - 각 탭 클릭 시 상태 변경으로 캠페인 목록 필터링
 * - 활성화된 탭 스타일 표시 (노란색 밑줄)
 * - 상단 고정으로 스크롤 시에도 접근 가능
 */

import type {
  PartnerCampaignStats,
  PartnerStatTab,
} from "@/types/domain/partner";
import styles from "../../../styles/partner/statistics.module.css";

interface StatisticsTabProps {
  activeStatTab: PartnerStatTab;
  setActiveStatTab: (tab: PartnerStatTab) => void;
  stats: PartnerCampaignStats;
}

/**
 * 캠페인 상태별 통계를 보여주는 탭
 * - 각 탭을 클릭하면 해당 상태의 캠페인 목록을 필터링
 * - 8개 탭: 전체, 예정, 신청, 진행, 종료, 취소, 연장 요청, 패널티
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
          - 각 탭에 해당 상태의 캠페인 개수 표시*/}
        <div className={styles.left_stat_tabs}>
          {/* 전체 탭 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "전체" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("전체")}
          >
            <span>전체</span>
            <span className={styles.stat_number}>{stats.전체}</span>
          </button>

          {/* 예정 탭 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "예정" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("예정")}
          >
            <span>예정</span>
            <span className={styles.stat_number}>{stats.예정}</span>
          </button>

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

          {/* 진행 탭 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "진행" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("진행")}
          >
            <span>진행</span>
            <span className={styles.stat_number}>{stats.진행}</span>
          </button>

          {/* 종료 탭 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "종료" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("종료")}
          >
            <span>종료</span>
            <span className={styles.stat_number}>{stats.종료}</span>
          </button>

          {/* 취소 탭 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "취소" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("취소")}
          >
            <span>취소</span>
            <span className={styles.stat_number}>{stats.취소}</span>
          </button>

          {/* 연장 요청 탭 */}
          <button
            className={`${styles.stat_tab} ${
              activeStatTab === "연장 요청" ? styles.active : ""
            }`}
            onClick={() => setActiveStatTab("연장 요청")}
          >
            <span>연장 요청</span>
            <span className={styles.stat_number}>{stats["연장 요청"]}</span>
          </button>
        </div>
      </div>
      <div>
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
