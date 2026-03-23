/* ========================================
   파트너 패널티 내역 API 타입
   ======================================== */

/**
 * 파트너 패널티 내역 API 타입 정의
 *
 * API:
 * - 23번: GET /partner/account/penalty (패널티 내역 조회)
 *
 * 사용 위치:
 * - src/lib/api/partnerPenalty.ts (신규)
 * - src/hooks/partner/usePartnerPenalty.ts
 */

// ── 패널티 탭 ──

export type PenaltyTab = "warning" | "caution" | "blocked";

// ── 파트너 등급 ──

export type PartnerGrade = "EXCELLENT" | "NORMAL" | "CAUTION" | "WARNING" | "RESTRICTED";

// ── GET /partner/account/penalty 응답 ──

export interface PartnerPenaltyResponse {
  result: "OK";
  generatedAt: string;
  summary: {
    totalPenaltyScore: number;
    warningCount: number;
    cautionCount: number;
    blockedCount: number;
    currentGrade: PartnerGrade;
  };
  penalties: PartnerPenaltyItem[];
}

export interface PartnerPenaltyItem {
  penaltyHistoryId: number;
  penaltyCode: string;
  penaltyReason: string;
  penaltyDetail: string;
  penaltyScore: number;
  relatedCampaignId: number | null;
  relatedCampaignTitle: string | null;
  imposedAt: string;
  imposerType: "SYSTEM" | "ADMIN" | "PARTNER";
}
