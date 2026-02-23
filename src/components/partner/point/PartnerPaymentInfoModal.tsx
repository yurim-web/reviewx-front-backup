/* ========================================
   💳 파트너 포인트 - 결제 정보 하단 시트 모달
   ======================================== */

/**
 * 결제 정보 하단 시트 모달
 *
 * 목적: 파트너 포인트 내역(전체/충전 탭)에서 충전 항목의 결제 정보를 하단 시트로 보여줍니다.
 *
 * 사용 페이지:
 * - /partner/point/all (전체 포인트 내역)
 * - /partner/point/earned (충전 포인트 내역)
 *
 * 주요 기능:
 * - 충전 내역 클릭 시 결제 정보(거래번호, 구매자, 카드 정보, 금액 등) 표시
 * - 회사 정보 표시
 * - 거래명세서 다운로드 버튼, 확인 버튼
 */

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { PartnerPointHistory } from "@/types/domain/partner";
import type { PaymentInfoFromHistory } from "@/data/partner/point/paymentInfoData";
import type { BankTransferPaymentInfo } from "@/data/partner/point/paymentInfoData";
import {
  getPaymentInfoFromHistory,
  getBankTransferPaymentInfoFromHistory,
  COMPANY_INFO,
} from "@/data/partner/point/paymentInfoData";
import styles from "@/styles/partner/point/payment_info_modal.module.css";

export interface PartnerPaymentInfoModalProps {
  is_open: boolean;
  on_close: () => void;
  /** 충전 내역 (type === "earned" && description === "포인트 충전") */
  history: PartnerPointHistory | null;
}

