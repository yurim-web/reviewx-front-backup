/* ========================================
   캠페인 콘텐츠 내역 페이지 공통 로직 훅
   ======================================== */

/**
 * useCampaignContents
 *
 * 목적: 파트너 캠페인 콘텐츠 내역 페이지 데이터를 실제 백엔드 API 구조로 조회
 *
 * API:
 * - 22번: GET /partner/campaign/{campaignId}/contents?tab=waiting|submitted|approved
 * - 22-1번: PUT /partner/campaign/contents/{contentId}/approve
 * - 22-2번: PUT /partner/campaign/contents/{contentId}/reject
 * - 22-3번: PUT /partner/campaign/applications/{applicationId}/extend-deadline
 * - 22-4번: POST /partner/campaign/applications/{applicationId}/report
 * - 22-5번: PUT /partner/campaign/contents/{contentId}/complete
 *
 * 사용 페이지:
 * - /partner/campaign_contents/{type}/[id]
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  getCampaignContents,
  approveContent,
  rejectContent,
  reportReviewer,
  extendContentDeadline,
  completeContent,
} from "@/lib/api/partnerCampaignContents";
import type { ContentItemApi, ReportReasonType } from "@/types/api/partnerCampaignContents";
import type { ContentByTab, ContentItem } from "@/data/partner/sharedCampaigns";
import type { CampaignInfo } from "@/types/domain/partner";

// ----------------------------------------
// API 응답 → 프론트엔드 변환
// ----------------------------------------

/** API campaignInfo → 프론트 CampaignInfo
 * 백엔드 API 22는 최소 필드만 반환 (campaignId, title, recruitLimit, selectedCount, contentRegistrationDeadline)
 * UI에 필요한 나머지 필드는 기본값 사용 */
function adaptCampaignInfo(api: {
  campaignId: number;
  title: string;
  recruitLimit: number;
  selectedCount: number;
  contentRegistrationDeadline: string;
  // mock에서 추가 제공 가능한 필드 (optional)
  campaignType?: string;
  platform?: string;
  thumbnailUrl?: string;
  category?: string;
  status?: string;
  recruitCount?: number;
  currentApplicants?: number;
  recruitmentPeriod?: string;
  announcementDate?: string;
  registrationPeriod?: string;
  purchasePeriod?: string;
}): CampaignInfo {
  const STATUS_MAP: Record<string, CampaignInfo["status"]> = {
    REGISTERING: "대기 중",
    RECRUITING: "모집 중",
    SELECTING: "선정 중",
    PURCHASING: "진행 중",
    CLOSED: "종료",
    EMERGENCY: "취소",
  };

  const TYPE_MAP: Record<string, CampaignInfo["campaignType"]> = {
    DELIVERY: "배송형",
    VISIT: "방문형",
    PURCHASE: "구매평",
    REPORTER: "기자단",
    MISSION: "미션형",
  };

  const PLATFORM_MAP: Record<string, string> = {
    NAVER_BLOG: "네이버블로그",
    NAVER_CLIP: "네이버클립",
    INSTAGRAM: "인스타그램",
    INSTAGRAM_REELS: "릴스",
    YOUTUBE: "유튜브",
    YOUTUBE_SHORTS: "숏츠",
    REELS: "릴스",
    SHORTS: "숏츠",
  };

  // 등록 기간: contentRegistrationDeadline에서 파생 가능
  const deadline = (api.contentRegistrationDeadline || "").slice(0, 10);

  return {
    id: String(api.campaignId),
    title: api.title,
    image: api.thumbnailUrl || "",
    status: (api.status ? STATUS_MAP[api.status] : "진행 중") as CampaignInfo["status"],
    campaignType: (api.campaignType
      ? TYPE_MAP[api.campaignType]
      : "배송형") as CampaignInfo["campaignType"],
    category: api.category || "",
    brandName: api.platform ? PLATFORM_MAP[api.platform] : "",
    channel: api.platform ? PLATFORM_MAP[api.platform] : "",
    recruitmentPeriod: api.recruitmentPeriod || "",
    announcementDate: api.announcementDate || "",
    registrationPeriod: api.registrationPeriod || (deadline ? `~ ${deadline}` : ""),
    purchasePeriod: api.purchasePeriod,
    recruitedCount: api.currentApplicants || api.selectedCount || 0,
    totalCount: api.recruitCount || api.recruitLimit || 0,
    daysLeft: 0,
  };
}

