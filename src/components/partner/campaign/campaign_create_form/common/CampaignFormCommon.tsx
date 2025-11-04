/* ========================================
   📝 캠페인 폼 공통 컴포넌트
   ======================================== */

/**
 * 캠페인 폼에서 공통으로 사용되는 컴포넌트들
 *
 * 목적: 모든 캠페인 유형에서 공통으로 사용되는 폼 요소들을 제공
 *
 * 사용 컴포넌트:
 * - 배송형, 방문형, 구매평, 기자단, 미션형 캠페인 컴포넌트들
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { CampaignType, PlatformType } from "@/types/campaign";
// 분리된 CSS 모듈들 import
import headerStyles from "@/styles/partner/campaign_create/campaign_header.module.css";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import dropdownStyles from "@/styles/partner/campaign_create/custom_dropdown.module.css";

// 캠페인 유형 옵션
export const campaignTypes: CampaignType[] = [
  "배송형",
  "방문형",
  "구매평",
  "기자단",
  "미션형",
];

// 플랫폼 옵션
export const platforms: PlatformType[] = [
  "네이버 블로그",
  "네이버 클립",
  "인스타그램",
  "릴스",
  "유튜브",
  "쇼츠",
];

// 카테고리 옵션
export const categories = [
  "전체",
  "식품",
  "뷰티",
  "가전",
  "유아동",
  "여가",
  "서비스",
  "생활",
  "패션",
  "가구",
  "디지털",
  "문화",
  "반려동물",
  "기타",
];

// 지역 옵션
export const regions = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

/**
 * 캠페인 유형 선택 컴포넌트
 */
interface CampaignTypeSelectorProps {
  currentType: CampaignType;
  onTypeChange: (type: CampaignType) => void;
  disabled?: boolean;
}

export function CampaignTypeSelector({
  currentType,
  onTypeChange,
  disabled = false,
}: CampaignTypeSelectorProps) {
  return (
    <article className={infoStyles.form_group}>
      <label className={infoStyles.form_label}>
        캠페인 유형<span className={infoStyles.required}>*</span>
      </label>
      <div className={headerStyles.campaign_type_buttons}>
        {campaignTypes.map((type) => (
          <button
            key={type}
            type="button"
            className={`${headerStyles.campaign_type_button} ${
              currentType === type ? headerStyles.active : ""
            } ${disabled ? headerStyles.disabled_button : ""}`}
            onClick={disabled ? undefined : () => onTypeChange(type)}
            disabled={disabled}
          >
            {type}
          </button>
        ))}
      </div>
    </article>
  );
}

/**
 * 커스텀 드롭다운 컴포넌트
 *
 * 목적: Figma 디자인에 맞는 커스텀 드롭다운 UI 제공
 *
 * 주요 기능:
 * - 클릭 시 옵션 리스트 표시/숨김
 * - 옵션 선택 시 드롭다운 닫기
 * - 외부 클릭 시 드롭다운 닫기
 * - 키보드 네비게이션 지원
 */
interface CustomDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CustomDropdown({
  value,
  options,
  onChange,
  placeholder = "선택하세요",
  disabled = false,
}: CustomDropdownProps) {
  // 드롭다운 열림/닫힘 상태 관리
  const [is_open, setIsOpen] = useState(false);
  // 드롭다운이 위쪽으로 열릴지 아래쪽으로 열릴지 결정하는 상태
  const [is_open_upward, setIsOpenUpward] = useState(false);

  // 드롭다운 컨테이너 참조
  const dropdown_ref = useRef<HTMLDivElement>(null);

  // 선택된 옵션의 표시 텍스트
  const display_text = value || placeholder;

  // 옵션 선택 핸들러
  const handle_option_select = (option: string) => {
    onChange(option);
    setIsOpen(false); // 선택 후 드롭다운 닫기
  };

  // 드롭다운 토글 핸들러
  const toggle_dropdown = () => {
    if (disabled) return;
    const new_is_open = !is_open;
    setIsOpen(new_is_open);

    // 드롭다운이 열릴 때 화면 위치 계산
    if (new_is_open && dropdown_ref.current) {
      const rect = dropdown_ref.current.getBoundingClientRect();
      const viewport_height = window.innerHeight;
      const dropdown_height = 400; // 드롭다운 최대 높이

      // 화면 하단에서 드롭다운 높이만큼의 여유 공간이 있는지 확인
      const space_below = viewport_height - rect.bottom;
      const space_above = rect.top;

      // 아래쪽 공간이 부족하고 위쪽 공간이 충분하면 위쪽으로 열기
      if (space_below < dropdown_height && space_above > dropdown_height) {
        setIsOpenUpward(true);
      } else {
        setIsOpenUpward(false);
      }

      // 드롭다운이 열릴 때 해당 요소로 스크롤 (위쪽으로 열릴 때만)
      if (!is_open_upward) {
        setTimeout(() => {
          dropdown_ref.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }, 100);
      }
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handle_click_outside = (event: MouseEvent) => {
      if (
        dropdown_ref.current &&
        !dropdown_ref.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // 드롭다운이 열려있을 때만 이벤트 리스너 추가
    if (is_open) {
      document.addEventListener("mousedown", handle_click_outside);
    }

    // 클린업 함수
    return () => {
      document.removeEventListener("mousedown", handle_click_outside);
    };
  }, [is_open]);

  return (
    <div ref={dropdown_ref} className={dropdownStyles.custom_dropdown}>
      {/* 드롭다운 버튼 (선택된 값 표시) */}
      <button
        type="button"
        className={`${dropdownStyles.dropdown_button} ${
          is_open ? dropdownStyles.open : ""
        } ${disabled ? dropdownStyles.disabled : ""}`}
        onClick={toggle_dropdown}
        aria-expanded={is_open}
        aria-haspopup="listbox"
        disabled={disabled}
      >
        <span className={dropdownStyles.dropdown_text}>{display_text}</span>
        {/* 화살표 아이콘 */}
        <img
          src="/images/icons/dropdown_arrow.svg"
          alt="드롭다운 화살표"
          className={`${dropdownStyles.dropdown_arrow} ${
            is_open ? dropdownStyles.rotated : ""
          }`}
        />
      </button>

      {/* 드롭다운 옵션 리스트 */}
      {is_open && (
        <div
          className={`${dropdownStyles.dropdown_options} ${
            is_open_upward ? dropdownStyles.dropdown_options_upward : ""
          }`}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`${dropdownStyles.dropdown_option} ${
                value === option ? dropdownStyles.selected : ""
              }`}
              onClick={() => handle_option_select(option)}
              role="option"
              aria-selected={value === option}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
