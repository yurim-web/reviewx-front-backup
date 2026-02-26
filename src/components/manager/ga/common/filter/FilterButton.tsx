/* ========================================
   ()
   ======================================== */
/* eslint-disable @next/next/no-img-element */

/**
 * 필터 버튼 컴포넌트
 *
 * 목적: 여러 필터 섹션에서 공통으로 사용하는 필터 버튼 컴포넌트입니다.
 *       체크박스 아이콘, 텍스트, 드롭다운 화살표를 포함합니다.
 *
 * 📍 사용 위치:
 * - CampaignProgressFilterSection.tsx (캠페인 진행 상황 필터)
 * - MemberFilterSection.tsx (회원 필터)
 * - 기타 필터가 필요한 모든 페이지
 *
 * React 핵심 개념:
 * - props: 부모 컴포넌트에서 전달받는 데이터
 * - 이벤트 핸들러: onClick으로 클릭 이벤트 처리
 * - 조건부 렌더링: isActive에 따라 다른 스타일 적용
 */

"use client";

import React from "react";

/**
 * FilterButton 컴포넌트의 props 타입 정의
 *
 * - label: 필터 버튼에 표시될 텍스트 (예: "상태", "유형", "채널")
 * - onClick: 버튼 클릭 시 실행될 함수
 * - isActive: 필터가 선택되어 있는지 여부 (나중에 아이콘 표시용)
 * - icon: 선택적 아이콘 (나중에 아이콘이 들어갈 때 사용)
 * - styles: CSS 모듈 스타일 객체
 *   - filter_item: 필터 버튼 컨테이너 스타일
 *   - checkbox_icon: 체크박스 아이콘 스타일
 *   - checkbox_icon_checked: 선택된 체크박스 아이콘 스타일 (선택적)
 *   - filter_text: 필터 텍스트 스타일
 *   - dropdown_arrow: 드롭다운 화살표 스타일
 */
interface FilterButtonProps {
  label: string;
  onClick: () => void;
  isActive?: boolean; // 선택 여부 (기본값: false)
  icon?: React.ReactNode; // 나중에 아이콘이 들어갈 때 사용
  styles: {
    filter_item: string;
    checkbox_icon: string;
    checkbox_icon_checked?: string; // 선택적: 선택된 상태 스타일
    filter_text: string;
    dropdown_arrow: string;
    filter_item_active?: string; // 선택적: 활성화된 버튼 스타일
    filter_text_active?: string; // 선택적: 활성화된 텍스트 스타일
    dropdown_arrow_active?: string; // 선택적: 활성화된 화살표 스타일
  };
}

/**
 * 필터 버튼 컴포넌트
 *
 * @param props - FilterButtonProps 타입의 props
 * @returns 필터 버튼 JSX 요소
 *
 * 컴포넌트 구조:
 * 1. filter_item: 전체 버튼 컨테이너
 * 2. checkbox_icon: 체크박스 아이콘 영역 (나중에 아이콘이 들어갈 예정)
 * 3. filter_text: 필터 텍스트
 * 4. dropdown_arrow: 드롭다운 화살표 아이콘
 */
export default function FilterButton({
  label,
  onClick,
  isActive = false,
  icon,
  styles,
}: FilterButtonProps) {
  /**
   * 체크박스 아이콘 클래스명 결정
   *
   * 조건부 클래스명 적용:
   * - isActive가 true이고 checkbox_icon_checked 스타일이 있으면: 두 클래스 모두 적용
   * - 그 외: checkbox_icon만 적용
   *
   * 배열을 사용하여 클래스를 조합하고, filter로 undefined를 제거한 후 join으로 연결합니다.
   * 이렇게 하면 CSS 모듈에서 클래스가 올바르게 적용됩니다.
   */
  const checkboxIconClassName = [styles.checkbox_icon, isActive && styles.checkbox_icon_checked]
    .filter(Boolean)
    .join(" ");

  const filterItemClassName = [styles.filter_item, isActive && styles.filter_item_active]
    .filter(Boolean)
    .join(" ");

  const filterTextClassName = [styles.filter_text, isActive && styles.filter_text_active]
    .filter(Boolean)
    .join(" ");

  const dropdownArrowClassName = [styles.dropdown_arrow, isActive && styles.dropdown_arrow_active]
    .filter(Boolean)
    .join(" ");

  /**
   * 드롭다운 화살표 아이콘 경로 결정
   *
   * 조건부 렌더링: isActive 상태에 따라 다른 아이콘 사용
   * - isActive가 true일 때: manager_dropdown_ok.svg (활성화 상태)
   * - isActive가 false일 때: manager_dropdown.svg (비활성화 상태)
   *
   * 삼항 연산자: 조건 ? 값1 : 값2
   * - 조건이 true이면 값1 반환
   * - 조건이 false이면 값2 반환
   */
  const dropdownIconSrc = isActive
    ? "/images/management_page/manager_dropdown_ok.svg"
    : "/images/management_page/manager_dropdown.svg";

  return (
    <div className={filterItemClassName} onClick={onClick}>
      {/* 
        체크박스 아이콘 영역
        - 나중에 아이콘이 들어갈 예정이므로 icon prop이 있으면 표시
        - icon이 없으면 빈 div로 공간만 확보
      */}
      <div className={checkboxIconClassName}>{icon || null}</div>

      {/* 필터 텍스트 */}
      <span className={filterTextClassName}>{label}</span>

      {/* 
        드롭다운 화살표 아이콘 (매니저 전용)
        - 비활성화 상태(isActive=false): manager_dropdown.svg (회색 화살표)
        - 활성화 상태(isActive=true): manager_dropdown_ok.svg (핑크색 화살표)
        - 조건부 렌더링으로 상태에 따라 다른 아이콘 표시
      */}
      <img src={dropdownIconSrc} alt="드롭다운" className={dropdownArrowClassName} />
    </div>
  );
}
