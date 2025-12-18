/* ========================================
   📊 통계 카드 컴포넌트 (SA 관리자 전용)
   ======================================== */

/**
 * 통계 카드 컴포넌트 (SA 관리자 전용)
 *
 * 목적: 통계 데이터를 카드 형태로 표시하는 재사용 가능한 컴포넌트입니다.
 *
 * 주요 기능:
 * - 통계 제목, 값, 변화율 표시
 * - 변화율에 따른 색상 구분 (증가/감소/변화없음)
 *
 * 사용 위치:
 * 1. SA 관리자 대시보드 - 정산 요약
 *    - /manager_sa (대시보드 페이지)
 *    - SettlementSummarySection 컴포넌트에서 사용
 *    - 예상 수수료, 카드 결제 총액, 입금 총액, 총 결제 금액 등 통계 표시
 *
 * 2. SA 관리자 대시보드 - 결제 요약
 *    - /manager_sa (대시보드 페이지)
 *    - PaymentSummarySection 컴포넌트에서 사용
 *    - 출금 요청 금액, 출금 완료 총액, 총 예치금 잔액 등 통계 표시
 *
 * 사용 컴포넌트:
 * - SettlementSummarySection.tsx (SA 관리자 대시보드)
 * - PaymentSummarySection.tsx (SA 관리자 대시보드)
 *
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

      {/* 통계 카드 값 (예: "21,515,000") */}
      <p className={styles.campaign_summary_section_stat_card_value}>
        {stat.value}
      </p>
    </div>
  );
}
