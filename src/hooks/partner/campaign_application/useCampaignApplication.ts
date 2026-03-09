/* ========================================
   캠페인 신청내역 페이지 공통 로직 훅
   ======================================== */

/**
 * useCampaignApplication
 *
 * 목적: 캠페인 신청내역 페이지 공통 상태 관리 및 핸들러 로직
 *
 * 사용 페이지:
 * - /partner/campaign_application (캠페인 신청내역 페이지)
 */

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  getCampaignById,
  updateCampaignApplicants,
  type CampaignWithApplicants,
  type AllApplicant,
} from "@/data/partner/sharedCampaigns";
import { patchCampaign } from "@/lib/api/partner";

/**
 * 유저 신청 내역 상태 업데이트 헬퍼 함수
 *
 * 📌 기능:
 * - localStorage의 user_applied_campaigns에서 해당 유저의 신청 내역을 찾아서 상태를 업데이트합니다
 * - 파트너가 선정/취소할 때 유저의 캠페인 관리 페이지에서 탭 이동이 일어나도록 합니다
 *
 * @param userId - 신청자(유저) ID
 * @param campaignId - 캠페인 ID
 * @param newStatus - 새로운 상태 ("대기" | "선정" | "탈락")
 */
function updateUserAppliedCampaignStatus(
  userId: string,
  campaignId: string,
  newStatus: "대기" | "선정" | "탈락"
): void {
  if (typeof window === "undefined") return;

  try {
    // localStorage에서 user_applied_campaigns 가져오기
    const userAppliedCampaigns = localStorage.getItem("user_applied_campaigns");
    if (!userAppliedCampaigns) {
      return;
    }

    const appliedCampaigns = JSON.parse(userAppliedCampaigns);
    if (!Array.isArray(appliedCampaigns)) {
      return;
    }

    // 해당 유저의 신청 내역 찾기
    const userCampaigns = appliedCampaigns.find(
      (uc: {
        userId: string;
        campaigns?: { campaignId: string | number; [key: string]: unknown }[];
      }) => uc.userId === userId
    );
    if (!userCampaigns || !userCampaigns.campaigns) {
      return;
    }

    // 해당 캠페인 찾기 (다양한 ID 형식 지원)
    const campaignIndex = userCampaigns.campaigns.findIndex(
      (c: { campaignId: string | number; [key: string]: unknown }) => {
        const storedCampaignId = String(c.campaignId);
        const searchCampaignId = String(campaignId);

        // 정확히 일치하는 경우
        if (storedCampaignId === searchCampaignId) return true;

        // ID 형식 변환 시도 (prefix 제거/추가)
        const prefixes = ["delivery_", "visit_", "review_", "reporter_", "mission_"];
        for (const prefix of prefixes) {
          // searchCampaignId가 prefix를 포함하는 경우
          if (searchCampaignId.startsWith(prefix)) {
            const idWithoutPrefix = searchCampaignId.replace(new RegExp(`^${prefix}`), "");
            if (storedCampaignId === idWithoutPrefix) return true;
          }
          // storedCampaignId가 prefix를 포함하는 경우
          if (storedCampaignId.startsWith(prefix)) {
            const idWithoutPrefix = storedCampaignId.replace(new RegExp(`^${prefix}`), "");
            if (idWithoutPrefix === searchCampaignId) return true;
          }
        }

        return false;
      }
    );

    if (campaignIndex === -1) {
      return;
    }

    // 상태 업데이트
    const _oldStatus = userCampaigns.campaigns[campaignIndex].status;
    userCampaigns.campaigns[campaignIndex].status = newStatus;

    // localStorage에 다시 저장
    localStorage.setItem("user_applied_campaigns", JSON.stringify(appliedCampaigns));

    // storage 이벤트 트리거 (다른 탭에서 변경사항 감지)
    window.dispatchEvent(new Event("storage"));
  } catch (_error) {}
}

/**
 * 유저 알림 추가 헬퍼 함수
 *
 * 📌 기능:
 * - localStorage의 notifications에 새로운 알림을 추가합니다
 * - 파트너가 유저를 선정했을 때 알림을 생성합니다
 *
 * @param userId - 알림을 받을 유저 ID
 * @param campaignId - 캠페인 ID
 * @param campaignTitle - 캠페인 제목
 * @param campaignType - 캠페인 타입 ('delivery' | 'visit' | 'review' | 'mission' | 'reporter')
 * @param type - 알림 타입 ('선정' | '탈락' | '제출' | '승인' 등)
 */
