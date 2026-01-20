/* ========================================
   🔍 SA 관리자 전용 필터 옵션
   ======================================== */

/**
 * SA 관리자 전용 필터 옵션
 *
 * 목적: SA 관리자 페이지에서만 사용하는 필터 옵션들을 한 곳에 모아둔 파일입니다.
 *       manager_sa 전용 필터 옵션들을 관리합니다.
 *
 * 📍 사용 위치:
 * - 관리자 목록 페이지 (관리자 상태 필터)
 * - 정산 관리 페이지 (결제 상태, 출금 상태 필터)
 * - 기타 SA 관리자 전용 페이지
 *
 * ⚠️ 참고:
 * - Channel, CampaignStatus, CampaignType은 manager_ga와 manager_sa 공통이므로
 *   src/data/manager/common/filterOptions.ts에서 import하여 사용합니다.
 *
 * 주요 기능:
 * - SA 관리자 전용 필터 타입 정의
 * - 필터 옵션 배열 정의
 * - 필터 라벨 매핑 객체 정의
 *
 */

// 공통 필터 옵션에서 import (재export)
export type {
  Channel,
  CampaignStatus,
  CampaignType,
} from "@/data/manager/common/filterOptions";

export {
  channel_filter_options,
  channel_name_map,
  campaign_status_filter_options,
  campaign_type_filter_options,
} from "@/data/manager/common/filterOptions";

/* ========================================
   👤 관리자 필터 옵션
   ======================================== */

/**
 * 관리자 상태 타입 정의
 *
 * 설명:
 * - 관리자 목록 페이지에서 사용하는 관리자 상태입니다.
 */
export type AdminStatus = "정상" | "일시 정지" | "영구 정지";

/**
 * 관리자 상태 필터 옵션 배열
 */
export const admin_status_filter_options: AdminStatus[] = [
  "정상",
  "일시 정지",
  "영구 정지",
];

/* ========================================
   💰 정산 필터 옵션
   ======================================== */

/**
 * 결제 상태 타입 정의
 *
 * 설명:
 * - 결제 내역 페이지에서 사용하는 결제 상태입니다.
 */
export type PaymentStatus = "완료" | "대기" | "취소";

/**
 * 결제 상태 필터 옵션 배열
 */
export const payment_status_filter_options: PaymentStatus[] = [
  "완료",
  "대기",
  "취소",
];

/**
 * 결제 수단 타입 정의
 *
 * 설명:
 * - 결제 내역 페이지에서 사용하는 결제 수단입니다.
 */
export type PaymentMethod = "카드 결제" | "무통장 입금";

/**
 * 결제 수단 필터 옵션 배열
 */
export const payment_method_filter_options: PaymentMethod[] = [
  "카드 결제",
  "무통장 입금",
];

/**
 * 출금 처리 상태 타입 정의
 *
 * 설명:
 * - 출금 현황/요청 페이지에서 사용하는 출금 처리 상태입니다.
 */
export type WithdrawalPaymentStatus =
  | "urgent"
  | "request"
  | "completed"
  | "rejected";

/**
 * 출금 처리 상태 필터 옵션 배열
 */
export const withdrawal_payment_status_filter_options: WithdrawalPaymentStatus[] =
  ["urgent", "request", "completed", "rejected"];

/**
 * 출금 처리 상태 라벨 매핑 객체
 *
 * 설명:
 * - 출금 처리 상태 코드를 한글 이름으로 변환하는 매핑입니다.
 */
export const withdrawal_payment_status_label_map: Record<
  WithdrawalPaymentStatus,
  string
> = {
  urgent: "긴급",
  request: "신청",
  completed: "완료",
  rejected: "반려",
};

/**
 * 회원 유형 타입 정의
 *
 * 설명:
 * - 정산 관련 페이지에서 사용하는 회원 유형입니다.
 */
export type MemberType =
  | "모범 회원"
  | "주의 회원"
  | "경고 회원"
  | "이용 제한 회원"
  | "일반 회원";

/**
 * 회원 유형 필터 옵션 배열
 */
export const member_type_filter_options: MemberType[] = [
  "모범 회원",
  "주의 회원",
  "경고 회원",
  "이용 제한 회원",
  "일반 회원",
];
