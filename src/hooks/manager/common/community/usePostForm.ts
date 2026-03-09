/* ========================================
   게시글 폼 로직 훅
   ======================================== */

/**
 * usePostForm
 *
 * 목적: PostFormPageClient의 폼 상태, 카테고리 필터, 제출 로직을 관리
 *
 * 사용 페이지:
 * - /manager_ga/community/posts/create, /manager_ga/community/posts/[id]/edit
 * - /manager_sa/community/posts/create, /manager_sa/community/posts/[id]/edit
 */

import { useState, useEffect, useMemo, useRef } from "react";
import {
  categories_data,
  initialize_categories_data,
  type CategoryDivision,
} from "@/data/manager_ga/community/categoriesData";
import {
  posts_data,
  add_post,
  update_post,
  type PostItem,
  type PostTarget,
  type PostDivision,
} from "@/data/manager_ga/community/postsData";
import { postCommunityPost, patchCommunityPost } from "@/lib/api/community";

interface UsePostFormConfig {
  mode: "create" | "edit";
  post_id?: string;
  initial_data?: {
    category_type: string;
    category: string;
    target: string;
    title: string;
    body: string;
  };
  manager_type: "ga" | "sa";
  /** 에디터 인스턴스 ref (제출 시 HTML 추출용) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor_ref: React.RefObject<any>;
  /** 에디터 준비 완료 여부 */
  is_editor_ready: boolean;
  /** 에디터 내용 (변경 추적용) */
  editor_content: string;
  /** 강제 리렌더링 카운터 */
  force_check: number;
}

// 드롭다운 옵션
const CATEGORY_TYPE_OPTIONS = ["공지사항", "자주 묻는 질문"].sort((a, b) =>
  a.localeCompare(b, "ko-KR")
);
const TARGET_OPTIONS = ["전체", "리뷰어", "파트너", "관리자"];

export { CATEGORY_TYPE_OPTIONS, TARGET_OPTIONS };

