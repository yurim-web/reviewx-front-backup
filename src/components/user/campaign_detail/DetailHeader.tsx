/* ========================================
   🏷️ 캠페인 헤더 컴포넌트 (태그 & 포인트)
   ======================================== */

/**
 * 캠페인 헤더 컴포넌트
 *
 * 목적: 캠페인 상세 페이지 상단의 태그와 포인트 정보를 표시합니다.
 *
 * 주요 기능:
 * - 카테고리 아이콘 및 태그 표시
 * - 서브카테고리 태그 표시
 * - 포인트 정보 표시
 */

import { getChannelLogo } from "@/utils/channelLogoMap";
import styles from "@/styles/user/campaign/campaign_detail/detail_header.module.css";

/**
 * Props 인터페이스
 * TypeScript: 컴포넌트에 전달되는 데이터의 타입을 정의합니다.
 */
interface CampaignHeaderProps {
  channel: string; // 채널 정보 (예: "네이버 블로그", "인스타그램", "유튜브")
  category: string; // 카테고리 이름 (예: 배송형, 방문형 등)
  subcategory: string; // 서브카테고리 이름 (예: 뷰티, 푸드 등)
  region?: string; // 지역 정보 (예: 서울 강남/서초) - 선택사항
  points: number; // 포인트 (숫자)
  altText?: string; // 이미지 alt 속성 (선택사항)
  dayCount?: string; // 남은 일수 또는 상태 (예: "D-5", "긴급", "마감임박", "마감") - 선택사항
}

/**
 * 캠페인 헤더 컴포넌트
 *
 * @param props - CampaignHeaderProps 타입의 속성들
 * @returns 태그와 포인트 정보를 담은 JSX 요소
 */
export default function CampaignHeader({
  channel,
  category,
  subcategory,
  region,
  points,
  altText = "category_tag",
  dayCount,
}: CampaignHeaderProps) {
  // dayCount가 "긴급"인지 확인하는 함수
  // includes(): 문자열에 특정 문자열이 포함되어 있는지 확인
  const isUrgent = dayCount?.includes("긴급") || false;

  // dayCount가 "마감"인지 확인하는 함수
  // 마감된 캠페인은 "마감" 태그를 표시
  const isClosed = dayCount === "마감" || false;

  // 카테고리에 따라 아이콘 경로 결정
  // 구매평과 미션형은 전용 아이콘으로 고정, 나머지는 채널에 따라 동적 아이콘 사용
  let categoryIcon: string;
  if (category === "구매평") {
    categoryIcon = "/images/brand_logo/review.svg";
  } else if (category === "미션형") {
    categoryIcon = "/images/brand_logo/misssion.svg";
  } else {
    // 배송형, 방문형, 기자단 등은 채널에 따라 동적 아이콘 사용
    categoryIcon = getChannelLogo(channel);
  }

  return (
    // ========================================
    // 태그 및 포인트 섹션
    // ========================================
    <article className={styles.tags_section}>
      {/* 왼쪽: 태그 정보 */}
      <div className={styles.tag_icon_container}>
        {/* 카테고리 아이콘 */}
        <img className={styles.tag_icon} src={categoryIcon} alt={altText} />

        {/* 카테고리 태그 (예: 배송형) */}
        <div className={styles.tag_box}>{category}</div>

        {/* 서브카테고리 태그 (예: 뷰티) */}
        <div className={styles.subcategory_tag}>{subcategory}</div>

        {/* 지역 태그 (예: 서울 강남/서초) - 지역 정보가 있을 때만 표시 */}
        {region && <div className={styles.region_tag}>{region}</div>}

        {/* 
          긴급 태그 - dayCount가 "긴급"을 포함할 때만 표시
          조건부 렌더링: && 연산자를 사용하여 조건이 true일 때만 요소를 렌더링
        */}
        {isUrgent && <div className={styles.urgent_tag}>긴급</div>}

        {/* 
          마감 태그 - dayCount가 "마감"일 때만 표시
          마감된 캠페인을 명확하게 표시하기 위한 태그
        */}
        {isClosed && <div className={styles.closed_tag}>마감</div>}
      </div>

      {/* 오른쪽: 포인트 정보 */}
      <div className={styles.points}>
        {/* 
          toLocaleString(): 숫자를 천 단위 콤마로 포맷팅
          예: 5000 → "5,000"
        */}
        + {points.toLocaleString()} P
      </div>
    </article>
  );
}
