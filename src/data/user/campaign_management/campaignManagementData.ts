/* ========================================
   📊 유저 캠페인 관리 임시 데이터
   ======================================== */

/**
 * 유저 캠페인 관리 임시 데이터
 *
 * 목적: 유저 캠페인 관리 페이지에서 사용할 테스트 데이터
 *
 * 사용 위치:
 * - /user/campaign_management 페이지의 캠페인 목록 표시
 *
 * 주요 기능:
 * - 실제 캠페인 데이터에서 ID로 참조하여 가져오기
 * - 날짜 기반 필터링 적용
 */

import type { CampaignApplication } from "@/types/domain/user";
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";

// 탭별 캠페인 ID 리스트
const 신청_탭_캠페인_IDS = [
  // 배송형
  "961",
  // 미션형
  "4002",
  // 기자단
  "3001",
  // 구매평
  "2002",
  // 방문형
  "1009",
];

const 선정_탭_캠페인_IDS = [
  // 구매평
  "2002",
  "2007",
  "2009",
  "2012",
  "2013",
  // 구매평 - 현재 구매 기간 테스트용 캠페인
  "review_test_1st_all_cases",
  // 배송형
  "972",
  "973",
  // 방문형
  "1002",
  "1007",
  "1009",
  "1011",
  "1012",
  // 기자단
  "3002",
  // 미션형
  "4013",
  "4014",
  "4015",
  "4005",
];

const 완료_탭_캠페인_IDS = [
  // 배송형
  "962",
  "970",
  // 미션형
  "4004",
  // 기자단
  "3004",
];

const 취소반려_탭_캠페인_IDS = [
  // 배송형
  "965",
  // 방문형
  "1003",
  // 구매평
  "2007",
  // 미션형
  "4005",
  // 기자단
  "3005",
];

/**
 * 등록된 콘텐츠 데이터 맵
 *
 * 설명:
 * - 각 캠페인 ID별로 등록된 콘텐츠 데이터를 저장합니다.
 * - 수정 모드에서 기존 데이터를 표시하기 위해 사용됩니다.
 */
const registeredContentData: Record<
  string,
  {
    link?: string;
    images?: string[];
    receiptImages?: string[];
  }
> = {
  // 구매 영수증 이미 등록된 구매평 캠페인
  "2002": {
    receiptImages: [
      "/images/main/campaign_img/eximg_1.png",
      "/images/main/campaign_img/eximg_2.png",
    ],
  },
  "2007": {
    receiptImages: [
      "/images/main/campaign_img/eximg_1.png",
      "/images/main/campaign_img/eximg_2.png",
    ],
  },
  // 콘텐츠 이미 등록된 캠페인
  "972": {
    link: "https://blog.naver.com/example-delivery-972",
  },
  "1002": {
    link: "https://blog.naver.com/example-visit-1002",
  },
  "4013": {
    link: "https://blog.naver.com/example-mission-4013",
    images: [
      "/images/main/campaign_img/eximg_1.png",
      "/images/main/campaign_img/eximg_2.png",
    ],
  },
  // 구매평: 콘텐츠(이미지) 이미 등록된 캠페인
  "2013": {
    images: [
      "/images/main/campaign_img/eximg_1.png",
      "/images/main/campaign_img/eximg_2.png",
    ],
  },
};

/**
 * 실제 캠페인 데이터를 CampaignApplication 형식으로 변환
 */
