/* ========================================
   FAQ 데이터 조회 훅
   ======================================== */

/**
 * useFAQData
 *
 * 목적: json-server에서 FAQ 게시글과 카테고리를 조회하고,
 *       FAQItem 형식으로 변환하여 반환합니다.
 *       API 실패 시 정적 fallback 데이터를 사용합니다.
 *
 * 사용 페이지:
 * - /faq (자주 묻는 질문 페이지)
 */

import { useQuery } from "@tanstack/react-query";
import { fetchFAQPosts, fetchFAQCategories } from "@/lib/api/community";
import type { FAQPostResponse, CommunityCategoryResponse } from "@/lib/api/community";
import { convertPostToFAQ } from "@/utils/faq/convertPostToFAQ";
import type { FAQItem } from "@/utils/faq/convertPostToFAQ";
import { posts_data } from "@/data/manager_ga/community/postsData";
import { get_post_detail } from "@/data/manager_ga/community/postsData";
import { categories_data } from "@/data/manager_ga/community/categoriesData";
import type { CategoryItem } from "@/data/manager_ga/community/categoriesData";
import { convertPostsToFAQs } from "@/utils/faq/convertPostToFAQ";

// ────────────────────────────────────────
// FAQ 게시글 응답 → PostItem 형태로 변환 후 FAQItem 변환
// ────────────────────────────────────────

function convertFAQResponseToFAQItem(post: FAQPostResponse): FAQItem | null {
  return convertPostToFAQ(
    {
      id: String(post.id),
      number: post.number,
      division: post.division as import("@/data/manager_ga/common/filterOptions").PostDivision,
      category: post.category,
      target: post.target as import("@/data/manager_ga/community/postsData").PostTarget,
      title: post.title,
      view_count: post.view_count,
      registered_date: post.registered_date,
      registered_by: post.registered_by,
      is_pinned: post.is_pinned,
    },
    { content: post.content } as import("@/data/manager_ga/community/postsData").PostDetail
  );
}

// ────────────────────────────────────────
// 카테고리 응답 → CategoryItem 형태로 변환
// ────────────────────────────────────────

function convertCategoryResponse(item: CommunityCategoryResponse): CategoryItem {
  return {
    id: String(item.id),
    number: item.number,
    division:
      item.division as import("@/data/manager_ga/community/categoriesData").CategoryDivision,
    category_name: item.category_name,
  };
}

// ────────────────────────────────────────
// fallback: 정적 데이터에서 FAQ 카테고리명 목록 생성
// ────────────────────────────────────────

function getFallbackCategoryNames(): string[] {
  const faq_categories = categories_data
    .filter((c: CategoryItem) => c.division === "자주 묻는 질문")
    .map((c: CategoryItem) => c.category_name);
  return ["전체", ...Array.from(new Set(faq_categories))];
}

// ────────────────────────────────────────
// 훅
// ────────────────────────────────────────

export interface UseFAQDataResult {
  faqs: FAQItem[];
  categories: string[];
  isLoading: boolean;
}

export function useFAQData(): UseFAQDataResult {
  const { data: postsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ["faq-posts"],
    queryFn: fetchFAQPosts,
    staleTime: 1000 * 60 * 5,
  });

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["community-categories"],
    queryFn: fetchFAQCategories,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isPostsLoading || isCategoriesLoading;

  // FAQ 게시글 변환
  const faqs: FAQItem[] = postsData
    ? postsData.map(convertFAQResponseToFAQItem).filter((faq): faq is FAQItem => faq !== null)
    : convertPostsToFAQs(posts_data, get_post_detail);

  // 카테고리 목록 변환 (division이 "자주 묻는 질문"인 것만)
  const categories: string[] = categoriesData
    ? [
        "전체",
        ...Array.from(
          new Set(
            categoriesData
              .filter((c) => c.division === "자주 묻는 질문")
              .map((c) => c.category_name)
          )
        ),
      ]
    : getFallbackCategoryNames();

  return { faqs, categories, isLoading };
}
