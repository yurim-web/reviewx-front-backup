/* ========================================
   홈 캠페인 병합: 정적 데이터 + localStorage
   ======================================== */

/**
 * mergedCampaigns
 *
 * 목적: 정적 캠페인 데이터와 localStorage 임시 데이터를 병합하여 홈 화면에 제공
 *
 * 사용 페이지:
 * - / (홈)
 */

import { generateSchedule } from "@/utils/home/campaignUtils";
import { enrichStaticCampaigns } from "@/utils/home/enrichCampaigns";
import {
  deliveryCampaigns,
  type DeliveryCampaignData,
} from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns, type VisitCampaignData } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns, type ReviewCampaignData } from "@/data/campaign/review/reviewCampaigns";
import {
  missionCampaigns,
  type MissionCampaignData,
} from "@/data/campaign/mission/missionCampaigns";
import {
  reporterCampaigns,
  type ReporterCampaignData,
} from "@/data/campaign/reporter/reporterCampaigns";
import type { CampaignWithApplicants } from "@/types/domain/partner";

// localStorage에서 불러온 캠페인 데이터의 추가 필드 타입 정의
interface StoredCampaignExtra extends CampaignWithApplicants {
  description?: string;
  keywords?: string;
  isUrgent?: boolean;
  registeredAt?: string;
  promotionLink?: string;
  visitAddress?: string;
  addressGuide?: string;
  visitLink?: string;
  purchasePeriod?: string;
  purchaseLink?: string;
  productLink?: string;
}

export type MergedCampaigns = {
  allDelivery: DeliveryCampaignData[];
  allVisit: VisitCampaignData[];
  allReview: ReviewCampaignData[];
  allMission: MissionCampaignData[];
  allReporter: ReporterCampaignData[];
};

/**
 * 서버/클라이언트 동일 결과용 정적 캠페인만 반환 (hydration 방지).
 */
export function getStaticCampaigns(): MergedCampaigns {
  return {
    allDelivery: enrichStaticCampaigns([...deliveryCampaigns]),
    allVisit: enrichStaticCampaigns([...visitCampaigns]),
    allReview: enrichStaticCampaigns([...reviewCampaigns]),
    allMission: enrichStaticCampaigns([...missionCampaigns]),
    allReporter: enrichStaticCampaigns([...reporterCampaigns]),
  };
}

/**
 * 정적 + localStorage 캠페인 병합 (클라이언트 전용).
 * SSR 시에는 정적만 반환.
 */
