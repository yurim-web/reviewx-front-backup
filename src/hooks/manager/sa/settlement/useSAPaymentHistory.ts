/* ========================================
   SA 결제 내역 훅
   ======================================== */

/**
 * useSAPaymentHistory
 *
 * 목적: SA 관리자 결제 내역을 백엔드 API에서 로드하고
 *       PaymentHistoryItem 타입으로 변환합니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSAPaymentList } from "@/lib/api/admin";
import type { SAPaymentHistoryParams, SAPaymentItem } from "@/types/api/admin";
import type { PaymentHistoryItem } from "@/data/manager_sa/settlement/paymentHistoryData";

const PAYMENT_METHOD_MAP: Record<string, PaymentHistoryItem["paymentMethod"]> = {
  CARD: "카드 결제",
  BANK_TRANSFER: "무통장 입금",
  POINT: "포인트 충전",
};

const PAYMENT_STATUS_MAP: Record<string, PaymentHistoryItem["paymentStatus"]> = {
  COMPLETED: "완료",
  PENDING: "대기",
  CANCELLED: "취소",
};

const ENTITY_TYPE_MAP: Record<string, PaymentHistoryItem["businessType"]> = {
  CORPORATE: "법인",
  INDIVIDUAL: "개인",
};

const RECEIPT_TYPE_MAP: Record<string, PaymentHistoryItem["taxInvoiceType"]> = {
  TAX_INVOICE: "세금계산서",
  CASH_RECEIPT_INCOME: "현금영수증 (소득공제)",
  CASH_RECEIPT_EXPENSE: "현금영수증 (지출증빙)",
  NONE: "미발행",
};

const MEMBER_GRADE_MAP: Record<string, string> = {
  EXCELLENT: "모범 회원",
  NORMAL: "일반 회원",
  CAUTION: "주의 회원",
  WARNING: "경고 회원",
  RESTRICTED: "이용 제한 회원",
};

const MEMBER_STATUS_MAP: Record<string, PaymentHistoryItem["accountStatus"]> = {
  ACTIVE: "정상",
  PAUSED: "일시정지",
  BLOCKED: "영구정지",
  WITHDRAW: "탈퇴",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

function adaptPaymentItem(item: SAPaymentItem, index: number): PaymentHistoryItem {
  const paymentMethod = PAYMENT_METHOD_MAP[item.paymentMethod] ?? "카드 결제";
  const paymentStatus = PAYMENT_STATUS_MAP[item.paymentStatus] ?? "대기";

  return {
    id: String(item.paymentId),
    number: String(index + 1).padStart(6, "0"),
    companyName: item.businessName,
    businessInfo: {
      registrationNumber: item.businessNumber,
      representativeName: item.managers?.[0] ?? "-",
    },
    depositorName: item.depositorName,
    businessType: ENTITY_TYPE_MAP[item.entityType] ?? "법인",
    paymentMethod,
    taxInvoiceType: RECEIPT_TYPE_MAP[item.receiptType] ?? "미발행",
    chargedPoints: (item.chargePoint ?? 0).toLocaleString("ko-KR"),
    heldPoints: (item.retainedPoint ?? 0).toLocaleString("ko-KR"),
    paymentStatus,
    requestDate: formatDate(item.requestedAt),
    approvalDate: item.approvedAt ? formatDate(item.approvedAt) : "-",
    memberType: MEMBER_GRADE_MAP[item.memberGrade] ?? "일반 회원",
    accountStatus: MEMBER_STATUS_MAP[item.memberStatus] ?? "정상",
  };
}

export function useSAPaymentHistory(params?: SAPaymentHistoryParams) {
  const { data: listData, isLoading } = useQuery({
    queryKey: ["saPaymentHistory", params],
    queryFn: () => fetchSAPaymentList(params),
    staleTime: 30_000,
  });

  const payments = useMemo<PaymentHistoryItem[]>(() => {
    if (!listData?.payments) return [];
    return listData.payments.map(adaptPaymentItem);
  }, [listData]);

  return { payments, isLoading };
}
