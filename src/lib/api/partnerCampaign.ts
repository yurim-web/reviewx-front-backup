/* ========================================
   파트너 캠페인 등록/수정/임시저장 API 함수
   ======================================== */

/**
 * 파트너 캠페인 등록/수정 관련 API
 *
 * API:
 * - 09번: GET /partner/campaign/create (등록페이지 조회)
 * - 10번: POST /partner/campaign/create (캠페인 등록)
 * - 11번: POST /partner/campaign/draft (임시저장)
 * - 12번: GET /partner/campaign/draft/{campaignId} (임시저장 불러오기)
 * - 15번: GET /partner/campaign/edit/{campaignId} (수정페이지 조회)
 * - 16번: POST /partner/campaign/edit/{campaignId} (캠페인 수정)
 *
 * 사용 위치:
 * - src/hooks/partner/campaign_create_form/useCampaignCreatePage.ts
 * - src/utils/partner/campaignRegistration/registerCampaignBase.ts
 * - src/hooks/partner/campaign_create_form/useCampaignFormStorage.ts
 * - src/app/partner/campaign/edit/
 */

import { apiClient } from "@/lib/api/client";
import type {
  CampaignCreatePageResponse,
  CreateCampaignRequest,
  CampaignCreateResponse,
  CampaignDraftSaveResponse,
  CampaignDraftLoadResponse,
  CampaignEditPageResponse,
  UpdateCampaignRequest,
  CampaignEditResponse,
} from "@/types/api/partnerCampaign";

/**
 * 1. 캠페인 등록페이지 조회
 * GET /partner/campaign/create
 * → 파트너 정보, 카테고리, 채널, 지역 목록 반환
 */
export const getCampaignCreatePage = async (): Promise<CampaignCreatePageResponse> => {
  const { data } = await apiClient.get<CampaignCreatePageResponse>("/partner/campaign/create");
  return data;
};

/**
 * 2. 캠페인 등록
 * POST /partner/campaign/create (multipart/form-data)
 */
export const postCampaignCreate = async (
  request: CreateCampaignRequest
): Promise<CampaignCreateResponse> => {
  const formData = new FormData();

  // 필수 필드
  formData.append("type", request.type);
  formData.append("categoryId", String(request.categoryId));
  if (request.requiredPlatformId != null) {
    formData.append("requiredPlatformId", String(request.requiredPlatformId));
  }
  formData.append("title", request.title);
  formData.append("description", request.description);
  formData.append("thumbnailImage", request.thumbnailImage);
  request.detailImages.forEach((file) => formData.append("detailImages", file));
  formData.append("recruitLimit", String(request.recruitLimit));
  formData.append("recruitStartAt", request.recruitStartAt);
  formData.append("recruitEndAt", request.recruitEndAt);
  formData.append("selectedAt", request.selectedAt);
  formData.append("contentStartAt", request.contentStartAt);
  formData.append("contentEndAt", request.contentEndAt);

  // 선택 필드 (숫자 0도 유효하므로 != null 체크)
  if (request.extraRewardPoint != null)
    formData.append("extraRewardPoint", String(request.extraRewardPoint));
  if (request.paymentRewardPoint != null)
    formData.append("paymentRewardPoint", String(request.paymentRewardPoint));
  if (request.promotionUrl) formData.append("promotionUrl", request.promotionUrl);
  if (request.keyword) formData.append("keyword", request.keyword);
  if (request.notification) formData.append("notification", request.notification);

  // VISIT 전용
  if (request.regionId != null) formData.append("regionId", String(request.regionId));
  if (request.visitAddress) formData.append("visitAddress", request.visitAddress);

  // axios가 FormData에서 boundary를 자동 설정하도록 Content-Type 헤더 생략
  const { data } = await apiClient.post<CampaignCreateResponse>(
    "/partner/campaign/create",
    formData
  );
  return data;
};

/**
 * 3. 캠페인 임시저장
 * POST /partner/campaign/draft (multipart/form-data)
 * 필수 검증 없음 — 입력된 값만 저장
 */