function addUserNotification(
  userId: string,
  campaignId: string,
  campaignTitle: string,
  campaignType: string,
  type: "선정" | "탈락" | "제출" | "승인"
): void {
  if (typeof window === "undefined") return;

  try {
    // localStorage에서 기존 알림 가져오기
    const storedNotifications = localStorage.getItem("notifications");
    const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];

    // 새로운 알림 ID 생성 (기존 알림 중 가장 큰 ID + 1)
    const maxId = notifications.reduce((max: number, notif: { id?: number }) => {
      return Math.max(max, notif.id || 0);
    }, 0);
    const newId = maxId + 1;

    // 알림 메시지 생성
    let message = "";
    switch (type) {
      case "선정":
        message = `축하합니다! [${campaignTitle}] 캠페인에 선정되셨습니다.`;
        break;
      case "탈락":
        message = `[${campaignTitle}] 캠페인에서 선정이 취소되었습니다.`;
        break;
      case "제출":
        message = `[${campaignTitle}] 캠페인의 콘텐츠를 제출해주세요.`;
        break;
      case "승인":
        message = `[${campaignTitle}] 캠페인의 콘텐츠가 승인되었습니다.`;
        break;
    }

    // 새로운 알림 생성
    const newNotification = {
      id: newId,
      user_id: userId,
      type:
        type === "선정"
          ? "campaign_selected"
          : type === "탈락"
            ? "campaign_rejected"
            : "campaign_update",
      campaign_id: campaignId,
      campaign_title: campaignTitle,
      campaign_type: campaignType,
      message: message,
      created_at: new Date().toISOString(),
      is_read: false,
    };

    // 알림 배열에 추가 (최신 알림이 맨 앞에 오도록)
    notifications.unshift(newNotification);

    // localStorage에 저장
    localStorage.setItem("notifications", JSON.stringify(notifications));

    // storage 이벤트 트리거 (다른 탭에서 변경사항 감지)
    window.dispatchEvent(new Event("storage"));
  } catch (_error) {}
}

/**
 * 정렬 옵션 타입 정의
 * - latest: 최신순
 * - registered: 등록순
 * - recommended: 추천순
 */
export type SortOption = "latest" | "registered" | "recommended";

/**
 * 탭 타입 정의
 * - applicants: 신청 탭
 * - selected: 선정 탭
 */
export type TabType = "applicants" | "selected";

/**
 * 커스텀 훅의 반환값 타입 정의
 */
export interface UseCampaignApplicationReturn {
  // 캠페인 데이터 관련
  campaignData: CampaignWithApplicants | null;
  isLoading: boolean;
  error: string | null;

  // 탭 관련
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // 정렬 관련
  sortOrder: SortOption;
  setSortOrder: (order: SortOption) => void;
  sortOptions: Array<{ value: SortOption; label: string }>;

  // 신청자 데이터 관련
  applicantsState: AllApplicant[];
  selectedState: AllApplicant[];
  applicantsCount: number;
  selectedCount: number;
  currentApplicants: AllApplicant[];

  // 모달 관련
  is_modal_open: boolean;
  setIsModalOpen: (open: boolean) => void;
  is_already_selected_modal_open: boolean;
  setIsAlreadySelectedModalOpen: (open: boolean) => void;

  // 핸들러 함수들
  handleSelectApplicant: (applicantId: string) => void;
  handleCancelApplicant: (applicantId: string) => void;
  handle_close_modal: () => void;
  handle_close_already_selected_modal: () => void;
}

/**
 * 캠페인 신청내역 페이지 공통 로직 커스텀 훅
 *
 * @returns UseCampaignApplicationReturn - 모든 상태와 핸들러 함수들
 *
 * 📌 사용 예시:
 * ```tsx
 * const {
 *   campaignData,
 *   isLoading,
 *   activeTab,
 *   currentApplicants,
 *   handleSelectApplicant,
 * } = useCampaignApplication();
 * ```
 */
