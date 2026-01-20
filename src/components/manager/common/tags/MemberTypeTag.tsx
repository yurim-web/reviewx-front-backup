/* ========================================
   🏷️ 회원 유형 태그 컴포넌트 (공통)
   ======================================== */

/**
 * 회원 유형 태그 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 회원 유형 태그 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/withdrawal (SA 관리자 출금 현황 페이지)
 * - 기타 회원 유형을 표시해야 하는 모든 페이지
 *
 * 주요 기능:
 * - 일반 회원: 회색 배경, 회색 텍스트
 * - 주의 회원: 연한 빨간색 배경, 빨간색 텍스트
 * - 이용 제한 회원: 회색 배경, 회색 텍스트
 *
 * React 학습 포인트:
 * - 조건부 렌더링: switch 문을 사용하여 상태에 따라 다른 스타일 적용
 * - CSS 모듈: CSS 클래스를 동적으로 조합하여 사용
 * - TypeScript 타입: 타입 안정성을 위한 타입 정의
 */

// CSS 모듈 직접 import
// 컴포넌트 내부에서 스타일을 직접 가져와서 사용합니다
import tag_styles from "@/styles/common/tags.module.css";

/**
 * 회원 유형 타입 정의
 * 
 * 설명:
 * - 출금 현황 페이지에서 사용하는 회원 유형입니다.
 * - 일반 회원, 주의 회원, 이용 제한 회원 3가지 옵션을 제공합니다.
 */
export type MemberType = "일반 회원" | "주의 회원" | "이용 제한 회원";

/**
 * MemberTypeTag 컴포넌트 Props 인터페이스
 *
 * 각 속성 설명:
 * - type: 표시할 회원 유형 값 (일반 회원, 주의 회원, 이용 제한 회원 중 하나)
 */
interface MemberTypeTagProps {
  type: MemberType;
}

/**
 * 회원 유형 태그 컴포넌트
 *
 * @param type - 표시할 회원 유형 값
 * 
 * 설명:
 * - 회원 유형에 따라 다른 색상의 태그를 표시합니다.
 * - switch 문을 사용하여 유형별로 적절한 CSS 클래스를 반환합니다.
 * 
 * React 학습 포인트:
 * - 조건부 스타일링: get_type_class_name 함수에서 switch 문으로 조건에 따라 다른 스타일 적용
 * - 템플릿 리터럴: 백틱(`)을 사용하여 여러 CSS 클래스를 하나의 문자열로 합침
 * - 접근성: role과 aria-label 속성으로 스크린 리더 지원
 */
export default function MemberTypeTag({ type }: MemberTypeTagProps) {
  /**
   * 유형에 따라 적절한 CSS 클래스명을 반환하는 함수
   * 
   * 설명:
   * - switch 문을 사용하여 각 유형에 맞는 CSS 클래스를 반환합니다.
   * - 각 유형별로 다른 배경색과 텍스트 색상을 적용합니다.
   */
  const get_type_class_name = () => {
    switch (type) {
      case "일반 회원":
        // 일반 회원: 회색 배경, 회색 텍스트
        return tag_styles.type_tag_normal;
      case "주의 회원":
        // 주의 회원: 연한 빨간색 배경, 빨간색 텍스트
        return tag_styles.type_tag_penalty_caution;
      case "이용 제한 회원":
        // 이용 제한 회원: 회색 배경, 회색 텍스트
        return tag_styles.type_tag_normal;
      default:
        // 기본값으로 일반 회원 스타일 반환
        return tag_styles.type_tag_normal;
    }
  };

  /**
   * JSX 반환
   *
   * 설명:
   * - className: CSS 모듈에서 가져온 클래스명을 조합하여 적용합니다.
   * - 템플릿 리터럴(백틱 `)을 사용하여 여러 클래스를 하나의 문자열로 합칩니다.
   * - ${}: 템플릿 리터럴 내에서 변수나 표현식을 삽입할 때 사용합니다.
   *
   * - role="status": 스크린 리더를 위한 접근성 속성입니다.
   * - aria-label: 스크린 리더가 읽을 수 있는 설명을 제공합니다.
   */
  return (
    <div
      className={`${tag_styles.type_tag} ${get_type_class_name()}`}
      role="status"
      aria-label={`회원 유형: ${type}`}
    >
      <span>{type}</span>
    </div>
  );
}


