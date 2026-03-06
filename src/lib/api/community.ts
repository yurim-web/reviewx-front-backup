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
