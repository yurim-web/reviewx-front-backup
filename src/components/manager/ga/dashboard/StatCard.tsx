/* ========================================
   📊 통계 카드 컴포넌트
   ======================================== */

/**
 * 통계 카드 컴포넌트 (GA 관리자 전용)
 *
 * 목적: 통계 데이터를 카드 형태로 표시하는 재사용 가능한 컴포넌트입니다.
 *
 * 주요 기능:
 * - 통계 제목, 값, 변화율 표시
 * - 진행 바 표시
 * - 변화율에 따른 색상 구분 (증가/감소/변화없음)
 *
 * 사용 위치:
 * 1. GA 관리자 대시보드
 *    - /manager_ga (대시보드 페이지)
 *    - CampaignSummarySection 컴포넌트에서 사용
 *    - 캠페인 모집률, 달성률, 반려율, 신고율 통계 표시
 *
 * 사용 컴포넌트:
 * - CampaignSummarySection.tsx (GA 관리자 대시보드)
 *
 */

import styles from "@/styles/manager_ga/dashboard/sections/campaign_summary_section.module.css";

// 통계 카드 데이터 타입 정의
export interface StatCardData {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  progress: number; // 0-100
  progressColor?: "default" | "red";
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
        {/* 통계 카드 제목 (예: "캠페인 모집률") */}
        <p className={styles.campaign_summary_section_stat_card_title}>
          {stat.title}
        </p>
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

      {/* 통계 카드 값 (예: "97%") */}
      {/* 조건부 클래스명: progressColor가 'red'이면 값도 빨간색으로 표시 */}
      <p
        className={`${styles.campaign_summary_section_stat_card_value} ${
          stat.progressColor === "red"
            ? styles.campaign_summary_section_stat_card_value_red
            : ""
        }`}
      >
        {stat.value}
      </p>

      {/* 진행 바 컨테이너 (회색 배경) */}
      <div className={styles.campaign_summary_section_progress_bar_container}>
        {/* 진행 바 (진행률에 따라 너비가 달라짐) */}
        <div
          className={`${styles.campaign_summary_section_progress_bar} ${
            stat.progressColor === "red"
              ? styles.campaign_summary_section_progress_bar_red
              : ""
          }`}
          style={{ width: `${stat.progress}%` }}
        />
      </div>
    </div>
  );
}