export function getAllMergedCampaigns(): MergedCampaigns {
  let allDelivery: DeliveryCampaignData[] = enrichStaticCampaigns([...deliveryCampaigns]);
  let allVisit: VisitCampaignData[] = enrichStaticCampaigns([...visitCampaigns]);
  let allReview: ReviewCampaignData[] = enrichStaticCampaigns([...reviewCampaigns]);
  let allMission: MissionCampaignData[] = enrichStaticCampaigns([...missionCampaigns]);
  let allReporter: ReporterCampaignData[] = enrichStaticCampaigns([...reporterCampaigns]);

  if (typeof window === "undefined") {
    return {
      allDelivery,
      allVisit,
      allReview,
      allMission,
      allReporter,
    };
  }

  const parsePeriod = (recruitmentPeriod: string) => {
    const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
    const [applicationStart = "", applicationEnd = ""] = recruitmentPeriod
      .split(separator)
      .map((s) => s.trim());
    return { applicationStart, applicationEnd };
  };

  try {
    const stored = localStorage.getItem("deliveryCampaigns");
    if (stored) {
      const storedCampaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (Array.isArray(storedCampaigns)) {
        const converted = storedCampaigns.map((c) => {
          const info = c.campaignInfo;
          const { applicationStart, applicationEnd } = parsePeriod(info.recruitmentPeriod || "");
          return {
            id: info.id,
            title: info.title,
            category: "배송형" as const,
            image: info.image,
            subcategory: info.category || "기타",
            points: 0,
            description: (c as StoredCampaignExtra).description || "",
            recruitment: {
              current: info.recruitedCount || 0,
              total: info.totalCount || 0,
            },
            schedule: generateSchedule(applicationStart),
            dayCount: info.daysLeft ? `D-${info.daysLeft}` : "",
            detailedSchedule: {
              applicationStart,
              applicationEnd,
              announcement: info.announcementDate || "",
              purchasePeriod: "",
              registrationPeriod: info.registrationPeriod || "",
            },
            campaign_detail_image: info.image,
            channel: info.brandName || "",
            keyword: (c as StoredCampaignExtra).keywords || "",
            promotionLink: (c as StoredCampaignExtra).promotionLink || "",
            requirements: [],
            guidelineTexts: [],
            isUrgent: (c as StoredCampaignExtra).isUrgent === true,
            registeredAt: (c as StoredCampaignExtra).registeredAt || undefined,
          } as DeliveryCampaignData;
        });
        const staticIds = new Set(deliveryCampaigns.map((c) => c.id));
        const newCampaigns = converted.filter((c) => !staticIds.has(c.id));
        allDelivery = [...deliveryCampaigns, ...newCampaigns];
      }
    }
  } catch (_error) {}

  try {
    const stored = localStorage.getItem("visitCampaigns");
    if (stored) {
      const storedCampaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (Array.isArray(storedCampaigns)) {
        const converted = storedCampaigns.map((c) => {
          const info = c.campaignInfo;
          const { applicationStart, applicationEnd } = parsePeriod(info.recruitmentPeriod || "");
          return {
            id: info.id,
            title: info.title,
            category: "방문형" as const,
            image: info.image,
            subcategory: info.category || "기타",
            region: "",
            points: 0,
            description: (c as StoredCampaignExtra).description || "",
            recruitment: {
              current: info.recruitedCount || 0,
              total: info.totalCount || 0,
            },
            schedule: generateSchedule(applicationStart),
            dayCount: info.daysLeft ? `D-${info.daysLeft}` : "",
            detailedSchedule: {
              applicationStart,
              applicationEnd,
              announcement: info.announcementDate || "",
              purchasePeriod: info.registrationPeriod || "",
            },
            campaign_detail_image: info.image,
            channel: info.brandName || "",
            keyword: (c as StoredCampaignExtra).keywords || "",
            guidelineTexts: [],
            requirements: [],
            visitAddress: (c as StoredCampaignExtra).visitAddress || "",
            addressGuide: (c as StoredCampaignExtra).addressGuide || "",
            visitLink: (c as StoredCampaignExtra).visitLink || "",
            isUrgent: (c as StoredCampaignExtra).isUrgent === true,
            registeredAt: (c as StoredCampaignExtra).registeredAt || undefined,
          } as VisitCampaignData;
        });
        const staticIds = new Set(allVisit.map((c) => c.id));
        const newCampaigns = converted.filter((c) => !staticIds.has(c.id));
        allVisit = [...allVisit, ...newCampaigns];
      }
    }
  } catch (_error) {}

  try {
    const stored = localStorage.getItem("reviewCampaigns");
    if (stored) {
      const storedCampaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (Array.isArray(storedCampaigns)) {
        const converted = storedCampaigns.map((c) => {
          const info = c.campaignInfo;
          const { applicationStart, applicationEnd } = parsePeriod(info.recruitmentPeriod || "");
          const isUrgentValue = (c as StoredCampaignExtra).isUrgent === true;
          return {
            id: info.id,
            title: info.title,
            category: "구매평" as const,
            image: info.image,
            subcategory: info.category || "기타",
            channel: info.brandName || "",
            points: 0,
            description: (c as StoredCampaignExtra).description || "",
            recruitment: {
              current: info.recruitedCount || 0,
              total: info.totalCount || 0,
            },
            schedule: generateSchedule(applicationStart),
            dayCount: info.daysLeft ? `D-${info.daysLeft}` : "",
            detailedSchedule: {
              applicationStart,
              applicationEnd,
              announcement: info.announcementDate || "",
              purchasePeriod: (c as StoredCampaignExtra).purchasePeriod || "",
              registrationPeriod: info.registrationPeriod || "",
            },
            campaign_detail_image: info.image,
            keyword: (c as StoredCampaignExtra).keywords || "",
            purchaseLink: (c as StoredCampaignExtra).purchaseLink || "",
            requirements: [],
            guidelineTexts: [],
            isUrgent: isUrgentValue,
            registeredAt: (c as StoredCampaignExtra).registeredAt || undefined,
          } as ReviewCampaignData;
        });
        const staticIds = new Set(reviewCampaigns.map((c) => c.id));
        const newCampaigns = converted.filter((c) => !staticIds.has(c.id));
        const updatedStaticCampaigns = reviewCampaigns.map((staticCampaign) => {
          const localStorageCampaign = converted.find((c) => c.id === staticCampaign.id);
          return localStorageCampaign || staticCampaign;
        });
        allReview = [...updatedStaticCampaigns, ...newCampaigns];
      }
    }
  } catch (_error) {}

  try {
    const stored = localStorage.getItem("reporterCampaigns");
    if (stored) {
      const storedCampaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (Array.isArray(storedCampaigns)) {
        const converted = storedCampaigns.map((c) => {
          const info = c.campaignInfo;
          const { applicationStart, applicationEnd } = parsePeriod(info.recruitmentPeriod || "");
          return {
            id: info.id,
            title: info.title,
            category: "기자단" as const,
            image: info.image,
            subcategory: info.category || "기타",
            points: 0,
            description: (c as StoredCampaignExtra).description || "",
            recruitment: {
              current: info.recruitedCount || 0,
              total: info.totalCount || 0,
            },
            schedule: generateSchedule(applicationStart),
            dayCount: info.daysLeft ? `D-${info.daysLeft}` : "",
            detailedSchedule: {
              applicationStart,
              applicationEnd,
              announcement: info.announcementDate || "",
              registrationPeriod: info.registrationPeriod || "",
            },
            campaign_detail_image: info.image,
            channel: info.brandName || "",
            keyword: (c as StoredCampaignExtra).keywords || "",
            productLink: (c as StoredCampaignExtra).productLink || "",
            requirements: [],
            guidelineTexts: [],
            isUrgent: (c as StoredCampaignExtra).isUrgent === true,
            registeredAt: (c as StoredCampaignExtra).registeredAt || undefined,
          } as ReporterCampaignData;
        });
        const staticIds = new Set(reporterCampaigns.map((c) => c.id));
        const newCampaigns = converted.filter((c) => !staticIds.has(c.id));
        allReporter = [...reporterCampaigns, ...newCampaigns];
      }
    }
  } catch (_error) {}

  try {
    const stored = localStorage.getItem("missionCampaigns");
    if (stored) {
      const storedCampaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (Array.isArray(storedCampaigns)) {
        const converted = storedCampaigns.map((c) => {
          const info = c.campaignInfo;
          const { applicationStart, applicationEnd } = parsePeriod(info.recruitmentPeriod || "");
          return {
            id: info.id,
            title: info.title,
            category: "미션형" as const,
            image: info.image,
            subcategory: info.category || "기타",
            channel: info.brandName || "",
            points: 0,
            description: (c as StoredCampaignExtra).description || "",
            recruitment: {
              current: info.recruitedCount || 0,
              total: info.totalCount || 0,
            },
            schedule: generateSchedule(applicationStart),
            dayCount: info.daysLeft ? `D-${info.daysLeft}` : "",
            detailedSchedule: {
              applicationStart,
              applicationEnd,
              announcement: info.announcementDate || "",
              registrationPeriod: info.registrationPeriod || "",
            },
            campaign_detail_image: info.image,
            keyword: (c as StoredCampaignExtra).keywords || "",
            productLink: (c as StoredCampaignExtra).productLink || "",
            requirements: [],
            guidelineTexts: [],
            isUrgent: (c as StoredCampaignExtra).isUrgent === true,
            registeredAt: (c as StoredCampaignExtra).registeredAt || undefined,
          } as MissionCampaignData;
        });
        const staticIds = new Set(missionCampaigns.map((c) => c.id));
        const newCampaigns = converted.filter((c) => !staticIds.has(c.id));
        allMission = [...missionCampaigns, ...newCampaigns];
      }
    }
  } catch (_error) {}

  return {
    allDelivery,
    allVisit,
    allReview,
    allMission,
    allReporter,
  };
}
