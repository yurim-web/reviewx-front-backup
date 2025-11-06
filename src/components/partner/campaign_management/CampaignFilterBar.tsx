/* ========================================
   🔍 파트너 캠페인 관리 필터 바 컴포넌트
   ======================================== */

/**
 * 파트너 캠페인 관리 필터 바 컴포넌트
 *
 * 목적: 파트너 캠페인 관리 페이지에서 필터링 및 검색 기능을 제공하는 필터 바 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /partner/campaign_management (캠페인 관리 메인 페이지)
 *
 * 주요 기능:
 * - 유형 필터 (배송형, 방문형, 구매평, 기자단, 미션형)
 * - 채널 필터 (네이버 블로그, 인스타그램, 유튜브 등)
 * - 검색 기능 (캠페인 제목 검색)
 * - 정렬 옵션 (최신순, 인기순 등)
 * - 모달 방식의 필터 선택 UI
 *
 * React 학습 포인트:
 * - useState: 필터 상태 관리 (선택된 유형, 채널, 검색어, 정렬)
 * - useEffect: 모달 열림 시 body 스크롤 방지
 * - 이벤트 핸들러: 필터 버튼 클릭, 검색 입력, 모달 닫기 등
 * - 조건부 렌더링: 모달 표시/숨김
 * - Props: 부모 컴포넌트로부터 필터 옵션과 콜백 함수를 받음
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "../../../styles/partner/campaign_management/campaign_filter.module.css";
import ModalFilter from "../../user/filter/ModalFilter";
import type { PartnerCampaign } from "@/types/partner/partner";

/* ========================================
   타입 정의 (Type Definitions)
   ======================================== */

/**
 * 필터 변경 시 호출되는 콜백 함수의 매개변수 타입
 *
 * 설명:
 * - 유형: 선택된 캠페인 유형 배열 (예: ["배송형", "방문형"])
 * - 채널: 선택된 채널 배열 (예: ["네이버 블로그", "인스타그램"])
 * - 검색어: 사용자가 입력한 검색 키워드
 * - 정렬: 선택된 정렬 옵션 (예: "최신순")
 */
interface FilterChangeParams {
  types?: string[]; // 선택된 캠페인 유형들
  channels?: string[]; // 선택된 채널들
  searchQuery?: string; // 검색어
  sortBy?: string; // 정렬 기준
}

/**
 * CampaignFilterBar 컴포넌트의 props 타입 정의
 *
 * 설명:
 * - campaigns: 필터링할 캠페인 목록
 * - onFilterChange: 필터가 변경될 때 호출되는 콜백 함수 (선택적)
 * - onFilteredCampaignsChange: 필터링된 캠페인 목록이 변경될 때 호출되는 콜백 함수
 * - activeFilters: 현재 활성화된 필터들 (부모 컴포넌트에서 관리, 선택적)
 * - typeOptions: 유형 필터 옵션 (배송형, 방문형 등)
 * - channelOptions: 채널 필터 옵션 (네이버 블로그, 인스타그램 등)
 * - sortOptions: 정렬 옵션 (최신순, 인기순 등)
 * - defaultSort: 기본 정렬값
 */
interface CampaignFilterBarProps {
  campaigns: PartnerCampaign[]; // 필터링할 캠페인 목록
  onFilterChange?: (filters: FilterChangeParams) => void; // 필터 변경 콜백 (선택적)
  onFilteredCampaignsChange: (filteredCampaigns: PartnerCampaign[]) => void; // 필터링된 결과 콜백
  activeFilters?: {
    types?: string[];
    channels?: string[];
    searchQuery?: string;
  };
  typeOptions?: string[];
  channelOptions?: string[];
  sortOptions?: string[] | { value: string; label: string }[];
  defaultSort?: string;
}

/* ========================================
   캠페인 필터 바 컴포넌트
   ======================================== */

/**
 * 파트너 캠페인 관리 필터 바 컴포넌트
 *
 * 컴포넌트 구조:
 * 1. 필터 버튼 영역 (유형, 채널)
 * 2. 검색 입력창
 * 3. 정렬 드롭다운
 * 4. 필터 모달들 (유형 모달, 채널 모달, 정렬 모달)
 *
 * 상태 관리:
 * - isTypeModalOpen: 유형 필터 모달 열림 여부
 * - isChannelModalOpen: 채널 필터 모달 열림 여부
 * - isSortModalOpen: 정렬 모달 열림 여부
 * - tempTypes: 모달에서 임시로 선택한 유형들
 * - tempChannels: 모달에서 임시로 선택한 채널들
 * - selectedSort: 현재 선택된 정렬 옵션
 * - searchQuery: 검색 입력창의 값
 */
