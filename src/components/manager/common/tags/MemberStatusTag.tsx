/* ========================================
   🏷️ 회원 상태 태그 컴포넌트 (공통)
   ======================================== */

/**
 * 회원 상태 태그 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 회원 상태 태그 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/withdrawal_request (SA 관리자 출금 요청 페이지)
 * - /manager_ga/settlement/withdrawal_request (GA 관리자 출금 요청 페이지 - 향후 사용 예정)
 * - 기타 회원 상태를 표시해야 하는 모든 페이지
 *
 * 주요 기능:
 * - 정상: 파란색 배경, 파란색 텍스트
 * - 일시 정지: 연한 빨간색 배경, 빨간색 텍스트
 * - 영구 정지: 회색 배경, 회색 텍스트
 * - 탈퇴: 회색 배경, 회색 텍스트
 */

// CSS 모듈 직접 import
// 컴포넌트 내부에서 스타일을 직접 가져와서 사용합니다
import tag_styles from "@/styles/common/tags.module.css";

/**
 * 회원 상태 타입 정의
 *
 * 참고: 공백이 없는 형태("일시정지", "영구정지")가 들어와도
 * 컴포넌트 내부에서 정규화하여 처리합니다.
 */
export type MemberStatus = "정상" | "일시 정지" | "영구 정지" | "탈퇴";

/**
 * MemberStatusTag 컴포넌트 Props 인터페이스
 *
 * 각 속성 설명:
 * - status: 표시할 상태 값 (정상, 일시 정지, 영구 정지, 탈퇴 중 하나)
 */
interface MemberStatusTagProps {
  status: MemberStatus;
}

/**
 * 회원 상태 태그 컴포넌트
 *
 * @param status - 표시할 상태 값
 */
export default function MemberStatusTag({ status }: MemberStatusTagProps) {
  /**
   * 상태 값을 정규화하는 함수
   * 공백이 포함된 상태 값도 처리할 수 있도록 합니다.
   *
   * 예: "일시 정지" → "일시정지", "영구 정지" → "영구정지"
   */
  const normalize_status = (status_value: string): string => {
    return status_value.replace(/\s+/g, "");
  };

  /**
   * 상태에 따라 적절한 CSS 클래스명을 반환하는 함수
   */
  const get_status_class_name = () => {
    // 상태 값을 정규화하여 공백 제거
    const normalized = normalize_status(status);

    switch (normalized) {
      case "정상":
        return tag_styles.status_tag_normal;
      case "일시정지":
        return tag_styles.status_tag_suspended;
      case "영구정지":
        return tag_styles.status_tag_permanent;
      case "탈퇴":
        return tag_styles.status_tag_withdrawn;
      default:
        // 기본값으로 정상 상태 스타일 반환
        return tag_styles.status_tag_normal;
    }
  };

  /**
   * 상태에 따라 표시할 텍스트를 반환하는 함수
   *
   * 일시정지/일시 정지의 경우 "일시 정지"로 공백을 포함하여 표시합니다.
   * 영구정지/영구 정지의 경우 "영구 정지"로 공백을 포함하여 표시합니다.
   * 정상과 탈퇴는 그대로 표시합니다.
   */
  const get_status_text = () => {
    const normalized = normalize_status(status);

    if (normalized === "일시정지") {
      return "일시 정지";
    }
    if (normalized === "영구정지") {
      return "영구 정지";
    }
    // 정상, 탈퇴는 원본 그대로 반환
    return status;
  };

  return (
    <div
      className={`${tag_styles.status_tag} ${get_status_class_name()}`}
      role="status"
      aria-label={`상태: ${status}`}
    >
      <span>{get_status_text()}</span>
    </div>
  );
}
