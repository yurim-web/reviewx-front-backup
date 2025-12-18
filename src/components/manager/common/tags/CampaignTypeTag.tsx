/* ========================================
   🏷️ 캠페인 타입 태그 컴포넌트 (공통)
   ======================================== */

/**
 * 캠페인 타입 태그 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 캠페인 타입 태그 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 * - /manager_ga/member/reviewers/[id] (GA 관리자 리뷰어 디테일 페이지 - 캠페인 진행 내역 모달)
 * - /manager_sa/member/reviewers/[id] (SA 관리자 리뷰어 디테일 페이지 - 캠페인 진행 내역 모달)
 * - /manager_ga/member/partners/[id] (GA 관리자 파트너 디테일 페이지 - 캠페인 진행 내역 모달)
 * - /manager_sa/member/partners/[id] (SA 관리자 파트너 디테일 페이지 - 캠페인 진행 내역 모달)
 * - 기타 캠페인 타입을 표시해야 하는 모든 페이지
 *
 * 주요 기능:
 * - 배송형: 회색 배경, 회색 텍스트
 * - 방문형: 회색 배경, 회색 텍스트
 * - 구매평: 회색 배경, 회색 텍스트
 * - 기자단: 회색 배경, 회색 텍스트
 * - 미션형: 회색 배경, 회색 텍스트
 * - 모든 타입은 동일한 스타일을 사용합니다
 */

/**
 * 캠페인 타입 정의
 */
export type CampaignType = "배송형" | "방문형" | "구매평" | "기자단" | "미션형";

/**
 * CampaignTypeTag 컴포넌트 Props 인터페이스
 *
 * 각 속성 설명:
 * - type: 표시할 캠페인 타입 값 (배송형, 방문형, 구매평, 기자단, 미션형 중 하나)
 * - styles: CSS 모듈에서 가져온 스타일 객체
 */
interface CampaignTypeTagProps {
  type: CampaignType;
  styles: Record<string, string>;
}

/**
 * 캠페인 타입 태그 컴포넌트
 *
 * @param type - 표시할 캠페인 타입 값
 * @param styles - CSS 모듈 스타일 객체
 */
export default function CampaignTypeTag({
  type,
  styles: css_styles,
}: CampaignTypeTagProps) {
  /**
   * JSX 반환
   *
   * className: CSS 모듈에서 가져온 클래스명을 적용합니다.
   * 모든 캠페인 타입은 동일한 스타일(type_tag)을 사용합니다.
   *
   * role="status": 스크린 리더를 위한 접근성 속성입니다.
   * aria-label: 스크린 리더가 읽을 수 있는 설명을 제공합니다.
   */
  return (
    <div
      className={css_styles.type_tag}
      role="status"
      aria-label={`캠페인 타입: ${type}`}
    >
      <span>{type}</span>
    </div>
  );
}
