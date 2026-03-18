import { apiClient } from "@/lib/api/client";

export interface CategoryListParams {
  division?: string;
  keyword?: string;
}

export interface CategoryApiItem {
  categoryId: number;
  division: string;
  categoryName: string;
  boardCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryListResponse {
  categories: CategoryApiItem[];
  total: number;
}

export interface CreateCategoryRequest {
  division: string;
  categoryName: string;
}

export interface UpdateCategoryRequest {
  division?: string;
  categoryName?: string;
}

export const getCategoryList = (params?: CategoryListParams): Promise<CategoryListResponse> =>
  apiClient.get("/api/admin/board-categories", { params }).then((res) => res.data);

export const createCategory = (body: CreateCategoryRequest): Promise<void> =>
  apiClient.post("/api/admin/board-categories", body).then(() => undefined);

export const updateCategoryApi = (categoryId: number, body: UpdateCategoryRequest): Promise<void> =>
  apiClient.patch(`/api/admin/board-categories/${categoryId}`, body).then(() => undefined);

export const deleteCategory = (categoryId: number): Promise<void> =>
  apiClient.delete(`/api/admin/board-categories/${categoryId}`).then(() => undefined);

export interface CategoryFormOptions {
  divisions: string[];
}

export const getCategoryFormOptions = (): Promise<CategoryFormOptions> =>
  apiClient.get("/api/admin/board-categories/form").then((res) => res.data);
