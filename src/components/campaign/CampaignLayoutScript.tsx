"use client";

import { useEffect } from "react";

/**
 * 캠페인 상세 페이지 레이아웃 스타일 보호 컴포넌트
 *
 * 설명:
 * - 캠페인 상세 페이지에서는 관리자 레이아웃 스타일이 적용되지 않도록 합니다
 * - body에서 data-manager-layout 속성을 제거하여 일반 레이아웃이 적용되도록 합니다
 */
export default function CampaignLayoutScript() {
  useEffect(() => {
    // 캠페인 상세 페이지에서는 관리자 레이아웃 속성 제거
    document.body.removeAttribute("data-manager-layout");
  }, []);

  return null;
}

