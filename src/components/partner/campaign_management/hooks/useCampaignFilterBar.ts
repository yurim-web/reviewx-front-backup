/* ========================================
   🪝 useCampaignFilterBar 커스텀 훅
   ======================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  filterCampaigns,
  getItemKey,
} from "../utils/campaign_filter_helpers";
import type {
  CampaignFilterBarProps,
  FilterableCampaign,
  FilterChangeParams,
} from "../types";

interface UseCampaignFilterBarParams<
  T extends FilterableCampaign = FilterableCampaign
> {
  campaigns: T[];
  onFilterChange?: (filters: FilterChangeParams) => void;
  onFilteredCampaignsChange: (filteredCampaigns: T[]) => void;
  activeFilters?: CampaignFilterBarProps<T>["activeFilters"];
  defaultSort: string;
}

export interface UseCampaignFilterBarReturn {
  state: {
    isTypeModalOpen: boolean;
    isChannelModalOpen: boolean;
    isSortModalOpen: boolean;
    tempTypes: string[];
    tempChannels: string[];
    tempSort: string;
    selectedSort: string;
    searchQuery: string;
    currentFilters: {
      types?: string[];
      channels?: string[];
      searchQuery?: string;
      sortBy?: string;
    };
  };
  actions: {
    openTypeModal: () => void;
    openChannelModal: () => void;
    openSortModal: () => void;
    closeTypeModal: () => void;
    closeChannelModal: () => void;
    closeSortModal: () => void;
    handleTypeToggle: (option: string | { value: string; label: string }) => void;
    handleChannelToggle: (
      option: string | { value: string; label: string }
    ) => void;
    handleTypeApply: () => void;
    handleChannelApply: () => void;
    handleTypeReset: () => void;
    handleChannelReset: () => void;
    handleSortToggle: (option: string | { value: string; label: string }) => void;
    handleSortReset: () => void;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTypeRemove: (type: string) => void;
    handleChannelRemove: (channel: string) => void;
  };
}

export function useCampaignFilterBar<
  T extends FilterableCampaign = FilterableCampaign
>({
  campaigns,
  onFilterChange,
  onFilteredCampaignsChange,
  activeFilters = {},
  defaultSort,
}: UseCampaignFilterBarParams<T>): UseCampaignFilterBarReturn {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const [tempTypes, setTempTypes] = useState<string[]>([]);
  const [tempChannels, setTempChannels] = useState<string[]>([]);
  const [tempSort, setTempSort] = useState<string>(defaultSort);

  const [selectedSort, setSelectedSort] = useState<string>(defaultSort);
  const [searchQuery, setSearchQuery] = useState<string>(
    activeFilters.searchQuery || ""
  );

  const [internalFilters, setInternalFilters] = useState<FilterChangeParams>({
    sortBy: defaultSort,
  });

  const currentFilters = useMemo(() => ({
    types: activeFilters.types ?? internalFilters.types,
    channels: activeFilters.channels ?? internalFilters.channels,
    searchQuery: activeFilters.searchQuery ?? internalFilters.searchQuery,
    sortBy: internalFilters.sortBy ?? selectedSort ?? defaultSort,
  }), [
    activeFilters.types,
    activeFilters.channels,
    activeFilters.searchQuery,
    internalFilters.types,
    internalFilters.channels,
    internalFilters.searchQuery,
    internalFilters.sortBy,
    selectedSort,
    defaultSort,
  ]);

  const filteredCampaigns = useMemo(
    () =>
      filterCampaigns<T>(campaigns, currentFilters, selectedSort, defaultSort),
    [campaigns, currentFilters, selectedSort, defaultSort]
  );

  const onFilteredCampaignsChangeRef = useRef(onFilteredCampaignsChange);
  useEffect(() => {
    onFilteredCampaignsChangeRef.current = onFilteredCampaignsChange;
  }, [onFilteredCampaignsChange]);

  const prevFilteredCampaignsRef = useRef<T[]>([]);

  useEffect(() => {
    const prevFiltered = prevFilteredCampaignsRef.current;

    if (prevFiltered.length === 0 && filteredCampaigns.length > 0) {
      prevFilteredCampaignsRef.current = filteredCampaigns;
      onFilteredCampaignsChangeRef.current(filteredCampaigns);
      return;
    }

    if (prevFiltered.length !== filteredCampaigns.length) {
      prevFilteredCampaignsRef.current = filteredCampaigns;
      onFilteredCampaignsChangeRef.current(filteredCampaigns);
      return;
    }

    const prevKeys = prevFiltered.map(getItemKey).sort().join(",");
    const currentKeys = filteredCampaigns.map(getItemKey).sort().join(",");

    if (prevKeys !== currentKeys) {
      prevFilteredCampaignsRef.current = filteredCampaigns;
      onFilteredCampaignsChangeRef.current(filteredCampaigns);
      return;
    }

    prevFilteredCampaignsRef.current = filteredCampaigns;
  }, [filteredCampaigns]);

  useEffect(() => {
    const hasOpenModal = isTypeModalOpen || isChannelModalOpen || isSortModalOpen;
    document.body.style.overflow = hasOpenModal ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isTypeModalOpen, isChannelModalOpen, isSortModalOpen]);

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

  const applyFilters = useCallback(
    (filters: FilterChangeParams) => {
      setInternalFilters(filters);
      onFilterChange?.(filters);
    },
    [onFilterChange]
  );

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
  }, [applyFilters, currentFilters.types, currentFilters.channels, searchQuery, defaultSort]);

  const handleTypeReset = useCallback(() => setTempTypes([]), []);
  const handleChannelReset = useCallback(() => setTempChannels([]), []);

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

  const handleTypeRemove = useCallback(
    (type: string) => {
      const newTypes = currentFilters.types?.filter((item) => item !== type) || [];
      applyFilters({
        types: newTypes.length > 0 ? newTypes : undefined,
        channels: currentFilters.channels,
        searchQuery,
        sortBy: selectedSort,
      });
    },
    [applyFilters, currentFilters.types, currentFilters.channels, searchQuery, selectedSort]
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
    [applyFilters, currentFilters.types, currentFilters.channels, searchQuery, selectedSort]
  );

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


