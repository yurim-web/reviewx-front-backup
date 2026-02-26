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
 */

import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import type { CampaignStats, StatTab } from "@/types/domain/user";
import styles from "../../../styles/user/campaign_management/statistics.module.css";

const MOBILE_BREAKPOINT = 768;

interface StatisticsTabProps {
  activeStatTab: StatTab;
  setActiveStatTab?: (tab: StatTab) => void; // 선택적: 제공되지 않으면 내부에서 라우팅 처리
  stats: CampaignStats;
}

/**
 * 캠페인 상태별 통계를 보여주는 탭
 * - 각 탭을 클릭하면 해당 상태의 캠페인 목록으로 이동
 * - 6개 탭: 전체, 신청, 선정, 완료, 취소/반려 + 오른쪽 패널티
 */
export default function StatisticsTab({
  activeStatTab,
  setActiveStatTab,
  stats,
}: StatisticsTabProps) {
  const router = useRouter();
  const tabRefs = useRef<Record<StatTab, HTMLButtonElement | null>>({
    전체: null,
    예정: null,
    신청: null,
    선정: null,
    완료: null,
    "취소/반려": null,
    패널티: null,
  });

  // 모바일에서 선택된 탭이 오른쪽 끝에 보이도록 스크롤
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth > MOBILE_BREAKPOINT) return;
    const el = tabRefs.current[activeStatTab];
    if (!el) return;
    const timer = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "end" });
    });
    return () => cancelAnimationFrame(timer);
  }, [activeStatTab]);

  const handleStatTabClick = (tab: "신청" | "선정" | "완료" | "취소/반려" | "전체" | "패널티") => {
    if (setActiveStatTab) {
      setActiveStatTab(tab);
      return;
    }
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
      case "전체":
        router.push("/user/campaign_management/all");
        break;
      case "패널티":
        router.push("/user/campaign_management/penalty");
        break;
    }
  };

  return (
    <div className={styles.statistics}>
      <div className={styles.stat_tab_navigation}>
        <div className={styles.left_stat_tabs}>
          <button
            ref={(el) => {
              tabRefs.current["전체"] = el;
            }}
            className={`${styles.stat_tab} ${activeStatTab === "전체" ? styles.active : ""}`}
            onClick={() => handleStatTabClick("전체")}
          >
            <span>전체</span>
            <span className={styles.stat_number}>{stats.전체}</span>
          </button>

          <button
            ref={(el) => {
              tabRefs.current["신청"] = el;
            }}
            className={`${styles.stat_tab} ${activeStatTab === "신청" ? styles.active : ""}`}
            onClick={() => handleStatTabClick("신청")}
          >
            <span>신청</span>
            <span className={styles.stat_number}>{stats.신청}</span>
          </button>

          <button
            ref={(el) => {
              tabRefs.current["선정"] = el;
            }}
            className={`${styles.stat_tab} ${activeStatTab === "선정" ? styles.active : ""}`}
            onClick={() => handleStatTabClick("선정")}
          >
            <span>선정</span>
            <span className={styles.stat_number}>{stats.선정}</span>
          </button>

          <button
            ref={(el) => {
              tabRefs.current["완료"] = el;
            }}
            className={`${styles.stat_tab} ${activeStatTab === "완료" ? styles.active : ""}`}
            onClick={() => handleStatTabClick("완료")}
          >
            <span>완료</span>
            <span className={styles.stat_number}>{stats.완료}</span>
          </button>

          <button
            ref={(el) => {
              tabRefs.current["취소/반려"] = el;
            }}
            className={`${styles.stat_tab} ${activeStatTab === "취소/반려" ? styles.active : ""}`}
            onClick={() => handleStatTabClick("취소/반려")}
          >
            <span>취소/반려</span>
            <span className={styles.stat_number}>{stats["취소/반려"]}</span>
          </button>
        </div>

        <button
          ref={(el) => {
            tabRefs.current["패널티"] = el;
          }}
          className={`${styles.stat_tab} ${activeStatTab === "패널티" ? styles.active : ""}`}
          onClick={() => handleStatTabClick("패널티")}
        >
          <span>패널티</span>
        </button>
      </div>
    </div>
  );
}
