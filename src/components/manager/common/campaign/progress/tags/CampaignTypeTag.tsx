/* ========================================
   🏷️ 캠페인 유형 태그 컴포넌트 (공통)
   ======================================== */

/**
 * 캠페인 유형 태그 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 캠페인 유형 태그 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 *
 * 주요 기능:
 * - 배송형, 방문형, 구매평, 기자단, 미션형을 표시합니다
 * - 모든 유형은 동일한 스타일을 사용합니다
 *
 */

// 캠페인 유형 타입 정의
export type CampaignType = '배송형' | '방문형' | '구매평' | '기자단' | '미션형';

// 캠페인 유형 태그 props 타입 정의
interface CampaignTypeTagProps {
  type: CampaignType; // 캠페인 유형
  styles: {
    type_tag: string;
  }; // CSS 모듈 스타일 객체
}

/**
 * 캠페인 유형 태그 컴포넌트
 *
 * @param type - 캠페인 유형
 * @param styles - CSS 모듈 스타일 객체
 */
export default function CampaignTypeTag({
  type,
  styles: cssStyles,
}: CampaignTypeTagProps) {
  return (
    <div className={cssStyles.type_tag}>
      <span>{type}</span>
    </div>
  );
}

