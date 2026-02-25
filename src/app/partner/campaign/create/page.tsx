/* ========================================
   🆕 파트너 새 캠페인 등록 페이지
   ======================================== */

/**
 * 파트너 새 캠페인 등록 페이지
 *
 * 목적: 파트너가 새로운 캠페인을 등록하는 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/campaign/create
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 파트너 캠페인 생성 메인 페이지
 * 배송형 캠페인 생성 페이지로 리다이렉트
 */
export default function PartnerCampaignCreatePage() {
  const router = useRouter();

  useEffect(() => {
    // 메인 캠페인 생성 페이지 접근 시 배송형 캠페인 생성 페이지로 리다이렉트
    router.replace("/partner/campaign/create/delivery");
  }, [router]);

  // 리다이렉트 중에는 아무것도 렌더링하지 않음
  return null;
}
