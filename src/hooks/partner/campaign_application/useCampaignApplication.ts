/* ========================================
   캠페인 신청내역 페이지 공통 로직 훅
   ======================================== */

/**
 * useCampaignApplication
 *
 * 목적: 캠페인 신청내역 페이지 공통 상태 관리 및 핸들러 로직
 *
 * API:
 * - 19번: GET /partner/campaign/applications/{campaignId} → 신청내역 조회
 * - 20번: PUT /partner/campaign/applications/{applicationId}/select → 리뷰어 선정
 * - 21번: PUT /partner/campaign/applications/{applicationId}/cancel-select → 선정 취소
 *
 * 사용 페이지:
 * - /partner/campaign_application (캠페인 신청내역 페이지)
 */

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCampaignApplications,
  selectApplication,
  cancelSelectApplication,
} from "@/lib/api/partnerCampaignApplication";
import type {
  CampaignApplicationInfo,
  ApplicationItem,
} from "@/types/api/partnerCampaignApplication";
import {
  CHANNEL_LABEL,
  USER_TYPE_LABEL,
  MEMBER_TYPE_LABEL,
} from "@/types/api/partnerCampaignApplication";
import type { CampaignWithApplicants, AllApplicant } from "@/data/partner/sharedCampaigns";
import type { CampaignInfo } from "@/components/partner/campaign_application/CampaignInfoBox";

// ----------------------------------------
// 정렬/탭 타입 정의
// ----------------------------------------
export type SortOption = "latest" | "registered" | "recommended";
export type TabType = "applicants" | "selected";

// ----------------------------------------
// API → 프론트엔드 어댑터
// ----------------------------------------

const CAMPAIGN_TYPE_MAP: Record<string, CampaignInfo["campaignType"]> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

const STATUS_MAP: Record<string, CampaignInfo["status"]> = {
  REGISTERING: "대기 중",
  RECRUITING: "모집 중",
  SELECTING: "선정 중",
  PURCHASING: "진행 중",
  CLOSED: "종료",
  EMERGENCY: "취소",
};

function formatPeriod(start: string, end: string): string {
  const s = (start || "").slice(0, 10);
  const e = (end || "").slice(0, 10);
  return s && e ? `${s} ~ ${e}` : s || e || "";
}

