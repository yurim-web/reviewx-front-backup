/* ========================================
   관리자 결제 내역 훅
   ======================================== */

/**
 * useAdminPayments
 *
 * 목적: SA 관리자 결제 내역을 mock API에서 로드하고
 *       파트너 데이터와 join하여 PaymentHistoryItem 타입으로 변환합니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminPayments, fetchAdminPartners } from "@/lib/api/admin";
import {
  getPaymentHistoryList,
  type PaymentHistoryItem,
} from "@/data/manager_sa/settlement/paymentHistoryData";
import type { AdminPaymentApiItem, AdminPartnerApiItem } from "@/types/api/admin";

const PAYMENT_METHOD_MAP: Record<string, PaymentHistoryItem["paymentMethod"]> = {
  CARD: "카드 결제",
  TRANSFER: "무통장 입금",
  POINT: "포인트 충전",
};

const STATUS_MAP: Record<string, PaymentHistoryItem["paymentStatus"]> = {
  COMPLETED: "완료",
  PENDING: "대기",
  CANCELLED: "취소",
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

function adaptPaymentItem(
  payment: AdminPaymentApiItem,
  partner: AdminPartnerApiItem | null,
  index: number
): PaymentHistoryItem {
  const paymentMethod = PAYMENT_METHOD_MAP[payment.payment_method] ?? "카드 결제";
  const taxInvoiceType: PaymentHistoryItem["taxInvoiceType"] =
    paymentMethod === "무통장 입금" ? "세금계산서" : "미발행";
  const paymentStatus = STATUS_MAP[payment.status] ?? "대기";

  return {
    id: String(payment.id),
    number: String(index + 1).padStart(6, "0"),
    companyName: partner?.business_name ?? `파트너#${payment.partner_id}`,
    businessInfo: {
      registrationNumber: partner?.business_number ?? "-",
      representativeName: partner?.representative_name ?? "-",
    },
    depositorName: partner?.contact_name ?? "-",
    businessType: (partner?.division as "법인" | "개인") ?? "법인",
    paymentMethod,
    taxInvoiceType,
    chargedPoints: (payment.points_charged ?? payment.amount ?? 0).toLocaleString("ko-KR"),
    heldPoints: (partner?.current_points ?? 0).toLocaleString("ko-KR"),
    paymentStatus,
    requestDate: formatDate(payment.paid_at),
    approvalDate: paymentStatus === "완료" ? formatDate(payment.paid_at) : "-",
    memberType: partner?.status_type ?? "일반 회원",
    accountStatus: (partner?.status ?? "정상") as PaymentHistoryItem["accountStatus"],
  };
}

export function useAdminPayments() {
  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ["adminPayments"],
    queryFn: fetchAdminPayments,
    staleTime: 30_000,
  });

  const { data: partnersData } = useQuery({
    queryKey: ["adminPartners"],
    queryFn: fetchAdminPartners,
    staleTime: 30_000,
  });

  const payments = useMemo<PaymentHistoryItem[]>(() => {
    if (paymentsData != null && paymentsData.length > 0) {
      return paymentsData.map((payment, index) => {
        const partner = partnersData?.find((p) => p.id === payment.partner_id) ?? null;
        return adaptPaymentItem(payment, partner, index);
      });
    }
    if (typeof window !== "undefined") {
      return getPaymentHistoryList();
    }
    return [];
  }, [paymentsData, partnersData]);

  return { payments, isLoading };
}
