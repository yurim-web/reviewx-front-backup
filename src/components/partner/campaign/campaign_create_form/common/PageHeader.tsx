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

import { useState } from "react";
import headerStyles from "@/styles/partner/campaign_create/campaign_header.module.css";
import guideStyles from "@/styles/partner/campaign_create/campaign_guide.module.css";

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
  const [isUrgent, setIsUrgent] = useState(initialUrgent);

  /**
   * 긴급 체크박스 변경 처리
   */
  const handleUrgentChange = (checked: boolean) => {
    setIsUrgent(checked);
    onUrgentChange?.(checked);
  };

  return (
    <div className={headerStyles.page_header}>
      <h1 className={headerStyles.page_title}>{title}</h1>

      {/* 긴급 체크박스 */}
      <div className={headerStyles.header_urgent_checkbox}>
        <label
          className={`${guideStyles.checkbox_label} ${
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
