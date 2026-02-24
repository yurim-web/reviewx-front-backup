/**
 * 캠페인 관리 필터 바 컴포넌트
 *
 * 캠페인 관리 페이지에서 사용하는 필터 바 UI
 * 유형, 채널, 검색, 정렬 기능 제공
 *
 * 사용 페이지:
 * - src/app/user/campaign_management/* (사용자 캠페인 관리 페이지들)
 * - src/app/partner/campaign_management/* (파트너 캠페인 관리 페이지들)
 */

"use client";

import { useRef, useState, useCallback } from "react";
import styles from "@/styles/partner/campaign_management/campaign_filter.module.css";
import ModalFilter from "@/components/campaign/filter/ModalFilter";
import { CampaignFilterBarProps, FilterableCampaign } from "./types";
import { useCampaignFilterBar } from "@/hooks/common/campaign_management/useCampaignFilterBar";

const DEFAULT_TYPE_OPTIONS = ["배송형", "방문형", "구매평", "기자단", "미션형"];
const DEFAULT_CHANNEL_OPTIONS = ["네이버 블로그", "클립", "인스타그램", "릴스", "유튜브", "쇼츠"];
const DEFAULT_SORT_OPTIONS = ["최신순", "오래된순", "마감임박순"];
const DEFAULT_SORT = "최신순";

export default function CampaignFilterBar<T extends FilterableCampaign = FilterableCampaign>({
  campaigns,
  onFilterChange,
  onFilteredCampaignsChange,
  activeFilters = {},
  typeOptions = DEFAULT_TYPE_OPTIONS,
  channelOptions = DEFAULT_CHANNEL_OPTIONS,
  sortOptions = DEFAULT_SORT_OPTIONS,
  defaultSort = DEFAULT_SORT,
  showSearch = true,
  isPartner = false,
}: CampaignFilterBarProps<T>) {
  const {
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
  } = useCampaignFilterBar({
    campaigns,
    onFilterChange,
    onFilteredCampaignsChange,
    activeFilters,
    defaultSort,
  });

  const hasActiveFilters =
    (currentFilters.types?.length ?? 0) > 0 || (currentFilters.channels?.length ?? 0) > 0;

  /* PC에서 활성 필터 태그 영역 마우스 드래그로 가로 스크롤 */
  const activeFiltersRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!activeFiltersRef.current) return;
    const dx = startXRef.current - e.clientX;
    activeFiltersRef.current.scrollLeft += dx;
    startXRef.current = e.clientX;
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, [handleDragMove]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest(`.${styles.remove_tag}`)) return;
      if (!activeFiltersRef.current) return;
      setIsDragging(true);
      startXRef.current = e.clientX;
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "pointer";
    },
    [handleDragMove, handleDragEnd]
  );

  const renderFilterButton = (label: string, isActive: boolean, onClick: () => void) => (
    <button
      className={`${styles.filter_button} ${isActive ? styles.filter_button_active : ""}`}
      onClick={onClick}
    >
      {/* 
        체크박스 아이콘
        - 필터가 활성화되어 있으면 체크마크가 표시됨
        - filter_button_active 클래스가 적용되면 CSS의 ::after 가상 요소로 체크마크가 표시됨
      */}
      <div className={styles.filter_icon}></div>
      <span className={styles.filter_label}>{label}</span>
      <img src="/images/filter/dropdown_icon.svg" alt="드롭다운" className={styles.dropdown_icon} />
    </button>
  );

  const renderFilterTag = (label: string, onRemove: () => void) => (
    <div key={label} className={styles.filter_tag}>
      <span>{label}</span>
      <button className={styles.remove_tag} onClick={onRemove} aria-label={`${label} 필터 제거`}>
        <img src="/images/filter/x_small.svg" alt="제거" className={styles.remove_icon} />
      </button>
    </div>
  );

  return (
    <div className={styles.filter_bar}>
      <div className={styles.filter_container}>
        <div className={styles.filter_buttons_container}>
          <div className={styles.filter_buttons}>
            {renderFilterButton("유형", (currentFilters.types?.length ?? 0) > 0, openTypeModal)}
            {renderFilterButton(
              "채널",
              (currentFilters.channels?.length ?? 0) > 0,
              openChannelModal
            )}
          </div>

          {/* 검색 및 정렬 컨테이너 (데스크톱용) */}
          <div className={styles.search_sort_container}>
            {showSearch && isPartner && (
              <div className={styles.search_container}>
                <img
                  src="/images/icons/search_icon.svg"
                  alt="검색"
                  className={styles.search_icon}
                />
                <input
                  type="text"
                  placeholder="검색"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={styles.search_input}
                />
              </div>
            )}

            {/* 정렬 버튼 (데스크톱용) */}
            <button className={styles.sort_button} onClick={openSortModal}>
              <span className={styles.sort_label}>{selectedSort}</span>
              <img
                src="/images/filter/dropdown_icon.svg"
                alt="드롭다운"
                className={styles.dropdown_icon}
              />
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className={styles.filter_tags_container}>
            <div
              ref={activeFiltersRef}
              className={`${styles.active_filters} ${isDragging ? styles.active_filters_dragging : ""}`}
              onMouseDown={handleDragStart}
            >
              {currentFilters.types?.map((type) =>
                renderFilterTag(type, () => handleTypeRemove(type))
              )}
              {currentFilters.channels?.map((channel) =>
                renderFilterTag(channel, () => handleChannelRemove(channel))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 검색 및 정렬 컨테이너 (모바일용 - 필터 바 border 아래) */}
      <div className={styles.mobile_search_sort_container}>
        {isPartner && (
          <div className={styles.search_container}>
            <img src="/images/icons/search_icon.svg" alt="검색" className={styles.search_icon} />
            <input
              type="text"
              placeholder="검색"
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.search_input}
            />
          </div>
        )}
        <div className={styles.sort_button_container}>
          <button className={styles.sort_button} onClick={openSortModal}>
            <span className={styles.sort_label}>{selectedSort}</span>
            <img
              src="/images/filter/dropdown_icon.svg"
              alt="드롭다운"
              className={styles.dropdown_icon}
            />
          </button>
        </div>
      </div>

      <ModalFilter
        isOpen={isTypeModalOpen}
        onClose={closeTypeModal}
        title="필터"
        sectionTitle="유형"
        options={typeOptions}
        selectedValues={tempTypes}
        onOptionChange={handleTypeToggle}
        onApply={handleTypeApply}
        onReset={handleTypeReset}
        type="checkbox"
      />

      <ModalFilter
        isOpen={isChannelModalOpen}
        onClose={closeChannelModal}
        title="필터"
        sectionTitle="채널"
        options={channelOptions}
        selectedValues={tempChannels}
        onOptionChange={handleChannelToggle}
        onApply={handleChannelApply}
        onReset={handleChannelReset}
        type="checkbox"
      />

      <ModalFilter
        isOpen={isSortModalOpen}
        onClose={closeSortModal}
        title="정렬"
        options={sortOptions as string[] | { value: string; label: string }[]}
        selectedValues={tempSort}
        onOptionChange={handleSortToggle}
        onApply={closeSortModal}
        onReset={handleSortReset}
        type="radio"
        showReset={false}
        showApply={false}
        layout="vertical"
        noScroll
      />
    </div>
  );
}