export default function PartnerPaymentInfoModal({
  is_open,
  on_close,
  history,
}: PartnerPaymentInfoModalProps) {
  const receipt_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!is_open) return;
    const handle_escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") on_close();
    };
    window.addEventListener("keydown", handle_escape);
    return () => window.removeEventListener("keydown", handle_escape);
  }, [is_open, on_close]);

  if (!is_open) return null;

  const handle_overlay_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) on_close();
  };

  const paymentMethod = history?.payment_method ?? "card";
  const payment = getPaymentInfoFromHistory(history);
  const bankPayment = getBankTransferPaymentInfoFromHistory(history);

  const hasContent =
    (paymentMethod === "card" && payment) ||
    (paymentMethod === "bank" && bankPayment);

  const handle_download_receipt = async () => {
    if (!receipt_ref.current || !hasContent) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(receipt_ref.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const data_url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const filename =
        paymentMethod === "card"
          ? `거래명세서_카드_${payment?.transaction_number ?? "unknown"}.png`
          : `거래명세서_무통장_${bankPayment?.transaction_number ?? "unknown"}.png`;
      link.download = filename;
      link.href = data_url;
      link.click();
    } catch (err) {
      console.error("거래명세서 이미지 생성 실패:", err);
    }
  };

  return (
    <>
      {/* 거래명세서 이미지 캡처용 (화면 밖 렌더, html2canvas로 캡처) */}
      {hasContent && (
        <div className={styles.receipt_sheet_wrapper}>
          <div ref={receipt_ref} className={styles.receipt_sheet}>
            <h3 className={styles.receipt_sheet_title}>거래명세서</h3>
            {paymentMethod === "card" && payment && (
              <ReceiptCardContent payment={payment} />
            )}
            {paymentMethod === "bank" && bankPayment && (
              <ReceiptBankContent bankPayment={bankPayment} />
            )}
            <ReceiptCompanyContent />
          </div>
        </div>
      )}

      <div
        className={styles.modal_overlay}
        onClick={handle_overlay_click}
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner_payment_info_modal_title"
      >
        <div
          className={styles.modal_content}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modal_header}>
            <h2
              id="partner_payment_info_modal_title"
              className={styles.modal_title}
            >
              결제 정보
            </h2>
            <button
              type="button"
              className={styles.modal_close_btn}
              onClick={on_close}
              aria-label="닫기"
            >
              <Image
                src="/images/filter/x_icon.svg"
                alt=""
                width={20}
                height={20}
              />
            </button>
          </div>

          <div className={styles.modal_body}>
            {hasContent && (
              <>
                {paymentMethod === "card" && payment && (
                  <>
                    {/* 카드 결제: 블록 1 거래번호/구매자 → 블록 2 카드 상세 → 블록 3 회사 정보 */}
                    <div
                      className={`${styles.info_block} ${styles.info_block_has_border}`}
                    >
                      <div className={styles.info_section_rows}>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>거래번호</span>
                          <span className={styles.info_value}>
                            {payment.transaction_number}
                          </span>
                        </div>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>구매자</span>
                          <span className={styles.info_value}>
                            {payment.buyer}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${styles.info_block} ${styles.info_block_has_border}`}
                    >
                      <div className={styles.info_section_rows}>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>카드 종류</span>
                          <span className={styles.info_value}>
                            {payment.card_type}
                          </span>
                        </div>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>카드번호</span>
                          <span className={styles.info_value}>
                            {payment.card_number}
                          </span>
                        </div>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>승인번호</span>
                          <span className={styles.info_value}>
                            {payment.approval_number}
                          </span>
                        </div>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>결제일시</span>
                          <span className={styles.info_value}>
                            {payment.payment_datetime}
                          </span>
                        </div>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>금액</span>
                          <span className={styles.info_value}>
                            {payment.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === "bank" && bankPayment && (
                  <>
                    {/* 무통장입금(현금 영수증): 블록 1 거래번호~금액 → 블록 2 회사 정보 */}
                    <div
                      className={`${styles.info_block} ${styles.info_block_has_border}`}
                    >
                      <div className={styles.info_section_rows}>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>거래번호</span>
                          <span className={styles.info_value}>
                            {bankPayment.transaction_number}
                          </span>
                        </div>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>구매자</span>
                          <span className={styles.info_value}>
                            {bankPayment.buyer}
                          </span>
                        </div>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>용도</span>
                          <span className={styles.info_value}>
                            {bankPayment.purpose}
                          </span>
                        </div>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>발급번호</span>
                          <span className={styles.info_value}>
                            {bankPayment.issuance_number}
                          </span>
                        </div>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>결제일시</span>
                          <span className={styles.info_value}>
                            {bankPayment.payment_datetime}
                          </span>
                        </div>
                        <div className={styles.info_row}>
                          <span className={styles.info_label}>금액</span>
                          <span className={styles.info_value}>
                            {bankPayment.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 회사 정보 (카드/무통장 공통) → 구분선 없음 */}
                <div
                  className={`${styles.info_block} ${styles.info_block_company}`}
                >
                  <div className={styles.info_section_rows}>
                    <div className={styles.info_row}>
                      <span className={styles.info_label}>상호명</span>
                      <span className={styles.info_value}>
                        {COMPANY_INFO.company_name}
                      </span>
                    </div>
                    <div className={styles.info_row}>
                      <span className={styles.info_label}>대표자명</span>
                      <span className={styles.info_value}>
                        {COMPANY_INFO.ceo}
                      </span>
                    </div>
                    <div className={styles.info_row}>
                      <span className={styles.info_label}>사업자등록번호</span>
                      <span className={styles.info_value}>
                        {COMPANY_INFO.business_number}
                      </span>
                    </div>
                    <div className={styles.info_row}>
                      <span className={styles.info_label}>전화번호</span>
                      <span className={styles.info_value}>
                        {COMPANY_INFO.phone}
                      </span>
                    </div>
                    <div className={styles.info_row}>
                      <span className={styles.info_label}>주소</span>
                      <span className={styles.info_value}>
                        {COMPANY_INFO.address}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className={styles.modal_actions}>
              <button
                type="button"
                className={styles.btn_outline}
                onClick={handle_download_receipt}
              >
                거래명세서 다운로드
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** 거래명세서 캡처용: 카드 결제 블록 (거래번호·구매자 | 카드상세 | 회사정보 구분선 유지) */
function ReceiptCardContent({ payment }: { payment: PaymentInfoFromHistory }) {
  return (
    <>
      <div className={styles.receipt_sheet_block}>
        <div className={styles.receipt_sheet_row}>
          <span className={styles.receipt_sheet_label}>거래번호</span>
          <span className={styles.receipt_sheet_value}>
            {payment.transaction_number}
          </span>
        </div>
        <div className={styles.receipt_sheet_row}>
          <span className={styles.receipt_sheet_label}>구매자</span>
          <span className={styles.receipt_sheet_value}>{payment.buyer}</span>
        </div>
      </div>
      <div className={styles.receipt_sheet_block}>
        <div className={styles.receipt_sheet_row}>
          <span className={styles.receipt_sheet_label}>카드 종류</span>
          <span className={styles.receipt_sheet_value}>
            {payment.card_type}
          </span>
        </div>
        <div className={styles.receipt_sheet_row}>
          <span className={styles.receipt_sheet_label}>카드번호</span>
          <span className={styles.receipt_sheet_value}>
            {payment.card_number}
          </span>
        </div>
        <div className={styles.receipt_sheet_row}>
          <span className={styles.receipt_sheet_label}>승인번호</span>
          <span className={styles.receipt_sheet_value}>
            {payment.approval_number}
          </span>
        </div>
        <div className={styles.receipt_sheet_row}>
          <span className={styles.receipt_sheet_label}>결제일시</span>
          <span className={styles.receipt_sheet_value}>
            {payment.payment_datetime}
          </span>
        </div>
        <div className={styles.receipt_sheet_row}>
          <span className={styles.receipt_sheet_label}>금액</span>
          <span className={styles.receipt_sheet_value}>{payment.amount}</span>
        </div>
      </div>
    </>
  );
}

/** 거래명세서 캡처용: 무통장입금(현금 영수증) - 한 블록으로 표시 */
function ReceiptBankContent({
  bankPayment,
}: {
  bankPayment: BankTransferPaymentInfo;
}) {
  return (
    <div className={styles.receipt_sheet_block}>
      <div className={styles.receipt_sheet_row}>
        <span className={styles.receipt_sheet_label}>거래번호</span>
        <span className={styles.receipt_sheet_value}>
          {bankPayment.transaction_number}
        </span>
      </div>
      <div className={styles.receipt_sheet_row}>
        <span className={styles.receipt_sheet_label}>구매자</span>
        <span className={styles.receipt_sheet_value}>{bankPayment.buyer}</span>
      </div>
      <div className={styles.receipt_sheet_row}>
        <span className={styles.receipt_sheet_label}>용도</span>
        <span className={styles.receipt_sheet_value}>{bankPayment.purpose}</span>
      </div>
      <div className={styles.receipt_sheet_row}>
        <span className={styles.receipt_sheet_label}>발급번호</span>
        <span className={styles.receipt_sheet_value}>
          {bankPayment.issuance_number}
        </span>
      </div>
      <div className={styles.receipt_sheet_row}>
        <span className={styles.receipt_sheet_label}>결제일시</span>
        <span className={styles.receipt_sheet_value}>
          {bankPayment.payment_datetime}
        </span>
      </div>
      <div className={styles.receipt_sheet_row}>
        <span className={styles.receipt_sheet_label}>금액</span>
        <span className={styles.receipt_sheet_value}>{bankPayment.amount}</span>
      </div>
    </div>
  );
}

/** 거래명세서 캡처용: 회사 정보 블록 */
function ReceiptCompanyContent() {
  return (
    <div className={styles.receipt_sheet_block}>
      <div className={styles.receipt_sheet_row}>
        <span className={styles.receipt_sheet_label}>상호명</span>
        <span className={styles.receipt_sheet_value}>
          {COMPANY_INFO.company_name}
        </span>
      </div>
      <div className={styles.receipt_sheet_row}>
        <span className={styles.receipt_sheet_label}>대표자명</span>
        <span className={styles.receipt_sheet_value}>{COMPANY_INFO.ceo}</span>
      </div>
      <div className={styles.receipt_sheet_row}>
        <span className={styles.receipt_sheet_label}>사업자등록번호</span>
        <span className={styles.receipt_sheet_value}>
          {COMPANY_INFO.business_number}
        </span>
      </div>
      <div className={styles.receipt_sheet_row}>
        <span className={styles.receipt_sheet_label}>전화번호</span>
        <span className={styles.receipt_sheet_value}>{COMPANY_INFO.phone}</span>
      </div>
      <div className={styles.receipt_sheet_row}>
        <span className={styles.receipt_sheet_label}>주소</span>
        <span className={styles.receipt_sheet_value}>
          {COMPANY_INFO.address}
        </span>
      </div>
    </div>
  );
}
