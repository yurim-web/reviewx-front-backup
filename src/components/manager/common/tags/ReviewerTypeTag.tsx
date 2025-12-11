/* ========================================
   🏷️ 리뷰어 타입 태그 컴포넌트 (공통)
   ======================================== */

/**
 * 리뷰어 타입 태그 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 리뷰어 타입 태그 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers (GA 관리자 리뷰어 목록 페이지)
 * - /manager_sa/member/reviewers (SA 관리자 리뷰어 목록 페이지)
 * - /manager_ga/member/blacklist (GA 관리자 차단 내역 페이지)
 * - /manager_sa/member/blacklist (SA 관리자 차단 내역 페이지)
 * - 기타 리뷰어 타입을 표시해야 하는 모든 페이지
 *
 * 주요 기능:
 * - 서포터즈: 분홍색 배경, 분홍색 텍스트
 * - 일반: 회색 배경, 회색 텍스트
 * - 인플루언서: 연한 초록색 배경, 초록색 텍스트
 */

/**
 * 리뷰어 타입 정의
 */
export type ReviewerType = "서포터즈" | "일반" | "인플루언서";

/**
 * ReviewerTypeTag 컴포넌트 Props 인터페이스
 *
 * 각 속성 설명:
 * - type: 표시할 리뷰어 타입 값 (서포터즈, 일반, 인플루언서 중 하나)
 * - styles: CSS 모듈에서 가져온 스타일 객체
 */
interface ReviewerTypeTagProps {
  type: ReviewerType;
  styles: Record<string, string>;
}

/**
 * 리뷰어 타입 태그 컴포넌트
 *
 * @param type - 표시할 리뷰어 타입 값
 * @param styles - CSS 모듈 스타일 객체
 */
export default function ReviewerTypeTag({
  type,
  styles: css_styles,
}: ReviewerTypeTagProps) {
  /**
   * 타입에 따라 적절한 CSS 클래스명을 반환하는 함수
   *
   * switch 문을 사용하여 각 타입에 맞는 CSS 클래스를 반환합니다.
   * switch 문: 여러 조건을 비교할 때 사용하는 JavaScript 제어문입니다.
   * case: 각 조건에 해당하는 경우를 정의합니다.
   * default: 모든 case에 해당하지 않을 때 실행되는 기본값입니다.
   */
  const get_type_class_name = () => {
    switch (type) {
      case "서포터즈":
        return css_styles.type_tag_supporter;
      case "일반":
        return css_styles.type_tag_normal;
      case "인플루언서":
        return css_styles.type_tag_influencer;
      default:
        // 기본값으로 일반 타입 스타일 반환
        return css_styles.type_tag_normal;
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
      className={`${css_styles.type_tag} ${get_type_class_name()}`}
      role="status"
      aria-label={`리뷰어 타입: ${type}`}
    >
      <span>{type}</span>
    </div>
  );
}
