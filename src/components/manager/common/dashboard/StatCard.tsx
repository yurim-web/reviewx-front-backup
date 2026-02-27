/* ========================================
   통계 카드 공통 컴포넌트 (GA/SA 관리자)
   ======================================== */

/**
 * StatCard
 *
 * 목적: 통계 데이터를 카드 형태로 표시하는 공통 컴포넌트
 *
 * 사용 페이지:
 * - /manager_ga (GA 대시보드) - CampaignSummarySection
 * - /manager_sa (SA 대시보드) - SettlementSummarySection, PaymentSummarySection
 */

import styles from "@/styles/manager_ga/dashboard/sections/campaign_summary_section.module.css";

// 통계 카드 데이터 타입 정의
export interface StatCardData {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  /** GA 전용: 진행률 (0-100). 미지정 시 progress bar 미표시 */
  progress?: number;
  /** GA 전용: progress bar 및 값 색상 */
  progressColor?: "default" | "red";
}

interface StatCardProps {
  stat: StatCardData;
}

/** 변화율 표시: 화살표 + 부호 제거된 값 */
function ChangeIndicator({ change, changeType }: Pick<StatCardData, "change" | "changeType">) {
  const stripped = change.replace(/^[+-]/, "");
  if (changeType === "positive")
    return (
      <>
        <span>↑</span> {stripped}
      </>
    );
  if (changeType === "negative")
    return (
      <>
        <span>↓</span> {stripped}
      </>
    );
  return (
    <>
      <span>-</span> {stripped}
    </>
  );
}

export default function StatCard({ stat }: StatCardProps) {
  const hasProgress = stat.progress !== undefined;

  return (
    <div className={styles.campaign_summary_section_stat_card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p className={styles.campaign_summary_section_stat_card_title}>{stat.title}</p>
        <p
          className={`${styles.campaign_summary_section_stat_card_change} ${
            stat.changeType === "positive"
              ? styles.campaign_summary_section_stat_card_change_positive
              : stat.changeType === "negative"
                ? styles.campaign_summary_section_stat_card_change_negative
                : styles.campaign_summary_section_stat_card_change_neutral
          }`}
        >
          {hasProgress ? (
            <ChangeIndicator change={stat.change} changeType={stat.changeType} />
          ) : (
            stat.change
          )}
        </p>
      </div>

      <p
        className={`${styles.campaign_summary_section_stat_card_value} ${
          stat.progressColor === "red" ? styles.campaign_summary_section_stat_card_value_red : ""
        }`}
      >
        {stat.value}
      </p>

      {hasProgress && (
        <div className={styles.campaign_summary_section_progress_bar_container}>
          <div
            className={`${styles.campaign_summary_section_progress_bar} ${
              stat.progressColor === "red" ? styles.campaign_summary_section_progress_bar_red : ""
            }`}
            style={{ width: `${stat.progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