/** API ContentItemApi → 프론트 ContentItem */
function adaptContentItem(api: ContentItemApi): ContentItem {
  const formatDate = (iso: string | null | undefined) =>
    iso ? iso.slice(0, 16).replace("T", " ") : "";

  return {
    id: String(api.campaignContentId ?? `waiting-${api.reviewerId}`),
    createdAt: api.contentRegAt ?? new Date().toISOString(),
    status: api.contentStatus === "APPROVED" ? "완료" : "검수중",
    userType: (api.reviewerGrade === "인플루언서"
      ? "인플루언서"
      : "리뷰어") as ContentItem["userType"],
    nickname: api.reviewerName || `리뷰어${api.reviewerId}`,
    channelId: api.channelUsername || "",
    channel: api.channelName || "",
    profileImage: api.profileImage,
    thumbnailSrc: api.thumbnailSrc,
    updatedAt: api.contentUpdateAt ? formatDate(api.contentUpdateAt) : undefined,
    isLateSubmission: api.isLateSubmission || false,
    receiptImages: api.receiptImages,
    extension_request_reason: undefined,
    isExtensionApproved: undefined,
    extendedDeadline: api.registrationDeadline ? api.registrationDeadline.slice(0, 10) : undefined,
    reject_reason: api.rejectReason,
    isReported: false,
    reportedDate: api.reportedAt ? formatDate(api.reportedAt) : undefined,
    isRejected: api.contentStatus === "REJECTED",
    applicationId: api.applicationId,
  };
}

// ----------------------------------------
// 정적 fallback 데이터 (API 미연결 시)
// ----------------------------------------
const STATIC_CAMPAIGN_INFO: CampaignInfo = {
  id: "961",
  title: "프리미엄 스킨케어 세트 체험단",
  image: "/images/main/campaign_img/eximg_7.png",
  status: "진행 중",
  campaignType: "배송형",
  category: "뷰티",
  brandName: "네이버블로그",
  recruitmentPeriod: "2026-07-01 ~ 2026-07-31",
  announcementDate: "2026-08-05",
  registrationPeriod: "2026-08-10 ~ 2026-08-25",
  recruitedCount: 4,
  totalCount: 5,
  daysLeft: 15,
};

const STATIC_CONTENTS: ContentByTab = {
  waiting: [
    {
      id: "sw1",
      createdAt: "2026-08-10T10:00:00.000Z",
      status: "검수중",
      userType: "리뷰어",
      nickname: "뷰티블로거",
      channelId: "blog.naver.com/beauty_blog",
      channel: "네이버블로그",
      profileImage: "/images/mypage/profile.svg",
      isLateSubmission: false,
    },
    {
      id: "sw2",
      createdAt: "2026-08-11T09:00:00.000Z",
      status: "검수중",
      userType: "인플루언서",
      nickname: "스킨케어스타",
      channelId: "@skincare_star",
      channel: "인스타그램",
      profileImage: "/images/mypage/profile.svg",
      isRejected: true,
      reject_reason: "이미지 품질이 기준에 미달합니다.",
    },
  ],
  reviewing: [
    {
      id: "sr1",
      createdAt: "2026-08-12T14:00:00.000Z",
      status: "검수중",
      userType: "리뷰어",
      nickname: "리뷰마스터",
      channelId: "blog.naver.com/review_master",
      channel: "네이버블로그",
      profileImage: "/images/mypage/profile.svg",
      thumbnailSrc: "/images/main/campaign_img/eximg_7.png",
      isLateSubmission: false,
    },
    {
      id: "sr2",
      createdAt: "2026-08-13T11:00:00.000Z",
      status: "검수중",
      userType: "인플루언서",
      nickname: "뷰티인플루언서",
      channelId: "youtube.com/@beauty_inf",
      channel: "유튜브",
      profileImage: "/images/mypage/profile.svg",
      thumbnailSrc: "/images/main/campaign_img/eximg_9.png",
    },
  ],
  completed: [
    {
      id: "sc1",
      createdAt: "2026-08-08T10:00:00.000Z",
      status: "완료",
      userType: "리뷰어",
      nickname: "완료된리뷰어",
      channelId: "blog.naver.com/completed",
      channel: "네이버블로그",
      profileImage: "/images/mypage/profile.svg",
      thumbnailSrc: "/images/main/campaign_img/eximg_7.png",
      updatedAt: "2026-08-09 15:30",
    },
    {
      id: "sc2",
      createdAt: "2026-08-09T09:00:00.000Z",
      status: "완료",
      userType: "인플루언서",
      nickname: "클립인플루언서",
      channelId: "nclip.naver.com/@clip_inf",
      channel: "네이버클립",
      profileImage: "/images/mypage/profile.svg",
      thumbnailSrc: "/images/main/campaign_img/eximg_9.png",
      updatedAt: "2026-08-10 11:00",
    },
  ],
};

