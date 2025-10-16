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

import { useState, useEffect } from "react";
import styles from "../../../styles/filter/filter_bar.module.css";

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
        "강남구",
        "강동구",
        "강북구",
        "강서구",
        "관악구",
        "광진구",
        "구로구",
        "금천구",
        "노원구",
        "도봉구",
        "동대문구",
        "동작구",
        "마포구",
        "서대문구",
        "서초구",
        "성동구",
        "성북구",
        "송파구",
        "양천구",
        "영등포구",
        "용산구",
        "은평구",
        "종로구",
        "중구",
        "중랑구",
      ],
      인천: [
        "계양구",
        "남구",
        "남동구",
        "동구",
        "부평구",
        "서구",
        "연수구",
        "중구",
        "강화군",
        "옹진군",
      ],
      경기: [
        "수원시",
        "성남시",
        "의정부시",
        "안양시",
        "부천시",
        "광명시",
        "평택시",
        "과천시",
        "오산시",
        "시흥시",
        "군포시",
        "의왕시",
        "하남시",
        "용인시",
        "파주시",
        "이천시",
        "안성시",
        "김포시",
        "화성시",
        "광주시",
        "여주시",
        "양평군",
        "고양시",
        "동두천시",
        "가평군",
        "연천군",
        "포천시",
        "양주시",
        "구리시",
        "남양주시",
      ],
      강원: [
        "춘천시",
        "원주시",
        "강릉시",
        "동해시",
        "태백시",
        "속초시",
        "삼척시",
        "홍천군",
        "횡성군",
        "영월군",
        "평창군",
        "정선군",
        "철원군",
        "화천군",
        "양구군",
        "인제군",
        "고성군",
        "양양군",
      ],
      대전: ["동구", "중구", "서구", "유성구", "대덕구"],
      세종: ["세종특별자치시"],
      충북: [
        "청주시",
        "충주시",
        "제천시",
        "보은군",
        "옥천군",
        "영동군",
        "증평군",
        "진천군",
        "괴산군",
        "음성군",
        "단양군",
      ],
      충남: [
        "천안시",
        "공주시",
        "보령시",
        "아산시",
        "서산시",
        "논산시",
        "계룡시",
        "당진시",
        "금산군",
        "부여군",
        "서천군",
        "청양군",
        "홍성군",
        "예산군",
        "태안군",
      ],
      전북: [
        "전주시",
        "군산시",
        "익산시",
        "정읍시",
        "남원시",
        "김제시",
        "완주군",
        "진안군",
        "무주군",
        "장수군",
        "임실군",
        "순창군",
        "고창군",
        "부안군",
      ],
      전남: [
        "목포시",
        "여수시",
        "순천시",
        "나주시",
        "광양시",
        "담양군",
        "곡성군",
        "구례군",
        "고흥군",
        "보성군",
        "화순군",
        "장흥군",
        "강진군",
        "해남군",
        "영암군",
        "무안군",
        "함평군",
        "영광군",
        "장성군",
        "완도군",
        "진도군",
        "신안군",
      ],
      광주: ["동구", "서구", "남구", "북구", "광산구"],
      대구: [
        "중구",
        "동구",
        "서구",
        "남구",
        "북구",
        "수성구",
        "달서구",
        "달성군",
      ],
      경북: [
        "포항시",
        "경주시",
        "김천시",
        "안동시",
        "구미시",
        "영주시",
        "영천시",
        "상주시",
        "문경시",
        "경산시",
        "군위군",
        "의성군",
        "청송군",
        "영양군",
        "영덕군",
        "청도군",
        "고령군",
        "성주군",
        "칠곡군",
        "예천군",
        "봉화군",
        "울진군",
        "울릉군",
      ],
      경남: [
        "창원시",
        "진주시",
        "통영시",
        "사천시",
        "김해시",
        "밀양시",
        "거제시",
        "양산시",
        "의령군",
        "함안군",
        "창녕군",
        "고성군",
        "남해군",
        "하동군",
        "산청군",
        "함양군",
        "거창군",
        "합천군",
      ],
      부산: [
        "중구",
        "서구",
        "동구",
        "영도구",
        "부산진구",
        "동래구",
        "남구",
        "북구",
        "해운대구",
        "사하구",
        "금정구",
        "강서구",
        "연제구",
        "수영구",
        "사상구",
        "기장군",
      ],
      울산: ["중구", "남구", "동구", "북구", "울주군"],
      제주: ["제주시", "서귀포시"],
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
      // 전체 지역의 모든 메인 지역 전체 선택
      const allRegions: string[] = Object.keys(regionData.subRegions).map(
        (mainRegion) => `${mainRegion} > ${mainRegion} 전체`
      );

      if (tempSelectedRegions.length === allRegions.length) {
        setTempSelectedRegions([]);
      } else {
        setTempSelectedRegions(allRegions);
      }
    } else {
      // 선택된 메인 지역의 모든 세부 지역 선택 (전체 옵션 포함)
      const currentSubRegions =
        regionData.subRegions[
          selectedMainRegion as keyof typeof regionData.subRegions
        ] || [];
      const currentFullRegions = [
        `${selectedMainRegion} > ${selectedMainRegion} 전체`, // 전체 옵션 포함
        ...currentSubRegions.map(
          (subRegion: string) => `${selectedMainRegion} > ${subRegion}`
        ),
      ];

      const isAllSelected = currentFullRegions.every((region) =>
        tempSelectedRegions.includes(region)
      );

      if (isAllSelected) {
        // 모두 선택되어 있으면 해제
        setTempSelectedRegions((prev) =>
          prev.filter((region) => !currentFullRegions.includes(region))
        );
      } else {
        // 모두 선택
        setTempSelectedRegions((prev) => {
          const newRegions = [...prev];
          currentFullRegions.forEach((region) => {
            if (!newRegions.includes(region)) {
              newRegions.push(region);
            }
          });
          return newRegions;
        });
      }
    }
  };

  // 적용 핸들러
  const handleApply = () => {
    console.log("🔧 RegionFilter - 적용할 지역들:", tempSelectedRegions);
    onRegionChange(tempSelectedRegions);
    onApply(tempSelectedRegions);
  };

  // 초기화 핸들러
  const handleReset = () => {
    setTempSelectedRegions([]);
    onReset();
  };

  // 현재 선택된 메인 지역의 세부 지역들
  const currentSubRegions =
    selectedMainRegion === "전체"
      ? Object.keys(regionData.subRegions).map(
          (mainRegion) => `${mainRegion} > ${mainRegion} 전체`
        )
      : [
          `${selectedMainRegion} > ${selectedMainRegion} 전체`, // 각 지역 탭의 첫 번째에 "전체" 옵션 추가
          ...(regionData.subRegions[
            selectedMainRegion as keyof typeof regionData.subRegions
          ]?.map((subRegion) => `${selectedMainRegion} > ${subRegion}`) || []),
        ];

  // 현재 메인 지역에서 선택된 세부 지역 수
  const selectedCountInCurrentRegion =
    selectedMainRegion === "전체"
      ? tempSelectedRegions.length
      : tempSelectedRegions.filter((region) =>
          region.startsWith(`${selectedMainRegion} >`)
        ).length;

  // 현재 메인 지역의 모든 세부 지역이 선택되었는지 확인
  const isAllSelectedInCurrentRegion =
    selectedMainRegion === "전체"
      ? tempSelectedRegions.length === Object.keys(regionData.subRegions).length
      : selectedCountInCurrentRegion === currentSubRegions.length;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal_overlay} onClick={handleBackdropClick}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className={styles.modal_header}>
          <h3 className={styles.modal_title}>{title}</h3>
          <button className={styles.modal_close_button} onClick={onClose}>
            <img src="/images/filter/x_icon.svg" alt="닫기" />
          </button>
        </div>

        {/* 모달 바디 */}
        <div className={styles.modal_body}>
          {/* 지역 섹션 제목 */}
          <h4 className={styles.region_section_title}>지역</h4>

          {/* 메인 지역 탭들 */}
          <div className={styles.region_tabs}>
            {regionData.mainRegions.map((region) => (
              <button
                key={region}
                className={`${styles.region_tab} ${
                  selectedMainRegion === region ? styles.region_tab_active : ""
                }`}
                onClick={() => handleMainRegionClick(region)}
              >
                {region}
              </button>
            ))}
          </div>

          {/* 세부 지역 목록 */}
          {currentSubRegions.length > 0 && (
            <div className={styles.sub_regions_container}>
              <div className={styles.options_grid}>
                {currentSubRegions.map((fullRegionName) => {
                  const isSelected =
                    tempSelectedRegions.includes(fullRegionName);

                  return (
                    <label key={fullRegionName} className={styles.option_item}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          // 전체 탭에서는 이미 fullRegionName이 완성된 형태
                          if (selectedMainRegion === "전체") {
                            setTempSelectedRegions((prev) => {
                              if (prev.includes(fullRegionName)) {
                                return prev.filter(
                                  (region) => region !== fullRegionName
                                );
                              } else {
                                return [...prev, fullRegionName];
                              }
                            });
                          } else {
                            // 개별 지역 탭에서는 subRegion만 전달
                            const subRegion = fullRegionName.split(" > ")[1];
                            handleSubRegionToggle(subRegion);
                          }
                        }}
                        className={styles.option_checkbox}
                      />
                      <span className={styles.option_label}>
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

                            {index < fullRegionName.split(" > ").length - 1 && (
                              <img
                                src="/images/filter/region_arrow.svg"
                                alt=">"
                                className={styles.region_arrow}
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
        <div className={styles.modal_footer}>
          <button className={styles.apply_button} onClick={handleApply}>
            필터 적용하기
          </button>
          <button className={styles.reset_button} onClick={handleReset}>
            <div className={styles.reset_icon}></div>
            선택 초기화
          </button>
        </div>
      </div>
    </div>
  );
}
