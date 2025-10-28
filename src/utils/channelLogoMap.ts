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

export const channel_logo_map: Record<string, string> = {
  네이버: "/images/brand_logo/navershop.svg",
  네이버블로그: "/images/brand_logo/naverblog.svg",
  네이버쇼핑: "/images/brand_logo/navershop.svg",
  쿠팡: "/images/brand_logo/coupang.svg",
  인스타: "/images/brand_logo/insta.svg",
  카카오선물하기: "/images/brand_logo/kakaopre.svg",
  올리브영: "/images/brand_logo/oliveyoung.svg",
  오늘의집: "/images/brand_logo/todayhouse.svg",
  유튜브: "/images/brand_logo/youtube.svg",
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
  return channel_logo_map[channelName] || "/images/brand_logo/default.svg";
}
