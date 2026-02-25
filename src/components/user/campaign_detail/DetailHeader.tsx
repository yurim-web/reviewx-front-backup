/* ========================================
   🏷️ 캠페인 헤더 컴포넌트 (태그 & 포인트)
   ======================================== */

/**
 * 캠페인 헤더 컴포넌트
 *
 * 목적: 캠페인 상세 페이지 상단의 태그와 포인트 정보를 표시합니다.
 *
 * 사용 페이지:
 * - /user/campaign/[type]/[id] (캠페인 상세 페이지)
 */

import Image from "next/image";
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
  dayCount?: string; // 남은 일수 또는 상태 (예: "D-5", "마감임박", "마감") - 선택사항
  isUrgent?: boolean; // 긴급 캠페인 여부 (기본값: false)
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
  isUrgent: isUrgentProp = false,
}: CampaignHeaderProps) {
  // 지역 태그를 "서울 + (화살표) + 영등포구" 형태로 표시하기 위한 분리 로직
  // - 예: "서울 영등포구" -> ["서울", "영등포구"]
  // - 예: "서울 강남/서초" -> ["서울", "강남/서초"]
  // - 예: "서울 > 종로구" -> ["서울", "종로구"] (">" 문자 제거)
  const get_region_parts = (raw_region: string): { first: string; second?: string } => {
    const trimmed = raw_region.trim();
    if (!trimmed) return { first: "" };

    // 0) ">" 문자가 있으면 먼저 분리하고 ">" 문자 제거
    const arrow_idx = trimmed.indexOf(">");
    if (arrow_idx > 0) {
      const first = trimmed.slice(0, arrow_idx).trim();
      const second = trimmed.slice(arrow_idx + 1).trim();
      return second ? { first, second } : { first };
    }

    // 1) 공백이 있으면 첫 단어를 시/도, 나머지를 구/동으로 사용
    const space_idx = trimmed.indexOf(" ");
    if (space_idx > 0) {
      const first = trimmed.slice(0, space_idx).trim();
      const second = trimmed.slice(space_idx + 1).trim();
      return second ? { first, second } : { first };
    }

    // 2) 공백이 없고 슬래시가 있으면 첫 토큰/나머지로 분리
    const slash_idx = trimmed.indexOf("/");
    if (slash_idx > 0) {
      const first = trimmed.slice(0, slash_idx).trim();
      const second = trimmed.slice(slash_idx + 1).trim();
      return second ? { first, second } : { first };
    }

    return { first: trimmed };
  };

  const region_parts = region ? get_region_parts(region) : null;

  // 긴급 캠페인 여부 확인
  // isUrgent prop이 있으면 우선 사용, 없으면 dayCount에서 "긴급" 포함 여부 확인 (하위 호환성)
  const isUrgent = isUrgentProp || dayCount?.includes("긴급") || false;

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
        <Image
          className={styles.tag_icon}
          src={categoryIcon}
          alt={altText}
          width={30}
          height={30}
        />

        {/* 카테고리 태그 (예: 배송형) */}
        <div className={styles.tag_box}>{category}</div>

        {/* 서브카테고리 태그 (예: 뷰티) */}
        <div className={styles.subcategory_tag}>{subcategory}</div>

        {/* 지역 태그 (예: 서울 강남/서초) - 지역 정보가 있을 때만 표시 */}
        {region_parts?.first && (
          <div className={styles.region_tag}>
            <span>{region_parts.first}</span>
            {region_parts.second && (
              <>
                <Image
                  src="/images/filter/region_arrow.svg"
                  alt=""
                  aria-hidden="true"
                  width={12}
                  height={12}
                  className={styles.region_tag_arrow}
                />
                <span>{region_parts.second}</span>
              </>
            )}
          </div>
        )}

        {/* 
          긴급 태그 - dayCount가 "긴급"을 포함할 때만 표시
          조건부 렌더링: && 연산자를 사용하여 조건이 true일 때만 요소를 렌더링
        */}
        {isUrgent && <div className={styles.urgent_tag}>긴급</div>}
      </div>

      {/* 오른쪽: 포인트 정보 */}
      <div className={styles.points}>
        {/* 
          toLocaleString(): 숫자를 천 단위 콤마로 포맷
        */}
        + {points.toLocaleString()} P
      </div>
    </article>
  );
}