// ----------------------------------------
// 타입 정의
// ----------------------------------------

export type TabKey = "대기" | "확인" | "완료";
export type SortOption = "latest" | "registered" | "recommended";
export type ContentsLoader = (campaignId: string) => ContentByTab | undefined;

export interface UseCampaignContentsReturn {
  campaignInfo: CampaignInfo | undefined;
  rawApiCampaign: null;
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  waitingCount: number;
  reviewCount: number;
  completedCount: number;
  sortOrder: SortOption;
  setSortOrder: (order: SortOption) => void;
  sortOptions: Array<{ value: SortOption; label: string }>;
  contents: ContentByTab;
  approvedContentIds: Set<string>;
  handleApprove: (contentId: string) => void;
  rejectedContentIds: Set<string>;
  rejectReasons: Map<string, string>;
  handleReject: (contentId: string, rejectReason?: string) => void;
  reportedContentIds: Set<string>;
  reportedDates: Map<string, string>;
  handleReport: (contentId: string, reportOption?: string, otherReason?: string) => void;
  handleExtend: (contentId: string) => void;
  handleComplete: (contentId: string) => void;
  formatDateTime: (iso: string | Date) => string;
}

// ========================================
// 메인 훅
// ========================================
export function useCampaignContents(_contentsLoader?: ContentsLoader): UseCampaignContentsReturn {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const campaignId = params.id as string;

  // ----------------------------------------
  // 탭 상태 관리 (URL 동기화)
  // ----------------------------------------
  const [activeTab, setActiveTabState] = useState<TabKey>(() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam === "완료") return "완료";
    if (tabParam === "확인") return "확인";
    return "대기";
  });

  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    let newTab: TabKey = "대기";
    if (tabParam === "완료") newTab = "완료";
    else if (tabParam === "확인") newTab = "확인";
    setActiveTabState((prev) => (prev !== newTab ? newTab : prev));
  }, [searchParams]);

  const setActiveTab = useCallback(
    (tab: TabKey) => {
      const currentPath = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("tab", tab);
      router.replace(`${currentPath}?${urlParams.toString()}`);
    },
    [router]
  );

  // ----------------------------------------
  // 정렬 상태
  // ----------------------------------------
  const [sortOrder, setSortOrder] = useState<SortOption>("latest");
  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: "latest", label: "최신순" },
    { value: "registered", label: "등록순" },
    { value: "recommended", label: "추천순" },
  ];

  // ----------------------------------------
  // 기본 헤더 숨기기
  // ----------------------------------------
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  // ----------------------------------------
  // API 22: 3탭 데이터 동시 조회
  // 백엔드 응답은 flat 구조 (data wrapper 없음)
  // ----------------------------------------
  const { data: waitingData } = useQuery({
    queryKey: ["partnerCampaignContents", campaignId, "waiting"],
    queryFn: () => getCampaignContents({ campaignId, tab: "waiting" }),
    enabled: !!campaignId,
    staleTime: 30_000,
  });

  const { data: submittedData } = useQuery({
    queryKey: ["partnerCampaignContents", campaignId, "submitted"],
    queryFn: () => getCampaignContents({ campaignId, tab: "submitted" }),
    enabled: !!campaignId,
    staleTime: 30_000,
  });

  const { data: approvedData } = useQuery({
    queryKey: ["partnerCampaignContents", campaignId, "approved"],
    queryFn: () => getCampaignContents({ campaignId, tab: "approved" }),
    enabled: !!campaignId,
    staleTime: 30_000,
  });

  // ----------------------------------------
  // campaignInfo 변환
  // 백엔드 응답이 flat이므로 data?.campaignInfo (data?.data?. 아님)
  // ----------------------------------------
  const campaignInfo = useMemo<CampaignInfo | undefined>(() => {
    const apiInfo =
      waitingData?.campaignInfo ?? submittedData?.campaignInfo ?? approvedData?.campaignInfo;
    if (!apiInfo) return STATIC_CAMPAIGN_INFO;
    return adaptCampaignInfo(apiInfo as Parameters<typeof adaptCampaignInfo>[0]);
  }, [waitingData, submittedData, approvedData]);

  // ----------------------------------------
  // 탭 카운트 (API 응답의 tabCounts 사용)
  // 백엔드: waiting/submitted/approved (Count 접미사 없음)
  // ----------------------------------------
  const tabCounts = useMemo(() => {
    const counts = waitingData?.tabCounts ?? submittedData?.tabCounts ?? approvedData?.tabCounts;
    return {
      waitingCount: counts?.waiting ?? 0,
      submittedCount: counts?.submitted ?? 0,
      approvedCount: counts?.approved ?? 0,
    };
  }, [waitingData, submittedData, approvedData]);

  // ----------------------------------------
  // 콘텐츠 변환
  // ----------------------------------------
  const baseContents = useMemo<ContentByTab>(() => {
    const waiting = (waitingData?.contents ?? []).map(adaptContentItem);
    const reviewing = (submittedData?.contents ?? []).map(adaptContentItem);
    const completed = (approvedData?.contents ?? []).map(adaptContentItem);
    const hasData = waiting.length + reviewing.length + completed.length > 0;
    if (!hasData) return STATIC_CONTENTS;
    return { waiting, reviewing, completed };
  }, [waitingData, submittedData, approvedData]);

  // ----------------------------------------
  // 로컬 상태: 승인/반려/신고 추적
  // ----------------------------------------
  const [approvedContentIds, setApprovedContentIds] = useState<Set<string>>(new Set());
  const [rejectedContentIds, setRejectedContentIds] = useState<Set<string>>(new Set());
  const [rejectReasons, setRejectReasons] = useState<Map<string, string>>(new Map());
  const [reportedContentIds, setReportedContentIds] = useState<Set<string>>(new Set());
  const [reportedDates, setReportedDates] = useState<Map<string, string>>(new Map());

  // ----------------------------------------
  // 승인/반려/신고 적용 후 콘텐츠 (즉시 UI 반영)
  // ----------------------------------------
  const contents = useMemo<ContentByTab>(() => {
    const reviewing = baseContents.reviewing || [];
    const completed = baseContents.completed || [];
    const waiting = baseContents.waiting || [];

    const approvedItems = reviewing.filter((item) => approvedContentIds.has(item.id));
    const rejectedItems = reviewing
      .filter((item) => rejectedContentIds.has(item.id))
      .map((item) => ({
        ...item,
        isRejected: true,
        reject_reason: rejectReasons.get(item.id) || "",
      }));

    const reportedFromReviewing = reviewing
      .filter((item) => reportedContentIds.has(item.id))
      .map((item) => ({
        ...item,
        isReported: true,
        reportedDate: reportedDates.get(item.id) || "",
      }));
    const reportedFromCompleted = completed
      .filter((item) => reportedContentIds.has(item.id))
      .map((item) => ({
        ...item,
        isReported: true,
        reportedDate: reportedDates.get(item.id) || "",
      }));

    const remainingReviewing = reviewing.filter(
      (item) =>
        !approvedContentIds.has(item.id) &&
        !rejectedContentIds.has(item.id) &&
        !reportedContentIds.has(item.id)
    );
    const remainingCompleted = completed.filter((item) => !reportedContentIds.has(item.id));

    return {
      waiting: [...waiting, ...rejectedItems, ...reportedFromReviewing, ...reportedFromCompleted],
      reviewing: remainingReviewing,
      completed: [...remainingCompleted, ...approvedItems],
    };
  }, [
    baseContents,
    approvedContentIds,
    rejectedContentIds,
    rejectReasons,
    reportedContentIds,
    reportedDates,
  ]);

  // 탭 카운트 (로컬 상태 반영)
  const waitingCount = contents.waiting?.length || 0;
  const reviewCount = contents.reviewing?.length || 0;
  const completedCount = contents.completed?.length || 0;

  // ----------------------------------------
  // 기한 연장 핸들러 (API 22-3)
  // contentId → applicationId 역방향 조회 후 extend-deadline 호출
  // ----------------------------------------
  const handleExtend = useCallback(
    (contentId: string) => {
      const allItems = [
        ...(baseContents.waiting || []),
        ...(baseContents.reviewing || []),
        ...(baseContents.completed || []),
      ];
      const item = allItems.find((i) => i.id === contentId);
      const applicationId = item?.applicationId;
      if (applicationId) {
        extendContentDeadline(applicationId).catch(() => {});
      }
    },
    [baseContents]
  );

  // ----------------------------------------
  // 확인완료 핸들러 (API 22-5)
  // ----------------------------------------
  const handleComplete = useCallback((contentId: string) => {
    const numericId = parseInt(String(contentId).replace(/\D/g, ""), 10);
    if (!Number.isNaN(numericId)) {
      completeContent(numericId).catch(() => {});
    }
  }, []);

  // ----------------------------------------
  // 포맷 유틸
  // ----------------------------------------
  const formatDateTime = (iso: string | Date) => String(iso).slice(0, 16).replace("T", " ");

  // ----------------------------------------
  // 승인 핸들러 (API 22-1)
  // ----------------------------------------
  const handleApprove = useCallback(
    (contentId: string) => {
      setApprovedContentIds((prev) => new Set([...prev, contentId]));
      setActiveTab("완료");

      const numericId = parseInt(String(contentId).replace(/\D/g, ""), 10);
      if (!Number.isNaN(numericId)) {
        approveContent(numericId).catch(() => {});
      }
    },
    [setActiveTab]
  );

  // ----------------------------------------
  // 반려 핸들러 (API 22-2)
  // ----------------------------------------
  const handleReject = useCallback(
    (contentId: string, rejectReason?: string) => {
      setRejectedContentIds((prev) => new Set([...prev, contentId]));
      if (rejectReason) {
        setRejectReasons((prev) => {
          const newMap = new Map(prev);
          newMap.set(contentId, rejectReason);
          return newMap;
        });
      }
      setActiveTab("대기");

      const numericId = parseInt(String(contentId).replace(/\D/g, ""), 10);
      if (!Number.isNaN(numericId)) {
        rejectContent(numericId, { rejectReason }).catch(() => {});
      }
    },
    [setActiveTab]
  );

  // ----------------------------------------
  // 신고 핸들러 (API 22-4)
  // REPORT_OPTIONS value → ReportReasonType ENUM 매핑
  // ----------------------------------------
  const REPORT_REASON_MAP: Record<string, ReportReasonType> = {
    selection_cancelled: "CANCEL_AFTER_SELECTED",
    no_show: "NO_CONTACT_NO_SHOW",
    exposure_period: "MISSED_CONTENT_DEADLINE",
    modification_request: "INCORRECT_CONTENT_SUBMISSION",
    other: "OTHER_MISCONDUCT",
  };

  const handleReport = useCallback(
    (contentId: string, reportOption?: string, otherReason?: string) => {
      setReportedContentIds((prev) => new Set([...prev, contentId]));

      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      setReportedDates((prev) => {
        const newMap = new Map(prev);
        newMap.set(contentId, formattedDate);
        return newMap;
      });
      setActiveTab("대기");

      // applicationId 역방향 조회 후 API 22-4 호출
      const allItems = [
        ...(baseContents.waiting || []),
        ...(baseContents.reviewing || []),
        ...(baseContents.completed || []),
      ];
      const item = allItems.find((i) => i.id === contentId);
      const applicationId = item?.applicationId;
      if (applicationId && reportOption) {
        const reportReason = REPORT_REASON_MAP[reportOption] ?? "OTHER_MISCONDUCT";
        const reportDetail = reportOption === "other" ? (otherReason ?? null) : null;
        reportReviewer(applicationId, { reportReason, reportDetail }).catch(() => {});
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setActiveTab, baseContents]
  );

  return {
    campaignInfo,
    rawApiCampaign: null,
    activeTab,
    setActiveTab,
    waitingCount,
    reviewCount,
    completedCount,
    sortOrder,
    setSortOrder,
    sortOptions,
    contents,
    approvedContentIds,
    handleApprove,
    rejectedContentIds,
    rejectReasons,
    handleReject,
    reportedContentIds,
    reportedDates,
    handleReport,
    handleExtend,
    handleComplete,
    formatDateTime,
  };
}
