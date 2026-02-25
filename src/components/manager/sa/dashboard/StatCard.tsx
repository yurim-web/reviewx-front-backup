/* ========================================
   📊 통계 카드 컴포넌트 (SA 관리자 전용)
   ======================================== */

/**
 * 통계 카드 컴포넌트 (SA 관리자 전용)
 *
 * 목적: 통계 데이터를 카드 형태로 표시하는 재사용 가능한 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa (대시보드 페이지) - SettlementSummarySection, PaymentSummarySection
 */

import styles from "@/styles/manager_ga/dashboard/sections/campaign_summary_section.module.css";

// 통계 카드 데이터 타입 정의
export interface StatCardData {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

// StatCard 컴포넌트의 props 타입 정의
interface StatCardProps {
  // 통계 카드 데이터
  stat: StatCardData;
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    // 통계 카드 전체 컨테이너
    <div className={styles.campaign_summary_section_stat_card}>
      {/* 제목과 변화율을 같은 줄에 배치 (space-between) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* 통계 카드 제목 (예: "예상 수수료") */}
        <p className={styles.campaign_summary_section_stat_card_title}>{stat.title}</p>
        {/* 변화율 텍스트 (예: "↑ 50%", "↓ 50%", "- 0%") */}
        {/* 조건부 클래스명: 변화율 타입에 따라 색상이 달라짐 (녹색/빨간색/회색) */}
        <p
          className={`${styles.campaign_summary_section_stat_card_change} ${
            stat.changeType === "positive"
              ? styles.campaign_summary_section_stat_card_change_positive
              : stat.changeType === "negative"
                ? styles.campaign_summary_section_stat_card_change_negative
                : styles.campaign_summary_section_stat_card_change_neutral
          }`}
        >
          {stat.change}
        </p>
      </div>

      {/* 통계 카드 값 (예: "21,515,000") */}
      <p className={styles.campaign_summary_section_stat_card_value}>{stat.value}</p>
    </div>
  );
}
