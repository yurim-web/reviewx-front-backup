/* ========================================
   파트너 포인트 - 결제 정보 데이터
   ========================================
   사용처: PartnerPaymentInfoModal.tsx
   실제 API 연동 시 이 파일에서 데이터 불러오기 로직만 교체하면 됨.
   ======================================== */

import type { PartnerPointHistory } from "@/types/domain/partner";

/* ----- 카드 결제 (카드 매출 전표) ----- */

export interface PaymentInfoFromHistory {
  transaction_number: string;
  buyer: string;
  card_type: string;
  card_number: string;
  approval_number: string;
  payment_datetime: string;
  amount: string;
}

/** 카드 결제 시 결제 정보 목업 (실제 API 연동 시 교체) */
export function getPaymentInfoFromHistory(
  history: PartnerPointHistory | null
): PaymentInfoFromHistory | null {
  if (!history || history.type !== "earned") return null;
  const idNum = history.id.replace(/\D/g, "") || "125";
  return {
    transaction_number: idNum.padStart(6, "0"),
    buyer: "(주)청명종합광고기획",
    card_type: "우리비씨",
    card_number: "9566",
    approval_number: "{PG사승인번호}",
    payment_datetime: `${history.date} 12:19:20`,
    amount: `${history.amount.toLocaleString()}원`,
  };
}

/* ----- 무통장입금 (현금 영수증 발급 관련) ----- */

export interface BankTransferPaymentInfo {
  transaction_number: string;
  buyer: string;
  purpose: string; // 용도 (예: 소득공제)
  issuance_number: string; // 발급번호
  payment_datetime: string;
  amount: string;
}

/** 무통장입금 시 현금 영수증 발급 정보 목업 (실제 API 연동 시 교체) */
export function getBankTransferPaymentInfoFromHistory(
  history: PartnerPointHistory | null
): BankTransferPaymentInfo | null {
  if (!history || history.type !== "earned") return null;
  const idNum = history.id.replace(/\D/g, "") || "1";
  return {
    transaction_number: idNum.padStart(6, "0"),
    buyer: "홍길동",
    purpose: "소득공제",
    issuance_number: "01012345678",
    payment_datetime: `${history.date} 12:19:20`,
    amount: `${history.amount.toLocaleString()}원`,
  };
}

export const COMPANY_INFO = {
  company_name: "주식회사 마크엑스",
  ceo: "유기수",
  business_number: "222-22-22222",
  phone: "010-0000-0000",
  address: "인천광역시 남동구 장자로 14, 2층 201호",
};