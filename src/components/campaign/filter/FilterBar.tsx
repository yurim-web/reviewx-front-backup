/* ========================================
   🔍 필터/정렬 바 컴포넌트
   ======================================== */

/**
 * 필터/정렬 바 컴포넌트
 *
 * 목적: 캠페인 목록 페이지에서 필터링 및 정렬 기능을 제공하는 상단 바 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /campaign/delivery (배송형 캠페인 목록)
 * - /campaign/visit (방문형 캠페인 목록)
 * - /campaign/review (구매평 캠페인 목록)
 * - /campaign/mission (미션형 캠페인 목록)
 * - /campaign/reporter (기자단 캠페인 목록)
 *
 * 참고: FilterBar는 CampaignListPage 컴포넌트 내부에서 사용되며,
 * 위 페이지들은 CampaignListPage를 통해 FilterBar를 간접적으로 사용합니다.
 *
 * 주요 기능:
 * - 카테고리/채널/지역 필터링 (모달 방식)
 * - 마감임박 필터 (토글 방식)
 * - 정렬 옵션 (최신순, 인기순, 마감임박순, 포인트높은순)
 * - 활성 필터 태그 표시 및 개별 제거
 * - 필터 적용/초기화 기능
 */

"use client";

import { useState, useEffect } from "react";
import mainStyles from "../../../styles/filter/filter_bar/main.module.css";
import ModalFilter from "./ModalFilter";
import RegionFilter from "./RegionFilter";
import SortModalFilter from "./SortModalFilter";

// FilterBar 컴포넌트의 props 타입 정의
interface FilterBarProps {
  // 필터 변경 시 호출되는 콜백 함수
  onFilterChange?: (filters: {
    category?: string; // 선택된 카테고리 (쉼표로 구분된 문자열)
    channel?: string; // 선택된 채널 (쉼표로 구분된 문자열)
    region?: string; // 선택된 지역 (쉼표로 구분된 문자열)
    closingSoon?: boolean; // 마감임박 필터 활성화 여부
    sortBy?: string; // 정렬 기준
  }) => void;
  // 현재 활성화된 필터들
  activeFilters?: {
    channels?: string[]; // 활성화된 채널 목록
    categories?: string[]; // 활성화된 카테고리 목록
    regions?: string[]; // 활성화된 지역 목록
  };
  // 카테고리 옵션 (외부에서 주입)
  categoryOptions: string[];
  // 채널 옵션 (외부에서 주입)
  channelOptions: string[];
  // 지역 필터 사용 여부
  useRegionFilter?: boolean;
  // 정렬 옵션 (외부에서 주입)
  sortOptions?: string[] | { value: string; label: string }[];
  // 마감임박 필터 상태
  closingSoon?: boolean;
  // 마감임박 필터 변경 핸들러
  onClosingSoonChange?: (closingSoon: boolean) => void;
}

