/* ========================================
   지역 선택 상태 관리 훅
   ======================================== */

/**
 * useRegionSelection
 *
 * 목적: RegionFilter 컴포넌트의 지역 선택 상태·핸들러·파생값을 관리합니다.
 *
 * 사용 페이지:
 * - /campaign/visit (RegionFilter 내부)
 */

import { useState, useEffect, useRef } from "react";
import { useHasScroll } from "@/hooks/common/useHasScroll";
import { regionData } from "@/data/campaign/regions";

// ========================================
// 타입 정의
// ========================================

interface UseRegionSelectionProps {
  isOpen: boolean;
  selectedRegions: string[];
  onRegionChange: (regions: string[]) => void;
  onApply: (regions?: string[]) => void;
  onReset: () => void;
}

// ========================================
// 지역 선택 상태 관리 훅
// ========================================

export function useRegionSelection({
  isOpen,
  selectedRegions,
  onRegionChange,
  onApply,
  onReset,
}: UseRegionSelectionProps) {
  const [selectedMainRegion, setSelectedMainRegion] = useState("전체");
  const [tempSelectedRegions, setTempSelectedRegions] = useState<string[]>([]);

  // 모달이 열릴 때 임시 선택 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setTempSelectedRegions(selectedRegions);
      setSelectedMainRegion("전체");
    }
  }, [isOpen, selectedRegions]);

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ========================================
  // 유틸 함수
  // ========================================

  const getRegionAllKey = (mainRegion: string) => `${mainRegion} > ${mainRegion} 전체`;

  // ========================================
  // 핸들러
  // ========================================

  const handleMainRegionClick = (region: string) => {
    setSelectedMainRegion(region);
  };

  // 세부 지역 체크박스 토글 (전체 탭과 개별 지역 탭 모두 처리)
  const handleSubRegionToggle = (fullRegionName: string) => {
    const isRegionAll =
      selectedMainRegion !== "전체" && fullRegionName === getRegionAllKey(selectedMainRegion);

    if (selectedMainRegion === "전체") {
      // 전체 탭: "서울 > 서울 전체" 등 토글
      setTempSelectedRegions((prev) => {
        const filtered = prev.filter((region) => region !== "지역 전체");
        if (filtered.includes(fullRegionName)) {
          return filtered.filter((region) => region !== fullRegionName);
        }
        // "X > X 전체" 선택 시 해당 시/도의 개별 구 선택 제거
        const mainPart = fullRegionName.split(" > ")[0];
        const subList =
          regionData.subRegions[mainPart as keyof typeof regionData.subRegions]?.map(
            (sub: string) => `${mainPart} > ${sub}`
          ) || [];
        const withoutSubRegions = filtered.filter((r) => !subList.includes(r));
        return [...withoutSubRegions, fullRegionName];
      });
    } else {
      // 개별 지역 탭: "X 전체" ↔ 구 목록 연동
      const regionAllKey = getRegionAllKey(selectedMainRegion);
      const subList =
        regionData.subRegions[selectedMainRegion as keyof typeof regionData.subRegions]?.map(
          (sub: string) => `${selectedMainRegion} > ${sub}`
        ) || [];

      setTempSelectedRegions((prev) => {
        const filtered = prev.filter((region) => region !== "지역 전체");

        if (isRegionAll) {
          // "서울 전체" 체크/해제
          if (filtered.includes(regionAllKey) || subList.every((s) => filtered.includes(s))) {
            return filtered.filter((r) => r !== regionAllKey && !subList.includes(r));
          }
          const withoutThisMain = filtered.filter(
            (r) => r !== regionAllKey && !subList.includes(r)
          );
          return [...withoutThisMain, regionAllKey];
        }

        if (filtered.includes(regionAllKey)) {
          // "X 전체" 체크된 상태에서 구 하나 해제 → 전체 해제 후 나머지 구만 선택
          const withoutAll = filtered.filter((r) => r !== regionAllKey);
          const otherGu = subList.filter((s) => s !== fullRegionName);
          return [...withoutAll, ...otherGu];
        }

        if (filtered.includes(fullRegionName)) {
          return filtered.filter((r) => r !== fullRegionName);
        }

        // 구 하나 추가: 모두 선택되면 "X 전체"로 정규화
        const next = [...filtered, fullRegionName];
        if (subList.length > 0 && subList.every((s) => next.includes(s))) {
          return next.filter((r) => !subList.includes(r)).concat([regionAllKey]);
        }
        return next;
      });
    }
  };

  const handleApply = () => {
    onRegionChange(tempSelectedRegions);
    onApply(tempSelectedRegions);
  };

  const handleReset = () => {
    setTempSelectedRegions([]);
    onReset();
  };

  // ========================================
  // 파생값 계산
  // ========================================

  // 현재 메인 지역 탭에 표시할 세부 지역 목록
  const currentSubRegions =
    selectedMainRegion === "전체"
      ? Object.keys(regionData.subRegions).map((mainRegion) => getRegionAllKey(mainRegion))
      : regionData.subRegions[selectedMainRegion as keyof typeof regionData.subRegions]?.map(
          (subRegion: string) => `${selectedMainRegion} > ${subRegion}`
        ) || [];

  // 현재 메인 지역의 모든 구 목록 (개별 탭에서만 사용)
  const currentMainSubList =
    selectedMainRegion !== "전체"
      ? regionData.subRegions[selectedMainRegion as keyof typeof regionData.subRegions]?.map(
          (sub: string) => `${selectedMainRegion} > ${sub}`
        ) || []
      : [];

  // "X 전체"가 선택됐거나 해당 지역의 모든 구가 선택된 경우 true
  const isRegionAllSelected =
    selectedMainRegion !== "전체" &&
    (tempSelectedRegions.includes(getRegionAllKey(selectedMainRegion)) ||
      (currentMainSubList.length > 0 &&
        currentMainSubList.every((r) => tempSelectedRegions.includes(r))));

  // 일부 구만 선택된 경우 indeterminate 표시
  const isRegionPartiallySelected =
    selectedMainRegion !== "전체" &&
    !tempSelectedRegions.includes(getRegionAllKey(selectedMainRegion)) &&
    currentMainSubList.some((r) => tempSelectedRegions.includes(r)) &&
    !currentMainSubList.every((r) => tempSelectedRegions.includes(r));

  const subRegionsRef = useRef<HTMLDivElement>(null);
  const hasScroll = useHasScroll(subRegionsRef, isOpen, [currentSubRegions, selectedMainRegion]);

  return {
    selectedMainRegion,
    tempSelectedRegions,
    currentSubRegions,
    isRegionAllSelected,
    isRegionPartiallySelected,
    subRegionsRef,
    hasScroll,
    getRegionAllKey,
    handleMainRegionClick,
    handleSubRegionToggle,
    handleApply,
    handleReset,
  };
}
