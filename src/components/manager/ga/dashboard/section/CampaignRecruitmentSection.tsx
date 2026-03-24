/* ========================================
   
   ======================================== */

/**
 * 캠페인 모집 통계 섹션 컴포넌트
 *
 * 목적: 캠페인 모집 통계 차트를 표시하는 섹션 컴포넌트입니다.
 *
 */

import styles from "@/styles/manager_ga/dashboard/sections/campaign_recruitment_section.module.css";
import CampaignRecruitmentChart from "../chart/CampaignRecruitmentChart";
import type { AdminDashboardResponse } from "@/types/api/admin";

interface CampaignRecruitmentSectionProps {
  dashboardData?: AdminDashboardResponse | null;
}

export default function CampaignRecruitmentSection({
  dashboardData,
}: CampaignRecruitmentSectionProps) {
  // 참고: 이 차트는 "카테고리별" 모집 통계 (생활/식품/패션 등 13개)
  // API campaignStats.byType은 "유형별" (배송형/방문형 등 4개)이므로 다른 데이터
  // 카테고리별 세부 데이터는 백엔드에 별도 API가 필요하므로, 현재는 기본 데이터 사용
  return (
    <div className={styles.campaign_recruitment_section_card}>
      {/* 제목과 범례를 같은 줄에 배치 (제목: 왼쪽, 범례: 오른쪽) */}
      <div className={styles.campaign_recruitment_section_header}>
        {/* 섹션 제목 */}
        <h2 className={styles.campaign_recruitment_section_title}>캠페인 카테고리별 모집 통계</h2>

        {/* 커스텀 범례 */}
        <div className={styles.campaign_recruitment_section_legend}>
          {/* 달성률 */}
          <div className={styles.campaign_recruitment_section_legend_item}>
            <div
              className={`${styles.campaign_recruitment_section_legend_icon} ${styles.campaign_recruitment_section_legend_icon_achievement}`}
            ></div>
            <span>달성률</span>
          </div>

          {/* 모집률 */}
          <div className={styles.campaign_recruitment_section_legend_item}>
            <div
              className={`${styles.campaign_recruitment_section_legend_icon} ${styles.campaign_recruitment_section_legend_icon_dark}`}
            ></div>
            <span>모집률</span>
          </div>

          {/* 평균 진행 기간 */}
          <div className={styles.campaign_recruitment_section_legend_item}>
            <div
              className={`${styles.campaign_recruitment_section_legend_icon} ${styles.campaign_recruitment_section_legend_icon_light}`}
            ></div>
            <span>평균 진행 기간</span>
          </div>
        </div>
      </div>
      {/* recharts 라이브러리를 사용한 복합 차트 */}
      <CampaignRecruitmentChart />
    </div>
  );
}