export function useCampaignApplication(): UseCampaignApplicationReturn {
  // URL 파라미터에서 캠페인 ID 가져오기
  // 📌 Next.js 훅 사용:
  // - useParams(): URL의 동적 파라미터를 가져옵니다 (예: /campaign/[id]에서 id 값)
  // - useSearchParams(): URL의 쿼리 파라미터를 가져옵니다 (예: ?tab=selected)
  const params = useParams();
  const searchParams = useSearchParams();
  const campaignId = params.id as string;

  // 캠페인 데이터 상태 관리
  // 📌 React 상태 관리:
  // - useState: 컴포넌트의 상태를 관리하는 React 훅
  // - 제네릭 타입으로 상태의 타입을 명시하여 타입 안정성 확보
  const [campaignData, setCampaignData] = useState<CampaignWithApplicants | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 탭 상태 관리
  // 📌 초기값을 함수로 설정:
  // - useState(() => ...) 형태로 초기값을 함수로 전달하면 컴포넌트 마운트 시 한 번만 실행됩니다
  // - URL 쿼리 파라미터에서 tab=selected가 있으면 선정 탭으로 초기화
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tabParam = searchParams.get("tab");
    return tabParam === "selected" ? "selected" : "applicants";
  });

  // 정렬 상태 관리
  const [sortOrder, setSortOrder] = useState<SortOption>("latest");

  // 화면 내 로컬 상태: 신청/선정 리스트를 상태로 관리하여 카드 이동 처리
  // 📌 상태 분리 이유:
  // - 신청자 목록과 선정자 목록을 별도로 관리하여 탭 전환 시 빠르게 표시
  // - 선정/취소 시 즉시 UI에 반영
  const [applicantsState, setApplicantsState] = useState<AllApplicant[]>([]);
  const [selectedState, setSelectedState] = useState<AllApplicant[]>([]);

  // 모달 상태 관리
  const [is_modal_open, setIsModalOpen] = useState(false);
  const [is_already_selected_modal_open, setIsAlreadySelectedModalOpen] = useState(false);

  // 정렬 옵션 정의
  // 📌 상수 배열:
  // - 컴포넌트 외부에서 정의하면 매 렌더링마다 재생성되지 않아 성능에 유리합니다
  // - 하지만 훅 내부에서 정의해도 문제없으며, 가독성을 위해 여기에 배치했습니다
  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: "latest", label: "최신순" },
    { value: "registered", label: "등록순" },
    { value: "recommended", label: "추천순" },
  ];

  /**
   * 캠페인 데이터 로딩
   *
   * 📌 useEffect 훅:
   * - 컴포넌트가 마운트되거나 의존성 배열의 값이 변경될 때 실행됩니다
   * - [campaignId]: campaignId가 변경되면 데이터를 다시 로드합니다
   */
  useEffect(() => {
    const loadCampaignData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // URL 파라미터로 받은 캠페인 ID로 데이터 조회
        const data = getCampaignById(campaignId);

        if (!data) {
          setError(`캠페인을 찾을 수 없습니다. (ID: ${campaignId})`);
          return;
        }

        setCampaignData(data);

        // 캠페인 데이터가 로드되면 신청자 상태도 초기화
        setApplicantsState(data.applicantData.applicants);
        setSelectedState(data.applicantData.selectedApplicants);
      } catch (_err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        // 📌 finally 블록:
        // - try나 catch 블록 실행 후 무조건 실행됩니다
        // - 성공/실패 여부와 관계없이 로딩 상태를 false로 변경
        setIsLoading(false);
      }
    };

    if (campaignId) {
      loadCampaignData();
    }
  }, [campaignId]);

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

  /**
   * 신청자 데이터 변경 시 localStorage에 저장
   *
   * 📌 useEffect를 사용하여 상태 변경 감지:
   * - applicantsState나 selectedState가 변경될 때마다 실행됩니다
   * - 파트너에서 선정/취소 시 localStorage에 저장하여 관리자 페이지에서도 볼 수 있도록 합니다
   * - 초기 로딩 시에는 저장하지 않도록 campaignData가 있을 때만 저장합니다
   */
  useEffect(() => {
    // 캠페인 데이터가 없거나 로딩 중이면 저장하지 않음
    if (!campaignData || isLoading) return;

    // localStorage에 저장
    const success = updateCampaignApplicants(
      campaignData.campaignInfo.id,
      campaignData.campaignInfo.campaignType,
      applicantsState,
      selectedState
    );

    if (success) {
    }
  }, [applicantsState, selectedState, campaignData, isLoading]);

  // 탭별 데이터 개수 계산
  const applicantsCount = applicantsState.length;
  const selectedCount = selectedState.length;

  /**
   * 현재 활성화된 탭에 따라 표시할 데이터 결정
   *
   * 📌 함수형 프로그래밍:
   * - switch 문을 사용하여 탭에 따라 다른 데이터를 반환합니다
   * - 명시적이고 읽기 쉬운 코드
   */
  const getCurrentApplicants = (): AllApplicant[] => {
    switch (activeTab) {
      case "applicants":
        return applicantsState;
      case "selected":
        return selectedState;
      default:
        return applicantsState;
    }
  };

  const currentApplicants = getCurrentApplicants();

  /**
   * 선정하기 버튼 클릭 핸들러
   *
   * 📌 함수 설명:
   * - 파트너가 신청자 카드에서 "선정하기" 버튼을 클릭했을 때 실행되는 함수입니다
   * - 모집 인원을 초과하지 않는지 먼저 체크합니다
   * - 인원 초과 시 모달을 표시하고 선정을 중단합니다
   * - 인원이 충분하면 신청자를 선정 리스트로 이동시킵니다
   * - user_applied_campaigns의 상태도 '대기' -> '선정'으로 업데이트합니다
   */
  const handleSelectApplicant = (applicantId: string) => {
    // 모집 인원 초과 체크
    if (!campaignData) return;

    const recruitment_limit = campaignData.campaignInfo.totalCount;
    const current_selected_count = selectedState.length;
    const will_exceed_limit = current_selected_count + 1 > recruitment_limit;

    // 모집 인원 초과 시 모달 표시하고 함수 종료
    if (will_exceed_limit) {
      setIsModalOpen(true);
      return;
    }

    // 📌 현재 탭이 "선정" 탭인 경우, 이미 선정된 리뷰어를 다시 선택하려는 것
    // - 선정 탭에서는 이미 선정된 리뷰어만 보이므로, 여기서 선정하기를 누르면 중복 선택 시도
    if (activeTab === "selected") {
      const isAlreadySelected = selectedState.some((a) => a.id === applicantId);
      if (isAlreadySelected) {
        // 이미 선택된 리뷰어인 경우 모달 표시
        setIsAlreadySelectedModalOpen(true);
        return;
      }
    }

    // state setter 밖에서 target 찾기
    const target = applicantsState.find((a) => a.id === applicantId);
    if (!target) return;

    const moved: AllApplicant = { ...target, selectionStatus: "선정하기" } as AllApplicant;
    const nextSelectedCount = current_selected_count + 1;

    // 상태 업데이트
    setApplicantsState((prev) => prev.filter((a) => a.id !== applicantId));
    setSelectedState((prev) => (prev.some((a) => a.id === applicantId) ? prev : [moved, ...prev]));

    // localStorage 동기화
    updateUserAppliedCampaignStatus(applicantId, campaignData.campaignInfo.id, "선정");
    addUserNotification(
      applicantId,
      campaignData.campaignInfo.id,
      campaignData.campaignInfo.title,
      campaignData.campaignInfo.campaignType,
      "선정"
    );

    // mock API 선정 카운트 업데이트 (state setter 밖, 서버 응답 확인)
    patchCampaign(campaignData.campaignInfo.id, { selectedCount: nextSelectedCount }).catch(
      (_err) => console.warn("선정 API 업데이트 실패:", _err)
    );
  };

  /**
   * 모달 닫기 핸들러
   */
  const handle_close_modal = () => {
    setIsModalOpen(false);
  };

  const handle_close_already_selected_modal = () => {
    setIsAlreadySelectedModalOpen(false);
  };

  /**
   * 선택 취소 버튼 클릭 핸들러
   *
   * 📌 선정 취소 로직:
   * - 선정 목록에서 신청자를 찾아 제거
   * - selectionStatus를 "미선택"으로 변경
   * - 신청 목록에 다시 추가
   * - user_applied_campaigns의 상태도 '선정' -> '대기'로 업데이트합니다
   */
  const handleCancelApplicant = (applicantId: string) => {
    if (!campaignData) return;

    // state setter 밖에서 target 찾기
    const target = selectedState.find((a) => a.id === applicantId);
    if (!target) return;

    const moved: AllApplicant = { ...target, selectionStatus: "미선택" } as AllApplicant;
    const nextSelectedCount = Math.max(0, selectedState.length - 1);

    // 상태 업데이트
    setSelectedState((prev) => prev.filter((a) => a.id !== applicantId));
    setApplicantsState((prev) =>
      prev.some((a) => a.id === applicantId) ? prev : [moved, ...prev]
    );

    // localStorage 동기화
    updateUserAppliedCampaignStatus(applicantId, campaignData.campaignInfo.id, "대기");
    addUserNotification(
      applicantId,
      campaignData.campaignInfo.id,
      campaignData.campaignInfo.title,
      campaignData.campaignInfo.campaignType,
      "탈락"
    );

    // mock API 선정 취소 카운트 업데이트 (state setter 밖, 서버 응답 확인)
    patchCampaign(campaignData.campaignInfo.id, { selectedCount: nextSelectedCount }).catch(
      (_err) => console.warn("선정 취소 API 업데이트 실패:", _err)
    );
  };

  // 📌 객체 반환:
  // - 모든 상태와 핸들러 함수를 객체로 묶어서 반환합니다
  // - 구조분해할당으로 필요한 것만 가져와서 사용할 수 있습니다
  return {
    campaignData,
    isLoading,
    error,
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
