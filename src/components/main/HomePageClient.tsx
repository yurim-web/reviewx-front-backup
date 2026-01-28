/* ========================================
   🏠 메인 홈 페이지 컴포넌트 (공통)
   ======================================== */

/**
 * 메인 홈 페이지 컴포넌트 (공통)
 *
 * 목적: 루트, 유저, 파트너 메인 홈 페이지에서 공통으로 사용하는 컴포넌트입니다.
 *
 * 사용 위치:
 * - / (루트 메인 홈 페이지)
 * - /user (유저 메인 홈 페이지)
 * - /partner (파트너 메인 홈 페이지)
 *
 * 주요 기능:
 * - 메인 배너 표시
 * - 선정 확률 높은 캠페인 섹션 (신청자가 적은 캠페인 8개, 마감 제외)
 * - 지금 인기 많은 캠페인 섹션 (참여자가 많은 캠페인 8개, 마감 제외)
 * - 진행 중인 캠페인 섹션 (전체 캠페인 중 최대 32개, 마감 제외)
 * - 캠페인 상세 페이지로 이동
 * - 메인 메뉴 상단 고정
 */

"use client";

// 컴포넌트들을 import
// @/는 src/를 가리키는 별칭입니다 (tsconfig.json에서 설정됨)
import { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import MainMenu from "@/components/main/MainMenu";
import CampaignBox from "@/components/main/CampaignBox";
import MainBannerSlider from "@/components/main/MainBannerSlider";
import Footer from "@/components/main/Footer";
import styles from "@/styles/home/home.module.css";
import Titletext from "@/components/main/Titletext";

// 각 캠페인 타입별 실제 데이터를 import
import {
  deliveryCampaigns,
  type DeliveryCampaignData,
} from "@/data/campaign/delivery/deliveryCampaigns";
import {
  visitCampaigns,
  type VisitCampaignData,
} from "@/data/campaign/visit/visitCampaigns";
import {
  reviewCampaigns,
  type ReviewCampaignData,
} from "@/data/campaign/review/reviewCampaigns";
import {
  missionCampaigns,
  type MissionCampaignData,
} from "@/data/campaign/mission/missionCampaigns";
import {
  reporterCampaigns,
  type ReporterCampaignData,
} from "@/data/campaign/reporter/reporterCampaigns";
import type { CampaignWithApplicants } from "@/types/domain/partner";

/**
 * 시드 기반 난수 생성기 (선형 합동 생성기)
 * 같은 시드 값이면 항상 같은 난수 시퀀스를 생성합니다
 *
 * @param seed - 시드 값
 * @returns 난수 생성 함수
 */
function seeded_random(seed: number) {
  // 선형 합동 생성기 (Linear Congruential Generator)
  // 같은 시드 값이면 항상 같은 난수 시퀀스를 생성합니다
  let current_seed = seed;
  return () => {
    // 선형 합동 생성기 공식: (a * seed + c) % m
    current_seed = (current_seed * 9301 + 49297) % 233280;
    return current_seed / 233280; // 0과 1 사이의 값으로 정규화
  };
}

/**
 * 배열을 무작위로 섞는 함수 (Fisher-Yates 알고리즘, 시드 기반)
 * 같은 시드 값이면 항상 같은 순서로 섞입니다
 *
 * @param array - 섞을 배열
 * @param seed - 시드 값 (선택적, 없으면 날짜 기반 시드 사용)
 * @returns 무작위로 섞인 새 배열
 */
function shuffle_array<T>(array: T[], seed?: number): T[] {
  // 배열을 복사하여 원본 배열을 변경하지 않습니다
  const shuffled = [...array];

  // 📌 Hydration 오류 방지: 시드가 제공되지 않으면 고정된 시드 사용
  // 서버와 클라이언트에서 동일한 결과를 보장하기 위해 고정된 시드를 사용합니다
  // Date 객체를 사용하면 서버와 클라이언트의 시간 차이로 인해 다른 결과가 나올 수 있습니다
  const date_seed = seed || 12345; // 고정된 기본 시드 사용

  // 시드 기반 난수 생성기 생성
  const random = seeded_random(date_seed);

  // Fisher-Yates 알고리즘: 배열의 끝에서부터 시작하여 무작위로 섞습니다
  for (let i = shuffled.length - 1; i > 0; i--) {
    // 시드 기반 난수 생성기를 사용하여 항상 같은 순서로 섞입니다
    const random_index = Math.floor(random() * (i + 1));

    // 배열의 두 요소를 교환합니다 (구조분해할당 사용)
    [shuffled[i], shuffled[random_index]] = [
      shuffled[random_index],
      shuffled[i],
    ];
  }

  return shuffled;
}

/**
 * 마감되지 않은 캠페인 필터링 함수
 *
 * 모집 기간이 진행 중인 캠페인만 반환합니다 (마감된 캠페인 제외)
 *
 * @param campaign - 필터링할 캠페인 객체
 * @param today - 오늘 날짜 (시간 정보 제거된 Date 객체)
 * @returns 마감되지 않은 캠페인인지 여부
 */
function isNotClosed(
  campaign: {
    detailedSchedule?: {
      applicationStart: string;
      applicationEnd: string;
    };
    recruitment: { current: number };
  },
  today: Date
): boolean {
  // detailedSchedule이 있는 경우 날짜 기반으로 필터링
  if (campaign.detailedSchedule) {
    const { applicationStart, applicationEnd } = campaign.detailedSchedule;

    // 날짜 파싱
    const startDate = new Date(applicationStart);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(applicationEnd);
    endDate.setHours(0, 0, 0, 0);

    // 모집 기간이 진행 중인 캠페인만 포함 (마감 제외)
    // applicationStart <= 오늘 <= applicationEnd
    return today >= startDate && today <= endDate;
  }

  // detailedSchedule이 없는 경우 기존 로직 유지 (하위 호환성)
  // 참여자가 있는 캠페인만 포함
  return campaign.recruitment.current > 0;
}

/**
 * 메인 홈 페이지 공통 컴포넌트
 *
 * @returns 메인 홈 페이지 JSX 요소
 */
/**
 * schedule 필드 생성 함수
 *
 * 설명:
 * - 모집 시작일(applicationStart)을 "1/15 (목) 10:00\n모집 오픈" 형식으로 포맷팅합니다.
 * - 오픈 예정일 때만 사용되며, 오픈 예정이 아닌 경우 빈 문자열을 반환합니다.
 *
 */
function generateSchedule(applicationStart: string): string {
  if (!applicationStart) {
    return "";
  }

  try {
    // 모집 시작일 파싱
    const startDate = new Date(applicationStart);

    // 오늘 날짜 (시간 정보 제거)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    // 오늘 < applicationStart → 오픈 예정일 때만 schedule 생성
    if (today < startDate) {
      // 모집 시작일 파싱
      const startDateTime = new Date(applicationStart);

      // 날짜를 "M/d (E)" 형식으로 포맷팅
      // M: 월 (1-12)
      // d: 일 (1-31)
      // E: 요일 약어 (월, 화, 수 등)
      const formattedDate = format(startDateTime, "M/d (E)", {
        locale: ko,
      });

      // "모집 오픈" 텍스트와 함께 반환
      return `${formattedDate}\n모집 오픈`;
    }
  } catch (error) {
    console.error("[generateSchedule] 날짜 포맷팅 실패:", error);
  }

  return "";
}

/**
 * localStorage에서 모든 캠페인 타입의 데이터를 가져와서 정적 데이터와 합치는 함수
 * 각 목록 페이지의 변환 함수와 동일한 로직을 사용합니다
 */
/**
 * 정적 캠페인 데이터의 schedule과 dayCount를 자동으로 계산하는 함수
 *
 * 설명:
 * - 정적 데이터의 schedule과 dayCount를 detailedSchedule을 기반으로 자동 계산합니다.
 * - 오픈 예정일 때는 schedule을 생성하고, dayCount는 빈 문자열로 설정합니다.
 * - 진행 중일 때는 dayCount를 계산하고, schedule은 빈 문자열로 설정합니다.
 *
 */
function enrichStaticCampaigns<
  T extends {
    id?: string;
    schedule?: string;
    dayCount?: string;
    detailedSchedule?: { applicationStart: string; applicationEnd: string };
  }
>(campaigns: T[]): T[] {
  return campaigns.map((campaign) => {
    if (!campaign.detailedSchedule) {
      return campaign;
    }

    const { applicationStart, applicationEnd } = campaign.detailedSchedule;
    if (!applicationStart || !applicationEnd) {
      return campaign;
    }

    // schedule 자동 계산
    const schedule = generateSchedule(applicationStart);

    // 디버깅: schedule이 제대로 계산되는지 확인
    if (schedule && campaign.id === "visit_11") {
      console.log("[enrichStaticCampaigns] visit_11 schedule:", schedule);
    }

    // dayCount 자동 계산
    const calculateDayCount = (): string => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(applicationStart);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(applicationEnd);
      endDate.setHours(0, 0, 0, 0);

      // 오픈 예정: dayCount는 빈 문자열
      if (today < startDate) {
        return "";
      }

      // 마감 이후: "마감"
      if (today > endDate) {
        return "마감";
      }

      // 진행 중: 남은 일수 계산
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 남은 일수가 1일 이하 → "마감임박"
      if (diffDays <= 1) {
        return "마감임박";
      }

      // 남은 일수가 2일 이상 → "D-n" 형태
      return `D-${diffDays}`;
    };

    const dayCount = calculateDayCount();

    return {
      ...campaign,
      schedule,
      dayCount,
    };
  });
}

