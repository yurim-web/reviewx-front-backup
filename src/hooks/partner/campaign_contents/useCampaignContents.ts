/* ========================================
   🎣 캠페인 콘텐츠 내역 페이지 공통 로직 훅
   ======================================== */

/**
 * 캠페인 콘텐츠 내역 페이지에서 공통으로 사용되는 로직을 추출한 커스텀 훅
 *
 * 📌 커스텀 훅이란?
 * - React의 기본 훅들(useState, useEffect 등)을 조합하여 만든 재사용 가능한 로직 묶음
 * - 여러 컴포넌트에서 동일한 로직을 사용할 때 중복을 제거하고 유지보수를 쉽게 합니다
 *
 * 주요 기능:
 * - 캠페인 데이터 로딩 및 상태 관리
 * - 콘텐츠 데이터 로딩 (대기/확인/완료)
 * - 탭 상태 관리 (대기/확인/완료)
 * - 정렬 옵션 관리
 * - 승인된 콘텐츠 추적
 * - 승인 핸들러
 *
 * 📌 파일 위치:
 * - src/hooks/partner/campaign_contents/useCampaignContents.ts
 * - 캠페인 콘텐츠 내역 페이지 전용 훅이므로 campaign_contents 폴더에 위치
 */

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  getCampaignById,
  getClosedContentsById,
  type ContentByTab,
  type ContentItem,
} from "@/data/partner/sharedCampaigns";
import { patchCampaignContent, fetchCampaignContents } from "@/lib/api/campaignContents";
import { fetchCampaignById } from "@/lib/api/partner";
import type { PartnerCampaignApiItem } from "@/types/api/partner";

// API 캠페인 타입 → campaignInfo 매핑
const TYPE_MAP: Record<string, string> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  PURCHASE_REVIEW: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};
import type { CampaignInfo } from "@/types/domain/partner";

