/* ========================================
   캠페인 진행현황 상세 페이지 공통 훅
   ======================================== */

/**
 * 캠페인 진행현황 상세 페이지 공통 로직 커스텀 훅
 *
 * 목적: 배송형, 미션형, 기자단, 구매평, 방문형 캠페인 상세 페이지에서
 *       공통으로 사용하는 상태 관리와 데이터 로딩 로직을 재사용 가능한 훅으로 추출합니다.
 *
 * 사용 페이지:
 * - src/app/manager_ga/campaign/progress/delivery/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/mission/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/reporter/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/review/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/visit/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/delivery/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/mission/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/reporter/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/review/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/visit/[id]/page.tsx
 *
 * 📌 훅 위치:
 * - src/hooks/manager/common/campaign/useCampaignProgressDetail.ts
 */

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminCampaignDetail, fetchCampaignApplications } from "@/lib/api/admin";
import type { AdminCampaignApiItem, CampaignApplicationApiItem } from "@/types/api/admin";
import type { CampaignWithApplicants, AllApplicant } from "@/data/partner/sharedCampaigns";
import type { CampaignInfo } from "@/components/partner/campaign_application/CampaignInfoBox";

/**
 * 정렬 옵션 타입 정의
 * - latest: 최신순
 * - popular: 인기순
 * - deadline: 마감임박순
 * - point: 포인트순
 */
export type SortOption = "latest" | "popular" | "deadline" | "point";

/**
 * 탭 타입 정의
 * - applicants: 신청 탭
 * - selected: 선정 탭
 */
export type TabType = "applicants" | "selected";

/**
 * 커스텀 훅의 반환 타입 정의
 */
export interface UseCampaignProgressDetailReturn {
  // 캠페인 데이터
  campaign_data: CampaignWithApplicants | null;
  // 로딩 상태
  is_loading: boolean;
  // 에러 메시지
  error_message: string | null;
  // 활성 탭 (신청/선정)
  active_tab: TabType;
  set_active_tab: (tab: TabType) => void;
  // 정렬 옵션
  sort_order: SortOption;
  set_sort_order: (order: SortOption) => void;
  sort_options: Array<{ value: SortOption; label: string }>;
  // 신청자 목록 상태
  applicants_state: AllApplicant[];
  set_applicants_state: React.Dispatch<React.SetStateAction<AllApplicant[]>>;
  // 선정자 목록 상태
  selected_state: AllApplicant[];
  set_selected_state: React.Dispatch<React.SetStateAction<AllApplicant[]>>;
  // 카운트
  applicants_count: number;
  selected_count: number;
  // 현재 탭에 표시할 신청자 목록
  current_applicants: AllApplicant[];
  // 카드 이동 핸들러
  handle_select_applicant: (applicant_id: string) => void;
  handle_cancel_applicant: (applicant_id: string) => void;
  // 엑셀 다운로드 핸들러 (목업)
  handle_download_applicants: () => void;
  handle_download_selected: () => void;
}

// ============================================================
// 매핑 유틸 함수
// ============================================================

/**
 * channelName(영문) → 한글 채널명 변환
 */
function mapChannelName(channelName: string): string {
  const map: Record<string, string> = {
    NAVER_BLOG: "네이버블로그",
    NAVER_CLIP: "네이버클립",
    INSTAGRAM: "인스타그램",
    INSTAGRAM_REELS: "릴스",
    REELS: "릴스",
    YOUTUBE: "유튜브",
    YOUTUBE_SHORTS: "유튜브",
  };
  return map[channelName] ?? "네이버블로그";
}

/**
 * campaign type(영문) → 한글 캠페인 유형 변환
 */
function mapCampaignType(type: string): CampaignInfo["campaignType"] {
  const map: Record<string, CampaignInfo["campaignType"]> = {
    DELIVERY: "배송형",
    VISIT: "방문형",
    PURCHASE_REVIEW: "구매평",
    REPORTER: "기자단",
    MISSION: "미션형",
  };
  return map[type] ?? "배송형";
}

/**
 * AdminCampaignApiItem → CampaignInfo 매핑
 */
