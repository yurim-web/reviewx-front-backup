/* ========================================
   환불 계좌 조회 모달 컴포넌트
   ======================================== */

/**
 * ManagerRefundAccountModal
 *
 * 목적: 결제 내역 항목의 환불 계좌 정보를 조회하는 모달입니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 */

"use client";

import { useState, useCallback } from "react";
import type { PaymentHistoryItem } from "@/data/manager_sa/settlement/paymentHistoryData";
import Toast from "@/components/common/toast/Toast";
import styles from "@/styles/manager_sa/settlement/payment_history/refund_account_modal.module.css";

export interface ManagerRefundAccountModalProps {
  is_open: boolean;
  on_close: () => void;
  item: PaymentHistoryItem | null;
}

/** 환불 계좌 표시용 데이터 (실제 API 연동 시 교체) */
function getRefundDisplayData(item: PaymentHistoryItem | null) {
  if (!item) return null;
  return {
    company_name: item.companyName,
    bank: "우리은행",
    account_number: "02301216514659",
    account_holder: "김리뷰",
  };
}

export default function ManagerRefundAccountModal({
  is_open,
  on_close,
  item,
}: ManagerRefundAccountModalProps) {
  const [show_toast, set_show_toast] = useState(false);

  const data = getRefundDisplayData(item);

  const handle_copy = useCallback(() => {
    if (!data) return;
    const text = `은행: ${data.bank}\n계좌번호: ${data.account_number}\n예금주: ${data.account_holder}`;
    navigator.clipboard.writeText(text).then(() => {
      set_show_toast(true);
    });
  }, [data]);

  if (!is_open) return null;

  const handle_overlay_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) on_close();
  };

  return (
    <div
      className={styles.overlay}
      onClick={handle_overlay_click}
      role="dialog"
      aria-modal="true"
      aria-labelledby="manager_refund_account_modal_title"
    >
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_header}>
          <h2 id="manager_refund_account_modal_title" className={styles.modal_title}>
            환불 계좌 조회
          </h2>
        </div>
        <div className={styles.modal_body}>
          {data && (
            <div className={styles.info_block}>
              <div className={styles.info_row}>
                <span className={styles.info_label}>상호명</span>
                <span className={styles.info_value}>{data.company_name}</span>
              </div>
              <div className={styles.info_row}>
                <span className={styles.info_label}>은행</span>
                <span className={styles.info_value}>{data.bank}</span>
              </div>
              <div className={styles.info_row}>
                <span className={styles.info_label}>계좌번호</span>
                <span className={styles.info_value}>{data.account_number}</span>
              </div>
              <div className={styles.info_row}>
                <span className={styles.info_label}>예금주</span>
                <span className={styles.info_value}>{data.account_holder}</span>
              </div>
            </div>
          )}
        </div>
        <div className={styles.modal_actions}>
          <button type="button" className={styles.btn_close} onClick={on_close}>
            닫기
          </button>
          <button type="button" className={styles.btn_copy} onClick={handle_copy}>
            복사
          </button>
        </div>
      </div>
      <Toast
        message="복사되었습니다."
        isOpen={show_toast}
        onClose={() => set_show_toast(false)}
        duration={2000}
      />
    </div>
  );
}
