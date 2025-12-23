/**
 * 캠페인 남은 일수/상태 계산 유틸
 *
 * - today, applicationStart, applicationEnd 를 기준으로 dayCount 텍스트를 만들어줍니다.
 * - "긴급" 같은 기존 상태 텍스트가 들어온 경우 그대로 유지합니다.
 */

/**
 * 날짜 문자열(YYYY-MM-DD)을 Date(자정) 객체로 변환
 */
function toDateOnly(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

/**
 * 남은 일수/상태 텍스트 계산
 *
 * @param applicationStart - 신청 시작일 (YYYY-MM-DD)
 * @param applicationEnd - 신청 마감일 (YYYY-MM-DD)
 * @param originalDayCount - 데이터에 미리 설정된 dayCount (예: "긴급")
 */
export function calculateDayCount(
  applicationStart: string,
  applicationEnd: string,
  originalDayCount?: string
): string {
  // 1) "긴급" 같은 특수 상태는 그대로 유지
  if (originalDayCount && originalDayCount.includes("긴급")) {
    return originalDayCount;
  }

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // 오늘(자정 기준), 시작일, 마감일을 Date로 변환
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDate = toDateOnly(applicationStart);
  const endDate = toDateOnly(applicationEnd);

  // 2) 아직 오픈 전: dayCount는 비워두고, 상단에서는 schedule을 사용
  if (today < startDate) {
    return "";
  }

  // 3) 마감 이후: "마감"으로 표시
  if (today > endDate) {
    return "마감";
  }

  // 4) 진행 중: 남은 일수를 계산해서 D-형태로 표현
  const diffMs = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / MS_PER_DAY);

  // 남은 일수가 1일 이하이면 "마감임박"으로 표시
  if (diffDays <= 1) {
    return "마감임박";
  }

  return `D-${diffDays}`;
}


