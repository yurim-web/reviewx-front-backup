/* ========================================
   🚶 방문형 캠페인 목록 페이지
   ======================================== */

/**
 * 방문형 캠페인 목록 페이지
 *
 * 목적: 방문형 캠페인 목록을 조회하고 필터링할 수 있는 캠페인 목록 페이지입니다.
 *
 * 페이지 경로:
 * - /visit (기존 /user/visit에서 변경)
 *
 * 사용 파일:
 * - 컴포넌트: CampaignBox, Titletext, MainMenu, FilterBar
 * - 데이터: visitCampaigns, visitCategoryOptions, visitChannelOptions, useVisitRegionFilter, visitSortOptions
 * - CSS: delivery.module.css
 *
 * 주요 기능:
 * - 방문형 캠페인 목록 표시
 * - 카테고리/채널/지역 필터링
 * - 마감임박 필터
 * - 정렬 옵션 (최신순, 인기순, 마감임박순, 포인트높은순)
 * - 캠페인 상세 페이지로 이동
 * - 빈 상태 처리 (필터 조건에 맞는 캠페인이 없을 때)
 * - useMemo를 이용한 성능 최적화
 */

"use client";

import { useState, useMemo } from "react";
import CampaignBox from "@/components/main/CampaignBox";
import Titletext from "@/components/main/Titletext";
import MainMenu from "@/components/main/MainMenu";
import FilterBar from "@/components/user/filter/FilterBar";
import { visitCampaigns } from "@/data/user/visit/visitCampaigns";
import {
  visitCategoryOptions,
  visitChannelOptions,
  useVisitRegionFilter,
  visitSortOptions,
} from "@/data/user/visit/visitFilterOptions";
import styles from "../../../styles/user/delivery/delivery.module.css";

