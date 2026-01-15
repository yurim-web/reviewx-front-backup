/* ========================================
   🏷️ 결제 수단 태그 컴포넌트 (공통)
   ======================================== */

/**
 * 결제 수단 태그 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 결제 수단 태그 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/payment_history (SA 관리자 결제 내역 페이지)
 * - 기타 결제 수단을 표시해야 하는 모든 페이지
 *
 * 주요 기능:
 * - 카드 결제: 분홍색 배경, 분홍색 텍스트
 * - 무통장 입금: 회색 배경, 회색 텍스트
 */

// CSS 모듈 직접 import
// 컴포넌트 내부에서 스타일을 직접 가져와서 사용합니다
import tag_styles from "@/styles/common/tags.module.css";

/**
 * 결제 수단 타입 정의
 */
export type PaymentMethod = "카드 결제" | "무통장 입금";

/**
 * PaymentMethodTag 컴포넌트 Props 인터페이스
 *
 * 각 속성 설명:
 * - method: 표시할 결제 수단 값 (카드 결제, 무통장 입금 중 하나)
 */
interface PaymentMethodTagProps {
  method: PaymentMethod;
}

/**
 * 결제 수단 태그 컴포넌트
 *
 * @param method - 표시할 결제 수단 값
 */
export default function PaymentMethodTag({
  method,
}: PaymentMethodTagProps) {
  /**
   * 결제 수단에 따라 적절한 CSS 클래스명을 반환하는 함수
   */
  const get_method_class_name = () => {
    switch (method) {
      case "카드 결제":
        // 카드 결제: 분홍색 배경, 분홍색 텍스트
        return tag_styles.payment_method_card;
      case "무통장 입금":
        // 무통장 입금: 회색 배경, 회색 텍스트
        return tag_styles.payment_method_bank;
      default:
        // 기본값으로 카드 결제 스타일 반환
        return tag_styles.payment_method_card;
    }
  };

  /**
   * JSX 반환
   *
   * className: CSS 모듈에서 가져온 클래스명을 조합하여 적용합니다.
   * 템플릿 리터럴(백틱 `)을 사용하여 여러 클래스를 하나의 문자열로 합칩니다.
   * ${}: 템플릿 리터럴 내에서 변수나 표현식을 삽입할 때 사용합니다.
   *
   * role="status": 스크린 리더를 위한 접근성 속성입니다.
   * aria-label: 스크린 리더가 읽을 수 있는 설명을 제공합니다.
   */
  return (
    <div
      className={`${tag_styles.payment_method_tag} ${get_method_class_name()}`}
      role="status"
      aria-label={`결제 수단: ${method}`}
    >
      <span>{method}</span>
    </div>
  );
}