function calcDaysLeft(dateStr: string): number {
  if (!dateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

/** API campaignInfo → CampaignInfo (프론트엔드 UI 모델) */
function adaptCampaignInfo(info: CampaignApplicationInfo): CampaignInfo {
  return {
    id: String(info.campaignId),
    title: info.title,
    image: info.thumbnailUrl || "/images/main/campaign_img/eximg_1.png",
    status: STATUS_MAP[info.status] || "모집 중",
    campaignType: CAMPAIGN_TYPE_MAP[info.type] || "배송형",
    category: info.category || "",
    brandName: CHANNEL_LABEL[info.platform || ""] || "",
    channel: info.platform || "",
    recruitmentPeriod: formatPeriod(info.recruitStartAt, info.recruitEndAt),
    announcementDate: (info.announcementDate || "").slice(0, 10),
    registrationPeriod: formatPeriod(info.campaignStartAt || "", info.campaignEndAt || ""),
    recruitedCount: info.totalApplied + info.totalSelected,
    totalCount: info.recruitLimit,
    daysLeft: calcDaysLeft(info.recruitEndAt),
    point: info.points || 0,
    region: info.region,
    subRegion: info.subRegion,
  };
}

/** API ApplicationItem → AllApplicant (프론트엔드 UI 모델) */
function adaptApplicant(item: ApplicationItem): AllApplicant {
  const channelName = item.channelInfo?.channelName || "NAVER_BLOG";
  const channel = CHANNEL_LABEL[channelName] || "네이버블로그";
  const selectionStatus: "미선택" | "선정하기" = item.status === "SELECTED" ? "선정하기" : "미선택";

  // 공통 필드
  const base = {
    id: String(item.applicationId),
    Id: item.channelInfo?.channelUrl || String(item.reviewerId),
    nickname: item.reviewerName,
    profileImage: item.profileImage || "/images/mypage/profile.svg",
    userType: (USER_TYPE_LABEL[item.userType || "REVIEWER"] || "리뷰어") as "리뷰어" | "인플루언서",
    memberType: (MEMBER_TYPE_LABEL[item.memberType || "MODEL"] || "모범 회원") as
      | "모범 회원"
      | "주의 회원"
      | "경고 회원"
      | "이용 제한",
    memo: item.memo || "",
    selectionStatus,
    registrationDate: (item.appliedAt || "").slice(0, 10),
  };

  // 채널별 메트릭 매핑
  switch (channelName) {
    case "NAVER_BLOG":
      return {
        ...base,
        channel: "네이버블로그" as const,
        dailyVisits: item.channelInfo?.dailyVisits || 0,
        totalVisits: item.channelInfo?.totalVisits || 0,
        neighbors: item.channelInfo?.neighbors || 0,
      };
    case "NAVER_CLIP":
      return {
        ...base,
        channel: "네이버클립" as const,
        followers: item.channelInfo?.followerCount || 0,
      };
    case "INSTAGRAM":
      return {
        ...base,
        channel: "인스타그램" as const,
        followers: item.channelInfo?.followerCount || 0,
      };
    case "REELS":
      return {
        ...base,
        channel: "릴스" as const,
        followers: item.channelInfo?.followerCount || 0,
      };
    case "YOUTUBE":
      return {
        ...base,
        channel: "유튜브" as const,
        subscribers: item.channelInfo?.subscribers || item.channelInfo?.followerCount || 0,
      };
    case "SHORTS":
      return {
        ...base,
        channel: "유튜브" as const,
        subscribers: item.channelInfo?.subscribers || item.channelInfo?.followerCount || 0,
      };
    default:
      return {
        ...base,
        channel: channel as "네이버블로그",
        dailyVisits: 0,
        totalVisits: 0,
        neighbors: 0,
      };
  }
}

// ----------------------------------------
// 반환 타입 정의
// ----------------------------------------
export interface UseCampaignApplicationReturn {
  campaignData: CampaignWithApplicants | null;
  isLoading: boolean;
  error: string | null;

  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  sortOrder: SortOption;
  setSortOrder: (order: SortOption) => void;
  sortOptions: Array<{ value: SortOption; label: string }>;

  applicantsState: AllApplicant[];
  selectedState: AllApplicant[];
  applicantsCount: number;
  selectedCount: number;
  currentApplicants: AllApplicant[];

  is_modal_open: boolean;
  setIsModalOpen: (open: boolean) => void;
  is_already_selected_modal_open: boolean;
  setIsAlreadySelectedModalOpen: (open: boolean) => void;

  handleSelectApplicant: (applicantId: string) => void;
  handleCancelApplicant: (applicantId: string) => void;
  handle_close_modal: () => void;
  handle_close_already_selected_modal: () => void;
}

// ----------------------------------------
// 정렬 매핑 (프론트 → 백엔드 API sort 파라미터)
// ----------------------------------------
const SORT_MAP: Record<SortOption, string> = {
  latest: "LATEST",
  registered: "OLDEST",
  recommended: "RECOMMEND",
};

// ----------------------------------------
// 정적 fallback 데이터 (API 미연결 시)
// ----------------------------------------
const STATIC_APPLICATION: CampaignWithApplicants = {
  campaignInfo: {
    id: "961",
    title: "프리미엄 스킨케어 세트 체험단",
    image: "/images/main/campaign_img/eximg_7.png",
    status: "모집 중",
    campaignType: "배송형",
    category: "뷰티",
    brandName: "네이버블로그",
    recruitmentPeriod: "2026-07-01 ~ 2026-07-31",
    announcementDate: "2026-08-05",
    registrationPeriod: "2026-08-10 ~ 2026-08-25",
    recruitedCount: 3,
    totalCount: 5,
    daysLeft: 21,
  },
  applicantData: {
    applicants: [
      {
        id: "sa1",
        Id: "blog.naver.com/beauty_review",
        nickname: "뷰티러버",
        userType: "리뷰어",
        profileImage: "/images/mypage/profile.svg",
        memberType: "모범 회원",
        dailyVisits: 1200,
        totalVisits: 450000,
        neighbors: 2800,
        memo: "",
        selectionStatus: "미선택",
        channel: "네이버블로그",
        registrationDate: "2026-07-05",
      },
      {
        id: "sa2",
        Id: "@skincare_daily",
        nickname: "스킨케어데일리",
        userType: "인플루언서",
        profileImage: "/images/mypage/profile.svg",
        memberType: "모범 회원",
        followers: 15000,
        memo: "",
        selectionStatus: "미선택",
        channel: "인스타그램",
        registrationDate: "2026-07-06",
      },
      {
        id: "sa3",
        Id: "youtube.com/@beauty_tube",
        nickname: "뷰티튜버",
        userType: "인플루언서",
        profileImage: "/images/mypage/profile.svg",
        memberType: "모범 회원",
        subscribers: 35000,
        memo: "",
        selectionStatus: "미선택",
        channel: "유튜브",
        registrationDate: "2026-07-07",
      },
      {
        id: "sa4",
        Id: "nclip.naver.com/@daily_clip",
        nickname: "데일리클립",
        userType: "리뷰어",
        profileImage: "/images/mypage/profile.svg",
        memberType: "모범 회원",
        followers: 4200,
        memo: "",
        selectionStatus: "미선택",
        channel: "네이버클립",
        registrationDate: "2026-07-08",
      },
    ],
    selectedApplicants: [
      {
        id: "ss1",
        Id: "blog.naver.com/selected_reviewer",
        nickname: "선정된리뷰어",
        userType: "리뷰어",
        profileImage: "/images/mypage/profile.svg",
        memberType: "모범 회원",
        dailyVisits: 800,
        totalVisits: 300000,
        neighbors: 1500,
        memo: "",
        selectionStatus: "선정하기",
        channel: "네이버블로그",
        registrationDate: "2026-07-04",
      },
    ],
  },
};

// ========================================
// 메인 훅
// ========================================
export function useCampaignApplication(): UseCampaignApplicationReturn {
  const params = useParams();
  const searchParams = useSearchParams();
  const campaignId = params.id as string;
  const queryClient = useQueryClient();

  // 탭 상태
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tabParam = searchParams.get("tab");
    return tabParam === "selected" ? "selected" : "applicants";
  });

  // 정렬 상태
  const [sortOrder, setSortOrder] = useState<SortOption>("latest");

  // 로컬 UI 상태 (선정/취소 즉시 반영용)
  const [applicantsState, setApplicantsState] = useState<AllApplicant[]>([]);
  const [selectedState, setSelectedState] = useState<AllApplicant[]>([]);

  // 모달 상태
  const [is_modal_open, setIsModalOpen] = useState(false);
  const [is_already_selected_modal_open, setIsAlreadySelectedModalOpen] = useState(false);

  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: "latest", label: "최신순" },
    { value: "registered", label: "등록순" },
    { value: "recommended", label: "추천순" },
  ];

  // ----------------------------------------
  // API 19: 신청내역 조회 (React Query)
  // ----------------------------------------
  const {
    data: apiData,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["partnerCampaignApplications", campaignId, sortOrder],
    queryFn: () =>
      getCampaignApplications({
        campaignId,
        status: "ALL",
        sort: SORT_MAP[sortOrder] as "LATEST" | "OLDEST" | "RECOMMEND",
      }),
    enabled: !!campaignId,
    staleTime: 30_000,
  });

  // API 응답 → CampaignWithApplicants 변환 + 로컬 상태 초기화
  const [campaignData, setCampaignData] = useState<CampaignWithApplicants | null>(null);

  useEffect(() => {
    if (!apiData?.data) return;

    const { campaignInfo: rawCampaignInfo, applications } = apiData.data;
    const campaignInfo = adaptCampaignInfo(rawCampaignInfo);
    const allApplicants = applications.map(adaptApplicant);

    const applied = allApplicants.filter((a) => a.selectionStatus === "미선택");
    const selected = allApplicants.filter((a) => a.selectionStatus === "선정하기");

    setCampaignData({
      campaignInfo,
      applicantData: {
        applicants: applied,
        selectedApplicants: selected,
      },
    });

    setApplicantsState(applied);
    setSelectedState(selected);
  }, [apiData]);

  // API 미연결 시 정적 데이터 fallback
  useEffect(() => {
    if (isLoading) return;
    if (campaignData) return;
    setCampaignData(STATIC_APPLICATION);
    setApplicantsState(STATIC_APPLICATION.applicantData.applicants);
    setSelectedState(STATIC_APPLICATION.applicantData.selectedApplicants);
  }, [isLoading, campaignData]);

  // 기본 헤더 숨기기
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  // 탭별 카운트
  const applicantsCount = applicantsState.length;
  const selectedCount = selectedState.length;

  // 현재 탭 데이터
  const currentApplicants = activeTab === "selected" ? selectedState : applicantsState;

  // ----------------------------------------
  // API 20: 리뷰어 선정 mutation
  // ----------------------------------------
  const selectMutation = useMutation({
    mutationFn: (applicationId: number) => selectApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerCampaignApplications", campaignId] });
    },
  });

  // ----------------------------------------
  // API 21: 리뷰어 선정 취소 mutation
  // ----------------------------------------
  const cancelMutation = useMutation({
    mutationFn: (applicationId: number) => cancelSelectApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerCampaignApplications", campaignId] });
    },
  });

  // ----------------------------------------
  // 선정하기 핸들러
  // ----------------------------------------
  const handleSelectApplicant = useCallback(
    (applicantId: string) => {
      if (!campaignData) return;

      const recruitment_limit = campaignData.campaignInfo.totalCount;
      const current_selected_count = selectedState.length;

      if (current_selected_count + 1 > recruitment_limit) {
        setIsModalOpen(true);
        return;
      }

      if (activeTab === "selected") {
        const isAlreadySelected = selectedState.some((a) => a.id === applicantId);
        if (isAlreadySelected) {
          setIsAlreadySelectedModalOpen(true);
          return;
        }
      }

      const target = applicantsState.find((a) => a.id === applicantId);
      if (!target) return;

      // Optimistic UI 업데이트
      const moved: AllApplicant = { ...target, selectionStatus: "선정하기" } as AllApplicant;
      setApplicantsState((prev) => prev.filter((a) => a.id !== applicantId));
      setSelectedState((prev) =>
        prev.some((a) => a.id === applicantId) ? prev : [moved, ...prev]
      );

      // API 호출 (applicationId)
      selectMutation.mutate(parseInt(applicantId, 10), {
        onError: () => {
          // 실패 시 롤백
          setApplicantsState((prev) =>
            prev.some((a) => a.id === applicantId) ? prev : [target, ...prev]
          );
          setSelectedState((prev) => prev.filter((a) => a.id !== applicantId));
        },
      });
    },
    [campaignData, applicantsState, selectedState, activeTab, selectMutation]
  );

  // ----------------------------------------
  // 선정 취소 핸들러
  // ----------------------------------------
  const handleCancelApplicant = useCallback(
    (applicantId: string) => {
      if (!campaignData) return;

      const target = selectedState.find((a) => a.id === applicantId);
      if (!target) return;

      // Optimistic UI 업데이트
      const moved: AllApplicant = { ...target, selectionStatus: "미선택" } as AllApplicant;
      setSelectedState((prev) => prev.filter((a) => a.id !== applicantId));
      setApplicantsState((prev) =>
        prev.some((a) => a.id === applicantId) ? prev : [moved, ...prev]
      );

      // API 호출
      cancelMutation.mutate(parseInt(applicantId, 10), {
        onError: () => {
          // 실패 시 롤백
          setSelectedState((prev) =>
            prev.some((a) => a.id === applicantId) ? prev : [target, ...prev]
          );
          setApplicantsState((prev) => prev.filter((a) => a.id !== applicantId));
        },
      });
    },
    [campaignData, selectedState, cancelMutation]
  );

  const handle_close_modal = useCallback(() => setIsModalOpen(false), []);
  const handle_close_already_selected_modal = useCallback(
    () => setIsAlreadySelectedModalOpen(false),
    []
  );

  return {
    campaignData,
    isLoading,
    error: queryError ? "데이터를 불러오는 중 오류가 발생했습니다." : null,
    activeTab,
    setActiveTab,
    sortOrder,
    setSortOrder,
    sortOptions,
    applicantsState,
    selectedState,
    applicantsCount,
    selectedCount,
    currentApplicants,
    is_modal_open,
    setIsModalOpen,
    is_already_selected_modal_open,
    setIsAlreadySelectedModalOpen,
    handleSelectApplicant,
    handleCancelApplicant,
    handle_close_modal,
    handle_close_already_selected_modal,
  };
}
