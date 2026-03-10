/* ========================================
   커뮤니티 게시글 API 함수
   ======================================== */

/**
 * community API
 *
 * 목적: 커뮤니티 게시글 등록/수정 API 함수 (mock)
 *
 * 사용 위치:
 * - src/hooks/manager/common/community/usePostForm.ts
 */

import { apiClient } from "@/lib/api/client";

// ────────────────────────────────────────
// FAQ 관련 타입
// ────────────────────────────────────────

export interface FAQPostResponse {
  id: number;
  number: string;
  division: string;
  category: string;
  target: string;
  title: string;
  content: string;
  view_count: number;
  registered_date: string;
  registered_by: string;
  is_pinned: boolean;
}

export interface CommunityCategoryResponse {
  id: number;
  number: string;
  division: string;
  category_name: string;
}

/**
 * FAQ 게시글 목록 조회
 * GET /community/faq → faq_posts 컬렉션
 */
export const fetchFAQPosts = (): Promise<FAQPostResponse[]> =>
  apiClient.get<FAQPostResponse[]>("/community/faq").then((res) => res.data);

/**
 * 커뮤니티 카테고리 목록 조회
 * GET /community/categories → community_categories 컬렉션
 */
export const fetchFAQCategories = (): Promise<CommunityCategoryResponse[]> =>
  apiClient.get<CommunityCategoryResponse[]>("/community/categories").then((res) => res.data);

export interface CommunityPostBody {
  division: string;
  category: string;
  target: string;
  title: string;
  content: string;
  number?: string;
  view_count?: number;
  registered_date?: string;
  registered_by?: string;
  is_pinned?: boolean;
}

/**
 * 게시글 등록
 * POST /admin/community → json-server community_posts 컬렉션에 저장
 */
export const postCommunityPost = (body: CommunityPostBody): Promise<void> =>
  apiClient.post("/admin/community", body).then(() => undefined);

/**
 * 게시글 수정
 * PATCH /admin/community/:id → json-server community_posts 컬렉션 업데이트
 */
export const patchCommunityPost = (id: string, body: Partial<CommunityPostBody>): Promise<void> =>
  apiClient.patch(`/admin/community/${id}`, body).then(() => undefined);
