/* ========================================
   💰 파트너 포인트 페이지 (기본)
   ======================================== */

/**
 * 파트너 포인트 페이지 (기본)
 *
 * 목적: 파트너 포인트 페이지의 기본 진입점입니다.
 * 전체 포인트 내역 페이지로 리다이렉트합니다.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PartnerPointPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/partner/point/all");
  }, [router]);

  return null;
}

