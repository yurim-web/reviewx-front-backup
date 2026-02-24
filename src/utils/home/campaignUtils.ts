/* ========================================
   홈 캠페인 유틸 (시드 난수, 셔플, 마감 여부, 스케줄 포맷)
   ======================================== */

import { format } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 시드 기반 난수 생성기 (선형 합동 생성기)
 * 같은 시드 값이면 항상 같은 난수 시퀀스를 생성합니다.
 */
export function seeded_random(seed: number) {
  let current_seed = seed;
  return () => {
    current_seed = (current_seed * 9301 + 49297) % 233280;
    return current_seed / 233280;
  };
}

/**
 * 배열을 무작위로 섞는 함수 (Fisher-Yates, 시드 기반)
 * Hydration 방지를 위해 시드 미제공 시 고정 시드(12345) 사용.
 */
export function shuffle_array<T>(array: T[], seed?: number): T[] {
  const shuffled = [...array];
  const date_seed = seed ?? 12345;
  const random = seeded_random(date_seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const random_index = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[random_index]] = [
      shuffled[random_index],
      shuffled[i],
    ];
  }
  return shuffled;
}

/** 마감되지 않은 캠페인 여부 판별용 타입 */
export type CampaignScheduleLike = {
  detailedSchedule?: {
    applicationStart: string;
    applicationEnd: string;
  };
  recruitment: { current: number };
};

/**
 * 마감되지 않은 캠페인인지 판별 (모집 기간 진행 중만 true)
 */
export function isNotClosed(
  campaign: CampaignScheduleLike,
  today: Date
): boolean {
  if (campaign.detailedSchedule) {
    const { applicationStart, applicationEnd } = campaign.detailedSchedule;
    const startDate = new Date(applicationStart);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(applicationEnd);
    endDate.setHours(0, 0, 0, 0);
    return today >= startDate && today <= endDate;
  }
  return campaign.recruitment.current > 0;
}

/**
 * 모집 시작일을 "M/d (E)\n모집 오픈" 형식으로 포맷.
 * 오픈 예정일일 때만 값 반환, 아니면 "".
 */
export function generateSchedule(applicationStart: string): string {
  if (!applicationStart) return "";
  try {
    const startDate = new Date(applicationStart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    if (today < startDate) {
      const startDateTime = new Date(applicationStart);
      const formattedDate = format(startDateTime, "M/d (E)", { locale: ko });
      return `${formattedDate}\n모집 오픈`;
    }
  } catch (_error) {
  }
  return "";
}
