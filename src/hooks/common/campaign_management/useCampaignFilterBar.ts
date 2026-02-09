/* ========================================
   🪝 useCampaignFilterBar 커스텀 훅 (공통)
   ======================================== */

/**
 * 모듈 목적
 *
 * - 캠페인 필터 바의 상태 및 로직 관리
 * - 필터링, 정렬, 검색 기능 제공
 *
 * 📍 사용 컴포넌트:
 * - src/components/common/campaign_management/CampaignFilterBar.tsx
 *   (캠페인 필터 바 컴포넌트에서 필터링 로직 관리)
 *
 * 📌 공통 훅 위치:
 * - src/hooks/common/campaign_management/useCampaignFilterBar.ts
 *   (user와 partner 캠페인 관리 페이지에서 공통으로 사용하는 훅)
 */

// ========================================
// 📦 Import
// ========================================
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  filterCampaigns,
  getItemKey,
} from "@/components/common/campaign_management/utils/campaign_filter_helpers";
import type {
  ActiveFilters,
  CampaignFilterBarProps,
  FilterableCampaign,
  FilterChangeParams,
} from "@/components/common/campaign_management/types";

// ========================================
// 📝 타입 정의
// ========================================

// 훅의 입력 파라미터 타입
interface UseCampaignFilterBarParams<
  T extends FilterableCampaign = FilterableCampaign
> {
  campaigns: T[]; // 필터링할 캠페인 목록
  onFilterChange?: (filters: FilterChangeParams) => void; // 필터 변경 콜백
  onFilteredCampaignsChange: (filteredCampaigns: T[]) => void; // 필터링된 캠페인 변경 콜백
  activeFilters?: ActiveFilters; // 초기 필터 값
  defaultSort: string; // 기본 정렬 방식
}

// 훅의 반환값 타입
export interface UseCampaignFilterBarReturn {
  state: {
    isTypeModalOpen: boolean; // 타입 필터 모달 열림 상태
    isChannelModalOpen: boolean; // 채널 필터 모달 열림 상태
    isSortModalOpen: boolean; // 정렬 모달 열림 상태
    tempTypes: string[]; // 모달에서 임시로 선택한 타입들
    tempChannels: string[]; // 모달에서 임시로 선택한 채널들
    tempSort: string; // 모달에서 임시로 선택한 정렬
    selectedSort: string; // 현재 적용된 정렬 방식
    searchQuery: string; // 검색어
    currentFilters: {
      types?: string[];
      channels?: string[];
      searchQuery?: string;
      sortBy?: string;
    };
  };
  actions: {
    openTypeModal: () => void; // 타입 필터 모달 열기
    openChannelModal: () => void; // 채널 필터 모달 열기
    openSortModal: () => void; // 정렬 모달 열기
    closeTypeModal: () => void; // 타입 필터 모달 닫기
    closeChannelModal: () => void; // 채널 필터 모달 닫기
    closeSortModal: () => void; // 정렬 모달 닫기
    handleTypeToggle: (
      option: string | { value: string; label: string }
    ) => void; // 타입 선택/해제 토글
    handleChannelToggle: (
      option: string | { value: string; label: string }
    ) => void; // 채널 선택/해제 토글
    handleTypeApply: () => void; // 타입 필터 적용
    handleChannelApply: () => void; // 채널 필터 적용
    handleTypeReset: () => void; // 타입 필터 초기화
    handleChannelReset: () => void; // 채널 필터 초기화
    handleSortToggle: (
      option: string | { value: string; label: string }
    ) => void; // 정렬 옵션 선택
    handleSortReset: () => void; // 정렬 초기화
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 검색어 변경
    handleTypeRemove: (type: string) => void; // 선택된 타입 제거
    handleChannelRemove: (channel: string) => void; // 선택된 채널 제거
  };
}

// ========================================
// 🪝 훅 함수
// ========================================
export function useCampaignFilterBar<
  T extends FilterableCampaign = FilterableCampaign
