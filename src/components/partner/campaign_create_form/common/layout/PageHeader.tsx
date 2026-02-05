/* ========================================
   📄 캠페인 생성 페이지 헤더 컴포넌트
   ======================================== */

/**
 * 캠페인 생성 페이지 헤더 컴포넌트
 *
 * 목적: 모든 캠페인 생성 페이지에서 공통으로 사용되는 헤더
 *
 * 주요 기능:
 * - 페이지 제목 표시
 * - 긴급 체크박스 기능
 * - 일관된 헤더 스타일 제공
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import headerStyles from "@/styles/partner/campaign_create/campaign_header.module.css";
import checkboxStyles from "@/styles/partner/campaign_create/campaign_guide/checkboxes.module.css";

interface PageHeaderProps {
  title?: string;
  onUrgentChange?: (isUrgent: boolean) => void;
  initialUrgent?: boolean;
}

export default function PageHeader({
  title = "새 캠페인 등록",
  onUrgentChange,
  initialUrgent = false,
}: PageHeaderProps) {
  const router = useRouter();
  const [isUrgent, setIsUrgent] = useState(initialUrgent);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * initialUrgent prop이 변경될 때 state 업데이트
   *
   * 설명:
   * - 데이터를 불러왔을 때 initialUrgent 값이 변경되면 state를 업데이트합니다.
   * - useEffect를 사용하여 prop 변경을 감지하고 state를 동기화합니다.
   */
  useEffect(() => {
    setIsUrgent(initialUrgent);
  }, [initialUrgent]);

  /**
   * 긴급 체크박스 변경 처리
   */
  const handleUrgentChange = (checked: boolean) => {
    setIsUrgent(checked);
    onUrgentChange?.(checked);
  };

  /**
   * 뒤로가기 처리
   */
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={headerStyles.page_header}>
      {/* 뒤로가기 버튼 */}
      <button
        className={headerStyles.mobile_back_button}
        onClick={handleGoBack}
        aria-label="뒤로가기"
      >
        <img
          src="/images/header/header_arrow_back.svg"
          alt="뒤로가기"
          width={16}
          height={16}
        />
      </button>

      <h1 className={headerStyles.page_title}>{title}</h1>

      {/* 긴급 체크박스 */}
      <div className={headerStyles.header_urgent_checkbox}>
        <label
          className={`${checkboxStyles.checkbox_label} ${
            isUrgent ? headerStyles.urgent_checked : ""
          }`}
          style={isUrgent ? { color: "#ff2626" } : {}}
        >
          <span>긴급</span>
          <input
            type="checkbox"
            className={headerStyles.urgent_checkbox}
            checked={isUrgent}
            onChange={(e) => handleUrgentChange(e.target.checked)}
          />
        </label>
      </div>
    </div>
  );
}
