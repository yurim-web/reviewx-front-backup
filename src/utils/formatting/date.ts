/* ========================================
   📅 날짜 포맷팅 유틸리티
   ======================================== */

import { format } from "date-fns";

/**
 * 날짜 포맷팅 유틸리티
 *
 * 용도:
 * - 일관된 날짜 형식 제공
 * - date-fns를 활용한 다양한 포맷 지원
 */

/**
 * 날짜를 "YYYY-MM-DD" 형식으로 포맷팅
 *
 * @param date - Date 객체 또는 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2024-01-20")
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "yyyy-MM-dd");
};

/**
 * 날짜를 "YYYY년 MM월 DD일" 형식으로 포맷팅
 *
 * @param date - Date 객체 또는 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2024년 01월 20일")
 */
export const formatDateKorean = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "yyyy년 MM월 dd일");
};

/**
 * 날짜와 시간을 "YYYY-MM-DD HH:mm:ss" 형식으로 포맷팅
 *
 * @param date - Date 객체 또는 날짜 문자열
 * @returns 포맷된 날짜시간 문자열 (예: "2024-01-20 14:30:00")
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "yyyy-MM-dd HH:mm:ss");
};

/**
 * 날짜와 시간을 "YYYY년 MM월 DD일 HH:mm" 형식으로 포맷팅
 *
 * @param date - Date 객체 또는 날짜 문자열
 * @returns 포맷된 날짜시간 문자열 (예: "2024년 01월 20일 14:30")
 */
export const formatDateTimeKorean = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "yyyy년 MM월 dd일 HH:mm");
};

/**
 * 시간을 "HH:mm:ss" 형식으로 포맷팅
 *
 * @param date - Date 객체 또는 날짜 문자열
 * @returns 포맷된 시간 문자열 (예: "14:30:00")
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "HH:mm:ss");
};

/**
 * 타이머 형식으로 포맷팅 (MM:SS)
 *
 * @param seconds - 초 단위 시간
 * @returns 포맷된 타이머 문자열 (예: "03:00")
 */
export const formatTimer = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

/**
 * 상대 시간 표시 (예: "3일 전", "2시간 전")
 *
 * @param date - Date 객체 또는 날짜 문자열
 * @returns 상대 시간 문자열
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}일 전`;
  if (diffHours > 0) return `${diffHours}시간 전`;
  if (diffMins > 0) return `${diffMins}분 전`;
  return "방금 전";
};

/**
 * 날짜 문자열이 특정 날짜 범위 내에 있는지 확인
 *
 * @param dateStr - "YYYY-MM-DD" 또는 "YYYY-MM-DD HH:mm" 형식의 날짜 문자열
 * @param startDate - 범위 시작 날짜
 * @param endDate - 범위 종료 날짜
 * @returns 범위 내에 있으면 true
 */
export const isDateInRange = (dateStr: string, startDate: Date, endDate: Date): boolean => {
  const itemDateStr = dateStr.split(" ")[0];
  const itemDate = new Date(itemDateStr);
  itemDate.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return itemDate >= start && itemDate <= end;
};

/**
 * 이번 주(월~일)의 시작일과 종료일 반환
 *
 * @returns { start: 월요일 00:00:00, end: 일요일 23:59:59 }
 */
export const getCurrentWeekRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
};

/**
 * 이번 달의 시작일과 종료일 반환
 *
 * @returns { start: 1일 00:00:00, end: 말일 23:59:59 }
 */
export const getCurrentMonthRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

/**
 * 등록 날짜를 모바일용으로 포맷팅 (시간 제거)
 *
 * @param dateString - 날짜 문자열 (예: "2025-11-02 17:37" 또는 "2025-11-02")
 * @returns 날짜만 포함된 문자열 (예: "2025-11-02")
 */
export const formatDateForMobile = (dateString: string): string => {
  // 날짜에서 시간 부분 제거 (공백 이전까지만 추출)
  return dateString.split(" ")[0];
};

/**
 * 시간 정보를 제거하고 날짜만 비교용 Date 반환 (00:00:00으로 설정)
 *
 * @param d - Date 객체
 * @returns 시간이 00:00:00으로 초기화된 Date 객체
 */
export function toDateOnly(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

/**
 * "A ~ B" 또는 "A~B" 형식의 기간 문자열을 파싱합니다.
 * 단일 날짜면 start === end 로 취급합니다.
 *
 * @param value - 기간 문자열 (예: "2025-01-01 ~ 2025-01-31")
 * @returns { start: Date; end: Date } 또는 유효하지 않으면 null
 */
export function parseDateRange(value: string): { start: Date; end: Date } | null {
  if (!value?.trim()) return null;
  const sep = value.includes(" ~ ") ? " ~ " : "~";
  const parts = value
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean);
  const startStr = parts[0];
  const endStr = parts[1] ?? parts[0];
  if (!startStr) return null;
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  return { start: toDateOnly(start), end: toDateOnly(end) };
}

/**
 * 등록 기간 문자열에서 마감 날짜(기한) 추출
 *
 * @param registrationPeriod - 등록 기간 문자열 (예: "2025-12-08 ~ 2025-12-25" 또는 "~2025-12-25")
 * @returns 마감 날짜 문자열 (예: "2025-12-25") 또는 undefined
 *
 * 예시:
 * ```ts
 * extractDeadlineDate("2025-12-08 ~ 2025-12-25")
 * // => "2025-12-25"
 *
 * extractDeadlineDate("~ 2025-12-25")
 * // => "2025-12-25"
 * ```
 */
export function extractDeadlineDate(registrationPeriod?: string): string | undefined {
  if (!registrationPeriod) return undefined;

  const separator = registrationPeriod.includes(" ~ ") ? " ~ " : "~";
  const endDateStr = registrationPeriod.split(separator)[1]?.trim();

  if (endDateStr) {
    const dateMatch = endDateStr.match(/^(\d{4}-\d{2}-\d{2})/);
    return dateMatch ? dateMatch[1] : undefined;
  }

  return undefined;
}
