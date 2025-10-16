// 지역 필터 전용 컴포넌트
// 계층적 지역 구조를 지원하는 특별한 필터 컴포넌트

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
  onApply: () => void;
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
        "강남/서초/송파/강동",
        "광진/성동/용산",
        "노원/도봉/강북/성북/동대문/중랑",
        "구로/금천/관악/동작/영등포/양천/강서",
        "종로/중구/용산",
        "마포/서대문/은평",
      ],
      인천: [
        "중구/동구/미추홀구",
        "연수구/남동구",
        "부평구/계양구",
        "서구/강화군/옹진군",
      ],
      경기: [
        "수원시/화성시/오산시",
        "성남시/하남시/광주시",
        "의정부시/동두천시/양주시",
        "부천시/광명시/시흥시",
        "안양시/과천시/의왕시",
        "평택시/안성시",
        "고양시/파주시/김포시",
        "구리시/남양주시/가평군",
        "여주시/양평군/이천시",
      ],
      강원: [
        "춘천시/홍천군/철원군",
        "원주시/횡성군/영월군",
        "강릉시/동해시/삼척시",
        "태백시/정선군/영월군",
        "속초시/고성군/양양군",
        "인제군/평창군",
      ],
      대전: ["동구/중구", "서구/유성구", "대덕구"],
      세종: ["세종특별자치시"],
      충북: [
        "청주시/청원군",
        "충주시/제천시",
        "보은군/옥천군/영동군",
        "진천군/괴산군/음성군",
        "단양군",
      ],
      충남: [
        "천안시/아산시",
        "공주시/연기군",
        "보령시/서천군",
        "논산시/계룡시",
        "당진시/서산시",
        "태안군/홍성군",
        "예산군/부여군",
        "청양군/금산군",
      ],
      전북: [
        "전주시/완주군",
        "군산시/김제시",
        "익산시/완주군",
        "정읍시/부안군",
        "남원시/순창군",
        "고창군/무주군",
        "진안군/장수군",
        "임실군",
      ],
      전남: [
        "목포시/무안군",
        "여수시/순천시",
        "나주시/화순군",
        "광양시/구례군",
        "담양군/곡성군",
        "장성군/영광군",
        "함평군/영암군",
        "장흥군/강진군",
        "완도군/진도군",
        "신안군",
      ],
      광주: ["동구/서구", "남구/북구", "광산구"],
      대구: ["중구/동구/서구", "남구/북구", "수성구/달서구", "달성군"],
      경북: [
        "포항시/영일군",
        "경주시/영천시",
        "김천시/상주시",
        "안동시/예천군",
        "구미시/칠곡군",
        "영주시/봉화군",
        "문경시/영양군",
        "경산시/청도군",
        "고령군/성주군",
        "칠곡군/군위군",
        "의성군/청송군",
        "영덕군/울진군",
      ],
      경남: [
        "창원시/의창군",
        "마산시/합포군",
        "진해시/진주시",
        "통영시/고성군",
        "사천시/남해군",
        "하동군/산청군",
        "함양군/거창군",
        "합천군/밀양시",
        "거제시/양산시",
        "김해시/창녕군",
        "의령군/함안군",
      ],
      부산: [
        "중구/서구/동구",
        "영도구/부산진구",
        "동래구/남구",
        "북구/해운대구",
        "사하구/금정구",
        "강서구/연제구",
        "수영구/사상구",
        "기장군",
      ],
      울산: ["중구/남구", "동구/북구", "울주군"],
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
      // 전체 지역의 모든 세부 지역 선택
      const allRegions: string[] = [];
      Object.keys(regionData.subRegions).forEach((mainRegion) => {
        regionData.subRegions[mainRegion].forEach((subRegion) => {
          allRegions.push(`${mainRegion} > ${subRegion}`);
        });
      });

      if (tempSelectedRegions.length === allRegions.length) {
        setTempSelectedRegions([]);
      } else {
        setTempSelectedRegions(allRegions);
      }
    } else {
      // 선택된 메인 지역의 모든 세부 지역 선택
      const currentSubRegions = regionData.subRegions[selectedMainRegion] || [];
      const currentFullRegions = currentSubRegions.map(
        (subRegion) => `${selectedMainRegion} > ${subRegion}`
      );

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
    onRegionChange(tempSelectedRegions);
    onApply();
  };

  // 초기화 핸들러
  const handleReset = () => {
    setTempSelectedRegions([]);
    onReset();
  };

  // 현재 선택된 메인 지역의 세부 지역들
  const currentSubRegions =
    selectedMainRegion === "전체"
      ? Object.keys(regionData.subRegions).flatMap((mainRegion) =>
          regionData.subRegions[mainRegion].map(
            (subRegion) => `${mainRegion} > ${subRegion}`
          )
        )
      : regionData.subRegions[selectedMainRegion]?.map(
          (subRegion) => `${selectedMainRegion} > ${subRegion}`
        ) || [];

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
      ? tempSelectedRegions.length ===
        Object.values(regionData.subRegions).flat().length
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
                        {fullRegionName}
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
