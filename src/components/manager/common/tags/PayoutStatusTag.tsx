/* ========================================
   🏷️ 출금 처리 상태 태그 컴포넌트 (공통)
   ======================================== */

/**
 * 출금 처리 상태 태그 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 출금 처리 상태(지급) 태그 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/withdrawal (SA 관리자 출금 현황 페이지)
 * - 기타 출금 처리 상태를 표시해야 하는 모든 페이지
 *
 * 주요 기능:
 * - 신청: 회색 배경, 회색 텍스트
 * - 긴급: 빨간색 배경, 흰색 텍스트
 * - 완료: 연한 초록색 배경, 초록색 텍스트
 * - 반려: 연한 빨간색 배경, 빨간색 텍스트
 */

// CSS 모듈 직접 import
// 컴포넌트 내부에서 스타일을 직접 가져와서 사용합니다
import tag_styles from "@/styles/common/tags.module.css";

/**
 * 출금 처리 상태 타입 정의
 */
export type PayoutStatus = "신청" | "긴급" | "완료" | "반려";

/**
 * PayoutStatusTag 컴포넌트 Props 인터페이스
 *
 * 각 속성 설명:
 * - status: 표시할 출금 처리 상태 값 (신청, 긴급, 완료, 반려 중 하나)
 */
interface PayoutStatusTagProps {
  status: PayoutStatus;
}

/**
 * 출금 처리 상태 태그 컴포넌트
 *
 * @param status - 표시할 출금 처리 상태 값
 */
export default function PayoutStatusTag({
  status,
}: PayoutStatusTagProps) {
  /**
   * 상태에 따라 적절한 CSS 클래스명을 반환하는 함수
   */
  const get_status_class_name = () => {
    switch (status) {
      case "신청":
        // 신청: 회색 배경, 회색 텍스트
        return tag_styles.payout_status_request;
      case "긴급":
        // 긴급: 빨간색 배경, 흰색 텍스트
        return tag_styles.payout_status_urgent;
      case "완료":
        // 완료: 연한 초록색 배경, 초록색 텍스트
        return tag_styles.payout_status_completed;
      case "반려":
        // 반려: 연한 빨간색 배경, 빨간색 텍스트
        return tag_styles.payout_status_rejected;
      default:
        // 기본값으로 신청 상태 스타일 반환
        return tag_styles.payout_status_request;
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
      className={`${tag_styles.payout_status_tag} ${get_status_class_name()}`}
      role="status"
      aria-label={`출금 처리 상태: ${status}`}
    >
      <span>{status}</span>
    </div>
  );
}

