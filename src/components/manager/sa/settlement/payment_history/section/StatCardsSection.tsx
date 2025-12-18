/* ========================================
   📊 결제 내역 통계 카드 섹션 컴포넌트
   ======================================== */

/**
 * 결제 내역 통계 카드 섹션 컴포넌트
 *
 * 목적: 결제 내역 페이지의 상단 통계 카드들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 *
 * 주요 기능:
 * - 통계 카드 3개를 표시합니다
 * - 이번 주 입금 내역, 이번 주 카드 결제 금액, 이번 달 총 합계
 *
 */

import styles from '@/styles/manager_sa/settlement/payment_history/stat_cards_section.module.css';
import { paymentHistoryStats } from '@/data/manager_sa/settlement/paymentHistoryData';

export default function StatCardsSection() {
  return (
    <div className={styles.stat_cards_section}>
      {/* 1. 이번 주 입금 내역 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>
          {paymentHistoryStats.weekDeposit.label}
        </p>
        <div className={styles.stat_card_value_row}>
          <p className={styles.stat_card_count}>
            {paymentHistoryStats.weekDeposit.count}
          </p>
          <p className={styles.stat_card_value}>
            {paymentHistoryStats.weekDeposit.amount}
          </p>
        </div>
      </div>

      {/* 2. 이번 주 카드 결제 금액 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>
          {paymentHistoryStats.weekCardPayment.label}
        </p>
        <div className={styles.stat_card_value_row}>
          <p className={styles.stat_card_value}>
            {paymentHistoryStats.weekCardPayment.amount}
          </p>
          <p className={styles.stat_card_count}>
            {paymentHistoryStats.weekCardPayment.count}
          </p>
        </div>
      </div>

      {/* 3. 이번 달 총 합계 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>
          {paymentHistoryStats.monthTotal.label}
        </p>
        <div className={styles.stat_card_value_row}>
          <p className={styles.stat_card_count}>
            {paymentHistoryStats.monthTotal.count}
          </p>
          <p className={styles.stat_card_value}>
            {paymentHistoryStats.monthTotal.amount}
          </p>
        </div>
      </div>
    </div>
  );
}

