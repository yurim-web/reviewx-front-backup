/* ========================================
   🎣 캠페인 신청내역 페이지 공통 로직 훅
   ======================================== */

/**
 * 캠페인 신청내역 페이지에서 공통으로 사용되는 로직을 추출한 커스텀 훅
 *
 * 📌 커스텀 훅이란?
 * - React의 기본 훅들(useState, useEffect 등)을 조합하여 만든 재사용 가능한 로직 묶음
 * - 여러 컴포넌트에서 동일한 로직을 사용할 때 중복을 제거하고 유지보수를 쉽게 합니다
 *
 * 주요 기능:
 * - 캠페인 데이터 로딩 및 상태 관리
 * - 신청자/선정자 상태 관리
 * - 선정하기/선택 취소 핸들러
 * - 모달 상태 관리
 * - 정렬 옵션 관리
 *
 * 📌 파일 위치:
 * - src/hooks/partner/campaign_application/useCampaignApplication.ts
 * - 캠페인 신청내역 페이지 전용 훅이므로 campaign_application 폴더에 위치
 */

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  getCampaignById,
  type CampaignWithApplicants,
  type AllApplicant,
} from "@/data/partner/sharedCampaigns";

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
  const [campaignData, setCampaignData] =
    useState<CampaignWithApplicants | null>(null);
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
  const [is_already_selected_modal_open, setIsAlreadySelectedModalOpen] =
    useState(false);

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
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        console.error("캠페인 데이터 로딩 오류:", err);
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
   */
  const handleSelectApplicant = (applicantId: string) => {
    console.log("선정하기:", applicantId);

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

    // 신청 목록에서 해당 신청자 찾기
    // 📌 React 상태 업데이트 패턴:
    // - setState의 콜백 함수를 사용하여 이전 상태를 기반으로 업데이트
    // - 함수형 업데이트: (prevState) => newState 형태
    setApplicantsState((prevApplicants) => {
      const target = prevApplicants.find((a) => a.id === applicantId);
      if (!target) {
        console.log(
          "신청 목록에서 해당 신청자를 찾을 수 없습니다:",
          applicantId
        );
        return prevApplicants;
      }

      // 신청 리스트에서 제거
      // 📌 배열 메서드 filter():
      // - 조건에 맞는 요소만 추출하여 새 배열을 만듭니다
      // - 원본 배열을 변경하지 않고 새 배열을 반환 (불변성 유지)
      const nextApplicants = prevApplicants.filter((a) => a.id !== applicantId);

      // 상태값 업데이트: selectionStatus를 "선정하기"로 변경하여 선정 리스트로 이동
      // 📌 객체 스프레드 연산자:
      // - ...target: 기존 신청자 데이터의 모든 속성을 복사합니다
      // - selectionStatus: "선정하기"로 변경하여 선정된 상태로 표시합니다
      const moved: AllApplicant = {
        ...target,
        selectionStatus: "선정하기",
      } as AllApplicant;

      // 선정 리스트에 추가 (별도로 처리)
      // 📌 신청 탭에서 선정하기를 누른 경우:
      // - 이미 위에서 선정 탭 체크를 했으므로, 여기서는 중복 체크 불필요
      // - 신청 목록에서 제거된 신청자를 선정 리스트에 추가
      setSelectedState((prevSelected) => {
        // 📌 배열 스프레드 연산자:
        // - [moved, ...prevSelected]: 선정된 신청자를 맨 앞에 추가하고, 기존 선정 리스트를 뒤에 붙입니다
        return [moved, ...prevSelected];
      });

      return nextApplicants;
    });
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
   */
  const handleCancelApplicant = (applicantId: string) => {
    console.log("선택 취소:", applicantId);

    // 선정 목록에서 해당 신청자 찾기
    setSelectedState((prevSelected) => {
      const target = prevSelected.find((a) => a.id === applicantId);
      if (!target) {
        console.log(
          "선정 목록에서 해당 신청자를 찾을 수 없습니다:",
          applicantId
        );
        return prevSelected;
      }

      // 선정 리스트에서 제거
      const nextSelected = prevSelected.filter((a) => a.id !== applicantId);

      // 상태값 업데이트: selectionStatus를 "미선택"으로 변경하여 신청 리스트로 이동
      const moved: AllApplicant = {
        ...target,
        selectionStatus: "미선택",
      } as AllApplicant;

      // 신청 리스트에 추가 (별도로 처리)
      setApplicantsState((prevApplicants) => {
        // 이미 신청 리스트에 있는지 확인
        const isAlreadyInApplicants = prevApplicants.some(
          (a) => a.id === applicantId
        );
        if (isAlreadyInApplicants) {
          console.log("이미 신청 리스트에 있는 신청자입니다:", applicantId);
          return prevApplicants;
        }
        return [moved, ...prevApplicants];
      });

      return nextSelected;
    });
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
