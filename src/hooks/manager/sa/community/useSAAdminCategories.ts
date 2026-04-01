/* ========================================
   SA(최고관리자) 카테고리 React Query 훅
   SA 응답 → GA 포맷 어댑터 포함
   ======================================== */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSACategoryList,
  getSACategoryDetail,
  createSACategory,
  updateSACategory,
  deleteSACategory,
  getSACategoryFormOptions,
  type SACategoryListParams,
  type SACreateCategoryRequest,
  type SAUpdateCategoryRequest,
} from "@/lib/api/sa-categories";
import type {
  CategoryListResponse,
  CategoryDetailResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
  CategoryFormOptionsResponse,
  CategoryApiItem,
  CategoryDivision,
} from "@/lib/api/categories";

const SA_CATEGORY_QUERY_KEY = "saAdminCategories";

/** SA 카테고리 목록 조회 (SA→GA 응답 어댑터) */
export function useSAAdminCategories(
  params?: SACategoryListParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [SA_CATEGORY_QUERY_KEY, params],
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<CategoryListResponse> => {
      const raw = await getSACategoryList(params);
      const categories: CategoryApiItem[] = raw.categories.map((cat) => ({
        categoryId: cat.categoryId,
        division: cat.division as CategoryDivision,
        categoryName: cat.categoryName,
        boardCount: 0,
        createdAt: "",
        updatedAt: "",
      }));
      return {
        result: raw.result,
        generatedAt: raw.generatedAt,
        data: { categories },
      };
    },
    staleTime: 30_000,
  });
}

/** SA 카테고리 상세 조회 (SA→GA 응답 어댑터) */
export function useSACategoryDetail(categoryId: number) {
  return useQuery({
    queryKey: [SA_CATEGORY_QUERY_KEY, "detail", categoryId],
    queryFn: async (): Promise<CategoryDetailResponse> => {
      const raw = await getSACategoryDetail(categoryId);
      return {
        result: raw.result,
        generatedAt: raw.generatedAt,
        data: {
          categoryId: raw.category.categoryId,
          division: raw.category.division as CategoryDivision,
          categoryName: raw.category.categoryName,
          boardCount: 0,
          createdAt: "",
          updatedAt: "",
        },
      };
    },
    enabled: categoryId > 0,
    staleTime: 30_000,
  });
}

/** SA 카테고리 등록 폼 옵션 조회 (SA→GA 응답 어댑터) */
export function useSACategoryFormOptions(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [SA_CATEGORY_QUERY_KEY, "formOptions"],
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<CategoryFormOptionsResponse> => {
      const raw = await getSACategoryFormOptions();
      return {
        result: raw.result,
        generatedAt: raw.generatedAt,
        data: {
          divisions: raw.divisions.map((d) => ({
            value: d.code as CategoryDivision,
            label: d.label,
          })),
        },
      };
    },
    staleTime: Infinity,
  });
}

/** SA 카테고리 등록 mutation */
export function useSACreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SACreateCategoryRequest): Promise<CreateCategoryResponse> =>
      createSACategory(body).then((raw) => ({
        result: raw.result,
        generatedAt: raw.generatedAt,
        data: {
          categoryId: raw.category.categoryId,
          division: raw.category.division as CategoryDivision,
          categoryName: raw.category.categoryName,
          createdAt: "",
          updatedAt: "",
        },
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SA_CATEGORY_QUERY_KEY] });
    },
  });
}

/** SA 카테고리 수정 mutation (PATCH — division + categoryName 모두 전송) */
export function useSAUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      body,
    }: {
      categoryId: number;
      body: SAUpdateCategoryRequest;
    }): Promise<UpdateCategoryResponse> =>
      updateSACategory(categoryId, body).then((raw) => ({
        result: raw.result,
        generatedAt: raw.generatedAt,
        data: {
          categoryId: raw.category.categoryId,
          division: raw.category.division as CategoryDivision,
          categoryName: raw.category.categoryName,
          boardCount: 0,
          createdAt: "",
          updatedAt: "",
        },
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SA_CATEGORY_QUERY_KEY] });
    },
  });
}

/** SA 카테고리 삭제 mutation */
export function useSADeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: number): Promise<DeleteCategoryResponse> =>
      deleteSACategory(categoryId).then((raw) => ({
        result: raw.result,
        generatedAt: raw.generatedAt,
        data: null,
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SA_CATEGORY_QUERY_KEY] });
    },
  });
}
