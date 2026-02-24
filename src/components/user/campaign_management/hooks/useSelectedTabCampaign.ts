/* ========================================
   선정 탭 캠페인 데이터 훅
   ======================================== */

/**
 * useSelectedTabCampaign
 *
 * 목적: 선정 탭 캠페인 카드에서 캠페인 날짜 및 기간 관련 데이터를 계산하는 커스텀 훅입니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 > 선정 탭)
 */

import { useMemo } from "react";
import type { CampaignApplication } from "@/types/domain/user";
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";

export function useSelectedTabCampaign(campaign: CampaignApplication) {
  /**
   * 실제 캠페인 데이터에서 선정일(announcement), 구매기간, 등록기간을 가져오는 함수
   */
  const getCampaignDates = useMemo(() => {
    const allCampaigns = [
      ...deliveryCampaigns,
      ...visitCampaigns,
      ...reviewCampaigns,
      ...reporterCampaigns,
      ...missionCampaigns,
    ];

    const actualCampaign = allCampaigns.find((c) => c.id === campaign.id);

    if (!actualCampaign || !actualCampaign.detailedSchedule) {
      return {
        announcementDate: null,
        purchasePeriod: null,
        registrationPeriod: null,
        purchaseEndDate: null,
        registrationEndDate: null,
      };
    }

    // 선정일 가져오기
    const announcementDate = actualCampaign.detailedSchedule.announcement?.trim() || null;

    // 구매평 캠페인: 구매기간과 등록기간 모두 확인
    let purchasePeriod: string | null = null;
    let registrationPeriod: string | null = null;

    if (campaign.type === "구매평") {
      // 구매평: purchasePeriod와 registrationPeriod 모두 확인
      purchasePeriod =
        "purchasePeriod" in actualCampaign.detailedSchedule
          ? (actualCampaign.detailedSchedule.purchasePeriod as string)
          : null;
      registrationPeriod =
        "registrationPeriod" in actualCampaign.detailedSchedule
          ? (actualCampaign.detailedSchedule.registrationPeriod as string)
          : null;
    } else if (campaign.type === "방문형") {
      // 방문형: purchasePeriod를 registrationPeriod처럼 사용
      registrationPeriod =
        "purchasePeriod" in actualCampaign.detailedSchedule
          ? (actualCampaign.detailedSchedule.purchasePeriod as string)
          : null;
    } else {
      // 나머지 타입: registrationPeriod만 사용
      registrationPeriod =
        "registrationPeriod" in actualCampaign.detailedSchedule
          ? (actualCampaign.detailedSchedule.registrationPeriod as string)
          : null;
    }

    // 구매기간 끝 날짜 추출
    // 구분자는 " ~ " (공백 포함) 또는 "~"를 모두 지원
    const purchaseEndDate = purchasePeriod
      ? (purchasePeriod.includes(" ~ ")
          ? purchasePeriod.split(" ~ ")[1]
          : purchasePeriod.split("~")[1]
        )?.trim() || null
      : null;

    // 등록기간 끝 날짜 추출
    // 구분자는 " ~ " (공백 포함) 또는 "~"를 모두 지원
    const registrationEndDate = registrationPeriod
      ? (registrationPeriod.includes(" ~ ")
          ? registrationPeriod.split(" ~ ")[1]
          : registrationPeriod.split("~")[1]
        )?.trim() || null
      : null;

    return {
      announcementDate,
      purchasePeriod,
      registrationPeriod,
      purchaseEndDate,
      registrationEndDate,
    };
  }, [campaign.id, campaign.type]);

  /**
   * 선정일로부터 경과된 일수 계산 (배지용)
   */
  const daysSinceSelection = useMemo(() => {
    if (!getCampaignDates.announcementDate) return null;

    try {
      const announcementDateStr = getCampaignDates.announcementDate.split(" ")[0]?.trim();
      if (!announcementDateStr) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const announcementDate = new Date(announcementDateStr);
      if (isNaN(announcementDate.getTime())) return null;
      announcementDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - announcementDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return diffDays >= 0 ? diffDays : null;
    } catch (_error) {
      return null;
    }
  }, [getCampaignDates.announcementDate]);

  /**
   * 구매평 캠페인: 현재가 구매기간인지 등록기간인지 판단
   */
  const isPurchasePeriod = useMemo(() => {
    if (campaign.type !== "구매평" || !getCampaignDates.purchasePeriod) {
      return false;
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const periodMatch = getCampaignDates.purchasePeriod.match(
        /(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/
      );
      if (!periodMatch) return false;

      const startDate = new Date(periodMatch[1]);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(periodMatch[2]);
      endDate.setHours(0, 0, 0, 0);

      // 오늘이 구매기간 내에 있는지 확인
      return today >= startDate && today <= endDate;
    } catch (_error) {
      return false;
    }
  }, [campaign.type, getCampaignDates.purchasePeriod]);

  /**
   * 현재 기한까지 남은 일수 계산 (구매기간 또는 등록기간)
   */
  const daysUntilDeadline = useMemo(() => {
    // 구매평 캠페인: 구매기간이면 구매기간 마감일, 아니면 등록기간 마감일
    let endDateStr: string | null = null;
    if (campaign.type === "구매평" && isPurchasePeriod) {
      endDateStr = getCampaignDates.purchaseEndDate;
    } else {
      endDateStr = getCampaignDates.registrationEndDate;
    }

    if (!endDateStr) return null;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const endDate = new Date(endDateStr);
      if (isNaN(endDate.getTime())) return null;
      endDate.setHours(0, 0, 0, 0);

      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    } catch (_error) {
      return null;
    }
  }, [
    campaign.type,
    isPurchasePeriod,
    getCampaignDates.purchaseEndDate,
    getCampaignDates.registrationEndDate,
  ]);

  return {
    getCampaignDates,
    daysSinceSelection,
    isPurchasePeriod,
    daysUntilDeadline,
  };
}
