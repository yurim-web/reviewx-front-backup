/* ========================================
   캘린더 공통 아이콘 컴포넌트
   ======================================== */

/**
 * CalendarIcons
 *
 * 목적: react-day-picker 캘린더에서 사용하는 이전/다음 달 버튼 아이콘을 공통으로 제공합니다.
 *
 * 사용 페이지:
 * - RangeCalendar.tsx (날짜 범위 선택)
 * - SingleCalendar.tsx (단일 날짜 선택)
 */

import Image from "next/image";

export function PreviousMonthIcon() {
  return <Image src="/images/calendar/calendar_left.svg" alt="이전 달" width={24} height={24} />;
}

export function NextMonthIcon() {
  return <Image src="/images/calendar/calendar_right.svg" alt="다음 달" width={24} height={24} />;
}
