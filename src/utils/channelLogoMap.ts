/* ========================================
   🏢 채널 로고 매핑 유틸리티
   ======================================== */

/**
 * 채널 이름과 아이콘 경로를 매핑하는 객체
 *
 * 📌 Record 타입:
 * - TypeScript의 유틸리티 타입
 * - Record<키타입, 값타입> 형태
 * - 문자열 키와 문자열 값을 가진 객체를 정의
 *
 * 📌 사용 목적:
 * - 채널 이름을 받아서 해당하는 로고 아이콘 경로를 반환
 * - 모든 배송형 신청자 카드 컴포넌트에서 공통으로 사용
 * - 중앙 집중식 관리로 유지보수 용이성 향상
 *
 * 📌 사용 예시:
 * - "네이버" -> "/images/brand_logo/navershop.svg"
 * - "네이버 인플루언서" -> "/images/brand_logo/naverblog.svg"
 * - "쿠팡" -> "/images/brand_logo/coupang.svg"
 */

// KEY는 공백 제거한 정규화 문자열을 사용 (예: "네이버 클립" → "네이버클립")
export const channel_logo_map: Record<string, string> = {
  네이버블로그: "/images/brand_logo/naverblog.svg",
  네이버클립: "/images/brand_logo/naverclip.svg",
  클립: "/images/brand_logo/naverclip.svg", // "클립" 별도 지원
  인스타그램: "/images/brand_logo/insta.svg",
  유튜브: "/images/brand_logo/youtube.svg",
  릴스: "/images/brand_logo/reels.svg",
  쇼츠: "/images/brand_logo/shots.svg",
  숏츠: "/images/brand_logo/shots.svg", // "숏츠"도 지원 (기존 호환성)
  기본: "/images/icons/phone_verified.svg",
};

/**
 * 채널 이름으로 로고 아이콘 경로를 가져오는 함수
 *
 * 📌 함수형 접근:
 * - 매핑 객체를 직접 노출하지 않고 함수를 통해 접근
 * - 타입 안전성 향상
 * - 기본값 처리 가능
 *
 * @param channelName - 채널 이름 (예: "네이버", "쿠팡")
 * @returns 해당 채널의 로고 아이콘 경로
 */
export function getChannelLogo(channelName: string): string {
  if (!channelName) return "/images/icons/phone_verified.svg";
  // 공백 제거하여 정규화
  const normalized = channelName.replace(/\s+/g, "");
  return channel_logo_map[normalized] ?? "/images/icons/phone_verified.svg";
}

/**
 * 카테고리 아이콘 매핑 객체
 *
 * 설명:
 * - 캠페인 카테고리에 따라 아이콘 경로를 반환합니다.
 * - 지원 카테고리: 네이버블로그, 클립, 유튜브, 쇼츠, 릴스, 인스타그램
 */
export const category_icon_map: Record<string, string> = {
  네이버블로그: "/images/brand_logo/naverblog.svg",
  네이버클립: "/images/brand_logo/naverclip.svg",
  클립: "/images/brand_logo/naverclip.svg",
  유튜브: "/images/brand_logo/youtube.svg",
  쇼츠: "/images/brand_logo/shots.svg",
  릴스: "/images/brand_logo/reels.svg",
  인스타그램: "/images/brand_logo/insta.svg",
};

/**
 * 캠페인 타입과 카테고리에 따라 아이콘 경로를 가져오는 함수
 *
 * 설명:
 * - 구매평, 미션형은 타입에 따라 고정 아이콘을 사용합니다.
 * - 그 외 타입은 카테고리에 따라 동적으로 아이콘을 가져옵니다.
 *
 *
 * @param type - 캠페인 타입 (배송형, 방문형, 구매평, 기자단, 미션형)
 * @param category - 카테고리 (네이버블로그, 클립, 유튜브, 쇼츠, 릴스, 인스타그램)
 * @returns 아이콘 경로
 */
export function getCategoryIcon(
  type: "배송형" | "방문형" | "구매평" | "기자단" | "미션형",
  category?: string
): string {
  // 구매평과 미션형은 타입에 따라 고정 아이콘 사용
  if (type === "구매평") {
    return "/images/brand_logo/review.svg";
  }
  if (type === "미션형") {
    return "/images/brand_logo/misssion.svg";
  }

  // 그 외 타입은 카테고리에 따라 동적 아이콘 사용
  if (!category) {
    return "/images/icons/phone_verified.svg";
  }

  // 공백 제거하여 정규화
  const normalized = category.replace(/\s+/g, "");
  return category_icon_map[normalized] ?? "/images/icons/phone_verified.svg";
}