function getAllMergedCampaigns() {
  // 정적 데이터를 기본값으로 사용하고 schedule과 dayCount를 자동 계산
  let allDelivery: DeliveryCampaignData[] = enrichStaticCampaigns([
    ...deliveryCampaigns,
  ]);
  let allVisit: VisitCampaignData[] = enrichStaticCampaigns([
    ...visitCampaigns,
  ]);
  let allReview: ReviewCampaignData[] = enrichStaticCampaigns([
    ...reviewCampaigns,
  ]);
  let allMission: MissionCampaignData[] = enrichStaticCampaigns([
    ...missionCampaigns,
  ]);
  let allReporter: ReporterCampaignData[] = enrichStaticCampaigns([
    ...reporterCampaigns,
  ]);

  if (typeof window === "undefined") {
    return {
      allDelivery,
      allVisit,
      allReview,
      allMission,
      allReporter,
    };
  }

  // 각 타입별로 localStorage에서 데이터를 가져와서 변환
  // 배송형
  try {
    const stored = localStorage.getItem("deliveryCampaigns");
    if (stored) {
      const storedCampaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (Array.isArray(storedCampaigns)) {
        // 간단한 변환 (상세 변환은 목록 페이지에서 처리)
        const converted = storedCampaigns.map((c) => {
          const info = c.campaignInfo;
          const recruitmentPeriod = info.recruitmentPeriod || "";
          const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
          const [applicationStart = "", applicationEnd = ""] = recruitmentPeriod
            .split(separator)
            .map((s) => s.trim());

          return {
            id: info.id,
            title: info.title,
            category: "배송형" as const,
            image: info.image,
            subcategory: info.category || "기타",
            points: 0,
            description: (c as any).description || "",
            recruitment: {
              current: info.recruitedCount || 0,
              total: info.totalCount || 0,
            },
            schedule: generateSchedule(applicationStart), // 오픈 예정일 때만 schedule 생성
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
            keyword: (c as any).keywords || "",
            promotionLink: (c as any).promotionLink || "",
            requirements: [],
            guidelineTexts: [],
            isUrgent: (c as any).isUrgent === true, // 긴급 캠페인 여부
            registeredAt: (c as any).registeredAt || undefined, // 등록 시간
          } as DeliveryCampaignData;
        });
        const staticIds = new Set(deliveryCampaigns.map((c) => c.id));
        const newCampaigns = converted.filter((c) => !staticIds.has(c.id));
        allDelivery = [...deliveryCampaigns, ...newCampaigns];
      }
    }
  } catch (error) {
    console.error("localStorage에서 배송형 캠페인 불러오기 실패:", error);
  }

  // 방문형
  try {
    const stored = localStorage.getItem("visitCampaigns");
    if (stored) {
      const storedCampaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (Array.isArray(storedCampaigns)) {
        const converted = storedCampaigns.map((c) => {
          const info = c.campaignInfo;
          const recruitmentPeriod = info.recruitmentPeriod || "";
          const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
          const [applicationStart = "", applicationEnd = ""] = recruitmentPeriod
            .split(separator)
            .map((s) => s.trim());

          return {
            id: info.id,
            title: info.title,
            category: "방문형" as const,
            image: info.image,
            subcategory: info.category || "기타",
            region: "",
            points: 0,
            description: (c as any).description || "",
            recruitment: {
              current: info.recruitedCount || 0,
              total: info.totalCount || 0,
            },
            schedule: generateSchedule(applicationStart), // 오픈 예정일 때만 schedule 생성
            dayCount: info.daysLeft ? `D-${info.daysLeft}` : "",
            detailedSchedule: {
              applicationStart,
              applicationEnd,
              announcement: info.announcementDate || "",
              purchasePeriod: info.registrationPeriod || "",
            },
            campaign_detail_image: info.image,
            channel: info.brandName || "",
            keyword: (c as any).keywords || "",
            guidelineTexts: [],
            requirements: [],
            visitAddress: (c as any).visitAddress || "",
            addressGuide: (c as any).addressGuide || "",
            visitLink: (c as any).visitLink || "",
            isUrgent: (c as any).isUrgent === true, // 긴급 캠페인 여부
            registeredAt: (c as any).registeredAt || undefined, // 등록 시간
          } as VisitCampaignData;
        });
        const staticIds = new Set(allVisit.map((c) => c.id));
        const newCampaigns = converted.filter((c) => !staticIds.has(c.id));
        allVisit = [...allVisit, ...newCampaigns];
      }
    }
  } catch (error) {
    console.error("localStorage에서 방문형 캠페인 불러오기 실패:", error);
  }

  // 구매평
  try {
    const stored = localStorage.getItem("reviewCampaigns");
    if (stored) {
      const storedCampaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (Array.isArray(storedCampaigns)) {
        const converted = storedCampaigns.map((c) => {
          const info = c.campaignInfo;
          const recruitmentPeriod = info.recruitmentPeriod || "";
          const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
          const [applicationStart = "", applicationEnd = ""] = recruitmentPeriod
            .split(separator)
            .map((s) => s.trim());

          const isUrgentValue = (c as any).isUrgent === true;

          // 디버깅: 모든 긴급 캠페인 확인
          if (
            (c as any).isUrgent === true ||
            info.id === "review_13" ||
            info.title?.includes("긴급")
          ) {
            console.log("[HomePageClient] 구매평 캠페인 변환:", {
              id: info.id,
              title: info.title,
              originalIsUrgent: (c as any).isUrgent,
              originalIsUrgentType: typeof (c as any).isUrgent,
              convertedIsUrgent: isUrgentValue,
              fullCampaign: c,
            });
          }

          return {
            id: info.id,
            title: info.title,
            category: "구매평" as const,
            image: info.image,
            subcategory: info.category || "기타",
            channel: info.brandName || "",
            points: 0,
            description: (c as any).description || "",
            recruitment: {
              current: info.recruitedCount || 0,
              total: info.totalCount || 0,
            },
            schedule: generateSchedule(applicationStart), // 오픈 예정일 때만 schedule 생성
            dayCount: info.daysLeft ? `D-${info.daysLeft}` : "",
            detailedSchedule: {
              applicationStart,
              applicationEnd,
              announcement: info.announcementDate || "",
              purchasePeriod: (c as any).purchasePeriod || "",
              registrationPeriod: info.registrationPeriod || "",
            },
            campaign_detail_image: info.image,
            keyword: (c as any).keywords || "",
            purchaseLink: (c as any).purchaseLink || "",
            requirements: [],
            guidelineTexts: [],
            isUrgent: isUrgentValue, // 긴급 캠페인 여부
            registeredAt: (c as any).registeredAt || undefined, // 등록 시간
          } as ReviewCampaignData;
        });
        const staticIds = new Set(reviewCampaigns.map((c) => c.id));
        // localStorage에 있는 캠페인 중 정적 데이터에 없는 것만 추가
        const newCampaigns = converted.filter((c) => !staticIds.has(c.id));
        // localStorage에 있는 캠페인 중 정적 데이터에도 있는 것은 localStorage 버전으로 교체 (최신 데이터 우선)
        const updatedStaticCampaigns = reviewCampaigns.map((staticCampaign) => {
          const localStorageCampaign = converted.find(
            (c) => c.id === staticCampaign.id
          );
          return localStorageCampaign || staticCampaign;
        });
        allReview = [...updatedStaticCampaigns, ...newCampaigns];
      }
    }
  } catch (error) {
    console.error("localStorage에서 구매평 캠페인 불러오기 실패:", error);
  }

  // 기자단
  try {
    const stored = localStorage.getItem("reporterCampaigns");
    if (stored) {
      const storedCampaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (Array.isArray(storedCampaigns)) {
        const converted = storedCampaigns.map((c) => {
          const info = c.campaignInfo;
          const recruitmentPeriod = info.recruitmentPeriod || "";
          const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
          const [applicationStart = "", applicationEnd = ""] = recruitmentPeriod
            .split(separator)
            .map((s) => s.trim());

          return {
            id: info.id,
            title: info.title,
            category: "기자단" as const,
            image: info.image,
            subcategory: info.category || "기타",
            points: 0,
            description: (c as any).description || "",
            recruitment: {
              current: info.recruitedCount || 0,
              total: info.totalCount || 0,
            },
            schedule: generateSchedule(applicationStart), // 오픈 예정일 때만 schedule 생성
            dayCount: info.daysLeft ? `D-${info.daysLeft}` : "",
            detailedSchedule: {
              applicationStart,
              applicationEnd,
              announcement: info.announcementDate || "",
              registrationPeriod: info.registrationPeriod || "",
            },
            campaign_detail_image: info.image,
            channel: info.brandName || "",
            keyword: (c as any).keywords || "",
            productLink: (c as any).productLink || "",
            requirements: [],
            guidelineTexts: [],
            isUrgent: (c as any).isUrgent === true, // 긴급 캠페인 여부
            registeredAt: (c as any).registeredAt || undefined, // 등록 시간
          } as ReporterCampaignData;
        });
        const staticIds = new Set(reporterCampaigns.map((c) => c.id));
        const newCampaigns = converted.filter((c) => !staticIds.has(c.id));
        allReporter = [...reporterCampaigns, ...newCampaigns];
      }
    }
  } catch (error) {
    console.error("localStorage에서 기자단 캠페인 불러오기 실패:", error);
  }

  // 미션형
  try {
    const stored = localStorage.getItem("missionCampaigns");
    if (stored) {
      const storedCampaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (Array.isArray(storedCampaigns)) {
        const converted = storedCampaigns.map((c) => {
          const info = c.campaignInfo;
          const recruitmentPeriod = info.recruitmentPeriod || "";
          const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
          const [applicationStart = "", applicationEnd = ""] = recruitmentPeriod
            .split(separator)
            .map((s) => s.trim());

          return {
            id: info.id,
            title: info.title,
            category: "미션형" as const,
            image: info.image,
            subcategory: info.category || "기타",
            channel: info.brandName || "",
            points: 0,
            description: (c as any).description || "",
            recruitment: {
              current: info.recruitedCount || 0,
              total: info.totalCount || 0,
            },
            schedule: generateSchedule(applicationStart), // 오픈 예정일 때만 schedule 생성
            dayCount: info.daysLeft ? `D-${info.daysLeft}` : "",
            detailedSchedule: {
              applicationStart,
              applicationEnd,
              announcement: info.announcementDate || "",
              registrationPeriod: info.registrationPeriod || "",
            },
            campaign_detail_image: info.image,
            keyword: (c as any).keywords || "",
            productLink: (c as any).productLink || "",
            requirements: [],
            guidelineTexts: [],
            isUrgent: (c as any).isUrgent === true, // 긴급 캠페인 여부
            registeredAt: (c as any).registeredAt || undefined, // 등록 시간
          } as MissionCampaignData;
        });
        const staticIds = new Set(missionCampaigns.map((c) => c.id));
        const newCampaigns = converted.filter((c) => !staticIds.has(c.id));
        allMission = [...missionCampaigns, ...newCampaigns];
      }
    }
  } catch (error) {
    console.error("localStorage에서 미션형 캠페인 불러오기 실패:", error);
  }

  return {
    allDelivery,
    allVisit,
    allReview,
    allMission,
    allReporter,
  };
}