function mapToCampaignInfo(campaign: AdminCampaignApiItem): CampaignInfo {
  const channelName = campaign.requiredPlatform?.channelName ?? "";
  const recruitStart = campaign.recruitStartAt ?? campaign.recruit?.recruitStartAt ?? "";
  const recruitEnd = campaign.recruitEndAt ?? campaign.recruit?.recruitEndAt ?? "";
  const contentStart = campaign.content?.contentStartAt ?? "";
  const contentEnd = campaign.content?.contentEndAt ?? "";
  const extraPoint = campaign.reward?.extraRewardPoint ?? 0;
  const selectAt = campaign.selectAt ?? "";

  return {
    id: String(campaign.id),
    title: campaign.title ?? "",
    image: campaign.thumbnailUrl ?? "",
    status: "진행 중",
    campaignType: mapCampaignType(campaign.type ?? ""),
    category: campaign.category?.categoryName ?? "",
    channel: mapChannelName(channelName),
    recruitmentPeriod:
      recruitStart && recruitEnd ? `${recruitStart.slice(0, 10)} ~ ${recruitEnd.slice(0, 10)}` : "",
    announcementDate: selectAt ? selectAt.slice(0, 10) : recruitEnd ? recruitEnd.slice(0, 10) : "",
    registrationPeriod:
      contentStart && contentEnd ? `${contentStart.slice(0, 10)} ~ ${contentEnd.slice(0, 10)}` : "",
    recruitedCount: campaign.appliedCount ?? 0,
    totalCount: campaign.recruitLimit ?? 0,
    daysLeft: 0,
    point: extraPoint,
  };
}

/**
 * campaign channel → AllApplicant.channel 매핑
 */
function mapApplicantChannel(channelName: string): AllApplicant["channel"] {
  const map: Record<string, AllApplicant["channel"]> = {
    NAVER_BLOG: "네이버블로그",
    NAVER_CLIP: "네이버클립",
    INSTAGRAM: "인스타그램",
    INSTAGRAM_REELS: "릴스",
    REELS: "릴스",
    YOUTUBE: "유튜브",
    YOUTUBE_SHORTS: "유튜브",
  };
  return (map[channelName] ?? "기본") as AllApplicant["channel"];
}

/**
 * CampaignApplicationApiItem → AllApplicant 매핑
 * (campaign의 channelName을 참조해 AllApplicant 구체 타입 결정)
 */
function mapToAllApplicant(
  app: CampaignApplicationApiItem,
  channelName: string,
  isSelected: boolean
): AllApplicant {
  const channel = mapApplicantChannel(channelName);
  const selectionStatus: AllApplicant["selectionStatus"] = isSelected ? "선정하기" : "미선택";

  const base = {
    id: String(app.id),
    Id: String(app.reviewer_id),
    nickname: `리뷰어${app.reviewer_id}`,
    userType: "리뷰어" as const,
    profileImage: "",
    memberType: "모범 회원" as const,
    memo: app.introduction ?? "",
    selectionStatus,
    registrationDate: app.apply_date ? app.apply_date.slice(0, 10) : "",
  };

  switch (channel) {
    case "네이버블로그":
      return {
        ...base,
        channel: "네이버블로그",
        dailyVisits: 0,
        totalVisits: 0,
        neighbors: app.follower_count ?? 0,
      };
    case "네이버클립":
      return {
        ...base,
        channel: "네이버클립",
        followers: app.follower_count ?? 0,
      };
    case "인스타그램":
      return {
        ...base,
        channel: "인스타그램",
        followers: app.follower_count ?? 0,
      };
    case "릴스":
      return {
        ...base,
        channel: "릴스",
        followers: app.follower_count ?? 0,
      };
    case "유튜브":
      return {
        ...base,
        channel: "유튜브",
        subscribers: app.follower_count ?? 0,
      };
    default:
      return {
        ...base,
        channel: "기본",
      };
  }
}

/**
 * 캠페인 진행현황 상세 페이지 공통 로직 훅
 *
 * @param campaign_id - 캠페인 ID (URL 파라미터에서 추출)
 * @param error_log_prefix - 에러 로그에 사용할 접두사 (예: "GA 배송형", "SA 배송형")
 * @returns UseCampaignProgressDetailReturn - 상태와 핸들러 함수들
 */
