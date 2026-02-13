/* ========================================
   🗺️ 지역 필터 컴포넌트
   ======================================== */

/**
 * 지역 필터 컴포넌트
 *
 * 목적: 계층적 지역 구조를 지원하는 특별한 지역 필터 컴포넌트입니다.
 *
 * 사용 페이지:
 * - FilterBar 컴포넌트에서 지역 필터로 사용 (useRegionFilter=true일 때)
 * - /campaign/visit (방문형 캠페인 목록)
 *
 * 참고: RegionFilter는 FilterBar 컴포넌트 내부에서 사용되며,
 * 방문형 캠페인 목록 페이지에서만 지역 필터가 활성화됩니다.
 *
 * 주요 기능:
 * - 계층적 지역 구조 (시/도 > 세부 지역)
 * - 메인 지역 탭 전환 (서울, 경기, 인천 등)
 * - 세부 지역 다중 선택
 * - 전체 선택/해제 기능
 * - 지역별 선택 개수 표시
 * - 필터 적용/초기화 기능
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useHasScroll } from "../../../hooks/common/useHasScroll";
import modalStyles from "../../../styles/filter/filter_bar/modal.module.css";
import optionsStyles from "../../../styles/filter/filter_bar/modal_options.module.css";
import footerStyles from "../../../styles/filter/filter_bar/modal_footer.module.css";
import regionStyles from "../../../styles/filter/filter_bar/region.module.css";

// RegionFilter 컴포넌트의 props 타입 정의
interface RegionFilterProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  selectedRegions: string[];
  onRegionChange: (regions: string[]) => void;
  onApply: (regions?: string[]) => void;
  onReset: () => void;
}

export default function RegionFilter({
  isOpen,
  onClose,
  title,
  selectedRegions,
  onRegionChange,
  onApply,
  onReset,
}: RegionFilterProps) {
  // 지역 데이터 (고정 데이터)
  const regionData = {
    mainRegions: [
      "전체",
      "서울",
      "인천",
      "경기",
      "강원",
      "대전",
      "세종",
      "충북",
      "충남",
      "전북",
      "전남",
      "광주",
      "대구",
      "경북",
      "경남",
      "부산",
      "울산",
      "제주",
    ],
    subRegions: {
      서울: [
        "강북구",
        "관악구",
        "구로구",
        "노원구",
        "동대문구",
        "마포구",
        "서초구",
        "성북구",
        "양천구",
        "용산구",
        "강남구",
        "강서구",
        "광진구",
        "금천구",
        "도봉구",
        "동작구",
        "서대문구",
        "성동구",
        "송파구",
        "영등포구",
        "은평구",
        "종로구",
        "중구",
        "중랑구",
        "강동구",
      ],
      인천: [
        "강화군",
        "검단구",
        "계양구",
        "남구",
        "남동구",
        "미추홀구",
        "부평구",
        "서구",
        "연수구",
        "영종구",
        "옹진구",
        "제물포구",
      ],
      경기: [
        "고양시",
        "광명시",
        "구리시",
        "김포시",
        "동두천시",
        "성남시",
        "시흥시",
        "안성시",
        "양주시",
        "여주시",
        "가평군",
        "과천시",
        "광주시",
        "군포시",
        "남양주시",
        "부천시",
        "수원시",
        "안산시",
        "안양시",
        "양평군",
        "연천군",
        "오산시",
        "용인시",
        "의왕시",
        "의정부시",
        "이천시",
        "파주시",
        "평택시",
        "포천시",
        "하남시",
        "화성시",
      ],
      강원: [
        "강릉시",
        "고성군",
        "동해시",
        "삼척시",
        "속초시",
        "양구군",
        "양양군",
        "영월군",
        "원주시",
        "인제군",
        "정선군",
        "철원군",
        "춘천시",
        "태백시",
        "평창군",
        "홍천군",
        "화천군",
        "횡성군",
      ],
      대전: ["대덕구", "동구", "서구", "유성구", "중구"],
      세종: ["세종시"],
      충북: [
        "괴산군",
        "단양군",
        "보은군",
        "영동군",
        "옥천군",
        "음성군",
        "제천시",
        "증평군",
        "진천군",
        "청원군",
        "청주시",
        "충주시",
      ],
      충남: [
        "계룡시",
        "공주시",
        "금산군",
        "논산시",
        "당진시",
        "보령시",
        "부여군",
        "서산시",
        "서천군",
        "아산시",
        "연기군",
        "예산군",
        "천안시",
        "청양군",
        "태안군",
        "홍성군",
      ],
      전북: [
        "고창군",
        "군산시",
        "김제시",
        "남원시",
        "무주군",
        "부안군",
        "순창군",
        "완주군",
        "익산시",
        "임실군",
        "장수군",
        "전주시",
        "정읍시",
        "진안군",
      ],
      전남: [
        "강진군",
        "고흥군",
        "곡성군",
        "광양시",
        "구례군",
        "나주시",
        "담양군",
        "목포시",
        "무안군",
        "보성군",
        "순천시",
        "신안군",
        "여수시",
        "영광군",
        "영암군",
        "완도군",
        "장성군",
        "장흥군",
        "진도군",
        "함평군",
        "해남군",
        "화순군",
      ],
      광주: ["광산구", "남구", "동구", "북구", "서구"],
      대구: [
        "남구",
        "달서구",
        "달성군",
        "동구",
        "북구",
        "서구",
        "수성구",
        "중구",
      ],
      경북: [
        "경산시",
        "경주시",
        "고령군",
        "구미시",
        "군위군",
        "김천시",
        "문경시",
        "봉화군",
        "상주시",
        "성주군",
        "안동시",
        "영덕군",
        "영양군",
        "영주시",
        "영천시",
        "예천군",
        "울릉군",
        "울진군",
        "의성군",
        "청도군",
        "청송군",
        "칠곡군",
        "포항시",
      ],
      경남: [
        "거제시",
        "거창군",
        "고성군",
        "김해시",
        "남해군",
        "마산시",
        "밀양시",
        "사천시",
        "산청군",
        "양산시",
        "의령군",
        "진주시",
        "진해시",
        "창녕군",
        "창원시",
        "통영시",
        "하동군",
        "함안군",
        "합천군",
      ],
      부산: [
        "강서구",
        "금정구",
        "기장군",
        "남구",
        "동구",
        "동래구",
        "부산진구",
        "북구",
        "사상구",
        "사하구",
        "서구",
        "수영구",
        "연제구",
        "영도구",
        "중구",
        "해운대구",
      ],
      울산: ["남구", "동구", "북구", "울주군", "중구"],
      제주: ["서귀포시", "제주시"],
    },
  };
  const [selectedMainRegion, setSelectedMainRegion] = useState("전체");
  const [tempSelectedRegions, setTempSelectedRegions] = useState<string[]>([]);

  // 모달이 열릴 때 초기화
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

    // cleanup 함수 - 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 메인 지역 탭 클릭 핸들러
  const handleMainRegionClick = (region: string) => {
    setSelectedMainRegion(region);
  };

  // "X > X 전체" 형식 문자열 생성 (예: "서울 > 서울 전체")
  const getRegionAllKey = (mainRegion: string) =>
    `${mainRegion} > ${mainRegion} 전체`;

  // 세부 지역 선택/해제 핸들러
  const handleSubRegionToggle = (subRegion: string) => {
    const fullRegionName = `${selectedMainRegion} > ${subRegion}`;

    setTempSelectedRegions((prev) => {
      if (prev.includes(fullRegionName)) {
        return prev.filter((region) => region !== fullRegionName);
      } else {
        return [...prev, fullRegionName];
      }
    });
  };

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (selectedMainRegion === "전체") {
      const regionsToToggle = Object.keys(regionData.subRegions).map(
        (mainRegion) => `${mainRegion} > ${mainRegion} 전체`,
      );
      const isAllSelected = regionsToToggle.every((region) =>
        tempSelectedRegions.includes(region),
      );
      if (isAllSelected) {
        setTempSelectedRegions((prev) =>
          prev.filter((region) => !regionsToToggle.includes(region)),
        );
      } else {
        setTempSelectedRegions((prev) => {
          const newRegions = [...prev];
          regionsToToggle.forEach((region) => {
            if (!newRegions.includes(region)) newRegions.push(region);
          });
          return newRegions;
        });
      }
      return;
    }
    const regionAllKey = getRegionAllKey(selectedMainRegion);
    const subList =
      regionData.subRegions[
        selectedMainRegion as keyof typeof regionData.subRegions
      ]?.map(
        (subRegion: string) => `${selectedMainRegion} > ${subRegion}`,
      ) || [];
    const isAllSelected =
      tempSelectedRegions.includes(regionAllKey) ||
      subList.every((s) => tempSelectedRegions.includes(s));
    if (isAllSelected) {
      setTempSelectedRegions((prev) =>
        prev.filter(
          (r) => r !== regionAllKey && !subList.includes(r),
        ),
      );
    } else {
      setTempSelectedRegions((prev) => {
        const without_this_main = prev.filter(
          (r) => r !== regionAllKey && !subList.includes(r),
        );
        return [...without_this_main, regionAllKey];
      });
    }
  };

  // 적용 핸들러
  const handleApply = () => {
    onRegionChange(tempSelectedRegions);
    onApply(tempSelectedRegions);
  };

  // 초기화 핸들러
  const handleReset = () => {
    setTempSelectedRegions([]);
    onReset();
  };

  // 현재 선택된 메인 지역의 세부 지역들
  // 전체 탭: 각 지역별 "X > X 전체" 옵션 | 개별 탭: "X 전체" + 실제 세부 지역 목록
  const currentSubRegions =
    selectedMainRegion === "전체"
      ? Object.keys(regionData.subRegions).map((mainRegion) =>
          getRegionAllKey(mainRegion),
        )
      : (() => {
          const subList =
            regionData.subRegions[
              selectedMainRegion as keyof typeof regionData.subRegions
            ]?.map(
              (subRegion: string) => `${selectedMainRegion} > ${subRegion}`,
            ) || [];
          // 개별 탭(서울, 경기 등)에서는 맨 앞에 "X 전체" 옵션 추가
          return [getRegionAllKey(selectedMainRegion), ...subList];
        })();

  // 현재 메인 지역의 "X 전체"가 선택됐는지 (개별 탭에서만 의미 있음)
  // "X 전체"가 있거나, 해당 메인 지역의 모든 구가 선택된 경우에도 true
  const currentMainSubList =
    selectedMainRegion !== "전체"
      ? (regionData.subRegions[
          selectedMainRegion as keyof typeof regionData.subRegions
        ]?.map(
          (sub: string) => `${selectedMainRegion} > ${sub}`,
        ) || [])
      : [];
  const isRegionAllSelected =
    selectedMainRegion !== "전체" &&
    (tempSelectedRegions.includes(getRegionAllKey(selectedMainRegion)) ||
      (currentMainSubList.length > 0 &&
        currentMainSubList.every((r) => tempSelectedRegions.includes(r))));

  // 현재 메인 지역의 모든 세부 지역이 선택되었는지 확인
  const isAllSelectedInCurrentRegion =
    currentSubRegions.length > 0 &&
    currentSubRegions.every((region) => tempSelectedRegions.includes(region));

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const subRegionsRef = useRef<HTMLDivElement>(null);
  const hasScroll = useHasScroll(subRegionsRef, isOpen, [
    currentSubRegions,
    selectedMainRegion,
  ]);

  if (!isOpen) return null;

  return (
    <div className={modalStyles.modal_overlay} onClick={handleBackdropClick}>
      <div
        className={`${modalStyles.modal_content} ${regionStyles.region_modal_content}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className={modalStyles.modal_header}>
          <h3 className={modalStyles.modal_title}>{title}</h3>
          <button className={modalStyles.modal_close_button} onClick={onClose}>
            <img src="/images/filter/x_icon.svg" alt="닫기" />
          </button>
        </div>

        {/* 모달 바디 */}
        <div
          className={`${modalStyles.modal_body} ${!hasScroll ? modalStyles.modal_body_no_margin : ""}`}
        >
          {/* 지역 섹션 제목 */}
          <h4 className={regionStyles.region_section_title}>지역</h4>

          {/* 메인 지역 탭들 */}
          <div className={regionStyles.region_tabs}>
            {regionData.mainRegions.map((region) => (
              <button
                key={region}
                className={`${regionStyles.region_tab} ${
                  selectedMainRegion === region
                    ? regionStyles.region_tab_active
                    : ""
                }`}
                onClick={() => handleMainRegionClick(region)}
              >
                {region}
              </button>
            ))}
          </div>

          {/* 세부 지역 목록 */}
          {currentSubRegions.length > 0 && (
            <div
              ref={subRegionsRef}
              className={regionStyles.sub_regions_container}
            >
              <div className={optionsStyles.options_grid}>
                {currentSubRegions.map((fullRegionName) => {
                  const isRegionAll =
                    selectedMainRegion !== "전체" &&
                    fullRegionName === getRegionAllKey(selectedMainRegion);
                  const isSelected = isRegionAll
                    ? isRegionAllSelected
                    : tempSelectedRegions.includes(fullRegionName) ||
                      isRegionAllSelected;

                  return (
                    <label
                      key={fullRegionName}
                      className={optionsStyles.option_item}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (selectedMainRegion === "전체") {
                            // 전체 탭: "서울 > 서울 전체" 등 토글
                            setTempSelectedRegions((prev) => {
                              const filtered = prev.filter(
                                (region) => region !== "지역 전체",
                              );
                              if (filtered.includes(fullRegionName)) {
                                return filtered.filter(
                                  (region) => region !== fullRegionName,
                                );
                              }
                              return [...filtered, fullRegionName];
                            });
                          } else {
                            // 개별 지역 탭 (서울 등): "X 전체" ↔ 구 목록 연동
                            const regionAllKey =
                              getRegionAllKey(selectedMainRegion);
                            const subList =
                              regionData.subRegions[
                                selectedMainRegion as keyof typeof regionData.subRegions
                              ]?.map(
                                (sub: string) =>
                                  `${selectedMainRegion} > ${sub}`,
                              ) || [];

                            setTempSelectedRegions((prev) => {
                              const filtered = prev.filter(
                                (region) => region !== "지역 전체",
                              );

                              if (isRegionAll) {
                                // "서울 전체" 체크/해제
                                if (
                                  filtered.includes(regionAllKey) ||
                                  subList.every((s) => filtered.includes(s))
                                ) {
                                  return filtered.filter(
                                    (r) =>
                                      r !== regionAllKey &&
                                      !subList.includes(r),
                                  );
                                }
                                const without_this_main = filtered.filter(
                                  (r) =>
                                    r !== regionAllKey &&
                                    !subList.includes(r),
                                );
                                return [...without_this_main, regionAllKey];
                              }

                              // 구 하나 체크/해제
                              if (filtered.includes(regionAllKey)) {
                                // 서울 전체 체크된 상태에서 이 구 해제 → 전체 해제, 나머지 구만 선택
                                const withoutAll = filtered.filter(
                                  (r) => r !== regionAllKey,
                                );
                                const other_gu = subList.filter(
                                  (s) => s !== fullRegionName,
                                );
                                return [...withoutAll, ...other_gu];
                              }
                              if (filtered.includes(fullRegionName)) {
                                return filtered.filter(
                                  (r) => r !== fullRegionName,
                                );
                              }
                              return [...filtered, fullRegionName];
                            });
                          }
                        }}
                        className={optionsStyles.option_checkbox}
                      />
                      <span className={optionsStyles.option_label}>
                        {fullRegionName.split(" > ").map((part, index) => (
                              <span
                                key={index}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                {part}

                                {index <
                                  fullRegionName.split(" > ").length - 1 && (
                                  <img
                                    src="/images/filter/region_arrow.svg"
                                    alt=">"
                                    className={optionsStyles.region_arrow}
                                  />
                                )}
                              </span>
                            ))}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className={footerStyles.modal_footer}>
          <button className={footerStyles.apply_button} onClick={handleApply}>
            필터 적용하기
          </button>
          <button className={footerStyles.reset_button} onClick={handleReset}>
            <Image
              src="/images/icons/reset_icon.svg"
              alt="초기화"
              width={16}
              height={16}
              className={footerStyles.reset_icon}
            />
            선택 초기화
          </button>
        </div>
      </div>
    </div>
  );
}
