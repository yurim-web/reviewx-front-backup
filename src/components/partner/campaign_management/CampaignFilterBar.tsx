/* ========================================
   🔍 파트너 캠페인 관리 필터 바 컴포넌트
   ======================================== */

"use client";

import styles from "../../../styles/partner/campaign_management/campaign_filter.module.css";
import ModalFilter from "../../user/filter/ModalFilter";
import {
  CampaignFilterBarProps,
  FilterableCampaign,
} from "./types";
import { useCampaignFilterBar } from "./hooks/useCampaignFilterBar";

const DEFAULT_TYPE_OPTIONS = ["배송형", "방문형", "구매평", "기자단", "미션형"];
const DEFAULT_CHANNEL_OPTIONS = [
  "네이버 블로그",
  "클립",
  "인스타그램",
  "릴스",
  "유튜브",
  "쇼츠",
];
const DEFAULT_SORT_OPTIONS = ["최신순", "인기순", "마감임박순"];
const DEFAULT_SORT = "최신순";

export default function CampaignFilterBar<
  T extends FilterableCampaign = FilterableCampaign
>({
  campaigns,
  onFilterChange,
  onFilteredCampaignsChange,
  activeFilters = {},
  typeOptions = DEFAULT_TYPE_OPTIONS,
  channelOptions = DEFAULT_CHANNEL_OPTIONS,
  sortOptions = DEFAULT_SORT_OPTIONS,
  defaultSort = DEFAULT_SORT,
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

  return (
    <div className={styles.filter_bar}>
      <div className={styles.filter_container}>
        <div className={styles.filter_buttons_container}>
          <div className={styles.filter_buttons}>
            <button
              className={`${styles.filter_button} ${
                currentFilters.types && currentFilters.types.length > 0
                  ? styles.filter_button_active
                  : ""
              }`}
              onClick={openTypeModal}
            >
              <div className={styles.checkbox_icon}>
                {currentFilters.types && currentFilters.types.length > 0 ? (
                  <div className={styles.checkbox_checked}></div>
                ) : (
                  <div className={styles.checkbox_unchecked}></div>
                )}
              </div>
              <span className={styles.filter_label}>유형</span>
              <img
                src="/images/filter/dropdown_icon.svg"
                alt="드롭다운"
                className={styles.dropdown_icon}
              />
            </button>

            <button
              className={`${styles.filter_button} ${
                currentFilters.channels && currentFilters.channels.length > 0
                  ? styles.filter_button_active
                  : ""
              }`}
              onClick={openChannelModal}
            >
              <div className={styles.checkbox_icon}>
                {currentFilters.channels && currentFilters.channels.length > 0 ? (
                  <div className={styles.checkbox_checked}></div>
                ) : (
                  <div className={styles.checkbox_unchecked}></div>
                )}
              </div>
              <span className={styles.filter_label}>채널</span>
              <img
                src="/images/filter/dropdown_icon.svg"
                alt="드롭다운"
                className={styles.dropdown_icon}
              />
            </button>
          </div>

          <div className={styles.search_sort_container}>
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

        <div className={styles.filter_tags_container}>
          {(currentFilters.types && currentFilters.types.length > 0) ||
          (currentFilters.channels && currentFilters.channels.length > 0) ? (
            <div className={styles.active_filters}>
              {currentFilters.types?.map((type) => (
                <div key={type} className={styles.filter_tag}>
                  <span>{type}</span>
                  <button
                    className={styles.remove_tag}
                    onClick={() => handleTypeRemove(type)}
                    aria-label={`${type} 필터 제거`}
                  >
                    <img
                      src="/images/filter/x_small.svg"
                      alt="제거"
                      className={styles.remove_icon}
                    />
                  </button>
                </div>
              ))}

              {currentFilters.channels?.map((channel) => (
                <div key={channel} className={styles.filter_tag}>
                  <span>{channel}</span>
                  <button
                    className={styles.remove_tag}
                    onClick={() => handleChannelRemove(channel)}
                    aria-label={`${channel} 필터 제거`}
                  >
                    <img
                      src="/images/filter/x_small.svg"
                      alt="제거"
                      className={styles.remove_icon}
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
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
        options={sortOptions}
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


