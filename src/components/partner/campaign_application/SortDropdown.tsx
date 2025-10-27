/* ========================================
   🔽 정렬 드롭다운 컴포넌트
   ======================================== */

/**
 * 정렬 드롭다운 컴포넌트
 *
 * 목적: 캠페인 신청 내역 페이지에서 신청자 목록을 정렬하는 커스텀 드롭다운입니다.
 *
 * 사용 페이지:
 * - /partner/campaign_application/delivery (배송형 캠페인 신청내역)
 * - /partner/campaign_application/visit (방문형 캠페인 신청내역)
 * - /partner/campaign_application/review (리뷰형 캠페인 신청내역)
 * - /partner/campaign_application/reporter (기자단형 캠페인 신청내역)
 * - /partner/campaign_application/mission (미션형 캠페인 신청내역)
 *
 * 주요 기능:
 * - 커스텀 스타일의 드롭다운
 * - 클릭 시 열림/닫힘 상태 관리
 * - 화살표 회전 애니메이션
 * - 최신순/오래된순 정렬 옵션
 */

import { useState, useRef, useEffect } from "react";
import styles from "../../../styles/partner/campaign_application/sort_dropdown.module.css";

// 정렬 옵션 타입 정의
type SortOption = "latest" | "popular" | "deadline" | "point";

interface SortDropdownProps {
  sortOrder: SortOption;
  onSortChange: (order: SortOption) => void;
}

export default function SortDropdown({
  sortOrder,
  onSortChange,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * 외부 클릭 감지하여 드롭다운 닫기
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * 정렬 옵션 선택 핸들러
   */
  const handleSelect = (value: SortOption) => {
    onSortChange(value);
    setIsOpen(false);
  };

  /**
   * 정렬 옵션에 따른 텍스트 반환
   */
  const getSortText = (option: SortOption) => {
    const sortTexts: Record<SortOption, string> = {
      latest: "최신순",
      popular: "인기순",
      deadline: "마감임박순",
      point: "포인트순",
    };
    return sortTexts[option];
  };

  return (
    <div className={styles.sort_filter} ref={dropdownRef}>
      {/* 드롭다운 버튼 */}
      <button
        className={styles.sort_select}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {getSortText(sortOrder)}

        <img
          src="/images/icons/dropdown_arrow.svg"
          alt="드롭다운 화살표"
          className={`${styles.dropdown_arrow} ${
            isOpen ? styles.arrow_rotated : ""
          }`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className={styles.dropdown_menu}>
          <button
            className={`${styles.dropdown_item} ${
              sortOrder === "latest" ? styles.dropdown_item_active : ""
            }`}
            onClick={() => handleSelect("latest")}
          >
            최신순
          </button>
          <button
            className={`${styles.dropdown_item} ${
              sortOrder === "popular" ? styles.dropdown_item_active : ""
            }`}
            onClick={() => handleSelect("popular")}
          >
            인기순
          </button>
          <button
            className={`${styles.dropdown_item} ${
              sortOrder === "deadline" ? styles.dropdown_item_active : ""
            }`}
            onClick={() => handleSelect("deadline")}
          >
            마감임박순
          </button>
          <button
            className={`${styles.dropdown_item} ${
              sortOrder === "point" ? styles.dropdown_item_active : ""
            }`}
            onClick={() => handleSelect("point")}
          >
            포인트순
          </button>
        </div>
      )}
    </div>
  );
}
