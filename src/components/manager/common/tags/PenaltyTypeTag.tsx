/* ========================================
   🏷️ 패널티 유형 태그 컴포넌트 (공통)
   ======================================== */

/**
 * 패널티 유형 태그 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 패널티 유형 태그 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers/[id] (GA 관리자 리뷰어 디테일 페이지 - 패널티 내역 모달)
 * - /manager_sa/member/reviewers/[id] (SA 관리자 리뷰어 디테일 페이지 - 패널티 내역 모달)
 * - /manager_ga/member/partners/[id] (GA 관리자 파트너 디테일 페이지 - 패널티 내역 모달)
 * - /manager_sa/member/partners/[id] (SA 관리자 파트너 디테일 페이지 - 패널티 내역 모달)
 * - 기타 패널티 유형을 표시해야 하는 모든 페이지
 *
 * 주요 기능:
 * - 경고: 오렌지색 배경, 오렌지색 텍스트
 * - 주의: 연한 빨간색 배경, 빨간색 텍스트
 * - 정지: 회색 배경, 회색 텍스트
 */

/**
 * 패널티 유형 타입 정의
 */
export type PenaltyType = "경고" | "주의" | "정지";

/**
 * PenaltyTypeTag 컴포넌트 Props 인터페이스
 *
 * 각 속성 설명:
 * - type: 표시할 패널티 유형 값 (경고, 주의, 정지 중 하나)
 * - styles: CSS 모듈에서 가져온 스타일 객체
 */
interface PenaltyTypeTagProps {
  type: PenaltyType;
  styles: Record<string, string>;
}

/**
 * 패널티 유형 태그 컴포넌트
 *
 * @param type - 표시할 패널티 유형 값
 * @param styles - CSS 모듈 스타일 객체
 */
export default function PenaltyTypeTag({
  type,
  styles: css_styles,
}: PenaltyTypeTagProps) {
  /**
   * 유형에 따라 적절한 CSS 클래스명을 반환하는 함수
   *
   * switch 문을 사용하여 각 유형에 맞는 CSS 클래스를 반환합니다.
   * switch 문: 여러 조건을 비교할 때 사용하는 JavaScript 제어문입니다.
   * case: 각 조건에 해당하는 경우를 정의합니다.
   * default: 모든 case에 해당하지 않을 때 실행되는 기본값입니다.
   */
  const get_type_class_name = () => {
    switch (type) {
      case "경고":
        // 경고: 오렌지색 배경, 오렌지색 텍스트
        // CSS 클래스가 없으면 기본 type_tag_penalty 사용 (기존 스타일과 호환)
        return (
          css_styles.type_tag_penalty_warning || css_styles.type_tag_penalty
        );
      case "주의":
        // 주의: 연한 빨간색 배경, 빨간색 텍스트
        return css_styles.type_tag_penalty_caution;
      case "정지":
        // 정지: 회색 배경, 회색 텍스트
        return css_styles.type_tag_penalty_suspension;
      default:
        // 기본값으로 경고 유형 스타일 반환
        return (
          css_styles.type_tag_penalty_warning || css_styles.type_tag_penalty
        );
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
      className={`${css_styles.type_tag_penalty} ${get_type_class_name()}`}
      role="status"
      aria-label={`패널티 유형: ${type}`}
    >
      <span>{type}</span>
    </div>
  );
}
