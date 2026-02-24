/* ========================================
   참여자 여부 URL 쿼리 훅
   ======================================== */

/**
 * useParticipantQuery
 *
 * 목적: URL 쿼리 파라미터로 참여자 여부를 판단하는 커스텀 훅
 *
 * 사용 페이지:
 * - /user/campaign_detail (가이드라인 섹션 컴포넌트)
 */

"use client";

import { useSearchParams } from "next/navigation";

export function useParticipantQuery(): boolean {
  const searchParams = useSearchParams();
  return (
    searchParams.get("participant") === "true" ||
    searchParams.get("selected") === "true"
  );
}
