/* ========================================
   🏷️ 유저 타입 태그 컴포넌트 (공통)
   ======================================== */

/**
 * 유저 타입 태그 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 유저 타입 태그 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_ga/member/blacklist (GA 관리자 차단 내역 페이지)
 * - /manager_sa/member/blacklist (SA 관리자 차단 내역 페이지)
 * - 기타 유저 타입을 표시해야 하는 모든 페이지
 *
 * 주요 기능:
 * - 리뷰어: 분홍색 배경, 분홍색 텍스트
 * - 파트너: 파란색 배경, 파란색 텍스트
 * - 관리자: 회색 배경, 회색 텍스트
 */

/**
 * 유저 타입 정의
 */
export type UserType = "리뷰어" | "파트너" | "관리자";

/**
 * UserTypeTag 컴포넌트 Props 인터페이스
 *
 * 각 속성 설명:
 * - type: 표시할 유저 타입 값 (리뷰어, 파트너, 관리자 중 하나)
 * - styles: CSS 모듈에서 가져온 스타일 객체
 */
interface UserTypeTagProps {
  type: UserType;
  styles: Record<string, string>;
}

/**
 * 유저 타입 태그 컴포넌트
 *
 * @param type - 표시할 유저 타입 값
 * @param styles - CSS 모듈 스타일 객체
 */
export default function UserTypeTag({
  type,
  styles: css_styles,
}: UserTypeTagProps) {
  /**
   * 타입에 따라 적절한 CSS 클래스명을 반환하는 함수
   */
  const get_type_class_name = () => {
    switch (type) {
      case "리뷰어":
        // 리뷰어: 분홍색 배경, 분홍색 텍스트
        return css_styles.division_tag_reviewer;
      case "파트너":
        // 파트너: 파란색 배경, 파란색 텍스트
        return css_styles.division_tag_partner;
      case "관리자":
        // 관리자: 회색 배경, 회색 텍스트
        return css_styles.division_tag_admin;
      default:
        // 기본값으로 리뷰어 스타일 반환
        return css_styles.division_tag_reviewer;
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
      className={`${css_styles.division_tag} ${get_type_class_name()}`}
      role="status"
      aria-label={`유저 타입: ${type}`}
    >
      <span>{type}</span>
    </div>
  );
}
