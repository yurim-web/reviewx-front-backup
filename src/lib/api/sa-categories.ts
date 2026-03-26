/* ========================================
   SA(최고관리자) 카테고리 API 함수
   백엔드: /api/admin-sa/categories
   ======================================== */

import { apiClient } from "@/lib/api/client";

// ── SA Division 타입 ──

/** SA 백엔드 구분 enum (NOTICE / FAQ / EVENT) */
export type SACategoryDivision = "NOTICE" | "FAQ" | "EVENT";

// ── SA 카테고리 목록 API 타입 ──

export interface SACategoryListParams {
  division?: SACategoryDivision;
  keyword?: string;
}

export interface SACategoryApiItem {
  categoryId: number;
  division: SACategoryDivision;
  categoryName: string;
}

/** GET /api/admin-sa/categories 응답 (flat, no data wrapper) */
export interface SACategoryListResponse {
  result: string;
  generatedAt: string;
  totalCount: number;
  categories: SACategoryApiItem[];
}

// ── SA 카테고리 상세 API 타입 ──

/** GET /api/admin-sa/categories/{categoryId} 응답 */
export interface SACategoryDetailResponse {
  result: string;
  generatedAt: string;
  category: SACategoryApiItem;
}

// ── SA 카테고리 등록 API 타입 ──

export interface SACreateCategoryRequest {
  division: SACategoryDivision;
  categoryName: string;
}

export interface SACreateCategoryResponse {
  result: string;
  generatedAt: string;
  category: SACategoryApiItem;
}

// ── SA 카테고리 수정 API 타입 ──

/** PATCH — division + categoryName 모두 수정 가능 */
export interface SAUpdateCategoryRequest {
  division: SACategoryDivision;
  categoryName: string;
}

export interface SAUpdateCategoryResponse {
  result: string;
  generatedAt: string;
  category: SACategoryApiItem;
}

// ── SA 카테고리 삭제 API 타입 ──

export interface SADeleteCategoryResponse {
  result: string;
  generatedAt: string;
}

// ── SA 카테고리 등록 폼 옵션 API 타입 ──

export interface SADivisionOption {
  code: SACategoryDivision;
  label: string;
}

/** GET /api/admin-sa/categories/register 응답 */
export interface SACategoryFormOptionsResponse {
  result: string;
  generatedAt: string;
  divisions: SADivisionOption[];
}

// ── API 함수 ──

/** 카테고리 목록 조회  GET /api/admin-sa/categories */
export const getSACategoryList = async (
  params?: SACategoryListParams
): Promise<SACategoryListResponse> => {
  const { data } = await apiClient.get<SACategoryListResponse>("/api/admin-sa/categories", {
    params,
  });
  return data;
};

/** 카테고리 상세 조회  GET /api/admin-sa/categories/{categoryId} */
export const getSACategoryDetail = async (
  categoryId: number
): Promise<SACategoryDetailResponse> => {
  const { data } = await apiClient.get<SACategoryDetailResponse>(
    `/api/admin-sa/categories/${categoryId}`
  );
  return data;
};

/** 카테고리 등록  POST /api/admin-sa/categories */
export const createSACategory = async (
  body: SACreateCategoryRequest
): Promise<SACreateCategoryResponse> => {
  const { data } = await apiClient.post<SACreateCategoryResponse>("/api/admin-sa/categories", body);
  return data;
};

/** 카테고리 수정  PATCH /api/admin-sa/categories/{categoryId} */
export const updateSACategory = async (
  categoryId: number,
  body: SAUpdateCategoryRequest
): Promise<SAUpdateCategoryResponse> => {
  const { data } = await apiClient.patch<SAUpdateCategoryResponse>(
    `/api/admin-sa/categories/${categoryId}`,
    body
  );
  return data;
};

/** 카테고리 삭제  DELETE /api/admin-sa/categories/{categoryId} */
export const deleteSACategory = async (categoryId: number): Promise<SADeleteCategoryResponse> => {
  const { data } = await apiClient.delete<SADeleteCategoryResponse>(
    `/api/admin-sa/categories/${categoryId}`
  );
  return data;
};

/** 카테고리 등록 폼 옵션 조회  GET /api/admin-sa/categories/register */
export const getSACategoryFormOptions = async (): Promise<SACategoryFormOptionsResponse> => {
  const { data } = await apiClient.get<SACategoryFormOptionsResponse>(
    "/api/admin-sa/categories/register"
  );
  return data;
};