>({
  campaigns,
  onFilterChange,
  onFilteredCampaignsChange,
  activeFilters = {},
  defaultSort,
}: UseCampaignFilterBarParams<T>): UseCampaignFilterBarReturn {
  // ========================================
  // 📊 상태 관리 (useState)
  // ========================================

  // 모달 열림/닫힘 상태
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  // 모달에서 임시로 선택한 값들 (적용 전)
  const [tempTypes, setTempTypes] = useState<string[]>([]);
  const [tempChannels, setTempChannels] = useState<string[]>([]);
  const [tempSort, setTempSort] = useState<string>(defaultSort);

  // activeFilters가 있는지 확인 (외부에서 필터 상태를 제어하는 경우)
  const hasActiveFilters = 
    activeFilters.types?.length ||
    activeFilters.channels?.length ||
    activeFilters.searchQuery ||
    activeFilters.sortBy;

  // 현재 적용된 값들 (activeFilters 우선 사용, 없으면 기본값)
  const [selectedSort, setSelectedSort] = useState<string>(() => {
    return activeFilters.sortBy || defaultSort;
  });
  
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    return activeFilters.searchQuery || "";
  });

  // 내부 필터 상태 (activeFilters와 병합하여 사용) - 새로고침 시 초기화됨
  const [internalFilters, setInternalFilters] = useState<FilterChangeParams>(() => {
    // activeFilters가 있으면 그것을 사용 (외부에서 제어하는 경우)
    if (hasActiveFilters) {
      return {
        types: activeFilters.types,
        channels: activeFilters.channels,
        searchQuery: activeFilters.searchQuery,
        sortBy: activeFilters.sortBy || defaultSort,
      };
    }
    // activeFilters가 없으면 빈 상태로 시작 (새로고침 시 항상 초기 상태)
    return {
      sortBy: defaultSort,
    };
  });

  // ========================================
  // 🧮 계산된 값 (useMemo)
  // ========================================

  // 현재 적용된 필터 (activeFilters와 internalFilters 병합)
  const currentFilters = useMemo(
    () => ({
      types: activeFilters.types ?? internalFilters.types,
      channels: activeFilters.channels ?? internalFilters.channels,
      searchQuery: activeFilters.searchQuery ?? internalFilters.searchQuery,
      sortBy: internalFilters.sortBy ?? selectedSort ?? defaultSort,
    }),
    [
      activeFilters.types,
      activeFilters.channels,
      activeFilters.searchQuery,
      internalFilters.types,
      internalFilters.channels,
      internalFilters.searchQuery,
      internalFilters.sortBy,
      selectedSort,
      defaultSort,
    ]
  );

  // 필터링된 캠페인 목록 (필터와 정렬 적용)
  const filteredCampaigns = useMemo(
    () =>
      filterCampaigns<T>(campaigns, currentFilters, selectedSort, defaultSort),
    [campaigns, currentFilters, selectedSort, defaultSort]
  );

  // ========================================
  // 🔄 부수 효과 (useEffect)
  // ========================================

  // onFilteredCampaignsChange 콜백을 ref에 저장 (최신 값 유지)
  const onFilteredCampaignsChangeRef = useRef(onFilteredCampaignsChange);
  useEffect(() => {
    onFilteredCampaignsChangeRef.current = onFilteredCampaignsChange;
  }, [onFilteredCampaignsChange]);

  // 이전 필터링된 캠페인 목록 저장 (변경 감지용)
  const prevFilteredCampaignsRef = useRef<T[]>([]);
  const isFirstRenderRef = useRef(true);

  // 필터링된 캠페인 목록이 변경되면 부모 컴포넌트에 알림
  useEffect(() => {
    const prevFiltered = prevFilteredCampaignsRef.current;

    // 첫 로드 시에만 콜백 호출
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      prevFilteredCampaignsRef.current = filteredCampaigns;
      onFilteredCampaignsChangeRef.current(filteredCampaigns);
      return;
    }

    // 개수가 변경된 경우
    if (prevFiltered.length !== filteredCampaigns.length) {
      prevFilteredCampaignsRef.current = filteredCampaigns;
      onFilteredCampaignsChangeRef.current(filteredCampaigns);
      return;
    }

    // 내용이 변경된 경우 (ID 비교)
    const prevKeys = prevFiltered.map(getItemKey).sort().join(",");
    const currentKeys = filteredCampaigns.map(getItemKey).sort().join(",");

    if (prevKeys !== currentKeys) {
      prevFilteredCampaignsRef.current = filteredCampaigns;
      onFilteredCampaignsChangeRef.current(filteredCampaigns);
      return;
    }
  }, [filteredCampaigns]);

  // 모달이 열려있을 때 body 스크롤 방지
  useEffect(() => {
    const hasOpenModal =
      isTypeModalOpen || isChannelModalOpen || isSortModalOpen;
    document.body.style.overflow = hasOpenModal ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isTypeModalOpen, isChannelModalOpen, isSortModalOpen]);

  // ========================================
  // 🔓 모달 열기/닫기 함수
  // ========================================

  const openTypeModal = useCallback(() => {
    setTempTypes(currentFilters.types || []);
    setIsTypeModalOpen(true);
  }, [currentFilters.types]);

  const openChannelModal = useCallback(() => {
    setTempChannels(currentFilters.channels || []);
    setIsChannelModalOpen(true);
  }, [currentFilters.channels]);

  const openSortModal = useCallback(() => {
    setTempSort(selectedSort);
    setIsSortModalOpen(true);
  }, [selectedSort]);

  const closeTypeModal = useCallback(() => setIsTypeModalOpen(false), []);
  const closeChannelModal = useCallback(() => setIsChannelModalOpen(false), []);
  const closeSortModal = useCallback(() => setIsSortModalOpen(false), []);

  // ========================================
  // 🔄 필터 토글 함수 (모달 내에서 선택/해제)
  // ========================================

  const handleTypeToggle = useCallback(
    (option: string | { value: string; label: string }) => {
      const typeValue = typeof option === "string" ? option : option.value;
      setTempTypes((prev) =>
        prev.includes(typeValue)
          ? prev.filter((item) => item !== typeValue)
          : [...prev, typeValue]
      );
    },
    []
  );

  const handleChannelToggle = useCallback(
    (option: string | { value: string; label: string }) => {
      const channelValue = typeof option === "string" ? option : option.value;
      setTempChannels((prev) =>
        prev.includes(channelValue)
          ? prev.filter((item) => item !== channelValue)
          : [...prev, channelValue]
      );
    },
    []
  );

  // ========================================
  // ✅ 필터 적용 함수
  // ========================================

  // 필터를 적용하고 부모 컴포넌트에 알림 (새로고침 시 유지하지 않음)
  const applyFilters = useCallback(
    (filters: FilterChangeParams) => {
      setInternalFilters(filters);
      onFilterChange?.(filters);
    },
    [onFilterChange]
  );

  // ========================================
  // 📌 필터 적용 핸들러 (모달에서 적용 버튼 클릭 시)
  // ========================================

  const handleTypeApply = useCallback(() => {
    closeTypeModal();
    applyFilters({
      types: tempTypes,
      channels: currentFilters.channels,
      searchQuery,
      sortBy: selectedSort,
    });
  }, [
    closeTypeModal,
    applyFilters,
    tempTypes,
    currentFilters.channels,
    searchQuery,
    selectedSort,
  ]);

  const handleChannelApply = useCallback(() => {
    closeChannelModal();
    applyFilters({
      types: currentFilters.types,
      channels: tempChannels,
      searchQuery,
      sortBy: selectedSort,
    });
  }, [
    closeChannelModal,
    applyFilters,
    currentFilters.types,
    tempChannels,
    searchQuery,
    selectedSort,
  ]);

  // ========================================
  // 🔄 정렬 핸들러
  // ========================================

  const handleSortToggle = useCallback(
    (option: string | { value: string; label: string }) => {
      const sortValue = typeof option === "string" ? option : option.value;
      setTempSort(sortValue);
      setSelectedSort(sortValue);
      closeSortModal();
      applyFilters({
        types: currentFilters.types,
        channels: currentFilters.channels,
        searchQuery,
        sortBy: sortValue,
      });
    },
    [
      closeSortModal,
      applyFilters,
      currentFilters.types,
      currentFilters.channels,
      searchQuery,
    ]
  );

  const handleSortReset = useCallback(() => {
    setTempSort(defaultSort);
    setSelectedSort(defaultSort);
    applyFilters({
      types: currentFilters.types,
      channels: currentFilters.channels,
      searchQuery,
      sortBy: defaultSort,
    });
  }, [
    applyFilters,
    currentFilters.types,
    currentFilters.channels,
    searchQuery,
    defaultSort,
  ]);

  // ========================================
  // 🔄 필터 초기화 핸들러
  // ========================================

  const handleTypeReset = useCallback(() => setTempTypes([]), []);
  const handleChannelReset = useCallback(() => setTempChannels([]), []);

  // ========================================
  // 🔍 검색 핸들러
  // ========================================

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      applyFilters({
        types: currentFilters.types,
        channels: currentFilters.channels,
        searchQuery: query,
        sortBy: selectedSort,
      });
    },
    [applyFilters, currentFilters.types, currentFilters.channels, selectedSort]
  );

  // ========================================
  // ❌ 필터 제거 핸들러 (태그에서 X 버튼 클릭 시)
  // ========================================

  const handleTypeRemove = useCallback(
    (type: string) => {
      const newTypes =
        currentFilters.types?.filter((item) => item !== type) || [];
      applyFilters({
        types: newTypes.length > 0 ? newTypes : undefined,
        channels: currentFilters.channels,
        searchQuery,
        sortBy: selectedSort,
      });
    },
    [
      applyFilters,
      currentFilters.types,
      currentFilters.channels,
      searchQuery,
      selectedSort,
    ]
  );

  const handleChannelRemove = useCallback(
    (channel: string) => {
      const newChannels =
        currentFilters.channels?.filter((item) => item !== channel) || [];
      applyFilters({
        types: currentFilters.types,
        channels: newChannels.length > 0 ? newChannels : undefined,
        searchQuery,
        sortBy: selectedSort,
      });
    },
    [
      applyFilters,
      currentFilters.types,
      currentFilters.channels,
      searchQuery,
      selectedSort,
    ]
  );

  // ========================================
  // 📤 반환값 (컴포넌트에서 사용할 state와 actions)
  // ========================================
  return {
    state: {
      isTypeModalOpen,
      isChannelModalOpen,
      isSortModalOpen,
      tempTypes,
      tempChannels,
      tempSort,
      selectedSort,
      searchQuery,
      currentFilters,
    },
    actions: {
      openTypeModal,
      openChannelModal,
      openSortModal,
      closeTypeModal,
      closeChannelModal,
      closeSortModal,
      handleTypeToggle,
      handleChannelToggle,
      handleTypeApply,
      handleChannelApply,
      handleTypeReset,
      handleChannelReset,
      handleSortToggle,
      handleSortReset,
      handleSearchChange,
      handleTypeRemove,
      handleChannelRemove,
    },
  };
}