export default function CampaignFilterBar({
  campaigns,
  onFilterChange,
  onFilteredCampaignsChange,
  activeFilters = {},
  typeOptions = ["배송형", "방문형", "구매평", "기자단", "미션형"],
  channelOptions = [
    "네이버 블로그",
    "네이버 클립",
    "인스타그램",
    "릴스",
    "유튜브",
    "쇼츠",
    "네이버 쇼핑",
    "카카오 쇼핑",
    "쿠팡",
    "오늘의집",
    "컬리",
    "카카오 선물하기",
    "올리브영",
  ],
  sortOptions = ["최신순", "인기순", "마감임박순"],
  defaultSort = "최신순",
}: CampaignFilterBarProps) {
  /* ========================================
     상태 관리 (State Management)
     ======================================== */

  /**
   * useState 훅: 컴포넌트의 상태를 관리하는 React 훅
   *
   * 설명:
   * - 각 필터 모달의 열림/닫힘 상태를 관리합니다.
   * - 모달에서 임시로 선택한 값들을 저장합니다.
   * - 실제 적용된 필터 값과 임시 값은 분리하여 관리합니다.
   *
   * 학습 포인트:
   * - useState: React의 상태 관리 훅입니다.
   * - 배열 구조분해할당: [상태값, 상태변경함수] = useState(초기값)
   * - boolean 타입: true/false 값을 가진 상태
   * - string[] 타입: 문자열 배열을 상태로 관리
   */

  // 모달 열림 상태 관리
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  // 임시 필터 선택 상태 (모달 내부에서 사용)
  const [tempTypes, setTempTypes] = useState<string[]>([]);
  const [tempChannels, setTempChannels] = useState<string[]>([]);
  const [tempSort, setTempSort] = useState<string>(defaultSort);

  // 실제 적용된 필터 상태
  const [selectedSort, setSelectedSort] = useState<string>(defaultSort);
  const [searchQuery, setSearchQuery] = useState<string>(
    activeFilters.searchQuery || ""
  );

  // 내부 필터 상태 관리 (activeFilters가 없을 때 사용)
  const [internalFilters, setInternalFilters] = useState<{
    types?: string[];
    channels?: string[];
    searchQuery?: string;
    sortBy?: string;
  }>({
    sortBy: defaultSort,
  });

  // 실제 사용할 필터 상태 (activeFilters가 있으면 사용, 없으면 내부 상태 사용)
  // sortBy는 별도로 관리하므로 currentFilters에 병합
  const currentFilters = {
    types: activeFilters.types ?? internalFilters.types,
    channels: activeFilters.channels ?? internalFilters.channels,
    searchQuery: activeFilters.searchQuery ?? internalFilters.searchQuery,
    sortBy: internalFilters.sortBy ?? selectedSort ?? defaultSort,
  };

  /* ========================================
     필터링 헬퍼 함수 (Filtering Helper Functions)
     ======================================== */

  /**
   * 채널 이름 정규화 함수
   *
   * 설명:
   * - 필터 옵션의 채널 이름 (예: "네이버 블로그")을
   * - 데이터의 brandName 형식 (예: "네이버블로그")으로 변환합니다.
   * - 공백을 제거하여 비교할 수 있도록 합니다.
   *
   * 학습 포인트:
   * - 문자열.replace(): 정규식을 사용하여 문자열 치환
   * - /\s+/g: 모든 공백 문자를 찾는 정규식 (g 플래그는 전역 검색)
   */
  const normalizeChannelName = (channel: string): string => {
    return channel.replace(/\s+/g, "");
  };

  /**
   * 날짜 파싱 헬퍼 함수
   *
   * 설명:
   * - "2025-11-01 ~ 2025-11-15" 형식의 날짜 문자열에서
   * - 시작일을 추출하여 Date 객체로 변환합니다.
   * - 잘못된 형식이면 1970-01-01 (new Date(0))을 반환합니다.
   *
   * 학습 포인트:
   * - 문자열.split(): 구분자를 기준으로 문자열을 배열로 분리
   * - Date 객체: JavaScript의 날짜/시간 객체
   * - isNaN(): 숫자가 아닌지 확인하는 함수
   * - getTime(): Date 객체를 밀리초로 변환
   */
  const parseDate = (dateRange: string | undefined): Date => {
    if (!dateRange || dateRange.trim() === "") {
      return new Date(0);
    }

    const startDate = dateRange.split("~")[0]?.trim() || "";
    
    if (!startDate) {
      return new Date(0);
    }

    const parsedDate = new Date(startDate);
    
    if (isNaN(parsedDate.getTime())) {
      return new Date(0);
    }

    return parsedDate;
  };

  /**
   * 캠페인 필터링 및 정렬 함수
   *
   * 설명:
   * - 유형, 채널, 검색어를 기준으로 캠페인을 필터링합니다.
   * - 선택된 정렬 옵션에 따라 캠페인을 정렬합니다.
   * - useMemo로 최적화하여 불필요한 재계산을 방지합니다.
   *
   * 학습 포인트:
   * - useMemo: 의존성이 변경될 때만 재계산하는 React 훅
   * - 배열.filter(): 조건에 맞는 요소만 남기는 배열 메서드
   * - 배열.some(): 배열의 요소 중 하나라도 조건을 만족하면 true 반환
   * - 배열.sort(): 배열을 정렬하는 메서드 (원본 배열을 변경)
   * - 스프레드 연산자([...campaigns]): 배열을 복사하여 원본 보호
   */
  const filteredCampaigns = useMemo(() => {
    let filtered = [...campaigns]; // 원본 배열 보호를 위해 복사

    // 1단계: 유형 필터링
    if (currentFilters.types && currentFilters.types.length > 0) {
      filtered = filtered.filter((campaign) => {
        const campaignType = (campaign as any).type || campaign.campaignType;
        return currentFilters.types!.includes(campaignType);
      });
    }

    // 2단계: 채널 필터링
    if (currentFilters.channels && currentFilters.channels.length > 0) {
      filtered = filtered.filter((campaign) => {
        const brandName = (campaign as any).brand || campaign.brandName;
        
        if (!brandName) return false;

        const normalizedBrandName = normalizeChannelName(brandName);
        return currentFilters.channels!.some((channel) => {
          const normalizedChannel = normalizeChannelName(channel);
          return normalizedBrandName === normalizedChannel;
        });
      });
    }

    // 3단계: 검색어 필터링
    if (currentFilters.searchQuery && currentFilters.searchQuery.trim() !== "") {
      const query = currentFilters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter((campaign) =>
        campaign.title.toLowerCase().includes(query)
      );
    }

    // 4단계: 정렬
    const sortBy = currentFilters.sortBy || selectedSort || defaultSort;
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "최신순":
          if (!a.recruitmentPeriod && !b.recruitmentPeriod) return 0;
          if (!a.recruitmentPeriod) return 1;
          if (!b.recruitmentPeriod) return -1;
          
          const dateA = parseDate(a.recruitmentPeriod);
          const dateB = parseDate(b.recruitmentPeriod);
          return dateB.getTime() - dateA.getTime();

        case "인기순":
          const countA = a.recruitedCount ?? 0;
          const countB = b.recruitedCount ?? 0;
          return countB - countA;

        case "마감임박순":
          const leftA = a.daysLeft ?? Infinity;
          const leftB = b.daysLeft ?? Infinity;
          
          if (leftA < 0 && leftB >= 0) return 1;
          if (leftA >= 0 && leftB < 0) return -1;
          return leftA - leftB;

        default:
          return 0;
      }
    });

    return filtered;
  }, [
    campaigns,
    currentFilters.types,
    currentFilters.channels,
    currentFilters.searchQuery,
    currentFilters.sortBy,
    selectedSort,
    defaultSort,
  ]);

  /* ========================================
     부수 효과 (Side Effects)
     ======================================== */

  /**
   * useEffect 훅: 필터링된 캠페인 목록이 변경될 때 부모 컴포넌트에 알림
   *
   * 설명:
   * - 필터링된 캠페인 목록이 변경될 때마다 부모 컴포넌트에 알립니다.
   * - 부모 컴포넌트는 이 콜백을 통해 필터링된 결과를 받을 수 있습니다.
   *
   * 학습 포인트:
   * - useEffect: 컴포넌트의 부수 효과를 처리합니다.
   * - 의존성 배열: filteredCampaigns가 변경될 때마다 실행됩니다.
   */
  useEffect(() => {
    onFilteredCampaignsChange(filteredCampaigns);
  }, [filteredCampaigns, onFilteredCampaignsChange]);

  /**
   * useEffect 훅: 모달이 열릴 때 body 스크롤 방지
   *
   * 설명:
   * - 모달이 열리면 배경 스크롤을 방지하여 사용자 경험을 개선합니다.
   * - 모달이 닫히면 스크롤을 다시 활성화합니다.
   *
   * 학습 포인트:
   * - useEffect: 컴포넌트의 부수 효과를 처리합니다.
   * - 의존성 배열: 모달 상태가 변경될 때마다 실행됩니다.
   * - cleanup 함수: 컴포넌트 언마운트 시 스크롤을 복원합니다.
   */
  useEffect(() => {
    const hasOpenModal = isTypeModalOpen || isChannelModalOpen || isSortModalOpen;

    if (hasOpenModal) {
      // 모달이 열리면 body 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      // 모달이 닫히면 스크롤 복원
      document.body.style.overflow = "unset";
    }

    // cleanup 함수: 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isTypeModalOpen, isChannelModalOpen, isSortModalOpen]);

  /* ========================================
     이벤트 핸들러 (Event Handlers)
     ======================================== */

  /**
   * 유형 필터 버튼 클릭 핸들러
   *
   * 설명:
   * - 유형 필터 버튼을 클릭하면 모달을 엽니다.
   * - 현재 선택된 유형들을 임시 상태로 복사합니다.
   */
  const handleTypeButtonClick = () => {
    setTempTypes(currentFilters.types || []);
    setIsTypeModalOpen(true);
  };

  /**
   * 채널 필터 버튼 클릭 핸들러
   *
   * 설명:
   * - 채널 필터 버튼을 클릭하면 모달을 엽니다.
   * - 현재 선택된 채널들을 임시 상태로 복사합니다.
   */
  const handleChannelButtonClick = () => {
    setTempChannels(currentFilters.channels || []);
    setIsChannelModalOpen(true);
  };

  /**
   * 정렬 버튼 클릭 핸들러
   *
   * 설명:
   * - 정렬 버튼을 클릭하면 정렬 모달을 엽니다.
   * - 현재 선택된 정렬 옵션을 임시 상태로 복사합니다.
   */
  const handleSortButtonClick = () => {
    setTempSort(selectedSort);
    setIsSortModalOpen(true);
  };

  /**
   * 유형 토글 핸들러 (모달 내부용)
   *
   * 설명:
   * - 모달에서 유형을 선택/해제할 때 호출됩니다.
   * - 배열에 있으면 제거, 없으면 추가합니다.
   *
   * 학습 포인트:
   * - 배열.includes(): 배열에 특정 값이 포함되어 있는지 확인
   * - 스프레드 연산자(...): 배열을 복사하거나 새로운 요소를 추가
   * - 삼항 연산자: 조건에 따라 다른 값을 반환
   */
  const handleTypeToggle = (option: string | { value: string; label: string }) => {
    const typeValue = typeof option === "string" ? option : option.value;
    setTempTypes((prev) => {
      if (prev.includes(typeValue)) {
        // 이미 선택되어 있으면 제거
        return prev.filter((item) => item !== typeValue);
      } else {
        // 선택되어 있지 않으면 추가
        return [...prev, typeValue];
      }
    });
  };

  /**
   * 채널 토글 핸들러 (모달 내부용)
   *
   * 설명:
   * - 모달에서 채널을 선택/해제할 때 호출됩니다.
   * - 배열에 있으면 제거, 없으면 추가합니다.
   */
  const handleChannelToggle = (option: string | { value: string; label: string }) => {
    const channelValue = typeof option === "string" ? option : option.value;
    setTempChannels((prev) => {
      if (prev.includes(channelValue)) {
        return prev.filter((item) => item !== channelValue);
      } else {
        return [...prev, channelValue];
      }
    });
  };

  /**
   * 유형 필터 적용 핸들러
   *
   * 설명:
   * - 모달에서 "필터 적용하기" 버튼을 클릭하면 호출됩니다.
   * - 임시 상태를 실제 필터 상태로 적용합니다.
   * - 부모 컴포넌트에 필터 변경을 알립니다.
   */
  const handleTypeApply = () => {
    setIsTypeModalOpen(false);
    const newFilters = {
      types: tempTypes,
      channels: currentFilters.channels,
      searchQuery: searchQuery,
      sortBy: selectedSort,
    };
    
    // 내부 상태 업데이트
    setInternalFilters(newFilters);
    
    // 부모 컴포넌트에 알림
    onFilterChange?.(newFilters);
  };

  /**
   * 채널 필터 적용 핸들러
   *
   * 설명:
   * - 모달에서 "필터 적용하기" 버튼을 클릭하면 호출됩니다.
   * - 임시 상태를 실제 필터 상태로 적용합니다.
   */
  const handleChannelApply = () => {
    setIsChannelModalOpen(false);
    const newFilters = {
      types: currentFilters.types,
      channels: tempChannels,
      searchQuery: searchQuery,
      sortBy: selectedSort,
    };
    
    // 내부 상태 업데이트
    setInternalFilters(newFilters);
    
    // 부모 컴포넌트에 알림
    onFilterChange?.(newFilters);
  };

  /**
   * 정렬 적용 핸들러
   *
   * 설명:
   * - 정렬 모달에서 옵션을 선택하면 즉시 적용됩니다.
   * - 선택된 정렬 옵션을 상태에 저장하고 부모 컴포넌트에 알립니다.
   */
  const handleSortToggle = (option: string | { value: string; label: string }) => {
    const sortValue = typeof option === "string" ? option : option.value;
    setTempSort(sortValue);
    setSelectedSort(sortValue);
    setIsSortModalOpen(false);
    const newFilters = {
      types: currentFilters.types,
      channels: currentFilters.channels,
      searchQuery: searchQuery,
      sortBy: sortValue,
    };
    
    // 내부 상태 업데이트
    setInternalFilters(newFilters);
    
    // 부모 컴포넌트에 알림
    onFilterChange?.(newFilters);
  };

  /**
   * 유형 필터 초기화 핸들러
   *
   * 설명:
   * - 모달에서 "선택 초기화" 버튼을 클릭하면 호출됩니다.
   * - 임시 상태를 빈 배열로 초기화합니다.
   */
  const handleTypeReset = () => {
    setTempTypes([]);
  };

  /**
   * 채널 필터 초기화 핸들러
   *
   * 설명:
   * - 모달에서 "선택 초기화" 버튼을 클릭하면 호출됩니다.
   * - 임시 상태를 빈 배열로 초기화합니다.
   */
  const handleChannelReset = () => {
    setTempChannels([]);
  };

  /**
   * 검색어 변경 핸들러
   *
   * 설명:
   * - 검색 입력창에 텍스트를 입력할 때마다 호출됩니다.
   * - 입력된 값을 상태에 저장하고 부모 컴포넌트에 알립니다.
   *
   * 학습 포인트:
   * - 이벤트 객체: React.SyntheticEvent 타입
   * - 이벤트 타겟: e.target은 이벤트가 발생한 요소
   * - HTMLInputElement: input 요소의 타입
   * - value 속성: input 요소에 입력된 값
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const newFilters = {
      types: currentFilters.types,
      channels: currentFilters.channels,
      searchQuery: query,
      sortBy: selectedSort,
    };
    
    // 내부 상태 업데이트
    setInternalFilters(newFilters);
    
    // 부모 컴포넌트에 알림
    onFilterChange?.(newFilters);
  };

  /**
   * 유형 필터 제거 핸들러
   *
   * 설명:
   * - 활성 필터 태그의 X 버튼을 클릭하면 해당 유형 필터를 제거합니다.
   * - 배열에서 특정 유형을 제거하고 부모 컴포넌트에 알립니다.
   *
   * 학습 포인트:
   * - 배열.filter(): 조건에 맞는 요소만 남기는 배열 메서드
   * - 화살표 함수: 간단한 함수 표현식
   */
  const handleTypeRemove = (type: string) => {
    const newTypes = currentFilters.types?.filter((item) => item !== type) || [];
    const newFilters = {
      types: newTypes.length > 0 ? newTypes : undefined,
      channels: currentFilters.channels,
      searchQuery: searchQuery,
      sortBy: selectedSort,
    };
    
    // 내부 상태 업데이트
    setInternalFilters(newFilters);
    
    // 부모 컴포넌트에 알림
    onFilterChange?.(newFilters);
  };

  /**
   * 채널 필터 제거 핸들러
   *
   * 설명:
   * - 활성 필터 태그의 X 버튼을 클릭하면 해당 채널 필터를 제거합니다.
   * - 배열에서 특정 채널을 제거하고 부모 컴포넌트에 알립니다.
   */
  const handleChannelRemove = (channel: string) => {
    const newChannels =
      currentFilters.channels?.filter((item) => item !== channel) || [];
    const newFilters = {
      types: currentFilters.types,
      channels: newChannels.length > 0 ? newChannels : undefined,
      searchQuery: searchQuery,
      sortBy: selectedSort,
    };
    
    // 내부 상태 업데이트
    setInternalFilters(newFilters);
    
    // 부모 컴포넌트에 알림
    onFilterChange?.(newFilters);
  };

  /* ========================================
     렌더링 (Rendering)
     ======================================== */

  /**
   * JSX 반환: 컴포넌트의 UI 구조
   *
   * 설명:
   * - 필터 바 컨테이너
   * - 필터 버튼들 (유형, 채널)
   * - 검색 입력창
   * - 정렬 드롭다운
   * - 필터 모달들 (조건부 렌더링)
   *
   * 학습 포인트:
   * - className: CSS 모듈을 사용한 스타일링
   * - 조건부 렌더링: && 연산자로 모달 표시/숨김
   * - 이벤트 바인딩: onClick, onChange 등
   * - 이미지 경로: public 폴더의 이미지 사용
   */
  return (
    <div className={styles.filter_bar}>
      {/* 필터 버튼 및 검색 영역 */}
      <div className={styles.filter_container}>

        <div className={styles.filter_buttons_container}>
                    {/* 왼쪽: 필터 버튼들 */}
        <div className={styles.filter_buttons}>
          {/* 유형 필터 버튼 */}
          <button
            className={`${styles.filter_button} ${
              currentFilters.types && currentFilters.types.length > 0
                ? styles.filter_button_active
                : ""
            }`}
            onClick={handleTypeButtonClick}
          >
            {/* 체크박스 아이콘 */}
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

          {/* 채널 필터 버튼 */}
          <button
            className={`${styles.filter_button} ${
              currentFilters.channels && currentFilters.channels.length > 0
                ? styles.filter_button_active
                : ""
            }`}
            onClick={handleChannelButtonClick}
          >
            {/* 체크박스 아이콘 */}
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

        {/* 오른쪽: 검색창 및 정렬 */}
        <div className={styles.search_sort_container}>
          {/* 검색 입력창 */}
          <div className={styles.search_container}>
            {/* 검색 아이콘 */}
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

          {/* 정렬 드롭다운 버튼 */}
          <button
            className={styles.sort_button}
            onClick={handleSortButtonClick}
          >
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
         {/* 활성 필터 태그 영역 */}
      {(currentFilters.types && currentFilters.types.length > 0) ||
      (currentFilters.channels && currentFilters.channels.length > 0) ? (
        <div className={styles.active_filters}>
          {/* 활성화된 유형 필터 태그들 */}
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

          {/* 활성화된 채널 필터 태그들 */}
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
    
     

      {/* 유형 필터 모달 */}
      <ModalFilter
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        title="필터"
        sectionTitle="유형"
        options={typeOptions}
        selectedValues={tempTypes}
        onOptionChange={handleTypeToggle}
        onApply={handleTypeApply}
        onReset={handleTypeReset}
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

      {/* 정렬 모달 */}
      <ModalFilter
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        title="정렬"
        options={sortOptions}
        selectedValues={tempSort}
        onOptionChange={handleSortToggle}
        onApply={() => setIsSortModalOpen(false)}
        onReset={() => {
          setTempSort(defaultSort);
          setSelectedSort(defaultSort);
        }}
        type="radio"
        showReset={false}
        showApply={false} // 정렬은 선택 시 즉시 적용되므로 버튼 숨김
        layout="vertical"
        noScroll={true} // 정렬 모달은 옵션이 적어 스크롤 불필요
      />
    </div>
  );
}

