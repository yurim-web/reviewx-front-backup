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
 * - 캠페인 유형(구매평/미션형) 우선, 그 외는 브랜드명 매핑
 * - 브랜드명 정규화: 공백 제거하여 "네이버 블로그" → "네이버블로그" 변환
 */
export const getBrandLogo = (brandName: string, campaignType?: string): string => {
  if (campaignType === "구매평") return "/images/brand_logo/review.svg";
  if (campaignType === "미션형") return "/images/brand_logo/misssion.svg";

  // 브랜드명 정규화 (공백 제거)
  // 예: "네이버 블로그" → "네이버블로그", "네이버 클립" → "네이버클립"
  const normalizedBrandName = brandName ? brandName.replace(/\s+/g, "") : "";

  switch (normalizedBrandName) {
    case "네이버블로그":
      return "/images/brand_logo/naverblog.svg";
    case "네이버클립":
      return "/images/brand_logo/naverclip.svg";
    case "인스타그램":
      return "/images/brand_logo/insta.svg";
    case "릴스":
      return "/images/brand_logo/reels.svg";
    case "유튜브":
      return "/images/brand_logo/youtube.svg";
    case "쇼츠":
      return "/images/brand_logo/shots.svg";
    default:
      return "/images/icons/phone_verified.svg";
  }
};

/**
 * 캠페인 탭(상태) → 서브 상태 키 반환
 * - 관리 카드의 버튼/액션 표시에 사용될 간단 키워드
 *
 * 탭별 버튼 규칙:
 * 1. 예정 탭: "campaign_edit,campaign_delete" (캠페인 수정하기 + 캠페인 삭제하기)
 * 2. 신청 탭: "campaign_edit,applicant_management" (캠페인 관리하기 + 신청 내역 확인하기)
 * 3. 진행 탭: "winner_selection" 또는 "content_review,content_approval" (당첨자 선정하기 or 콘텐츠 검수하기 + 콘텐츠 확인하기)
 * 4. 종료 탭: "content_review,content_approval" (콘텐츠 검수하기 + 콘텐츠 확인하기)
 * 5. 취소 탭: "penalty" (패널티 내역보기)
 *
 * 📌 학습 포인트:
 * - 탭(상태)에 따라 다른 버튼 조합을 반환
 * - 콘텐츠가 있는 경우 진행 탭에서도 콘텐츠 버튼 표시 (CampaignCard에서 처리)
 */
export const getSubStatus = (
  tabStatus: string, // 탭 상태: "예정" | "신청" | "진행" | "종료" | "취소"
  applicantsCount: number,
  selectedCount: number
): string => {
  switch (tabStatus) {
    case "예정":
      // 예정 탭: 캠페인 삭제하기 + 캠페인 수정하기
      return "campaign_edit,campaign_delete";
    case "신청":
      // 신청 탭: 캠페인 관리하기 + 신청 내역 확인하기 (신청자 수와 관계없이 항상 2개 버튼)
      return "campaign_edit,applicant_management";
    case "진행":
      // 진행 탭: 선정자 수에 따라 버튼 결정
      // 선정자가 0명이면 → "당첨자 선정하기" 버튼만
      // 선정자가 1명 이상이면 → "콘텐츠 검수하기" + "콘텐츠 확인하기" 버튼 2개
      return selectedCount > 0
        ? "content_review,content_approval"
        : "winner_selection";
    case "종료":
      // 종료 탭: 콘텐츠 검수하기 + 콘텐츠 확인하기
      return "content_review,content_approval";
    case "취소":
      // 취소 탭: 패널티 내역보기
      return "penalty";
    default:
      // 기본값: 캠페인 수정하기
      return "campaign_edit";
  }
};

/* ========================================
   🧭 파트너 탭 분류 헬퍼
   ======================================== */

/**
 * 캠페인 탭 판별 (파트너 관리 탭: 전체/예정/신청/진행/종료)
 *
 * 규칙(요청 반영):
 * - 전체: 모든 캠페인
 * - 예정: "모집기간"의 시작일이 아직 오늘이 되지 않은 경우
 * - 신청: 오늘이 "모집기간" 범위 안에 있는 경우
 * - 진행: 선정 단계로, 오늘이 "등록기간" 범위 안에 있는 경우
 * - 종료: 오늘이 "등록기간" 종료일을 지난 경우
 *
 * 입력 형식 예시:
 * - recruitmentPeriod: "2025-10-25 ~ 2025-11-05"
 * - registrationPeriod: "2025-11-07 ~ 2025-11-14"
 */
export function getPartnerTabByDates(
  recruitmentPeriod?: string,
  registrationPeriod?: string,
  todayInput?: Date
): "전체" | "예정" | "신청" | "진행" | "종료" {
  const today = normalizeToDateOnly(todayInput ?? new Date());

  const [recruitStart, recruitEnd] = parseDateRange(recruitmentPeriod);
  const [regStart, regEnd] = parseDateRange(registrationPeriod);

  // 예정: 모집 시작 전
  if (recruitStart && isBefore(today, recruitStart)) return "예정";

  // 신청: 모집기간 내
  if (
    recruitStart &&
    recruitEnd &&
    isWithinInclusive(today, recruitStart, recruitEnd)
  ) {
    return "신청";
  }

  // 진행: 등록기간 내
  if (regStart && regEnd && isWithinInclusive(today, regStart, regEnd)) {
    return "진행";
  }

  // 종료: 등록 종료 후
  if (regEnd && isAfter(today, regEnd)) return "종료";

  // 등록기간 정보가 없고, 모집도 지나간 경우 → 종료로 간주
  if (!regEnd && recruitEnd && isAfter(today, recruitEnd)) return "종료";

  // 기본: 전체 (정의 불가 시)
  return "전체";
}

/* ----------------------------------------
   내부 유틸 (날짜 파싱/비교)
   ---------------------------------------- */

function parseDateRange(range?: string): [Date | null, Date | null] {
  if (!range || typeof range !== "string") return [null, null];
  const parts = range.split("~").map((s) => s.trim());
  if (parts.length !== 2) return [null, null];
  const start = parseDateFlexible(parts[0]);
  const end = parseDateFlexible(parts[1]);
  return [start, end];
}

function parseDateFlexible(value?: string): Date | null {
  if (!value) return null;
  // 공백 제거 및 날짜만 추출 (예: "2025-11-12 10:00" → "2025-11-12")
  const dateOnly = value.split(" ")[0];
  const d = new Date(dateOnly);
  return isNaN(d.getTime()) ? null : normalizeToDateOnly(d);
}

function normalizeToDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isBefore(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}

function isAfter(a: Date, b: Date): boolean {
  return a.getTime() > b.getTime();
}

function isWithinInclusive(target: Date, start: Date, end: Date): boolean {
  const t = target.getTime();
  return t >= start.getTime() && t <= end.getTime();
}