// recruitEndAt + 7일을 선정 발표일로 유도 (API에 announcementDate 없을 때)
function deriveAnnouncementDate(recruitEndAt?: string): string {
  if (!recruitEndAt) return "";
  try {
    const date = new Date(recruitEndAt);
    if (isNaN(date.getTime())) return "";
    date.setDate(date.getDate() + 7);
    return date.toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

const STATUS_MAP: Record<string, CampaignInfo["status"]> = {
  SCHEDULED: "대기 중",
  REGISTERING: "모집 중",
  RECRUITING: "모집 중",
  SELECTED: "선정 중",
  IN_PROGRESS: "진행 중",
  COMPLETED: "종료",
  CLOSED: "종료",
  CANCELLED: "취소",
};

function mapApiToCampaignInfo(item: PartnerCampaignApiItem): CampaignInfo {
  const fmt = (iso: string) => iso?.slice(0, 10) ?? "";
  return {
    id: String(item.id),
    title: item.title ?? "",
    image: item.thumbnailUrl ?? "",
    status: STATUS_MAP[item.status] ?? "대기 중",
    campaignType: (TYPE_MAP[item.type] ?? "배송형") as CampaignInfo["campaignType"],
    category: item.category?.categoryName ?? "",
    brandName: item.requiredPlatform?.channelName ?? "",
    channel: item.requiredPlatform?.channelName ?? "",
    recruitmentPeriod:
      item.recruitStartAt && item.recruitEndAt
        ? `${fmt(item.recruitStartAt)} ~ ${fmt(item.recruitEndAt)}`
        : "",
    announcementDate: deriveAnnouncementDate(item.recruitEndAt),
    registrationPeriod:
      item.content?.contentStartAt && item.content?.contentEndAt
        ? `${fmt(item.content.contentStartAt)} ~ ${fmt(item.content.contentEndAt)}`
        : "",
    recruitedCount: item.appliedCount ?? 0,
    totalCount: item.recruitLimit ?? 0,
    daysLeft: 0,
  };
}

/**
 * 탭 타입 정의
 * - 대기: 콘텐츠 미등록 상태
 * - 확인: 검수 중인 콘텐츠
 * - 완료: 완료된 콘텐츠
 */
export type TabKey = "대기" | "확인" | "완료";

/**
 * 정렬 옵션 타입 정의
 * - latest: 최신순
 * - registered: 등록순
 * - recommended: 추천순
 */
export type SortOption = "latest" | "registered" | "recommended";

/**
 * 데이터 소스 함수 타입 정의
 * - 각 캠페인 유형별로 콘텐츠를 가져오는 함수
 */
export type ContentsLoader = (campaignId: string) => ContentByTab | undefined;

/**
 * 커스텀 훅의 반환값 타입 정의
 */
export interface UseCampaignContentsReturn {
  // 캠페인 정보
  campaignInfo: NonNullable<ReturnType<typeof getCampaignById>>["campaignInfo"] | undefined;

  // API에서 받은 raw 캠페인 데이터 (contentType 등 추가 필드 접근용)
  rawApiCampaign: PartnerCampaignApiItem | null;

  // 탭 관련
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  waitingCount: number;
  reviewCount: number;
  completedCount: number;

  // 정렬 관련
  sortOrder: SortOption;
  setSortOrder: (order: SortOption) => void;
  sortOptions: Array<{ value: SortOption; label: string }>;

  // 콘텐츠 데이터
  contents: ContentByTab;

  // 승인 관련
  approvedContentIds: Set<string>;
  handleApprove: (contentId: string) => void;

  // 반려 관련
  rejectedContentIds: Set<string>;
  rejectReasons: Map<string, string>;
  handleReject: (contentId: string, rejectReason?: string) => void;

  // 신고 관련
  reportedContentIds: Set<string>;
  reportedDates: Map<string, string>;
  handleReport: (contentId: string) => void;

  // 유틸리티 함수
  formatDateTime: (iso: string | Date) => string;
}

/**
 * 캠페인 콘텐츠 내역 페이지 공통 로직 커스텀 훅
 *
 * @param contentsLoader - (선택) 캠페인 유형별 정적 콘텐츠 로더 함수. 미전달 시 API만 사용.
 * @returns UseCampaignContentsReturn - 모든 상태와 핸들러 함수들
 *
 * 📌 사용 예시:
 * ```tsx
 * // API 전용 (정적 데이터 없이)
 * const { campaignInfo, activeTab, contents } = useCampaignContents();
 *
 * // 정적 데이터 fallback 포함
 * const { campaignInfo, activeTab, contents } = useCampaignContents(getDeliveryContentsById);
 * ```
 */
export function useCampaignContents(contentsLoader?: ContentsLoader): UseCampaignContentsReturn {
  // URL 파라미터에서 캠페인 ID 가져오기
  // 📌 Next.js 훅 사용:
  // - useParams(): URL의 동적 파라미터를 가져옵니다 (예: /campaign/[id]에서 id 값)
  // - useSearchParams(): URL의 쿼리 파라미터를 가져옵니다 (예: ?tab=완료)
  // - useRouter(): Next.js 라우터 객체를 가져옵니다 (URL 업데이트용)
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const campaignId = params.id as string;

  // 탭 상태 관리
  // 📌 초기값을 함수로 설정:
  // - useState(() => ...) 형태로 초기값을 함수로 전달하면 컴포넌트 마운트 시 한 번만 실행됩니다
  // - URL 쿼리 파라미터에서 tab 값을 확인하여 초기 탭 설정
  const [activeTab, setActiveTabState] = useState<TabKey>(() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam === "완료") return "완료";
    if (tabParam === "확인") return "확인";
    return "대기";
  });

  // 📌 URL과 상태 동기화:
  // - URL 쿼리 파라미터가 변경되면 상태도 함께 업데이트합니다
  // - 브라우저 뒤로가기/앞으로가기 버튼을 눌렀을 때도 올바른 탭이 표시됩니다
  // - searchParams를 의존성으로 사용하여 URL 변경을 감지합니다
  // - activeTab을 의존성에서 제거하여 불필요한 리렌더링을 방지합니다
  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    let newTab: TabKey = "대기";

    if (tabParam === "완료") {
      newTab = "완료";
    } else if (tabParam === "확인") {
      newTab = "확인";
    }

    // 현재 상태와 다를 때만 업데이트 (불필요한 리렌더링 방지)
    // 📌 상태 업데이트 최적화:
    // - URL 파라미터에서 읽은 값과 현재 상태가 다를 때만 업데이트합니다
    // - 이렇게 하면 탭 클릭 시 깜빡임 없이 부드럽게 전환됩니다
    setActiveTabState((prevTab) => {
      if (prevTab !== newTab) {
        return newTab;
      }
      return prevTab;
    });
  }, [searchParams]);

  // 📌 탭 변경 핸들러 (URL 업데이트 포함):
  // - 탭을 변경할 때 URL만 업데이트하고, 상태는 useEffect에서 자동으로 동기화됩니다
  // - useCallback을 사용하여 함수를 메모이제이션합니다 (성능 최적화)
  // - URL이 업데이트되면 새로고침해도 선택한 탭이 유지됩니다
  // - 상태를 먼저 업데이트하지 않고 URL만 업데이트하여 깜빡임을 방지합니다
  const setActiveTab = useCallback(
    (tab: TabKey) => {
      // URL 쿼리 파라미터만 업데이트 (상태는 useEffect에서 자동 동기화)
      // 📌 Next.js App Router의 router.replace 사용:
      // - 현재 경로를 유지하면서 쿼리 파라미터만 업데이트합니다
      // - replace를 사용하여 히스토리에 새 항목을 추가하지 않고 현재 항목을 교체합니다
      // - 기존 쿼리 파라미터를 유지하면서 tab만 업데이트합니다
      const currentPath = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      params.set("tab", tab);
      const newUrl = `${currentPath}?${params.toString()}`;
      router.replace(newUrl);
      // 📌 주의: 상태는 업데이트하지 않습니다
      // - router.replace가 URL을 변경하면 searchParams가 변경되고
      // - useEffect가 이를 감지하여 상태를 자동으로 업데이트합니다
      // - 이렇게 하면 상태와 URL이 항상 동기화되고 깜빡임이 없습니다
    },
    [router]
  );

  // 정렬 상태 관리
  const [sortOrder, setSortOrder] = useState<SortOption>("latest");

  // 승인된 콘텐츠 ID 목록 (로컬 상태 관리)
  // 📌 Set 자료구조 사용:
  // - 중복을 자동으로 제거하는 자료구조
  // - has(), add() 메서드로 빠른 조회 및 추가 가능
  const [approvedContentIds, setApprovedContentIds] = useState<Set<string>>(new Set());

  // 반려된 콘텐츠 ID 목록 (로컬 상태 관리)
  // 📌 반려 처리:
  // - 반려된 콘텐츠는 reviewing에서 waiting으로 이동합니다
  // - 반려 사유는 콘텐츠 객체에 저장됩니다
  const [rejectedContentIds, setRejectedContentIds] = useState<Set<string>>(new Set());

  // 반려 사유 저장 (콘텐츠 ID -> 반려 사유)
  // 📌 Map 자료구조 사용:
  // - 키(콘텐츠 ID)와 값(반려 사유)을 쌍으로 저장
  // - 반려 사유를 콘텐츠별로 관리
  const [rejectReasons, setRejectReasons] = useState<Map<string, string>>(new Map());

  // 신고된 콘텐츠 ID 목록 (로컬 상태 관리)
  // 📌 신고 처리:
  // - 신고된 콘텐츠는 reviewing/completed에서 waiting으로 이동합니다
  // - 신고 날짜/시간은 콘텐츠 객체에 저장됩니다
  const [reportedContentIds, setReportedContentIds] = useState<Set<string>>(new Set());

  // 신고 날짜/시간 저장 (콘텐츠 ID -> 신고 날짜/시간)
  // 📌 Map 자료구조 사용:
  // - 키(콘텐츠 ID)와 값(신고 날짜/시간)을 쌍으로 저장
  // - 신고 날짜/시간을 콘텐츠별로 관리
  const [reportedDates, setReportedDates] = useState<Map<string, string>>(new Map());

  // 정렬 옵션 정의
  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: "latest", label: "최신순" },
    { value: "registered", label: "등록순" },
    { value: "recommended", label: "추천순" },
  ];

  // 기본 헤더 숨기기 (PartnerHeader만 표시)
  // 📌 useEffect의 cleanup 함수:
  // - 컴포넌트가 언마운트될 때 실행되는 함수를 반환합니다
  // - return () => { ... } 형태로 cleanup 함수를 정의
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    // 컴포넌트가 언마운트될 때 헤더 다시 표시
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  // 캠페인 정보: 정적 데이터 우선, 없으면 API fallback
  const staticCampaignInfo = campaignId ? getCampaignById(campaignId)?.campaignInfo : undefined;
  const [apiCampaignInfo, setApiCampaignInfo] = useState<CampaignInfo | null>(null);
  const [rawApiCampaign, setRawApiCampaign] = useState<PartnerCampaignApiItem | null>(null);
  const [apiContents, setApiContents] = useState<ContentByTab>({
    waiting: [],
    reviewing: [],
    completed: [],
  });

  useEffect(() => {
    if (!campaignId) return;
    // 캠페인 정보는 항상 API에서 가져오기 (rawApiCampaign 채우기 위해)
    fetchCampaignById(campaignId).then((data) => {
      if (data) {
        setRawApiCampaign(data);
        if (!staticCampaignInfo) {
          setApiCampaignInfo(mapApiToCampaignInfo(data));
        }
      }
    });
    // 콘텐츠는 항상 API에서도 가져오기
    fetchCampaignContents(campaignId).then((items) => {
      if (!items.length) return;
      const waiting: ContentItem[] = [];
      const reviewing: ContentItem[] = [];
      const completed: ContentItem[] = [];
      items.forEach((item) => {
        const base: ContentItem = {
          id: String(item.id),
          createdAt: item.submitted_at ?? new Date().toISOString(),
          status: item.status === "APPROVED" ? "완료" : "검수중",
          userType: "리뷰어",
          nickname: `리뷰어${item.reviewer_id ?? ""}`,
          channelId: String(item.reviewer_id ?? ""),
          channel: "",
        };
        if (item.status === "APPROVED") completed.push(base);
        else if (item.status === "SUBMITTED") reviewing.push(base);
        else waiting.push(base);
      });
      setApiContents({ waiting, reviewing, completed });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const campaignInfo = staticCampaignInfo ?? apiCampaignInfo ?? undefined;

  // 캠페인 상태에 따라 데이터 소스 분기
  const baseContents = (() => {
    if (!campaignId) return { waiting: [], reviewing: [], completed: [] };
    const info = campaignInfo;
    if (info && (String(info.status) === "종료" || String(info.status) === "취소")) {
      const closed = getClosedContentsById(campaignId);
      return closed || { waiting: [], reviewing: [], completed: [] };
    }
    // 정적 loader가 제공된 경우 정적 데이터 우선, 없으면 API 콘텐츠 사용
    if (contentsLoader) {
      const staticContents = contentsLoader(campaignId);
      if (
        staticContents &&
        staticContents.waiting.length +
          staticContents.reviewing.length +
          staticContents.completed.length >
          0
      ) {
        return staticContents;
      }
    }
    return apiContents;
  })();

  // 승인된 콘텐츠를 reviewing에서 completed로 이동
  // 반려된 콘텐츠를 reviewing에서 waiting으로 이동
  // 신고된 콘텐츠를 reviewing/completed에서 waiting으로 이동
  // 📌 상태 변환 로직:
  // - 승인된 콘텐츠는 reviewing에서 제거하고 completed에 추가
  // - 반려된 콘텐츠는 reviewing에서 제거하고 waiting에 추가 (isRejected: true)
  // - 신고된 콘텐츠는 reviewing/completed에서 제거하고 waiting에 추가 (isReported: true)
  // - 사용자가 승인/반려/신고 버튼을 클릭하면 즉시 UI에 반영
  const contents = (() => {
    const reviewing = baseContents.reviewing || [];
    const completed = baseContents.completed || [];
    const waiting = baseContents.waiting || [];

    // 승인된 콘텐츠 필터링
    const approvedItems = reviewing.filter((item) => approvedContentIds.has(item.id));

    // 반려된 콘텐츠 필터링 (isRejected: true로 표시, 반려 사유 포함)
    const rejectedItems = reviewing
      .filter((item) => rejectedContentIds.has(item.id))
      .map((item) => ({
        ...item,
        isRejected: true,
        reject_reason: rejectReasons.get(item.id) || "",
      }));

    // 신고된 콘텐츠 필터링 (reviewing과 completed 모두에서)
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

    // 남은 reviewing 콘텐츠 (승인/반려/신고되지 않은 것들)
    const remainingReviewing = reviewing.filter(
      (item) =>
        !approvedContentIds.has(item.id) &&
        !rejectedContentIds.has(item.id) &&
        !reportedContentIds.has(item.id)
    );

    // 남은 completed 콘텐츠 (신고되지 않은 것들)
    const remainingCompleted = completed.filter((item) => !reportedContentIds.has(item.id));

    return {
      waiting: [...waiting, ...rejectedItems, ...reportedFromReviewing, ...reportedFromCompleted],
      reviewing: remainingReviewing,
      completed: [...remainingCompleted, ...approvedItems],
    };
  })();

  // 탭별 데이터 개수 계산
  const waitingCount = contents.waiting?.length || 0;
  const reviewCount = contents.reviewing?.length || 0;
  const completedCount = contents.completed?.length || 0;

  // ISO → 'YYYY-MM-DD HH:mm' 포맷 변환
  // 📌 문자열 메서드:
  // - slice(0, 16): ISO 문자열의 처음 16자만 가져옵니다 (예: "2025-01-15T10:00")
  // - replace("T", " "): T를 공백으로 변경하여 "2025-01-15 10:00" 형식으로 변환
  const formatDateTime = (iso: string | Date) => String(iso).slice(0, 16).replace("T", " ");

  /**
   * 승인 핸들러: 콘텐츠를 완료 상태로 변경하고 완료 탭으로 이동
   *
   * 📌 함수 설명:
   * - 파트너가 콘텐츠를 승인했을 때 실행되는 함수입니다
   * - 승인된 콘텐츠 ID를 Set에 추가합니다
   * - 완료 탭으로 자동 이동합니다
   * - setActiveTab 함수가 이미 URL을 업데이트하므로 별도로 URL 업데이트할 필요 없습니다
   */
  const handleApprove = (contentId: string) => {
    // 승인된 콘텐츠 ID 추가
    // 📌 Set 자료구조 업데이트:
    // - 이전 Set을 스프레드 연산자로 배열로 변환하고 새 ID를 추가한 후 다시 Set으로 변환
    setApprovedContentIds((prev) => new Set([...prev, contentId]));

    // 완료 탭으로 이동 (setActiveTab이 URL도 함께 업데이트합니다)
    setActiveTab("완료");

    // mock DB의 campaign_contents 상태도 APPROVED로 업데이트 (실패해도 UI는 유지)
    const numericId = parseInt(String(contentId).replace(/\D/g, ""), 10);
    if (!Number.isNaN(numericId)) {
      try {
        void patchCampaignContent(numericId, { status: "APPROVED" });
      } catch {
        // ignore mock API error
      }
    }
  };

  /**
   * 반려 핸들러: 콘텐츠를 대기 상태로 변경하고 대기 탭으로 이동
   *
   * 📌 함수 설명:
   * - 파트너가 콘텐츠를 반려했을 때 실행되는 함수입니다
   * - 반려된 콘텐츠 ID를 Set에 추가합니다
   * - 대기 탭으로 자동 이동합니다
   * - 반려 사유는 콘텐츠 객체에 저장됩니다 (필요시)
   */
  const handleReject = useCallback(
    (contentId: string, rejectReason?: string) => {
      // 반려된 콘텐츠 ID 추가
      // 📌 Set 자료구조 업데이트:
      // - 이전 Set을 스프레드 연산자로 배열로 변환하고 새 ID를 추가한 후 다시 Set으로 변환
      setRejectedContentIds((prev) => new Set([...prev, contentId]));

      // 반려 사유 저장
      // 📌 Map 자료구조 업데이트:
      // - 이전 Map을 스프레드 연산자로 복사하고 새 항목을 추가
      if (rejectReason) {
        setRejectReasons((prev) => {
          const newMap = new Map(prev);
          newMap.set(contentId, rejectReason);
          return newMap;
        });
      }

      // 대기 탭으로 이동 (setActiveTab이 URL도 함께 업데이트합니다)
      setActiveTab("대기");

      // mock DB의 campaign_contents 상태도 REJECTED로 업데이트 (실패해도 UI는 유지)
      const numericId = parseInt(String(contentId).replace(/\D/g, ""), 10);
      if (!Number.isNaN(numericId)) {
        try {
          void patchCampaignContent(numericId, {
            status: "REJECTED",
            admin_comment: rejectReason ?? null,
          });
        } catch {
          // ignore mock API error
        }
      }
    },
    [setActiveTab]
  );

  /**
   * 신고 핸들러: 콘텐츠를 대기 상태로 변경하고 대기 탭으로 이동
   *
   * 📌 함수 설명:
   * - 파트너가 콘텐츠를 신고했을 때 실행되는 함수입니다
   * - 신고된 콘텐츠 ID를 Set에 추가합니다
   * - 신고 날짜/시간을 저장합니다
   * - 대기 탭으로 자동 이동합니다
   */
  const handleReport = useCallback(
    (contentId: string) => {
      // 신고된 콘텐츠 ID 추가
      // 📌 Set 자료구조 업데이트:
      // - 이전 Set을 스프레드 연산자로 배열로 변환하고 새 ID를 추가한 후 다시 Set으로 변환
      setReportedContentIds((prev) => new Set([...prev, contentId]));

      // 신고 날짜/시간 저장 (현재 날짜/시간)
      // 📌 Map 자료구조 업데이트:
      // - 이전 Map을 스프레드 연산자로 복사하고 새 항목을 추가
      // - 날짜/시간 형식: "YYYY-MM-DD HH:mm" (로컬 시간 사용)
      // 📌 주의: toISOString()은 UTC 시간을 반환하므로 로컬 시간을 직접 포맷팅합니다
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
      setReportedDates((prev) => {
        const newMap = new Map(prev);
        newMap.set(contentId, formattedDate);
        return newMap;
      });

      // 대기 탭으로 이동 (setActiveTab이 URL도 함께 업데이트합니다)
      setActiveTab("대기");

      // mock DB의 campaign_contents 상태도 REPORTED로 업데이트 (실패해도 UI는 유지)
      const numericId = parseInt(String(contentId).replace(/\D/g, ""), 10);
      if (!Number.isNaN(numericId)) {
        try {
          void patchCampaignContent(numericId, { status: "REPORTED" });
        } catch {
          // ignore mock API error
        }
      }
    },
    [setActiveTab]
  );

  // 📌 객체 반환:
  // - 모든 상태와 핸들러 함수를 객체로 묶어서 반환합니다
  // - 구조분해할당으로 필요한 것만 가져와서 사용할 수 있습니다
  return {
    campaignInfo,
    rawApiCampaign,
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
    formatDateTime,
  };
}