export default function VisitPage() {
  // =================================================================
  // 🎯 학습 포인트 1: React State 관리
  // =================================================================
  // useState Hook을 사용하여 컴포넌트의 상태를 관리합니다
  // 필터 상태와 정렬 상태를 별도로 관리하여 명확한 구조를 만듭니다

  // 필터 상태 관리 (카테고리, 채널, 지역 필터)
  const [activeFilters, setActiveFilters] = useState<{
    channels: string[]; // 선택된 채널 목록 (예: ["블로그", "인스타그램"])
    categories: string[]; // 선택된 카테고리 목록 (예: ["방문형"])
    regions: string[]; // 선택된 지역 목록 (예: ["서울 강남/서초"])
  }>({
    channels: [],
    categories: [],
    regions: [],
  });

  // 마감임박 필터와 정렬 상태 관리
  const [closingSoon, setClosingSoon] = useState<boolean>(false); // 마감임박 필터 활성화 여부
  const [sortBy, setSortBy] = useState<string>("최신순"); // 현재 선택된 정렬 기준

  // =================================================================
  // 🎯 학습 포인트 2: 필터 변경 핸들러 함수
  // =================================================================
  // FilterBar 컴포넌트에서 전달받은 필터 변경사항을 처리하는 함수입니다
  // 각각의 필터 타입별로 상태를 업데이트합니다

  const handleFilterChange = (filters: any) => {
    console.log("🔧 VisitPage - 필터 변경:", filters); // 개발자 도구에서 필터 변경사항 확인용

    // 마감임박 필터 처리
    if (filters.closingSoon !== undefined) {
      setClosingSoon(filters.closingSoon);
    }

    // 정렬 기준 변경 처리
    if (filters.sortBy !== undefined) {
      setSortBy(filters.sortBy);
    }

    // 다른 필터들 (카테고리, 채널, 지역) 상태 업데이트
    setActiveFilters((prev) => {
      // 구조분해할당과 스프레드 연산자로 기존 상태를 복사
      const newFilters = { ...prev };

      // 카테고리 필터 업데이트
      if (filters.category !== undefined) {
        // 문자열을 쉼표로 분할하고, 빈 문자열 제거
        newFilters.categories = filters.category
          ? filters.category.split(",").filter((c: string) => c.trim())
          : [];
      }

      // 채널 필터 업데이트
      if (filters.channel !== undefined) {
        newFilters.channels = filters.channel
          ? filters.channel.split(",").filter((c: string) => c.trim())
          : [];
      }

      // 지역 필터 업데이트
      if (filters.region !== undefined) {
        console.log("🔧 VisitPage - 지역 필터 원본:", filters.region);
        newFilters.regions = filters.region
          ? filters.region.split(",").filter((r: string) => r.trim())
          : [];
        console.log("🔧 VisitPage - 지역 필터 업데이트:", newFilters.regions);
      }

      console.log("🔧 VisitPage - setActiveFilters 호출:", newFilters);
      return newFilters; // 새로운 필터 상태 반환
    });
  };

  // =================================================================
  // 🎯 학습 포인트 3: useMemo를 이용한 성능 최적화 & 필터링 로직
  // =================================================================
  // useMemo는 계산 비용이 높은 작업의 결과를 캐싱하여 성능을 최적화합니다
  // 의존성 배열의 값들이 변경될 때만 다시 계산되므로 불필요한 재계산을 방지합니다

  const filteredAndSortedCampaigns = useMemo(() => {
    console.log("🔄 캠페인 필터링 및 정렬 시작"); // 언제 재계산되는지 확인용
    console.log("🔄 현재 activeFilters:", activeFilters);

    // 1단계: 기본 캠페인 데이터 복사
    let filtered = [...visitCampaigns];

    // 2단계: 각 필터 조건에 따라 캠페인들을 필터링
    // ===================================================

    // 🎯 마감임박 필터 적용 (핵심 기능!)
    if (closingSoon) {
      console.log("⏰ 마감임박 필터 적용 중...");
      // dayCount가 "마감임박"인 캠페인만 필터링
      filtered = filtered.filter(
        (campaign) => campaign.dayCount === "마감임박"
      );
      console.log(`✅ 마감임박 캠페인 ${filtered.length}개 찾음`);
    }

    // 카테고리 필터 적용
    if (activeFilters.categories.length > 0) {
      console.log("📂 카테고리 필터 적용:", activeFilters.categories);
      filtered = filtered.filter((campaign) =>
        activeFilters.categories.includes(campaign.subcategory)
      );
    }

    // 채널 필터 적용
    if (activeFilters.channels.length > 0) {
      console.log("📺 채널 필터 적용:", activeFilters.channels);
      filtered = filtered.filter((campaign) =>
        activeFilters.channels.includes(campaign.channel)
      );
    }

    // 지역 필터 적용
    if (activeFilters.regions.length > 0) {
      console.log("🌍 지역 필터 적용:", activeFilters.regions);
      console.log("🌍 필터링 전 캠페인 수:", filtered.length);
      console.log(
        "🌍 캠페인들의 지역 정보:",
        filtered.map((c) => c.region)
      );

      filtered = filtered.filter((campaign) => {
        // 지역 필터와 캠페인 지역 매칭 로직
        const isMatch = activeFilters.regions.some((filterRegion) => {
          // 1. 정확한 매칭 (예: "서울 > 강남구" === "서울 > 강남구")
          if (filterRegion === campaign.region) {
            return true;
          }

          // 2. 전체 지역 매칭 (예: "서울 > 서울 전체"와 "서울 > 강남구" 매칭)
          if (filterRegion.endsWith(" 전체")) {
            const mainRegion = filterRegion.split(" > ")[0];
            return campaign.region.startsWith(`${mainRegion} >`);
          }

          return false;
        });

        console.log(
          `🌍 캠페인 "${campaign.title}" (${campaign.region}) 매칭:`,
          isMatch
        );
        return isMatch;
      });

      console.log("🌍 필터링 후 캠페인 수:", filtered.length);
    }

    // 3단계: 정렬 적용
    // ================
    console.log("🔄 정렬 적용:", sortBy);

    // 정렬 기준에 따라 배열을 정렬합니다
    switch (sortBy) {
      case "최신순":
        // ID를 기준으로 내림차순 정렬 (최신이 먼저)
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;

      case "인기순":
        // 현재 지원자 수 기준으로 내림차순 정렬
        filtered.sort((a, b) => b.recruitment.current - a.recruitment.current);
        break;

      case "마감임박순":
        // 마감임박인 캠페인을 먼저 보여주고, 나머지는 최신순
        filtered.sort((a, b) => {
          // 마감임박인 것이 우선
          if (a.dayCount === "마감임박" && b.dayCount !== "마감임박") {
            return -1; // a가 앞으로
          }
          if (b.dayCount === "마감임박" && a.dayCount !== "마감임박") {
            return 1; // b가 앞으로
          }
          // 둘 다 마감임박이거나 둘 다 아닌 경우 최신순으로 정렬
          return b.id.localeCompare(a.id);
        });
        break;

      case "포인트높은순":
        // 포인트 기준으로 내림차순 정렬
        filtered.sort((a, b) => b.points - a.points);
        break;

      default:
        // 기본값은 최신순
        filtered.sort((a, b) => b.id.localeCompare(a.id));
    }

    console.log(`✅ 최종 결과: ${filtered.length}개 캠페인`);
    return filtered;
  }, [
    // 의존성 배열: 이 값들이 변경될 때만 필터링/정렬 재실행
    activeFilters.categories, // 카테고리 필터 변경 시
    activeFilters.channels, // 채널 필터 변경 시
    activeFilters.regions, // 지역 필터 변경 시
    closingSoon, // 마감임박 필터 변경 시
    sortBy, // 정렬 기준 변경 시
  ]);

  return (
    <>
      {/* 메인 메뉴 컴포넌트 - 헤더(80px) 밑에 고정 */}
      <MainMenu />

      {/* 
        레이아웃 시프트 방지를 위한 placeholder 
        - 헤더(80px) + MainMenu(약 69px) = 149px
        - fixed된 헤더와 메뉴가 콘텐츠를 가리지 않도록 공간 확보
      */}
      <div style={{ height: "149px" }}></div>

      <main className={styles.delivery_page}>
        {/* 필터/정렬 바 */}
        <FilterBar
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
          categoryOptions={visitCategoryOptions}
          channelOptions={visitChannelOptions}
          useRegionFilter={useVisitRegionFilter}
          sortOptions={visitSortOptions}
          closingSoon={closingSoon}
          onClosingSoonChange={setClosingSoon}
        />

        <section className={styles.campaign_container}>
          <Titletext main_title="방문형" />
          <div className={styles.campaign_grid}>
            {/* 🎯 학습 포인트 4: 조건부 렌더링 */}
            {/* 필터링된 캠페인 목록의 길이에 따라 다른 내용을 표시합니다 */}
            {filteredAndSortedCampaigns.length > 0 ? (
              // 캠페인이 있을 때: map 함수로 각 캠페인을 CampaignBox 컴포넌트로 렌더링
              filteredAndSortedCampaigns.map((campaign) => (
                <CampaignBox
                  key={campaign.id} // React의 고유 key (리스트 렌더링 최적화)
                  campaign={campaign} // 캠페인 데이터 props로 전달
                  basePath="/campaign/visit" // 상세 페이지 경로 설정
                />
              ))
            ) : (
              // 캠페인이 없을 때: 빈 상태 메시지 표시
              <div className={styles.empty_state}>
                <div className={styles.empty_icon}>📍</div>
                {closingSoon ? (
                  // 마감임박 필터가 활성화되어 있고 결과가 없을 때
                  <>
                    <h3>마감임박인 방문형 캠페인이 없습니다</h3>
                    <p>다른 조건으로 검색해보세요!</p>
                  </>
                ) : (
                  // 일반적인 빈 상태 메시지
                  <>
                    <h3>현재 진행중인 방문형 캠페인이 없습니다</h3>
                    <p>새로운 캠페인을 기다려주세요!</p>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

// =================================================================
// 🎯 핵심 학습 포인트 정리
// =================================================================

/*
📚 이 컴포넌트에서 학습할 수 있는 React 개념들:

1. **State 관리 (useState)**
   - 컴포넌트의 상태를 관리하는 React Hook
   - 상태가 변경되면 컴포넌트가 리렌더링됩니다
   - 예: const [closingSoon, setClosingSoon] = useState(false)

2. **성능 최적화 (useMemo)**
   - 계산 비용이 높은 작업의 결과를 메모이제이션
   - 의존성 배열의 값이 변경될 때만 재계산
   - 불필요한 재계산을 방지하여 성능 향상

3. **배열 메서드 활용**
   - filter(): 조건에 맞는 요소만 걸러내기
   - map(): 배열의 각 요소를 변환하여 새 배열 만들기
   - sort(): 배열 요소를 정렬하기
   - includes(): 배열에 특정 값이 포함되어 있는지 확인

4. **조건부 렌더링**
   - 삼항 연산자 (? :)를 사용한 조건부 렌더링
   - 조건에 따라 다른 JSX 요소를 렌더링

5. **컴포넌트 간 데이터 전달 (Props)**
   - 부모 컴포넌트에서 자식 컴포넌트로 데이터 전달
   - FilterBar에 onFilterChange 함수를 전달하여 콜백 패턴 구현

6. **이벤트 핸들링**
   - 사용자 상호작용(필터 변경)을 처리하는 함수 작성
   - 상태 업데이트를 통한 UI 반영

💡 추천 학습 순서:
1. useState Hook 기본 사용법 익히기
2. 배열 메서드 (map, filter, sort) 연습하기
3. 조건부 렌더링 패턴 익히기
4. useMemo를 이용한 최적화 이해하기
5. 컴포넌트 간 데이터 전달 패턴 학습하기

🔍 개발자 도구 활용:
- 콘솔 로그를 통해 필터링 과정 확인 가능
- React Developer Tools로 컴포넌트 상태 모니터링
- Network 탭으로 데이터 로딩 확인 (향후 API 연동 시)
*/