function convertToCampaignApplication(
  campaignId: string,
  status: CampaignApplication["status"],
  subStatus?: CampaignApplication["subStatus"],
  hasContent?: boolean,
  isPenalty?: boolean,
  contentType?: "link" | "image" | "both",
  statusMessage?: string,
  rejectionReason?: string,
  registeredContentLink?: string,
  registeredContentImages?: string[],
  registeredReceiptImages?: string[]
): CampaignApplication | null {
  // 캠페인 ID(숫자 문자열)를 기준으로 실제 캠페인 데이터 찾기
  const delivery = deliveryCampaigns.find((c) => c.id === campaignId);
  const visit = visitCampaigns.find((c) => c.id === campaignId);
  const review = reviewCampaigns.find((c) => c.id === campaignId);
  const reporter = reporterCampaigns.find((c) => c.id === campaignId);
  const mission = missionCampaigns.find((c) => c.id === campaignId);

  const actualCampaign = delivery || visit || review || reporter || mission;

  if (!actualCampaign) return null;

  // 타입 결정 (실제 데이터 기반)
  const type: CampaignApplication["type"] =
    (actualCampaign as any).category ?? "배송형";

  // 카테고리 결정
  let category = "";
  if ("channel" in (actualCampaign as any)) {
    category = (actualCampaign as any).channel || "";
  }

  // remainingDays·isUrgent 계산 (탭별 규칙 통일 — 선정탭/전체탭 동일 표시)
  let remainingDays = 0;
  let isUrgentResolved = actualCampaign.isUrgent || false;
  if (actualCampaign.detailedSchedule) {
    const schedule = actualCampaign.detailedSchedule as Record<string, string | undefined>;
    if (status === "신청" && schedule.announcement) {
      const announcementDate = new Date(schedule.announcement);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      announcementDate.setHours(0, 0, 0, 0);
      const diffTime = announcementDate.getTime() - today.getTime();
      remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else if (status === "선정") {
      const registrationPeriod =
        type === "방문형"
          ? (schedule.purchasePeriod ?? null)
          : (schedule.registrationPeriod ?? null);
      if (registrationPeriod) {
        const endDateStr = registrationPeriod.split("~")[1]?.trim();
        if (endDateStr) {
          const registrationEndDate = new Date(endDateStr);
          registrationEndDate.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const diffTime = registrationEndDate.getTime() - today.getTime();
          remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          isUrgentResolved = remainingDays <= 3;
        }
      }
    }
  }

  // statusMessage 기본값
  const defaultStatusMessage =
    statusMessage ||
    (status === "신청"
      ? `캠페인 선정 발표까지 ${remainingDays}일 남았습니다.`
      : status === "선정"
      ? "콘텐츠를 등록해주세요."
      : status === "완료"
      ? "캠페인이 완료되었습니다."
      : "캠페인 상태를 확인해주세요.");

  // 등록된 콘텐츠 데이터 가져오기
  const contentData = registeredContentData[campaignId];

  return {
    id: campaignId,
    title: actualCampaign.title,
    category,
    image: actualCampaign.image,
    status,
    remainingDays,
    statusMessage: defaultStatusMessage,
    type,
    isUrgent: isUrgentResolved,
    subStatus,
    hasContent: hasContent ?? false,
    isPenalty: isPenalty ?? false,
    contentType:
      contentType ||
      (type === "미션형" && "contentType" in actualCampaign
        ? (actualCampaign as any).contentType
        : undefined),
    rejectionReason,
    registeredContentLink:
      registeredContentLink ?? contentData?.link ?? undefined,
    registeredContentImages:
      registeredContentImages ?? contentData?.images ?? undefined,
    registeredReceiptImages:
      registeredReceiptImages ?? contentData?.receiptImages ?? undefined,
  };
}

/**
 * 신청 탭: ID 리스트의 캠페인들을 변환하여 반환
 */
function filterAppliedCampaigns(campaignIds: string[]): CampaignApplication[] {
  return campaignIds
    .map((id) => convertToCampaignApplication(id, "신청"))
    .filter((c): c is CampaignApplication => c !== null);
}

/**
 * 선정 탭: ID 리스트의 캠페인들을 변환하여 반환
 * @param excludeCompletedIds - 제외할 완료된 캠페인 ID 목록 (선택적, 클라이언트에서만 사용)
 */
function filterSelectedCampaigns(
  campaignIds: string[],
  excludeCompletedIds: string[] = []
): CampaignApplication[] {
  return campaignIds
    .map((id) => {
      // 등록 완료된 캠페인은 선정 탭에서 제외 (완료 탭으로 이동)
      if (excludeCompletedIds.includes(id)) {
        return null;
      }

      // 구매 영수증 이미 등록된 구매평 캠페인 (수정 가능)
      const receiptRegisteredReviewIds = ["2002", "2007"];
      // 콘텐츠 이미 등록된 캠페인 (수정 가능)
      const contentRegisteredIds = [
        "972",
        "1002",
        "4013",
        "2013",
      ];

      let subStatus: CampaignApplication["subStatus"];
      let hasContent = false;

      if (receiptRegisteredReviewIds.includes(id)) {
        // 구매 영수증 이미 등록됨 (구매평, 수정 가능)
        subStatus = "receipt_registered";
        hasContent = true;
      } else if (contentRegisteredIds.includes(id)) {
        // 콘텐츠 이미 등록됨 (수정 가능)
        subStatus = "content_registered";
        hasContent = true;
      } else {
        // 기본 상태: 미등록 상태
        const isReview = reviewCampaigns.some((c) => c.id === id);
        subStatus = isReview
          ? "receipt_not_registered"
          : "content_not_registered";
      }

      return convertToCampaignApplication(id, "선정", subStatus, hasContent);
    })
    .filter((c): c is CampaignApplication => c !== null);
}

/**
 * localStorage에서 등록 완료된 캠페인 ID 목록 가져오기
 */
function getCompletedCampaignIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const completed = localStorage.getItem("completedCampaignIds");
    return completed ? JSON.parse(completed) : [];
  } catch (error) {
    console.error("Failed to get completed campaign IDs:", error);
    return [];
  }
}

