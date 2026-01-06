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

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  getCampaignById,
  getClosedContentsById,
  type ContentByTab,
} from "@/data/partner/sharedCampaigns";

/**
 * 탭 타입 정의
 * - 대기: 콘텐츠 미등록 상태
 * - 확인: 검수 중인 콘텐츠
 * - 완료: 완료된 콘텐츠
 */
export type TabKey = "대기" | "확인" | "완료";

/**
 * 정렬 옵션 타입 정의
 */
export type SortOption = "latest" | "popular" | "deadline" | "point";

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
  campaignInfo: ReturnType<typeof getCampaignById>["campaignInfo"] | undefined;

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

  // 유틸리티 함수
  formatDateTime: (iso: string) => string;
}

/**
 * 캠페인 콘텐츠 내역 페이지 공통 로직 커스텀 훅
 *
 * @param contentsLoader - 캠페인 유형별 콘텐츠 로더 함수
 * @returns UseCampaignContentsReturn - 모든 상태와 핸들러 함수들
 *
 * 📌 사용 예시:
 * ```tsx
 * const {
 *   campaignInfo,
 *   activeTab,
 *   contents,
 *   handleApprove,
 * } = useCampaignContents(getDeliveryContentsById);
 * ```
 */
export function useCampaignContents(
  contentsLoader: ContentsLoader
): UseCampaignContentsReturn {
  // URL 파라미터에서 캠페인 ID 가져오기
  // 📌 Next.js 훅 사용:
  // - useParams(): URL의 동적 파라미터를 가져옵니다 (예: /campaign/[id]에서 id 값)
  // - useSearchParams(): URL의 쿼리 파라미터를 가져옵니다 (예: ?tab=완료)
  const params = useParams();
  const searchParams = useSearchParams();
  const campaignId = params.id as string;

  // 탭 상태 관리
  // 📌 초기값을 함수로 설정:
  // - useState(() => ...) 형태로 초기값을 함수로 전달하면 컴포넌트 마운트 시 한 번만 실행됩니다
  // - URL 쿼리 파라미터에서 tab 값을 확인하여 초기 탭 설정
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam === "완료") return "완료";
    if (tabParam === "확인") return "확인";
    return "대기";
  });

  // 정렬 상태 관리
  const [sortOrder, setSortOrder] = useState<SortOption>("latest");

  // 승인된 콘텐츠 ID 목록 (로컬 상태 관리)
  // 📌 Set 자료구조 사용:
  // - 중복을 자동으로 제거하는 자료구조
  // - has(), add() 메서드로 빠른 조회 및 추가 가능
  const [approvedContentIds, setApprovedContentIds] = useState<Set<string>>(
    new Set()
  );

  // 정렬 옵션 정의
  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: "latest", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "deadline", label: "마감임박순" },
    { value: "point", label: "포인트순" },
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

  // 캠페인 정보 가져오기
  const campaignInfo = campaignId
    ? getCampaignById(campaignId)?.campaignInfo
    : undefined;

  // 캠페인 상태에 따라 데이터 소스 분기
  // 📌 즉시 실행 함수(IIFE) 패턴:
  // - (() => { ... })() 형태로 함수를 정의하고 즉시 실행
  // - 변수 스코프를 제한하여 코드를 깔끔하게 유지
  const baseContents = (() => {
    if (!campaignId) return { waiting: [], reviewing: [], completed: [] };
    const info = campaignInfo;
    if (
      info &&
      (String(info.status) === "종료" || String(info.status) === "취소")
    ) {
      // 종료/취소된 캠페인은 closed 데이터 사용
      const closed = getClosedContentsById(campaignId);
      return closed || { waiting: [], reviewing: [], completed: [] };
    }
    // 일반 상태는 각 캠페인 유형별 로더 함수 사용
    const contents = contentsLoader(campaignId);
    return contents || { waiting: [], reviewing: [], completed: [] };
  })();

  // 승인된 콘텐츠를 reviewing에서 completed로 이동
  // 📌 상태 변환 로직:
  // - 승인된 콘텐츠는 reviewing에서 제거하고 completed에 추가
  // - 사용자가 승인 버튼을 클릭하면 즉시 UI에 반영
  const contents = (() => {
    const reviewing = baseContents.reviewing || [];
    const completed = baseContents.completed || [];

    // 승인된 콘텐츠 필터링
    const approvedItems = reviewing.filter((item) =>
      approvedContentIds.has(item.id)
    );
    const remainingReviewing = reviewing.filter(
      (item) => !approvedContentIds.has(item.id)
    );

    return {
      waiting: baseContents.waiting || [],
      reviewing: remainingReviewing,
      completed: [...(baseContents.completed || []), ...approvedItems],
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
  const formatDateTime = (iso: string) => iso.slice(0, 16).replace("T", " ");

  /**
   * 승인 핸들러: 콘텐츠를 완료 상태로 변경하고 완료 탭으로 이동
   *
   * 📌 함수 설명:
   * - 파트너가 콘텐츠를 승인했을 때 실행되는 함수입니다
   * - 승인된 콘텐츠 ID를 Set에 추가합니다
   * - 완료 탭으로 자동 이동합니다
   * - URL 쿼리 파라미터도 업데이트합니다
   */
  const handleApprove = (contentId: string) => {
    // 승인된 콘텐츠 ID 추가
    // 📌 Set 자료구조 업데이트:
    // - 이전 Set을 스프레드 연산자로 배열로 변환하고 새 ID를 추가한 후 다시 Set으로 변환
    setApprovedContentIds((prev) => new Set([...prev, contentId]));

    // 완료 탭으로 이동
    setActiveTab("완료");

    // URL 쿼리 파라미터도 업데이트 (선택적)
    // 📌 브라우저 API 사용:
    // - window.location.href: 현재 페이지의 전체 URL
    // - URL 객체: URL을 파싱하고 조작할 수 있는 브라우저 API
    // - window.history.pushState(): URL을 변경하되 페이지 새로고침 없이 히스토리만 업데이트
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", "완료");
      window.history.pushState({}, "", url.toString());
    }
  };

  // 📌 객체 반환:
  // - 모든 상태와 핸들러 함수를 객체로 묶어서 반환합니다
  // - 구조분해할당으로 필요한 것만 가져와서 사용할 수 있습니다
  return {
    campaignInfo,
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
    formatDateTime,
  };
}

