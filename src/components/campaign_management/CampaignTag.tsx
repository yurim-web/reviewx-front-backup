// 캠페인 태그 컴포넌트들
// 캠페인 카드에 표시되는 작은 태그들 (마감임박, 배송형/방문형, 브랜드 아이콘 등)

import styles from "../../styles/campaign_management/campaign_management.module.css";

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
      className={`${styles.cam_tag} ${
        isUrgent ? styles.urgent : styles.normal
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
    <div className={styles.cam_type}>
      <span>{type}</span>
    </div>
  );
}

/**
 * 브랜드/플랫폼 아이콘
 */
export function CamIcon({ icon }: { icon: string }) {
  return (
    <div className={styles.cam_icon}>
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
    <div className={styles.cam_cate_icon}>
      <CamIcon icon={icon} />
      <CamType type={type} />
    </div>
  );
}