/**
 * 캠페인 ID를 완료 목록에 추가
 */
export function addCompletedCampaignId(campaignId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const completed = getCompletedCampaignIds();
    if (!completed.includes(campaignId)) {
      completed.push(campaignId);
      localStorage.setItem("completedCampaignIds", JSON.stringify(completed));
    }
  } catch (error) {
    console.error("Failed to add completed campaign ID:", error);
  }
}

/**
 * 완료 탭: ID 리스트의 캠페인들을 변환하여 반환
 * @param additionalCompletedIds - 추가로 완료된 캠페인 ID 목록 (선택적, 클라이언트에서만 사용)
 */
function filterCompletedCampaigns(
  campaignIds: string[],
  additionalCompletedIds: string[] = []
): CampaignApplication[] {
  // 기존 완료 탭 캠페인 + 새로 등록 완료된 캠페인 합치기
  const allCompletedIds = [
    ...new Set([...campaignIds, ...additionalCompletedIds]),
  ];

  return allCompletedIds
    .map((id) =>
      convertToCampaignApplication(id, "완료", "content_registered", true)
    )
    .filter((c): c is CampaignApplication => c !== null);
}

/**
 * 취소/반려 탭: 조건 없이 모든 캠페인 반환
 */
function filterCancelledCampaigns(
  campaignIds: string[]
): CampaignApplication[] {
  return campaignIds
    .map((id) => {
      const isPenalty = id === "2007" || id === "4005";
      const subStatus: CampaignApplication["subStatus"] = isPenalty
        ? "penalty"
        : "content_rejected,re_register";

      return convertToCampaignApplication(
        id,
        "취소/반려",
        subStatus,
        !isPenalty,
        isPenalty,
        undefined,
        isPenalty
          ? "콘텐츠 등록 기간이 지났습니다."
          : "등록한 콘텐츠가 반려되었습니다. 반려 사유 확인 후 다시 등록해 주세요.",
        isPenalty
          ? undefined
          : "제품 사진이 명확하지 않습니다. 제품의 특징이 잘 보이도록 재촬영하여 등록해 주세요.긴글테스트테스트테스트테스트테스트테스트테스틋테ㅡ틑테틋스긴글테스트테스트테스트테스트테스트테스트테스틋테ㅡ틑테틋스긴글테스트테스트테스트테스트테스트테스트테스틋테ㅡ틑테틋스긴글테스트테스트테스트테스트테스트테스트테스틋테ㅡ틑테틋스긴글테스트테스트테스트테스트테스트테스트테스틋테ㅡ틑테틋스긴글테스트테스트테스트테스트테스트테스트테스틋테ㅡ틑테틋스"
      );
    })
    .filter((c): c is CampaignApplication => c !== null);
}

