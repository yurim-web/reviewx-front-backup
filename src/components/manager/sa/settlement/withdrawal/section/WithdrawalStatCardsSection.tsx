/* ========================================
   📊 출금 현황 통계 카드 섹션 컴포넌트
   ======================================== */

/**
 * 출금 현황 통계 카드 섹션 컴포넌트
 *
 * 목적: 출금 현황 페이지의 상단 통계 카드들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/withdrawal (출금 현황 페이지)
 *
 * 주요 기능:
 * - 통계 카드 4개를 표시합니다
 * - 이번 달 출금 합계, 이번 주 출금 예정, 긴급 정산, 예치금 총 합계
 */

import styles from "@/styles/manager_sa/settlement/withdrawal/stat_cards_section.module.css";
import { withdrawalStats } from "@/data/manager_sa/settlement/withdrawalData";

export default function WithdrawalStatCardsSection() {
  return (
    <div className={styles.stat_cards_section}>
      {/* 1. 긴급 정산 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>긴급 정산</p>
        <div className={styles.stat_card_value_row}>
          <p
            className={`${styles.stat_card_value} ${styles.stat_card_value_urgent}`}
          >
            {withdrawalStats.urgent.amount}
          </p>
          <p
            className={`${styles.stat_card_count} ${styles.stat_card_count_urgent}`}
          >
            {withdrawalStats.urgent.count}
          </p>
        </div>
      </div>

      {/* 2. 이번 주 출금 예정 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>이번 주 출금 예정</p>
        <p className={styles.stat_card_value}>
          {withdrawalStats.weekScheduled.amount}
        </p>
      </div>

      {/* 3. 이번 달 출금 합계 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>이번 달 출금 합계</p>
        <div className={styles.stat_card_value_row}>
          <p className={styles.stat_card_value}>
            {withdrawalStats.monthTotal.amount}
          </p>
          <p className={styles.stat_card_count}>
            {withdrawalStats.monthTotal.count}
          </p>
        </div>
      </div>

      {/* 4. 예치금 총 합계 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>예치금 총 합계</p>
        <p className={styles.stat_card_value}>
          {withdrawalStats.totalDeposit.amount}
        </p>
      </div>
    </div>
  );
}
