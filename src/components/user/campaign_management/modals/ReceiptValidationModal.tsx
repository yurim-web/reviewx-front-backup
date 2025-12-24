/* ========================================
   ✅ 구매 영수증 검수 실패 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 구매 영수증 검수 실패 모달 컴포넌트 (유저용)
 *
 * 목적: 구매 영수증 자동 검수 결과에 따라 검수 실패 항목을 알리고,
 *       재업로드를 요청하는 모달입니다.
 *
 * 사용 위치:
 * - 구매 영수증 등록/수정 후 자동 검수 결과에 따라 표시
 * - ReceiptRegistrationModal에서 영수증 등록/수정 완료 후 검수 실패 시 사용
 *
 * 검수 항목:
 * 1. 주문번호 (order_number)
 * 2. 배송지 (delivery_address)
 * 3. 주문 금액 (order_amount)
 * 4. 구매 상품 (purchase_item)
 *
 * 모달 구성:
 * - 검수 실패 항목에 따른 안내 메시지
 * - 취소 버튼: 모달만 닫기
 * - 등록 버튼: 영수증 재등록 모달로 이동 (on_register 콜백)
 *
 * 한국어 조사 처리:
 * - 주문번호, 배송지: "가" 조사 사용
 * - 주문 금액, 구매 상품: "이" 조사 사용
 */

"use client";

import { useMemo } from "react";
import BaseModal from "@/components/common/modal/BaseModal";

/* ========================================
   📋 타입 정의
   ======================================== */

/**
 * 검수 실패 항목 타입
 * - order_number: 주문번호
 * - delivery_address: 배송지
 * - order_amount: 주문 금액
 * - purchase_item: 구매 상품
 */
export type ValidationFailureType =
  | "order_number"
  | "delivery_address"
  | "order_amount"
  | "purchase_item";

/**
 * ReceiptValidationModal 컴포넌트 Props
 */
interface ReceiptValidationModalProps {
  /** 모달 열림/닫힘 상태 */
  is_open: boolean;
  /** 모달 닫기 함수 */
  on_close: () => void;
  /** 검수 실패 항목 타입 */
  failure_type: ValidationFailureType | null;
  /** 등록 버튼 클릭 핸들러 (영수증 재등록 모달 열기) */
  on_register?: () => void;
}

/* ========================================
   📝 상수 정의
   ======================================== */

/**
 * 검수 실패 항목별 메시지 맵
 *
 * 설명:
 * - 각 검수 실패 항목에 대한 안내 메시지를 정의합니다.
 * - 메시지는 3줄로 구성되며, <br> 태그로 줄바꿈합니다.
 * - 한국어 조사를 올바르게 처리합니다.
 *   - 주문번호, 배송지: "가" 조사
 *   - 주문 금액, 구매 상품: "이" 조사
 *
 * 실무 팁:
 * - 상수를 객체로 관리하면 타입 안정성과 유지보수성이 향상됩니다.
 * - Record 타입을 사용하여 모든 키가 ValidationFailureType에 속하도록 보장합니다.
 * - as const를 사용하여 타입 추론을 더 정확하게 만듭니다.
 */
const VALIDATION_MESSAGES: Record<ValidationFailureType, string> = {
  order_number:
    "영수증에 주문번호가 확인되지 않습니다.<br>주문번호가 포함된 영수증을<br>추가 등록해 주세요.",
  delivery_address:
    "영수증에 배송지가 확인되지 않습니다.<br>배송지가 포함된 영수증을<br>추가 등록해 주세요.",
  order_amount:
    "영수증에 주문 금액이 확인되지 않습니다.<br>주문 금액이 포함된 영수증을<br>추가 등록해 주세요.",
  purchase_item:
    "영수증에 구매 상품이 확인되지 않습니다.<br>구매 상품이 포함된 영수증으로<br>추가 등록해 주세요.",
} as const;

/**
 * 모달 버튼 라벨
 */
const MODAL_BUTTONS = ["취소", "등록"] as const;

/* ========================================
   🛠️ 유틸리티 함수
   ======================================== */

/**
 * 검수 실패 항목 타입 가드 함수
 *
 * @param value - 검사할 값
 * @returns value가 ValidationFailureType인지 여부
 *
 * 설명:
 * - 타입 가드를 사용하여 런타임에서 타입을 안전하게 검사합니다.
 * - 실무에서는 타입 안정성을 위해 타입 가드를 적극 활용합니다.
 */
function isValidationFailureType(
  value: unknown
): value is ValidationFailureType {
  return (
    typeof value === "string" &&
    Object.keys(VALIDATION_MESSAGES).includes(value)
  );
}

/**
 * 검수 실패 항목에 따른 메시지 조회 함수
 *
 * @param failure_type - 검수 실패 항목 타입
 * @returns 검수 실패 안내 메시지 (HTML 형식, <br> 태그 포함)
 *
 * 설명:
 * - 메시지 맵에서 해당 항목의 메시지를 조회합니다.
 * - 타입 가드를 통해 안전하게 메시지를 반환합니다.
 * - 실무에서는 이런 방식으로 메시지를 중앙 관리합니다.
 */
function getValidationMessage(
  failure_type: ValidationFailureType | null
): string {
  if (!failure_type || !isValidationFailureType(failure_type)) {
    return "";
  }
  return VALIDATION_MESSAGES[failure_type];
}

/* ========================================
   🎨 컴포넌트
   ======================================== */

/**
 * 구매 영수증 검수 실패 모달 컴포넌트
 *
 * 사용 예시:
 * ```tsx
 * const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
 * const [failureType, setFailureType] = useState<ValidationFailureType | null>(null);
 *
 * <ReceiptValidationModal
 *   is_open={isValidationModalOpen}
 *   on_close={() => setIsValidationModalOpen(false)}
 *   failure_type={failureType}
 *   on_register={() => {
 *     setIsValidationModalOpen(false);
 *     setIsReceiptModalOpen(true);
 *   }}
 * />
 * ```
 *
 * 실무 팁:
 * - useMemo를 사용하여 메시지 계산을 최적화합니다.
 * - early return 패턴을 사용하여 불필요한 렌더링을 방지합니다.
 * - 콜백 함수는 useCallback으로 메모이제이션하는 것이 좋지만,
 *   이 컴포넌트는 단순하므로 인라인으로 작성해도 무방합니다.
 */
export default function ReceiptValidationModal({
  is_open,
  on_close,
  failure_type,
  on_register,
}: ReceiptValidationModalProps) {
  // 검수 실패 항목에 따른 메시지 계산 (useMemo로 최적화)
  const message = useMemo(
    () => getValidationMessage(failure_type),
    [failure_type]
  );

  // 검수 실패 항목이 없거나 메시지가 없으면 모달을 표시하지 않음
  if (!is_open || !failure_type || !message) {
    return null;
  }

  // 등록 버튼 클릭 핸들러
  const handle_register = () => {
    on_register?.();
    on_close();
  };

  return (
    <BaseModal
      is_open={is_open}
      on_close={on_close}
      message={message}
      buttons={[...MODAL_BUTTONS]}
      on_confirm={handle_register}
      type="center"
      close_on_overlay_click={true}
      close_on_escape={true}
    />
  );
}