/**
 * 탭별 캠페인 필터링 함수
 * @param tab - 탭 이름
 * @param completedCampaignIds - 완료된 캠페인 ID 목록 (선택적, 클라이언트에서만 사용)
 */
export const getCampaignsByTab = (
  tab: string,
  completedCampaignIds: string[] = []
): CampaignApplication[] => {
  switch (tab) {
    case "신청":
      return filterAppliedCampaigns(신청_탭_캠페인_IDS);
    case "선정":
      return filterSelectedCampaigns(선정_탭_캠페인_IDS, completedCampaignIds);
    case "완료":
      return filterCompletedCampaigns(완료_탭_캠페인_IDS, completedCampaignIds);
    case "취소/반려":
      return filterCancelledCampaigns(취소반려_탭_캠페인_IDS);
    case "전체":
      return [
        ...filterAppliedCampaigns(신청_탭_캠페인_IDS),
        ...filterSelectedCampaigns(선정_탭_캠페인_IDS, completedCampaignIds),
        ...filterCompletedCampaigns(완료_탭_캠페인_IDS, completedCampaignIds),
        ...filterCancelledCampaigns(취소반려_탭_캠페인_IDS),
      ];
    case "패널티":
      // 패널티는 취소/반려 중에서 isPenalty가 true인 것들
      return filterCancelledCampaigns(취소반려_탭_캠페인_IDS).filter(
        (c) => c.isPenalty === true
      );
    default:
      return [];
  }
};

/**
 * 정적 캠페인 통계 데이터 (서버와 클라이언트에서 동일하게 사용)
 * localStorage를 제외한 정적 데이터만으로 계산하여 hydration 오류 방지
 */
export const campaignManagementStats = {
  신청: getCampaignsByTab("신청").length,
  선정: getCampaignsByTab("선정").length,
  완료: getCampaignsByTab("완료").length,
  "취소/반려": getCampaignsByTab("취소/반려").length,
  전체: getCampaignsByTab("전체").length,
  패널티: getCampaignsByTab("패널티").length,
};

/**
 * 클라이언트에서 localStorage를 고려한 통계 계산
 * useEffect에서 사용하여 클라이언트 마운트 후 업데이트
 */
export const getClientCampaignStats = () => {
  const completedCampaignIds = getCompletedCampaignIds();
  return {
    신청: getCampaignsByTab("신청", completedCampaignIds).length,
    선정: getCampaignsByTab("선정", completedCampaignIds).length,
    완료: getCampaignsByTab("완료", completedCampaignIds).length,
    "취소/반려": getCampaignsByTab("취소/반려", completedCampaignIds).length,
    전체: getCampaignsByTab("전체", completedCampaignIds).length,
    패널티: getCampaignsByTab("패널티", completedCampaignIds).length,
  };
};

/**
 * 스토리북/개발용 전체 캠페인 목록 (여러 탭 목업을 합친 배열)
 */
export const campaignManagementData: CampaignApplication[] = [
  ...getCampaignsByTab("신청"),
  ...getCampaignsByTab("선정"),
  ...getCampaignsByTab("완료"),
  ...getCampaignsByTab("취소/반려"),
  ...getCampaignsByTab("패널티"),
];
