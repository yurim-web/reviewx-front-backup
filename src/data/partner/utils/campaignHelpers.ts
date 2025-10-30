/* ========================================
   🧰 캠페인 데이터 헬퍼 (공용)
   ======================================== */

/**
 * 상태별 안내 문구 생성
 * - 카드 하단/툴팁 등에 사용할 간단 메시지
 */
export const getStatusMessage = (status: string, daysLeft: number): string => {
  switch (status) {
    case "예정":
      return `캠페인 오픈까지 ${daysLeft}일 남았습니다.`;
    case "모집 중":
    case "신청":
      return `캠페인 선정 발표까지 ${daysLeft}일 남았습니다.`;
    case "진행 중":
    case "진행":
      return "캠페인 당첨자를 선정해 주세요.";
    case "종료":
      return "캠페인이 마감되었습니다.";
    case "취소":
      return "캠페인을 취소하였습니다.";
    default:
      return `캠페인 선정 발표까지 ${daysLeft}일 남았습니다.`;
  }
};

/**
 * 브랜드 로고 경로 반환
 * - 카테고리(구매평/미션형) 우선, 그 외는 브랜드명 매핑
 */
export const getBrandLogo = (brandName: string, category?: string): string => {
  if (category === "구매평") return "/images/brand_logo/review.svg";
  if (category === "미션형") return "/images/brand_logo/misssion.svg";

  switch (brandName) {
    case "쿠팡":
      return "/images/brand_logo/coupang.svg";
    case "네이버블로그":
      return "/images/brand_logo/naverblog.svg";
    case "네이버클립":
      return "/images/brand_logo/naverclip.svg";
    case "인스타그램":
      return "/images/brand_logo/insta.svg";
    case "릴스":
      return "/images/brand_logo/reels.svg";
    case "네이버쇼핑":
      return "/images/brand_logo/navershop.svg";
    case "숏츠":
      return "/images/brand_logo/shots.svg";
    case "11번가":
      return "/images/brand_logo/11st.svg";
    default:
      return "/images/icons/phone_verified.svg";
  }
};

/**
 * 캠페인 상태 → 서브 상태 키 반환
 * - 관리 카드의 버튼/액션 표시에 사용될 간단 키워드
 */
export const getSubStatus = (
  status: string,
  applicantsCount: number,
  selectedCount: number
): string => {
  switch (status) {
    case "예정":
      return "campaign_edit";
    case "모집 중":
    case "신청":
      return applicantsCount > 0
        ? "campaign_edit,applicant_management"
        : "campaign_edit";
    case "진행 중":
    case "진행":
      return "winner_selection";
    case "종료":
      return "content_review,content_approval";
    case "취소":
      return "penalty";
    default:
      return "campaign_edit";
  }
};