/**
 * 정적 캠페인 데이터만 반환하는 함수 (서버와 클라이언트 동일)
 *
 * 설명:
 * - hydration mismatch를 방지하기 위해 서버와 클라이언트에서 동일한 정적 데이터만 반환합니다.
 * - localStorage 데이터는 useEffect에서 별도로 추가합니다.
 */
function getStaticCampaigns() {
  return {
    allDelivery: enrichStaticCampaigns([...deliveryCampaigns]),
    allVisit: enrichStaticCampaigns([...visitCampaigns]),
    allReview: enrichStaticCampaigns([...reviewCampaigns]),
    allMission: enrichStaticCampaigns([...missionCampaigns]),
    allReporter: enrichStaticCampaigns([...reporterCampaigns]),
  };
}

export default function HomePageClient() {
  const pathname = usePathname();

  /**
   * URL 기반 자동 로그인 (테스트용)
   * - /user로 접속하면 리뷰어 계정으로 자동 로그인
   * - /partner로 접속하면 파트너 계정으로 자동 로그인
   * - 각각 독립적인 키로 저장하여 서로 영향을 주지 않음
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 개발 환경에서만 동작
    if (process.env.NODE_ENV !== 'development') return;

    // /user 경로이면 리뷰어 계정으로 설정
    if (pathname?.startsWith('/user')) {
      let reviewerAuth = localStorage.getItem('reviewx_auth_user_reviewer');

      // 리뷰어 로그인 정보가 없으면 생성
      if (!reviewerAuth) {
        reviewerAuth = JSON.stringify({
          id: 'user_naver_001',
          email: 'kimeunji@gmail.com',
          name: '김은지',
          role: 'user'
        });
        localStorage.setItem('reviewx_auth_user_reviewer', reviewerAuth);
        console.log('✅ 리뷰어 계정으로 자동 로그인');
      }

      // 현재 경로에 맞는 계정으로 reviewx_auth_user 설정
      localStorage.setItem('reviewx_auth_user', reviewerAuth);
      localStorage.setItem('reviewx_auth_token', 'test_token_reviewer');
    }

    // /partner 경로이면 파트너 계정으로 설정
    if (pathname?.startsWith('/partner')) {
      let partnerAuth = localStorage.getItem('reviewx_auth_user_partner');

      // 파트너 로그인 정보가 없으면 생성
      if (!partnerAuth) {
        partnerAuth = JSON.stringify({
          id: 'partner_test_001',
          email: 'partner@test.com',
          name: '테스트파트너',
          role: 'partner'
        });
        localStorage.setItem('reviewx_auth_user_partner', partnerAuth);
        console.log('✅ 파트너 계정으로 자동 로그인');
      }

      // 현재 경로에 맞는 계정으로 reviewx_auth_user 설정
      localStorage.setItem('reviewx_auth_user', partnerAuth);
      localStorage.setItem('reviewx_auth_token', 'test_token_partner');
    }
  }, [pathname]);

  /**
   * 캠페인 데이터 상태 관리
   *
   * 설명:
   * - 서버와 클라이언트 간 hydration mismatch를 방지하기 위해
   *   초기값은 정적 데이터만 사용하고, 클라이언트에서만 localStorage 데이터를 추가합니다.
   * - useState의 초기값으로는 서버에서도 동일하게 렌더링되는 정적 데이터만 사용합니다.
   */
  const [mergedCampaigns, setMergedCampaigns] = useState(() =>
    getStaticCampaigns()
  );

  /**
   * 클라이언트에서만 localStorage 데이터를 불러와서 상태 업데이트
   *
   * 설명:
   * - useEffect는 클라이언트에서만 실행되므로 hydration mismatch를 방지할 수 있습니다.
   * - 컴포넌트가 마운트된 후에 localStorage 데이터를 불러와서 상태를 업데이트합니다.
   */
  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window === "undefined") return;

    // localStorage 데이터를 포함한 전체 캠페인 데이터로 업데이트
    setMergedCampaigns(getAllMergedCampaigns());
  }, []);

  // 오늘 날짜 (시간 정보 제거) - 모든 필터링에서 공통으로 사용
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // 📌 Hydration 오류 방지: 서버와 클라이언트에서 동일한 초기 데이터 사용
  // useState의 초기값을 사용하여 서버와 클라이언트에서 동일한 결과 보장
  // useMemo를 사용하여 컴포넌트가 마운트될 때 한 번만 계산
  // ⚠️ 중요: 이 변수는 high_probability_campaigns, popular_campaigns, ongoing_campaigns보다 먼저 정의되어야 합니다
  const staticCampaigns = useMemo(() => getStaticCampaigns(), []);

  /**
   * 선정 확률 높은 캠페인 - 신청자가 적은 캠페인을 무작위로 선택 (무조건 8개 노출)
   *
   * 로직:
   * 1. 모든 캠페인을 수집
   * 2. 마감되지 않은 캠페인만 필터링
   * 3. 신청자 수가 적은 캠페인만 필터링 (신청자 수 100명 이하)
   * 4. 신청자 수가 적은 순서로 정렬
   * 5. 무작위로 섞어서 최대 8개 선택
   * 6. 8개 미만이면 신청자가 적은 순서대로 추가로 채우기
   *
   * useMemo: 의존성 배열에 today를 포함하여 날짜가 바뀔 때마다 재계산됩니다
   */
  const high_probability_campaigns = useMemo(() => {
    // 모든 캠페인을 하나의 배열로 합칩니다
    // 스프레드 연산자(...): 배열을 펼쳐서 새 배열에 추가합니다
    // 📌 mergedCampaigns 사용 (localStorage 데이터 포함)
    const all_campaigns = [
      ...mergedCampaigns.allDelivery,
      ...mergedCampaigns.allReview,
      ...mergedCampaigns.allVisit,
      ...mergedCampaigns.allMission,
      ...mergedCampaigns.allReporter,
    ];

    // 마감되지 않은 캠페인만 필터링
    const not_closed_campaigns = all_campaigns.filter((campaign) =>
      isNotClosed(campaign, today)
    );

    // 신청자가 적은 캠페인만 필터링 (신청자 수 100명 이하)
    // filter: 조건에 맞는 요소만 추출합니다
    // recruitment.current: 현재 신청자 수
    // 신청자 수가 100명 이하인 캠페인만 선택합니다
    const low_applicant_campaigns = not_closed_campaigns.filter(
      (campaign) => campaign.recruitment.current <= 100
    );

    // 신청자가 적은 순서로 정렬
    // sort: 배열을 정렬합니다
    // 신청자 수가 적을수록 앞에 오도록 정렬합니다
    const sorted_by_applicants = [...low_applicant_campaigns].sort((a, b) => {
      // 신청자 수가 적은 순서대로 정렬 (신청자가 적은 캠페인이 우선)
      return a.recruitment.current - b.recruitment.current;
    });

    // 신청자 수가 가장 적은 캠페인들(5명 이하)을 우선 선택
    const very_low_applicant_campaigns = sorted_by_applicants.filter(
      (campaign) => campaign.recruitment.current <= 5
    );

    // 나머지 캠페인들
    const other_campaigns = sorted_by_applicants.filter(
      (campaign) => campaign.recruitment.current > 5
    );

    // 신청자 수가 매우 적은 캠페인들을 우선적으로 선택 (최대 8개)
    let selected = very_low_applicant_campaigns.slice(0, 8);

    // 8개 미만이면 나머지 캠페인에서 추가로 채우기
    if (selected.length < 8) {
      // 이미 선택된 캠페인 ID를 Set으로 저장 (중복 방지)
      const selected_ids = new Set(selected.map((c) => c.id));

      // 나머지 캠페인에서 추가로 선택
      for (const campaign of other_campaigns) {
        if (selected.length >= 8) break; // 8개가 되면 중단
        if (!selected_ids.has(campaign.id)) {
          // 중복되지 않은 캠페인만 추가
          selected.push(campaign);
          selected_ids.add(campaign.id);
        }
      }
    }

    // 최종적으로 무작위로 섞어서 반환 (8개)
    // 📌 고정된 시드를 사용하여 서버와 클라이언트에서 동일한 순서 보장
    return shuffle_array(selected, 12345).slice(0, 8);
  }, [today, mergedCampaigns]);

  /**
   * 지금 인기 많은 캠페인 - 참여자가 많은 캠페인을 무작위로 선택
   *
   * 로직:
   * 1. 모든 캠페인을 수집
   * 2. 마감되지 않은 캠페인만 필터링
   * 3. 참여자 수가 많은 캠페인 필터링 (현재 참여자 수가 전체 모집 인원의 50% 이상)
   * 4. 무작위로 섞어서 각 타입별로 1-2개씩 선택
   *
   * useMemo: 의존성 배열에 today를 포함하여 날짜가 바뀔 때마다 재계산됩니다
   */
  const popular_campaigns = useMemo(() => {
    // 모든 캠페인을 하나의 배열로 합칩니다
    // 📌 mergedCampaigns 사용 (localStorage 데이터 포함)
    const all_campaigns = [
      ...mergedCampaigns.allDelivery,
      ...mergedCampaigns.allReview,
      ...mergedCampaigns.allVisit,
      ...mergedCampaigns.allMission,
      ...mergedCampaigns.allReporter,
    ];

    // 마감되지 않은 캠페인만 필터링
    const not_closed_campaigns = all_campaigns.filter((campaign) =>
      isNotClosed(campaign, today)
    );

    // 참여자가 많은 캠페인 필터링
    // 참여율이 50% 이상인 캠페인만 선택합니다
    const high_participation_campaigns = not_closed_campaigns.filter(
      (campaign) => {
        const participation_rate =
          campaign.recruitment.total > 0
            ? campaign.recruitment.current / campaign.recruitment.total
            : 0;
        return participation_rate >= 0.5; // 참여율 50% 이상
      }
    );

    // 무작위로 섞기
    // 📌 고정된 시드를 사용하여 서버와 클라이언트에서 동일한 순서 보장
    const shuffled = shuffle_array(high_participation_campaigns, 12345);

    // 각 타입별로 1-2개씩 선택
    const selected_by_type: Record<string, (typeof shuffled)[0][]> = {
      배송형: [],
      구매평: [],
      방문형: [],
      미션형: [],
      기자단: [],
    };

    // 무작위로 섞인 캠페인을 순회하며 각 타입별로 최대 2개씩 선택
    for (const campaign of shuffled) {
      const category = campaign.category as keyof typeof selected_by_type;
      if (
        category in selected_by_type &&
        selected_by_type[category].length < 2
      ) {
        selected_by_type[category].push(campaign);
      }
    }

    // 각 타입별로 선택된 캠페인을 합칩니다
    const selected = [
      ...selected_by_type.배송형,
      ...selected_by_type.구매평,
      ...selected_by_type.방문형,
      ...selected_by_type.미션형.slice(0, 1), // 미션형은 1개만
      ...selected_by_type.기자단.slice(0, 1), // 기자단은 1개만
    ];

    // 최대 8개까지 선택
    return selected.slice(0, 8);
  }, [today, mergedCampaigns]);

  /**
   * 진행 중인 캠페인 - 현재 진행 중인 캠페인 32개를 무작위로 선택
   *
   * 로직:
   * 1. 모든 캠페인을 수집
   * 2. 마감되지 않은 캠페인만 필터링
   * 3. 무작위로 섞어서 최대 32개 선택
   *
   * useMemo: 의존성 배열에 today를 포함하여 날짜가 바뀔 때마다 재계산됩니다
   */
  const ongoing_campaigns = useMemo(() => {
    // 모든 캠페인을 하나의 배열로 합칩니다
    // 📌 mergedCampaigns 사용 (localStorage 데이터 포함)
    const all_campaigns = [
      ...mergedCampaigns.allDelivery,
      ...mergedCampaigns.allReview,
      ...mergedCampaigns.allVisit,
      ...mergedCampaigns.allMission,
      ...mergedCampaigns.allReporter,
    ];

    // 마감되지 않은 캠페인만 필터링
    const active_campaigns = all_campaigns.filter((campaign) =>
      isNotClosed(campaign, today)
    );

    // 무작위로 섞기 (고정된 시드 사용하여 서버와 클라이언트에서 동일한 결과)
    // 📌 고정된 시드를 사용하여 서버와 클라이언트에서 동일한 순서 보장
    const shuffled = shuffle_array(active_campaigns, 12345); // 고정된 시드 사용

    // 최대 32개만 선택
    return shuffled.slice(0, 32);
  }, [today, mergedCampaigns]);

  return (
    // React Fragment (<>...</>) 사용
    // 불필요한 div 래퍼 없이 여러 요소를 그룹화할 수 있습니다
    <>
      {/* 메인 메뉴 컴포넌트 - 헤더 밑에 고정 */}
      <MainMenu />

      {/*
        레이아웃 시프트 방지를 위한 placeholder
        - 데스크톱: 헤더(80px) + MainMenu(약 69px) = 149px
        - 모바일: 헤더(60px) + MainMenu(약 52px) = 112px (CSS에서 동적으로 처리)
        - fixed된 헤더와 메뉴가 콘텐츠를 가리지 않도록 공간 확보
      */}
      <div className={styles.header_spacer}></div>

      {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 메인 콘텐츠 영역 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
      <article className={styles.container}>
        {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 상단 배너 부분 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
        <section className={styles.main_banner_container}>
          {/* 
            메인 배너 슬라이드 컴포넌트
            - 여러 배너 이미지를 슬라이드로 표시
            - 자동 슬라이드 전환 (5초마다)
            - 페이지네이션 도트로 현재 슬라이드 표시
            - 도트 클릭으로 특정 슬라이드로 이동
          */}
          <MainBannerSlider
            banners={[
              "/images/main/main_banner.png",
              "/images/main/main_banner2.png", // TODO: 실제 배너 이미지로 교체
              "/images/main/main_banner.png", // TODO: 실제 배너 이미지로 교체
              "/images/main/main_banner.png", // TODO: 실제 배너 이미지로 교체
              "/images/main/main_banner.png", // TODO: 실제 배너 이미지로 교체
            ]}
            autoSlideInterval={5000}
          />
        </section>

        {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 선정 확률 높은 캠페인 영역 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
        <section className={styles.campaign_container}>
          {/* 제목 컴포넌트 */}
          <Titletext main_title="선정 확률 높은 캠페인" />

          {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 캠페인 그리드 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
          <div className={styles.campaign_grid}>
            {/* JavaScript의 map 함수를 사용한 리스트 렌더링 */}
            {/* 각 캠페인 타입에서 가져온 데이터를 CampaignBox 컴포넌트로 변환 */}
            {/* map: 배열의 각 요소를 순회하며 새로운 요소를 생성합니다 */}
            {high_probability_campaigns.map((campaign) => (
              // key prop은 React에서 리스트 렌더링 시 필수입니다
              // 각 요소를 고유하게 식별하기 위해 사용됩니다
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 지금 인기 많은 캠페인 영역 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
        <section className={styles.campaign_container}>
          {/* 제목 컴포넌트 */}
          <Titletext main_title="지금 인기 많은 캠페인" />

          {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 캠페인 그리드 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
          <div className={styles.campaign_grid}>
            {/* JavaScript의 map 함수를 사용한 리스트 렌더링 */}
            {/* 각 캠페인 타입에서 가져온 데이터를 CampaignBox 컴포넌트로 변환 */}
            {popular_campaigns.map((campaign) => (
              // key prop은 React에서 리스트 렌더링 시 필수입니다
              // 각 요소를 고유하게 식별하기 위해 사용됩니다
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 진행 중인 캠페인 영역 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
        <section className={styles.campaign_container}>
          {/* 제목 컴포넌트 */}
          <Titletext main_title="진행 중인 캠페인" />

          {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 캠페인 그리드 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
          <div className={styles.campaign_grid}>
            {/* JavaScript의 map 함수를 사용한 리스트 렌더링 */}
            {/* 전체 캠페인 중 최대 32개까지 진행 중인 캠페인 노출 */}
            {ongoing_campaigns.map((campaign) => (
              // key prop은 React에서 리스트 렌더링 시 필수입니다
              // 각 요소를 고유하게 식별하기 위해 사용됩니다
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>
      </article>

      {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 푸터 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
      <Footer />
    </>
  );
}
