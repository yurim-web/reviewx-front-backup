/* ========================================
   정적 캠페인 schedule / dayCount 자동 계산
   ======================================== */

import { generateSchedule } from "./campaignUtils";

type CampaignWithSchedule = {
  id?: string;
  schedule?: string;
  dayCount?: string;
  detailedSchedule?: { applicationStart: string; applicationEnd: string };
};

/**
 * 정적 캠페인에 schedule, dayCount를 detailedSchedule 기준으로 계산해 붙입니다.
 * 오픈 예정이면 schedule만, 진행 중이면 dayCount만 채움.
 */
export function enrichStaticCampaigns<T extends CampaignWithSchedule>(
  campaigns: T[]
): T[] {
  return campaigns.map((campaign) => {
    if (!campaign.detailedSchedule) return campaign;
    const { applicationStart, applicationEnd } = campaign.detailedSchedule;
    if (!applicationStart || !applicationEnd) return campaign;

    const schedule = generateSchedule(applicationStart);

    const calculateDayCount = (): string => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(applicationStart);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(applicationEnd);
      endDate.setHours(0, 0, 0, 0);
      if (today < startDate) return "";
      if (today > endDate) return "마감";
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) return "마감임박";
      return `D-${diffDays}`;
    };

    const dayCount = calculateDayCount();
    return { ...campaign, schedule, dayCount };
  });
}
