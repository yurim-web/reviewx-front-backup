/* ========================================
   패널티 API 함수
   ======================================== */

/**
 * penalty API
 *
 * 목적: 유저(리뷰어)와 파트너의 패널티 내역·상태 조회 API 함수
 *      (apiClient → json-server or 실제 백엔드)
 *
 * 사용 페이지:
 * - /user/campaign_management/penalty (유저 패널티 페이지)
 * - /partner/campaign_management/penalty (파트너 패널티 페이지)
 */

import { apiClient } from "@/lib/api/client";
import type { PenaltyItem, PenaltyStatusData } from "@/data/campaign_management/penaltyTypes";

// ────────────────────────────────────────────────────────────────
// R-36 백엔드 타입
// ────────────────────────────────────────────────────────────────

export interface PenaltySummary {
  currentTotalScore: number;
  currentLevel: "NORMAL" | "CAUTION" | "SUSPENDED" | "BANNED";
  isSuspended: boolean;
  suspendedRemainingDays: number | null;
  isPermanentlyBanned: boolean;
}

export interface PenaltyHistoryItem {
  userPenaltyHistoryId: number;
  penaltyCode: string;
  penaltyReason: string;
  penaltyScore: number;
  imposeType: "SYSTEM" | "MANUAL";
  createdAt: string;
  campaignTitle?: string;
}

export interface PenaltyApiResponse {
  result: "OK";
  generatedAt: string;
  summary: PenaltySummary;
  items: PenaltyHistoryItem[];
}

/**
 * 리뷰어 패널티 현황/내역 조회 (R-36)
 * GET /user/campaign_management/penalty (Bearer 토큰)
 */
export const fetchReviewerPenalty = (): Promise<PenaltyApiResponse> =>
  apiClient.get<PenaltyApiResponse>("/api/v1/reviewer/penalties").then((r) => r.data);

/**
 * 유저(리뷰어) 패널티 내역 조회
 * GET /reviewer/penalty?reviewer_id=:id → /user_penalties?reviewer_id=:id
 */
export const fetchUserPenalties = (reviewerId: number): Promise<PenaltyItem[]> =>
  apiClient
    .get<PenaltyItem[]>(`/user_penalties?reviewer_id=${reviewerId}`)
    .then((res) => (Array.isArray(res.data) ? res.data : []));

/**
 * 유저(리뷰어) 패널티 상태 조회
 * GET /user_penalty_status?reviewer_id=:id
 */
export const fetchUserPenaltyStatus = (reviewerId: number): Promise<PenaltyStatusData | null> =>
  apiClient
    .get<PenaltyStatusData[]>(`/user_penalty_status?reviewer_id=${reviewerId}`)
    .then((res) => (Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null));

/**
 * 파트너 패널티 내역 조회
 * GET /partner_penalties?partner_id=:id
 */
export const fetchPartnerPenalties = (partnerId: number): Promise<PenaltyItem[]> =>
  apiClient
    .get<PenaltyItem[]>(`/partner_penalties?partner_id=${partnerId}`)
    .then((res) => (Array.isArray(res.data) ? res.data : []));

/**
 * 파트너 패널티 상태 조회
 * GET /partner_penalty_status?partner_id=:id
 */
export const fetchPartnerPenaltyStatus = (partnerId: number): Promise<PenaltyStatusData | null> =>
  apiClient
    .get<PenaltyStatusData[]>(`/partner_penalty_status?partner_id=${partnerId}`)
    .then((res) => (Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null));