export const postCampaignDraft = async (
  request: Partial<CreateCampaignRequest>
): Promise<CampaignDraftSaveResponse> => {
  const formData = new FormData();

  if (request.type) formData.append("type", request.type);
  if (request.categoryId != null) formData.append("categoryId", String(request.categoryId));
  if (request.requiredPlatformId != null)
    formData.append("requiredPlatformId", String(request.requiredPlatformId));
  if (request.title) formData.append("title", request.title);
  if (request.description) formData.append("description", request.description);
  if (request.thumbnailImage) formData.append("thumbnailImage", request.thumbnailImage);
  if (request.detailImages) {
    request.detailImages.forEach((file) => formData.append("detailImages", file));
  }
  if (request.recruitLimit != null) formData.append("recruitLimit", String(request.recruitLimit));
  if (request.recruitStartAt) formData.append("recruitStartAt", request.recruitStartAt);
  if (request.recruitEndAt) formData.append("recruitEndAt", request.recruitEndAt);
  if (request.selectedAt) formData.append("selectedAt", request.selectedAt);
  if (request.contentStartAt) formData.append("contentStartAt", request.contentStartAt);
  if (request.contentEndAt) formData.append("contentEndAt", request.contentEndAt);
  if (request.extraRewardPoint != null)
    formData.append("extraRewardPoint", String(request.extraRewardPoint));
  if (request.paymentRewardPoint != null)
    formData.append("paymentRewardPoint", String(request.paymentRewardPoint));
  if (request.promotionUrl) formData.append("promotionUrl", request.promotionUrl);
  if (request.keyword) formData.append("keyword", request.keyword);
  if (request.notification) formData.append("notification", request.notification);
  if (request.regionId != null) formData.append("regionId", String(request.regionId));
  if (request.visitAddress) formData.append("visitAddress", request.visitAddress);

  // axios가 FormData에서 boundary를 자동 설정하도록 Content-Type 헤더 생략
  const { data } = await apiClient.post<CampaignDraftSaveResponse>(
    "/partner/campaign/draft",
    formData
  );
  return data;
};

/**
 * 4. 임시저장 캠페인 불러오기
 * GET /partner/campaign/draft/{campaignId}
 */
export const getCampaignDraft = async (campaignId: number): Promise<CampaignDraftLoadResponse> => {
  const { data } = await apiClient.get<CampaignDraftLoadResponse>(
    `/partner/campaign/draft/${campaignId}`
  );
  return data;
};

/**
 * 5. 캠페인 수정페이지 조회
 * GET /partner/campaign/edit/{campaignId}
 * → 기존 캠페인 데이터 + 파트너 정보 + 카테고리/채널/지역 목록
 */
export const getCampaignEditPage = async (
  campaignId: number
): Promise<CampaignEditPageResponse> => {
  const { data } = await apiClient.get<CampaignEditPageResponse>(
    `/partner/campaign/edit/${campaignId}`
  );
  return data;
};

/**
 * 6. 캠페인 수정
 * POST /partner/campaign/edit/{campaignId}
 * → 파일 업로드 있으면 multipart/form-data, 없으면 JSON
 * → 변경된 필드만 전송 (모든 필드 optional)
 */
export const postCampaignEdit = async (
  campaignId: number,
  request: UpdateCampaignRequest
): Promise<CampaignEditResponse> => {
  const hasFiles =
    request.thumbnailImage instanceof File ||
    (request.detailImages && request.detailImages.some((f) => f instanceof File));

  if (hasFiles) {
    // 파일 업로드 포함 → multipart/form-data (실제 백엔드용)
    const formData = new FormData();
    if (request.type) formData.append("type", request.type);
    if (request.categoryId != null) formData.append("categoryId", String(request.categoryId));
    if (request.requiredPlatformId != null)
      formData.append("requiredPlatformId", String(request.requiredPlatformId));
    if (request.title) formData.append("title", request.title);
    if (request.description) formData.append("description", request.description);
    if (request.thumbnailImage) formData.append("thumbnailImage", request.thumbnailImage);
    if (request.detailImages) {
      request.detailImages.forEach((file) => formData.append("detailImages", file));
    }
    if (request.recruitLimit != null) formData.append("recruitLimit", String(request.recruitLimit));
    if (request.recruitStartAt) formData.append("recruitStartAt", request.recruitStartAt);
    if (request.recruitEndAt) formData.append("recruitEndAt", request.recruitEndAt);
    if (request.selectedAt) formData.append("selectedAt", request.selectedAt);
    if (request.contentStartAt) formData.append("contentStartAt", request.contentStartAt);
    if (request.contentEndAt) formData.append("contentEndAt", request.contentEndAt);
    if (request.extraRewardPoint != null)
      formData.append("extraRewardPoint", String(request.extraRewardPoint));
    if (request.paymentRewardPoint != null)
      formData.append("paymentRewardPoint", String(request.paymentRewardPoint));
    if (request.promotionUrl) formData.append("promotionUrl", request.promotionUrl);
    if (request.keyword) formData.append("keyword", request.keyword);
    if (request.notification) formData.append("notification", request.notification);
    if (request.regionId != null) formData.append("regionId", String(request.regionId));
    if (request.visitAddress) formData.append("visitAddress", request.visitAddress);

    const { data } = await apiClient.post<CampaignEditResponse>(
      `/partner/campaign/edit/${campaignId}`,
      formData
    );
    return data;
  }

  // 텍스트만 수정 → JSON (mock 서버 호환)
  // undefined 필드 제거
  const jsonBody: Record<string, unknown> = {};
  Object.entries(request).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      jsonBody[key] = value;
    }
  });

  const { data } = await apiClient.post<CampaignEditResponse>(
    `/partner/campaign/edit/${campaignId}`,
    jsonBody
  );
  return data;
};