export function useCampaignProgressDetail(
  campaign_id: string,
  error_log_prefix: string = "GA"
): UseCampaignProgressDetailReturn {
  /**
   * 1) URL 쿼리 파라미터 처리
   */
  const search_params = useSearchParams();

  /**
   * 2) 탭 상태
   */
  const [active_tab, set_active_tab] = useState<TabType>(() => {
    const tab_param = search_params.get("tab");
    return tab_param === "selected" ? "selected" : "applicants";
  });

  /**
   * 3) 정렬 상태
   */
  const [sort_order, set_sort_order] = useState<SortOption>("latest");
  const sort_options: Array<{ value: SortOption; label: string }> = [
    { value: "latest", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "deadline", label: "마감임박순" },
    { value: "point", label: "포인트순" },
  ];

  /**
   * 4) 신청자/선정자 목록 상태
   */
  const [applicants_state, set_applicants_state] = useState<AllApplicant[]>([]);
  const [selected_state, set_selected_state] = useState<AllApplicant[]>([]);

  // ============================================================
  // 5) API 호출 (useQuery)
  // ============================================================

  /**
   * 캠페인 상세 조회  GET /admin/campaign/:id
   */
  const {
    data: campaign_api_data,
    isLoading: is_campaign_loading,
    isError: is_campaign_error,
  } = useQuery({
    queryKey: ["admin-campaign-detail", campaign_id, error_log_prefix],
    queryFn: () => fetchAdminCampaignDetail(campaign_id),
    enabled: !!campaign_id,
    staleTime: 30_000,
  });

  /**
   * 캠페인 신청자 목록 조회  GET /partner/campaign/:id/applications
   */
  const { data: applications_data, isLoading: is_applications_loading } = useQuery({
    queryKey: ["campaign-applications", campaign_id],
    queryFn: () => fetchCampaignApplications(campaign_id),
    enabled: !!campaign_id,
    staleTime: 30_000,
  });

  // ============================================================
  // 6) API 응답 → 상태 동기화
  // ============================================================
  useEffect(() => {
    if (!applications_data || !campaign_api_data) return;

    const channelName = campaign_api_data.requiredPlatform?.channelName ?? "";

    const applicants: AllApplicant[] = [];
    const selected: AllApplicant[] = [];

    for (const app of applications_data) {
      const isSelected = app.status === "SELECTED";
      const mapped = mapToAllApplicant(app, channelName, isSelected);
      if (isSelected) {
        selected.push(mapped);
      } else {
        applicants.push(mapped);
      }
    }

    set_applicants_state(applicants);
    set_selected_state(selected);
  }, [applications_data, campaign_api_data]);

  // ============================================================
  // 7) campaign_data 조립 (CampaignWithApplicants 형태)
  // ============================================================
  const is_loading = is_campaign_loading || is_applications_loading;
  const error_message = is_campaign_error
    ? `캠페인을 찾을 수 없습니다. (ID: ${campaign_id})`
    : null;

  const campaign_data: CampaignWithApplicants | null = campaign_api_data
    ? {
        campaignInfo: mapToCampaignInfo(campaign_api_data),
        applicantData: {
          applicants: applicants_state,
          selectedApplicants: selected_state,
        },
      }
    : null;

  // ============================================================
  // 8) 카운트 계산
  // ============================================================
  const applicants_count = applicants_state.length;
  const selected_count = selected_state.length;

  // ============================================================
  // 9) 현재 탭에 표시할 신청자 목록 계산
  // ============================================================
  const get_current_applicants = (): AllApplicant[] => {
    switch (active_tab) {
      case "applicants":
        return applicants_state;
      case "selected":
        return selected_state;
      default:
        return applicants_state;
    }
  };

  const current_applicants = get_current_applicants();

  // ============================================================
  // 10) 신청자 선정 핸들러
  // ============================================================
  const handle_select_applicant = (applicant_id: string) => {
    set_applicants_state((prev) => {
      const target = prev.find((applicant) => applicant.id === applicant_id);
      if (!target) return prev;

      const next_applicants = prev.filter((applicant) => applicant.id !== applicant_id);

      const moved: AllApplicant = {
        ...target,
        selectionStatus: "선정하기",
      } as AllApplicant;

      set_selected_state((prev_selected) => {
        const already = prev_selected.some((applicant) => applicant.id === applicant_id);
        if (already) return prev_selected;
        return [moved, ...prev_selected];
      });

      return next_applicants;
    });
  };

  // ============================================================
  // 11) 선정 취소 핸들러
  // ============================================================
  const handle_cancel_applicant = (applicant_id: string) => {
    set_selected_state((prev_selected) => {
      const target = prev_selected.find((applicant) => applicant.id === applicant_id);
      if (!target) return prev_selected;

      const next_selected = prev_selected.filter((applicant) => applicant.id !== applicant_id);

      const moved: AllApplicant = {
        ...target,
        selectionStatus: "미선택",
      } as AllApplicant;

      set_applicants_state((prev) => {
        const already = prev.some((applicant) => applicant.id === applicant_id);
        if (already) return prev;
        return [moved, ...prev];
      });

      return next_selected;
    });
  };

  // ============================================================
  // 12) 엑셀 다운로드 핸들러 (목업)
  // ============================================================
  const handle_download_applicants = () => {
    // TODO: 신청자 목록 다운로드 기능 구현
  };

  const handle_download_selected = () => {
    // TODO: 선정자 목록 다운로드 기능 구현
  };

  // ============================================================
  // 13) 훅 반환 값
  // ============================================================
  return {
    campaign_data,
    is_loading,
    error_message,
    active_tab,
    set_active_tab,
    sort_order,
    set_sort_order,
    sort_options,
    applicants_state,
    set_applicants_state,
    selected_state,
    set_selected_state,
    applicants_count,
    selected_count,
    current_applicants,
    handle_select_applicant,
    handle_cancel_applicant,
    handle_download_applicants,
    handle_download_selected,
  };
}
