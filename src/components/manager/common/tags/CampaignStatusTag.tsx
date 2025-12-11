/* ========================================
   🏷️ 캠페인 상태 태그 컴포넌트 (공통)
   ======================================== */

/**
 * 캠페인 상태 태그 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 캠페인 상태 태그 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 * - 기타 캠페인 상태를 표시해야 하는 모든 페이지
 *
 * 주요 기능:
 * - 예정: 노란색 배경, 노란색 텍스트
 * - 신청: 분홍색 배경, 분홍색 텍스트
 * - 진행: 파란색 배경, 파란색 텍스트
 * - 종료: 회색 배경, 흰색 텍스트
 * - 취소: 연한 빨간색 배경, 빨간색 텍스트
 * - 긴급: 빨간색 배경, 흰색 텍스트
 */

/**
 * 캠페인 상태 타입 정의
 */
export type CampaignStatus =
  | "예정"
  | "신청"
  | "진행"
  | "종료"
  | "취소"
  | "긴급";

/**
 * CampaignStatusTag 컴포넌트 Props 인터페이스
 *
 * 각 속성 설명:
 * - status: 표시할 상태 값 (예정, 신청, 진행, 종료, 취소, 긴급 중 하나)
 * - styles: CSS 모듈에서 가져온 스타일 객체
 */
interface CampaignStatusTagProps {
  status: CampaignStatus;
  styles: Record<string, string>;
}

/**
 * 캠페인 상태 태그 컴포넌트
 *
 * @param status - 표시할 상태 값
 * @param styles - CSS 모듈 스타일 객체
 */
export default function CampaignStatusTag({
  status,
  styles: css_styles,
}: CampaignStatusTagProps) {
  /**
   * 상태에 따라 적절한 CSS 클래스명을 반환하는 함수
   *
   * switch 문을 사용하여 각 상태에 맞는 CSS 클래스를 반환합니다.
   * switch 문: 여러 조건을 비교할 때 사용하는 JavaScript 제어문입니다.
   * case: 각 조건에 해당하는 경우를 정의합니다.
   * default: 모든 case에 해당하지 않을 때 실행되는 기본값입니다.
   */
  const get_status_class_name = () => {
    switch (status) {
      case "예정":
        return css_styles.status_tag_scheduled;
      case "신청":
        return css_styles.status_tag_applied;
      case "진행":
        return css_styles.status_tag_progress;
      case "종료":
        return css_styles.status_tag_ended;
      case "취소":
        return css_styles.status_tag_cancelled;
      case "긴급":
        return css_styles.status_tag_urgent;
      default:
        // 기본값으로 예정 상태 스타일 반환
        return css_styles.status_tag_scheduled;
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
      className={`${css_styles.status_tag} ${get_status_class_name()}`}
      role="status"
      aria-label={`캠페인 상태: ${status}`}
    >
      <span>{status}</span>
    </div>
  );
}
