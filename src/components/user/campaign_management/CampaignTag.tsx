/* ========================================
   🏷️ 캠페인 태그 컴포넌트들
   ======================================== */

/**
 * 캠페인 태그 컴포넌트들
 *
 * 목적: 캠페인 카드에 표시되는 작은 태그들을 제공하는 유틸리티 컴포넌트들입니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 페이지 - CampaignCard에서 사용)
 *
 * 주요 기능:
 * - 마감임박/D-day 태그 (CamTag)
 * - 캠페인 타입 태그 (배송형/방문형/구매평/기자단/미션형) (CamType)
 * - 브랜드/플랫폼 아이콘 (CamIcon)
 * - 카테고리 아이콘 + 타입 조합 (CamCateIcon)
 */

import cardStyles from '../../../styles/user/campaign_management/campaign_card.module.css';

/**
 * 마감 임박 또는 D-day 태그
 * @param isUrgent - 긴급 여부 (마감임박)
 * @param remainingDays - 남은 일수
 */
export function CamTag({
  isUrgent,
  remainingDays,
}: {
  isUrgent: boolean;
  remainingDays: number;
}) {
  return (
    <div
      className={`${cardStyles.cam_tag} ${
        isUrgent ? cardStyles.urgent : cardStyles.normal
      }`}
    >
      <span>{isUrgent ? '마감임박' : `${remainingDays}일 전`}</span>
    </div>
  );
}

/**
 * 캠페인 타입 태그 (배송형 / 방문형 / 구매평 / 기자단 / 미션형)
 *
 * 설명:
 * - 모든 캠페인 타입을 표시할 수 있는 컴포넌트입니다.
 * - CSS 스타일은 동일하게 적용됩니다.
 */
export function CamType({
  type,
}: {
  type: '배송형' | '방문형' | '구매평' | '기자단' | '미션형';
}) {
  return (
    <div className={cardStyles.cam_type}>
      <span>{type}</span>
    </div>
  );
}

/**
 * 브랜드/플랫폼 아이콘
 */
export function CamIcon({ icon }: { icon: string }) {
  return (
    <div className={cardStyles.cam_icon}>
      <img src={icon} alt="브랜드 아이콘" />
    </div>
  );
}

/**
 * 카테고리 아이콘 + 타입을 함께 표시하는 컴포넌트
 *
 * 설명:
 * - 브랜드/플랫폼 아이콘과 캠페인 타입(배송형, 방문형, 구매평, 기자단, 미션형)을 함께 표시합니다.
 * - 모든 타입이 동일하게 아이콘과 타입 텍스트를 표시합니다.
 */
export function CamCateIcon({
  category,
  icon,
  type,
}: {
  category: string;
  icon: string;
  type: '배송형' | '방문형' | '구매평' | '기자단' | '미션형';
}) {
  // 모든 타입에 대해 아이콘과 타입 텍스트를 함께 표시
  return (
    <div className={cardStyles.cam_cate_icon}>
      <CamIcon icon={icon} />
      <CamType type={type} />
    </div>
  );
}