export default function usePostForm({
  mode,
  post_id,
  initial_data,
  manager_type,
  editor_ref,
  is_editor_ready,
  editor_content,
  force_check,
}: UsePostFormConfig) {
  const base_path =
    manager_type === "ga" ? "/manager_ga/community/posts" : "/manager_sa/community/posts";
  const page_title = mode === "create" ? "게시글 등록" : "게시글 수정";
  const button_text = mode === "create" ? "등록" : "저장";
  const form_aria_label = mode === "create" ? "게시글 등록 폼" : "게시글 수정 폼";

  // 폼 상태
  const [category_type, setCategoryType] = useState(
    initial_data?.category_type || (mode === "create" ? "공지사항" : "")
  );
  const [category, setCategory] = useState(initial_data?.category || "");
  const [target, setTarget] = useState(initial_data?.target || (mode === "create" ? "전체" : ""));
  const [title, setTitle] = useState(initial_data?.title || "");
  const [show_toast, set_show_toast] = useState(false);
  const [categories_list, setCategoriesList] = useState(categories_data);
  const is_initial_mount = useRef(true);

  const is_faq_type = category_type === "자주 묻는 질문";

  // initial_data 동기화 (수정 모드)
  useEffect(() => {
    if (mode === "edit" && initial_data) {
      if (initial_data.category_type) setCategoryType(initial_data.category_type);
      if (initial_data.category) setCategory(initial_data.category);
      if (initial_data.target) setTarget(initial_data.target);
      if (initial_data.title) setTitle(initial_data.title);
    }
  }, [mode, initial_data]);

  // 구분 변경 핸들러 (초기 마운트 제외)
  const handleCategoryTypeChange = (new_type: string) => {
    setCategoryType(new_type);
    if (!is_initial_mount.current) {
      setCategory("");
    }
  };

  // 카테고리 옵션 필터링
  const category_options = useMemo(() => {
    if (!category_type) return [];
    return categories_list
      .filter((item) => item.division === (category_type as CategoryDivision))
      .map((item) => item.category_name)
      .sort((a, b) => a.localeCompare(b, "ko-KR"));
  }, [category_type, categories_list]);

  // 작성 모드: 카테고리 기본 선택
  useEffect(() => {
    if (mode !== "create" || category_options.length === 0) return;
    if (category === "" || !category_options.includes(category)) {
      setCategory(category_options[0]);
    }
  }, [mode, category_options, category]);

  // 카테고리 데이터 초기화 (localStorage)
  useEffect(() => {
    if (typeof window === "undefined") return;
    initialize_categories_data();
    setCategoriesList([...categories_data]);
    setTimeout(() => {
      is_initial_mount.current = false;
    }, 200);
  }, []);

  // 버튼 비활성화
  const is_button_disabled = useMemo(() => {
    if (mode === "edit" && initial_data) return false;
    if (!category_type || !category || !target || !title.trim()) return true;
    if (!is_editor_ready || !editor_ref.current) return true;

    try {
      const content = editor_ref.current.getHTML() || "";
      const text = content
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (!text) return true;
    } catch (_error) {
      return true;
    }
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mode,
    initial_data,
    category_type,
    category,
    target,
    title,
    editor_content,
    is_editor_ready,
    force_check,
  ]);

  // 제출 핸들러
  const handle_submit = async () => {
    if (!category_type || !category || !target || !title.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    let content = "";
    try {
      if (editor_ref.current) {
        content = editor_ref.current.getHTML() || "";
      }
    } catch (_error) {
      alert("에디터 내용을 가져오는데 실패했습니다.");
      return;
    }

    const now = new Date();
    const date_string = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const time_string = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const registered_date = `${date_string} ${time_string}`;

    if (mode === "create") {
      const max_id = Math.max(...posts_data.map((item) => Number(item.id)), 0);
      const max_number = Math.max(...posts_data.map((item) => Number(item.number)), 0);
      const new_post: PostItem = {
        id: String(max_id + 1),
        number: String(max_number + 1).padStart(6, "0"),
        division: category_type as PostDivision,
        category,
        target: target as PostTarget,
        title: title.trim(),
        view_count: 0,
        registered_date,
        registered_by: "관리자",
        is_pinned: false,
      };
      add_post(new_post, content);
      // mock DB에 게시글 저장
      try {
        await postCommunityPost({ ...new_post, content });
      } catch (_apiError) {
        console.warn("게시글 작성 API 호출 실패 (로컬 저장 완료):", _apiError);
      }
    } else {
      if (!post_id) {
        alert("게시글 ID가 없습니다.");
        return;
      }
      const existing = posts_data.find((p) => p.id === post_id);
      if (!existing) {
        alert("수정할 게시글을 찾을 수 없습니다.");
        return;
      }
      update_post(
        post_id,
        {
          ...existing,
          division: category_type as PostDivision,
          category,
          target: target as PostTarget,
          title: title.trim(),
        },
        content
      );
      // mock DB에 게시글 수정 저장
      try {
        await patchCommunityPost(post_id, {
          division: category_type as PostDivision,
          category,
          target: target as PostTarget,
          title: title.trim(),
          content,
        });
      } catch (_apiError) {
        console.warn("게시글 수정 API 호출 실패 (로컬 저장 완료):", _apiError);
      }
    }

    set_show_toast(true);
    setTimeout(() => {
      window.location.href = base_path;
    }, 2000);
  };

  return {
    // 상태
    category_type,
    category,
    setCategory,
    target,
    setTarget,
    title,
    setTitle,
    show_toast,
    set_show_toast,
    // 파생값
    base_path,
    page_title,
    button_text,
    form_aria_label,
    is_faq_type,
    category_options,
    is_button_disabled,
    // 핸들러
    handleCategoryTypeChange,
    handle_submit,
  };
}
