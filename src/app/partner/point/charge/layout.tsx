/* ========================================
   💰 파트너 포인트 충전 레이아웃
   ======================================== */

"use client";

import { useEffect } from "react";

const FROM_CAMPAIGN_CREATE_FLAG = "from_campaign_create";

/**
 * 파트너 포인트 충전 레이아웃
 *
 * 설명:
 * - 이 레이아웃은 포인트 충전 페이지에서만 사용됩니다.
 * - 캠페인 등록 페이지에서 온 경우에만 PartnerHeader를 숨기고 SubHeader만 사용하도록 합니다.
 */
export default function PartnerPointChargeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // sessionStorage에서 캠페인 등록 페이지에서 온 플래그 확인
    const isFromCampaignCreate =
      sessionStorage.getItem(FROM_CAMPAIGN_CREATE_FLAG) === "true";

    if (isFromCampaignCreate) {
      // PartnerHeader 숨기기 (header 태그 안에 있음)
      const header = document.querySelector("header");
      if (header) {
        header.style.display = "none";
      }

      // 플래그 제거 (한 번만 적용되도록)
      sessionStorage.removeItem(FROM_CAMPAIGN_CREATE_FLAG);
    }

    // cleanup: 컴포넌트 언마운트 시 header 다시 표시
    return () => {
      const header = document.querySelector("header");
      if (header && isFromCampaignCreate) {
        header.style.display = "block";
      }
    };
  }, []);

  return <>{children}</>;
}