export default function FilterBar({
  onFilterChange,
  activeFilters = {},
  categoryOptions,
  channelOptions,
  useRegionFilter = false,
  sortOptions = ["최신순", "인기순", "마감임박순", "포인트높은순"],
  closingSoon = false,
  onClosingSoonChange,
}: FilterBarProps) {
  // 필터 상태 관리
  const [selectedSort, setSelectedSort] = useState("최신순"); // 실제 선택된 정렬 옵션
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // 카테고리 모달 열림 상태
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false); // 채널 모달 열림 상태
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false); // 지역 모달 열림 상태
  const [tempCategories, setTempCategories] = useState<string[]>([]); // 임시 카테고리 선택 상태
  const [tempChannels, setTempChannels] = useState<string[]>([]); // 임시 채널 선택 상태
  const [tempRegions, setTempRegions] = useState<string[]>([]); // 임시 지역 선택 상태
  const [isSortModalOpen, setIsSortModalOpen] = useState(false); // 정렬 모달 열림 상태
  const [tempSort, setTempSort] = useState<string>("최신순"); // 임시 정렬 선택 상태

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    const hasOpenModal =
      isCategoryModalOpen ||
      isChannelModalOpen ||
      isRegionModalOpen ||
      isSortModalOpen;

    if (hasOpenModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // cleanup 함수 - 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    isCategoryModalOpen,
    isChannelModalOpen,
    isRegionModalOpen,
    isSortModalOpen,
  ]);

  /* ========================================
     모달 열기 함수
     ======================================== */

  // 카테고리 버튼 클릭 핸들러
  const handleCategoryButtonClick = () => {
    setTempCategories(activeFilters.categories || []);
    setIsCategoryModalOpen(true);
  };

  // 채널 버튼 클릭 핸들러
  const handleChannelButtonClick = () => {
    setTempChannels(activeFilters.channels || []);
    setIsChannelModalOpen(true);
  };

  // 지역 버튼 클릭 핸들러
  const handleRegionButtonClick = () => {
    setTempRegions(activeFilters.regions || []);
    setIsRegionModalOpen(true);
  };

  /* ========================================
     정렬 함수
     ======================================== */

  // 정렬 버튼 클릭 핸들러
  const handleSortButtonClick = () => {
    setTempSort(selectedSort);
    setIsSortModalOpen(true);
  };

  // 정렬 모달 닫기 핸들러
  const handleSortModalClose = () => {
    setIsSortModalOpen(false);
  };

  // 정렬 선택/해제 핸들러 (모달 내부용) - 선택 즉시 적용
  const handleSortToggle = (
    option: string | { value: string; label: string }
  ) => {
    const sort = typeof option === "string" ? option : option.value;
    setTempSort(sort);
    setSelectedSort(sort);
    onFilterChange?.({ sortBy: sort });
    setIsSortModalOpen(false); // 선택 후 모달 닫기
  };

  /* ========================================
     모달 내부 선택/해제 함수
     ======================================== */

  // 모달 내에서 카테고리 선택/해제 핸들러
  const handleCategoryToggle = (
    option: string | { value: string; label: string }
  ) => {
    const category = typeof option === "string" ? option : option.value;
    if (category === "전체") {
      // "전체" 선택 시: 모든 항목이 선택되어 있으면 전체 해제, 아니면 전체 선택
      const allCategories = categoryOptions.filter((opt) => opt !== "전체");
      if (tempCategories.length === allCategories.length) {
        setTempCategories([]);
      } else {
        setTempCategories(allCategories);
      }
    } else {
      setTempCategories((prev) => {
        const newCategories = prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category];
        return newCategories;
      });
    }
  };

  // 모달 내에서 채널 선택/해제 핸들러
  const handleChannelToggle = (
    option: string | { value: string; label: string }
  ) => {
    const channel = typeof option === "string" ? option : option.value;
    if (channel === "전체") {
      // "전체" 선택 시: 모든 항목이 선택되어 있으면 전체 해제, 아니면 전체 선택
      const allChannels = channelOptions.filter((opt) => opt !== "전체");
      if (tempChannels.length === allChannels.length) {
        setTempChannels([]);
      } else {
        setTempChannels(allChannels);
      }
    } else {
      setTempChannels((prev) => {
        const newChannels = prev.includes(channel)
          ? prev.filter((c) => c !== channel)
          : [...prev, channel];
        return newChannels;
      });
    }
  };

  // 지역 선택 변경 핸들러 (RegionFilter에서 사용)
  const handleRegionChange = (regions: string[]) => {
    setTempRegions(regions);
  };

  /* ========================================
     필터 적용 함수
     ======================================== */

  // 카테고리 필터 적용하기
  const handleCategoryApply = () => {
    onFilterChange?.({ category: tempCategories.join(",") });
    setIsCategoryModalOpen(false);
  };

  // 채널 필터 적용하기
  const handleChannelApply = () => {
    onFilterChange?.({ channel: tempChannels.join(",") });
    setIsChannelModalOpen(false);
  };

  // 지역 필터 적용하기
  const handleRegionApply = (regions?: string[]) => {
    const regionsToApply = regions || tempRegions;
    onFilterChange?.({ region: regionsToApply.join(",") });
    setIsRegionModalOpen(false);
  };

  /* ========================================
     초기화 함수
     ======================================== */

  // 카테고리 선택 초기화
  const handleCategoryReset = () => {
    setTempCategories([]);
  };

  // 채널 선택 초기화
  const handleChannelReset = () => {
    setTempChannels([]);
  };

  // 지역 선택 초기화
  const handleRegionReset = () => {
    setTempRegions([]);
  };

  /* ========================================
     필터 제거 함수
     ======================================== */

  // 활성 필터 태그에서 채널 제거하는 함수
  const handleChannelRemove = (channel: string) => {
    // 현재 활성화된 채널 목록에서 해당 채널을 제거
    const newChannels =
      activeFilters.channels?.filter((c) => c !== channel) || [];
    // 부모 컴포넌트에 변경된 채널 목록을 전달
    onFilterChange?.({
      channel: newChannels.join(","),
    });
  };

  // 활성 필터 태그에서 카테고리 제거하는 함수
  const handleCategoryRemove = (category: string) => {
    // 현재 활성화된 카테고리 목록에서 해당 카테고리를 제거
    const newCategories =
      activeFilters.categories?.filter((c) => c !== category) || [];
    // 부모 컴포넌트에 변경된 카테고리 목록을 전달
    onFilterChange?.({
      category: newCategories.join(","),
    });
  };

  // 활성 필터 태그에서 지역 제거하는 함수
  const handleRegionRemove = (region: string) => {
    // 현재 활성화된 지역 목록에서 해당 지역을 제거
    const newRegions = activeFilters.regions?.filter((r) => r !== region) || [];
    // 부모 컴포넌트에 변경된 지역 목록을 전달
    onFilterChange?.({
      region: newRegions.join(","),
    });
  };

  return (
    <>
      <div className={mainStyles.filter_bar}>
        <div className={mainStyles.filter_buttons_container}>
          <div className={mainStyles.filter_buttons}>
            {/* 카테고리 필터 버튼 */}
            <button
              className={`${mainStyles.filter_button} ${
                activeFilters.categories && activeFilters.categories.length > 0
                  ? mainStyles.filter_button_active
                  : ""
              }`}
              onClick={handleCategoryButtonClick}
            >
              {/*
                체크박스 아이콘
                - 필터가 활성화되어 있으면 체크마크가 표시됨
                - filter_button_active 클래스가 적용되면 CSS의 ::after 가상 요소로 체크마크가 표시됨
              */}
              <div className={mainStyles.filter_icon}></div>
              <span>카테고리</span>
              <img
                src="/images/filter/dropdown_icon.svg"
                alt="드롭다운"
                className={mainStyles.dropdown_icon}
              />
            </button>

            {/* 채널 필터 버튼 */}
            {channelOptions.length > 0 && (
              <button
                className={`${mainStyles.filter_button} ${
                  activeFilters.channels && activeFilters.channels.length > 0
                    ? mainStyles.filter_button_active
                    : ""
                }`}
                onClick={handleChannelButtonClick}
              >
                {/*
                  체크박스 아이콘
                  - 필터가 활성화되어 있으면 체크마크가 표시됨
                  - filter_button_active 클래스가 적용되면 CSS의 ::after 가상 요소로 체크마크가 표시됨
                */}
                <div className={mainStyles.filter_icon}></div>
                <span>채널</span>
                <img
                  src="/images/filter/dropdown_icon.svg"
                  alt="드롭다운"
                  className={mainStyles.dropdown_icon}
                />
              </button>
            )}

            {/* 지역 필터 버튼 */}
            {useRegionFilter && (
              <button
                className={`${mainStyles.filter_button} ${
                  activeFilters.regions && activeFilters.regions.length > 0
                    ? mainStyles.filter_button_active
                    : ""
                }`}
                onClick={handleRegionButtonClick}
              >
                {/*
                  체크박스 아이콘
                  - 필터가 활성화되어 있으면 체크마크가 표시됨
                  - filter_button_active 클래스가 적용되면 CSS의 ::after 가상 요소로 체크마크가 표시됨
                */}
                <div className={mainStyles.filter_icon}></div>
                <span>지역</span>
                <img
                  src="/images/filter/dropdown_icon.svg"
                  alt="드롭다운"
                  className={mainStyles.dropdown_icon}
                />
              </button>
            )}

            {/* 마감임박 필터 버튼 (토글 방식) */}
            <button
              className={`${mainStyles.filter_button} ${
                closingSoon ? mainStyles.filter_button_active : ""
              }`}
              onClick={() => {
                onClosingSoonChange?.(!closingSoon);
              }}
            >
              {/*
                체크박스 아이콘
                - 마감임박 필터가 활성화되어 있으면 체크마크가 표시됨
                - filter_button_active 클래스가 적용되면 CSS의 ::after 가상 요소로 체크마크가 표시됨
              */}
              <div className={mainStyles.filter_icon}></div>
              <span>긴급</span>
            </button>
          </div>

          {/* 정렬 버튼 (모달 열기) - 데스크톱용 */}
          <button
            className={mainStyles.sort_button}
            onClick={handleSortButtonClick}
          >
            <span>{selectedSort}</span>
            <img
              src="/images/filter/dropdown_icon.svg"
              alt="정렬"
              className={mainStyles.dropdown_icon}
            />
          </button>
        </div>

        {/* 활성화된 필터들을 태그 형태로 표시하는 영역 */}
        {(activeFilters.channels?.length || 0) +
          (activeFilters.categories?.length || 0) +
          (activeFilters.regions?.length || 0) >
          0 && (
          <div className={mainStyles.active_filters}>
            {/* 왼쪽 패딩용 빈 요소 */}
            <div className={mainStyles.filter_padding_left}></div>
            {/* 활성화된 카테고리 필터 태그들 */}
            {activeFilters.categories?.map((category) => (
              <div key={category} className={mainStyles.filter_tag}>
                <span>{category}</span>

                {/* x 버튼 */}
                <button
                  className={mainStyles.remove_tag}
                  onClick={() => handleCategoryRemove(category)}
                >
                  <img
                    src="/images/filter/x_small.svg"
                    alt="제거"
                    className={mainStyles.remove_icon}
                  />
                </button>
              </div>
            ))}
            {/* 활성화된 채널 필터 태그들 */}
            {activeFilters.channels?.map((channel) => (
              <div key={channel} className={mainStyles.filter_tag}>
                <span>{channel}</span>
                <button
                  className={mainStyles.remove_tag}
                  onClick={() => handleChannelRemove(channel)}
                >
                  <img
                    src="/images/filter/x_small.svg"
                    alt="제거"
                    className={mainStyles.remove_icon}
                  />
                </button>
              </div>
            ))}
            {/* 활성화된 지역 필터 태그들 */}
            {activeFilters.regions?.map((region) => (
              <div key={region} className={mainStyles.filter_tag}>
                <span>{region}</span>
                <button
                  className={mainStyles.remove_tag}
                  onClick={() => handleRegionRemove(region)}
                >
                  <img
                    src="/images/filter/x_small.svg"
                    alt="제거"
                    className={mainStyles.remove_icon}
                  />
                </button>
              </div>
            ))}
            {/* 오른쪽 패딩용 빈 요소 */}
            <div className={mainStyles.filter_padding_right}></div>
          </div>
        )}
      </div>

      {/* 정렬 버튼 (모달 열기) - 모바일용 (필터 바 border 아래) */}
      <div className={mainStyles.sort_button_container}>
        <button
          className={mainStyles.sort_button}
          onClick={handleSortButtonClick}
        >
          <span>{selectedSort}</span>
          <img
            src="/images/filter/dropdown_icon.svg"
            alt="정렬"
            className={mainStyles.dropdown_icon}
          />
        </button>
      </div>

      {/* 카테고리 필터 모달 */}
      <ModalFilter
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="필터"
        sectionTitle="카테고리"
        options={categoryOptions}
        selectedValues={tempCategories}
        onOptionChange={handleCategoryToggle}
        onApply={handleCategoryApply}
        onReset={handleCategoryReset}
        type="checkbox"
      />

      {/* 채널 필터 모달 */}
      <ModalFilter
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        title="필터"
        sectionTitle="채널"
        options={channelOptions}
        selectedValues={tempChannels}
        onOptionChange={handleChannelToggle}
        onApply={handleChannelApply}
        onReset={handleChannelReset}
        type="checkbox"
      />

      {/* 지역 필터 모달 */}
      {useRegionFilter && (
        <RegionFilter
          isOpen={isRegionModalOpen}
          onClose={() => setIsRegionModalOpen(false)}
          title="필터"
          selectedRegions={tempRegions}
          onRegionChange={handleRegionChange}
          onApply={handleRegionApply}
          onReset={handleRegionReset}
        />
      )}

      {/* 정렬 모달 */}
      <SortModalFilter
        isOpen={isSortModalOpen}
        onClose={handleSortModalClose}
        title="정렬"
        options={sortOptions}
        selectedValue={tempSort}
        onOptionChange={handleSortToggle}
      />
    </>
  );
}
