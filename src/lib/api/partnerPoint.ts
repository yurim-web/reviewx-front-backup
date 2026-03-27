/* ========================================
   파트너 포인트 API 함수
   ======================================== */

/**
 * partnerPoint API
 *
 * 목적: 파트너 포인트 내역 조회 API 함수
 *
 * API:
 * - 24번: GET /partner/points (포인트 페이지 조회)
 * - 24-1번: GET /partner/points/charge/{chargeId}/receipt (거래명세서 조회)
 *
 * 사용 훅:
 * - hooks/partner/usePartnerPointData.ts
 * - hooks/partner/point/usePartnerPoints.ts
 */

import { partnerApiClient } from "@/lib/api/partnerClient";
import { apiClient } from "@/lib/api/client";
import type { PartnerPointHistory } from "@/types/domain/partner";
import type {
  PartnerPointsResponse,
  ReceiptResponse,
  PointFilterType,
  ChargeRequest,
  ChargeResponse,
} from "@/types/api/partnerPoint";

/**
 * 파트너 포인트 내역 조회 (신규 API)
 * GET /partner/point/all?type=ALL|CHARGE|USE
 */
export async function getPartnerPoints(
  type: PointFilterType = "ALL",
  page: number = 0,
  size: number = 15
): Promise<PartnerPointsResponse> {
  const { data } = await partnerApiClient.get<PartnerPointsResponse>("/partner/point/all", {
    params: { type, page, size },
  });
  return data;
}

/**
 * 거래명세서 조회 (충전 항목 전용)
 * GET /partner/points/charge/{chargeId}/receipt
 *
 * TODO: 백엔드 미구현 — 실제 엔드포인트 확정 후 URL 수정 필요
 */
export async function getChargeReceipt(chargeId: number): Promise<ReceiptResponse> {
  const { data } = await partnerApiClient.get<ReceiptResponse>(
    `/partner/points/charge/${chargeId}/receipt`
  );
  return data;
}

/**
 * 포인트 충전 요청
 * POST /api/points/charge (PointTransactionController — JWT Bearer 인증)
 *
 * ⚠️ partnerApiClient(세션) 대신 apiClient(JWT Bearer)를 사용해야 함
 */
export async function requestPointCharge(body: ChargeRequest): Promise<ChargeResponse> {
  const { data } = await apiClient.post<ChargeResponse>("/api/points/charge", body);
  return data;
}

/**
 * 파트너 포인트 내역 조회 (기존 mock API — 하위 호환)
 * @deprecated getPartnerPoints 사용
 */
export const fetchPartnerPointHistory = (partnerId: number): Promise<PartnerPointHistory[]> =>
  partnerApiClient
    .get<PartnerPointHistory[]>("/partner/point/history", {
      params: { partner_id: partnerId },
    })
    .then((res) => (Array.isArray(res.data) ? res.data : []));
