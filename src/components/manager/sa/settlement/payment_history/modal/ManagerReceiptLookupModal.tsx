/* ========================================
   📄 관리자 - 거래명세서 조회 모달
   Figma: 4490-23257
   ======================================== */

"use client";

import type { PaymentHistoryItem } from "@/data/manager_sa/settlement/paymentHistoryData";
import styles from "@/styles/manager_sa/settlement/payment_history/receipt_lookup_modal.module.css";

export interface ManagerReceiptLookupModalProps {
  is_open: boolean;
  on_close: () => void;
  /** 결제 내역 행 (없으면 모달만 닫기) */
  item: PaymentHistoryItem | null;
}

/** 결제 내역 항목으로 거래명세서 표시용 데이터 생성 (실제 API 연동 시 교체) */
function getReceiptDisplayData(item: PaymentHistoryItem) {
  return {
    transaction_number: item.number,
    buyer: item.companyName,
    card_type: "우리비씨",
    card_number: "9566",
    approval_number: "{PG사승인번호}",
    payment_datetime: item.requestDate,
    amount: item.chargedPoints + "원",
    company_name: "주식회사 마크엑스",
    ceo: "유기수",
    business_number: "222-22-22222",
    phone: "010-0000-0000",
    address: "인천광역시 남동구 장자로 14, 2층 201호",
  };
}

export default function ManagerReceiptLookupModal({
  is_open,
  on_close,
  item,
}: ManagerReceiptLookupModalProps) {
  if (!is_open) return null;

  const handle_overlay_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) on_close();
  };

  const data = item ? getReceiptDisplayData(item) : null;

  return (
    <div
      className={styles.overlay}
      onClick={handle_overlay_click}
      role="dialog"
      aria-modal="true"
      aria-labelledby="manager_receipt_modal_title"
    >
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_header}>
          <h2
            id="manager_receipt_modal_title"
            className={styles.modal_title}
          >
            거래명세서
          </h2>
        </div>
        <div className={styles.modal_body}>
          {data && (
            <>
              <div className={styles.info_block}>
                <div className={styles.info_row}>
                  <span className={styles.info_label}>거래번호</span>
                  <span className={styles.info_value}>{data.transaction_number}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.info_label}>구매자</span>
                  <span className={styles.info_value}>{data.buyer}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.info_label}>카드 종류</span>
                  <span className={styles.info_value}>{data.card_type}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.info_label}>카드번호</span>
                  <span className={styles.info_value}>{data.card_number}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.info_label}>승인번호</span>
                  <span className={styles.info_value}>{data.approval_number}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.info_label}>결제일시</span>
                  <span className={styles.info_value}>{data.payment_datetime}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.info_label}>금액</span>
                  <span className={styles.info_value}>{data.amount}</span>
                </div>
              </div>
              <div className={styles.info_block}>
                <div className={styles.info_row}>
                  <span className={styles.info_label}>상호명</span>
                  <span className={styles.info_value}>{data.company_name}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.info_label}>대표자명</span>
                  <span className={styles.info_value}>{data.ceo}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.info_label}>사업자등록번호</span>
                  <span className={styles.info_value}>{data.business_number}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.info_label}>전화번호</span>
                  <span className={styles.info_value}>{data.phone}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.info_label}>주소</span>
                  <span className={styles.info_value}>{data.address}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
