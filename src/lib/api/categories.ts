/* ========================================
   카테고리 API 함수 (백엔드 API 기준)
   ======================================== */

import { apiClient } from "@/lib/api/client";

// ── Division 타입 ──

/** 백엔드 구분 enum (GA: NOTICE/QUESTIONS, SA: NOTICE/FAQ/EVENT) */
export type CategoryDivision = "NOTICE" | "QUESTIONS" | "FAQ" | "EVENT";

/** Division enum → 한글 표시명 매핑 */
export const DIVISION_LABEL_MAP: Record<CategoryDivision, string> = {
  NOTICE: "공지사항",
  QUESTIONS: "자주 묻는 질문",
  FAQ: "자주 묻는 질문",
  EVENT: "이벤트",
};

/** 한글 표시명 → Division enum 역매핑 (GA 기준) */
export const DIVISION_VALUE_MAP: Record<string, CategoryDivision> = {
  공지사항: "NOTICE",
  "자주 묻는 질문": "QUESTIONS",
  이벤트: "EVENT",
};

// ── 카테고리 목록 API 타입 ──

export interface CategoryListParams {
  division?: CategoryDivision;
  keyword?: string;
}

export interface CategoryApiItem {
  categoryId: number;
  division: CategoryDivision;
  categoryName: string;
  boardCount: number;
  createdAt: string;
  updatedAt: string;
}

/** GET /api/admin/board-categories 응답 */
export interface CategoryListResponse {
  result: string;
  generatedAt: string;
  data: {
    categories: CategoryApiItem[];
  };
}

// ── 카테고리 상세 API 타입 ──

/** GET /api/admin/board-categories/{categoryId} 응답 */
export interface CategoryDetailResponse {
  result: string;
  generatedAt: string;
  data: CategoryApiItem;
}

// ── 카테고리 등록 API 타입 ──

export interface CreateCategoryRequest {
  division: CategoryDivision;
  categoryName: string;
}

export interface CreateCategoryResponse {
  result: string;
  generatedAt: string;
  data: {
    categoryId: number;
    division: CategoryDivision;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
  };
}

// ── 카테고리 수정 API 타입 ──

/** PUT — 카테고리명만 수정 가능 (구분 변경 불가) */
export interface UpdateCategoryRequest {
  categoryName: string;
}

export interface UpdateCategoryResponse {
  result: string;
  generatedAt: string;
  data: CategoryApiItem;
}

// ── 카테고리 삭제 API 타입 ──

export interface DeleteCategoryResponse {
  result: string;
  generatedAt: string;
  data: null;
}

// ── 카테고리 등록 폼 옵션 API 타입 ──

export interface DivisionOption {
  value: CategoryDivision;
  label: string;
}

export interface CategoryFormOptionsResponse {
  result: string;
  generatedAt: string;
  data: {
    divisions: DivisionOption[];
  };
}

// ── API 함수 ──

/** 카테고리 목록 조회  GET /api/admin/board-categories */
export const getCategoryList = async (
  params?: CategoryListParams
): Promise<CategoryListResponse> => {
  const { data } = await apiClient.get<CategoryListResponse>("/api/admin/board-categories", {
    params,
  });
  return data;
};

/** 카테고리 상세 조회  GET /api/admin/board-categories/{categoryId} */
export const getCategoryDetail = async (categoryId: number): Promise<CategoryDetailResponse> => {
  const { data } = await apiClient.get<CategoryDetailResponse>(
    `/api/admin/board-categories/${categoryId}`
  );
  return data;
};

/** 카테고리 등록  POST /api/admin/board-categories */
export const createCategory = async (
  body: CreateCategoryRequest
): Promise<CreateCategoryResponse> => {
  const { data } = await apiClient.post<CreateCategoryResponse>(
    "/api/admin/board-categories",
    body
  );
  return data;
};

/** 카테고리 수정  PUT /api/admin/board-categories/{categoryId} */
export const updateCategory = async (
  categoryId: number,
  body: UpdateCategoryRequest
): Promise<UpdateCategoryResponse> => {
  const { data } = await apiClient.put<UpdateCategoryResponse>(
    `/api/admin/board-categories/${categoryId}`,
    body
  );
  return data;
};

/** 카테고리 삭제  DELETE /api/admin/board-categories/{categoryId} */
export const deleteCategory = async (categoryId: number): Promise<DeleteCategoryResponse> => {
  const { data } = await apiClient.delete<DeleteCategoryResponse>(
    `/api/admin/board-categories/${categoryId}`
  );
  return data;
};

/** 카테고리 등록 폼 옵션 조회  GET /api/admin/board-categories/form */
export const getCategoryFormOptions = async (): Promise<CategoryFormOptionsResponse> => {
  const { data } = await apiClient.get<CategoryFormOptionsResponse>(
    "/api/admin/board-categories/form"
  );
  return data;
};
