/* ========================================
   관리자 카테고리 React Query 훅
   ======================================== */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategoryList,
  getCategoryDetail,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryFormOptions,
  type CategoryListParams,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
} from "@/lib/api/categories";

const CATEGORY_QUERY_KEY = "adminCategories";

/** 카테고리 목록 조회 */
export function useAdminCategories(params?: CategoryListParams) {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY, params],
    queryFn: () => getCategoryList(params),
    staleTime: 30_000,
  });
}

/** 카테고리 상세 조회 (수정 페이지) */
export function useCategoryDetail(categoryId: number) {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY, "detail", categoryId],
    queryFn: () => getCategoryDetail(categoryId),
    enabled: categoryId > 0,
    staleTime: 30_000,
  });
}

/** 카테고리 등록 폼 옵션 조회 */
export function useCategoryFormOptions() {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY, "formOptions"],
    queryFn: getCategoryFormOptions,
    staleTime: Infinity,
  });
}

/** 카테고리 등록 mutation */
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCategoryRequest) => createCategory(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
}

/** 카테고리 수정 mutation */
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, body }: { categoryId: number; body: UpdateCategoryRequest }) =>
      updateCategory(categoryId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
}

/** 카테고리 삭제 mutation */
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
}
