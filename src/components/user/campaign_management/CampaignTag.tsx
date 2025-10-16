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
 * - 캠페인 타입 태그 (배송형/방문형) (CamType)
 * - 브랜드/플랫폼 아이콘 (CamIcon)
 * - 카테고리 아이콘 + 타입 조합 (CamCateIcon)
 */

import cardStyles from "../../../styles/user/campaign_management/campaign_card.module.css";

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
      <span>{isUrgent ? "마감임박" : `${remainingDays}일 전`}</span>
    </div>
  );
}

/**
 * 캠페인 타입 태그 (배송형 / 방문형)
 */
export function CamType({ type }: { type: "배송형" | "방문형" }) {
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
 */
export function CamCateIcon({
  category,
  icon,
  type,
}: {
  category: string;
  icon: string;
  type: "배송형" | "방문형";
}) {
  return (
    <div className={cardStyles.cam_cate_icon}>
      <CamIcon icon={icon} />
      <CamType type={type} />
    </div>
  );
}
