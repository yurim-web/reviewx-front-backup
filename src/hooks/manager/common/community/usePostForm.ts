/* ========================================
   게시글 폼 로직 훅
   ======================================== */

/**
 * usePostForm
 *
 * 목적: PostFormPageClient의 폼 상태, 카테고리 필터, 제출 로직을 관리
 *       localStorage 완전 제거 → API 훅 사용
 *
 * 사용 페이지:
 * - /manager_ga/community/posts/create, /manager_ga/community/posts/[id]/edit
 * - /manager_sa/community/posts/create, /manager_sa/community/posts/[id]/edit
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useBoardFormOptions,
  useCreateBoard,
  useUpdateBoard,
} from "@/hooks/manager/ga/useAdminPosts";
import {
  useSABoardFormOptions,
  useSACreateBoard,
  useSAUpdateBoard,
} from "@/hooks/manager/sa/community/useSAAdminPosts";
import type { BoardDivision, BoardTarget, BoardCategoryOption } from "@/lib/api/posts";
import { BOARD_DIVISION_LABEL_MAP, BOARD_TARGET_LABEL_MAP } from "@/lib/api/posts";

interface UsePostFormConfig {
  mode: "create" | "edit";
  post_id?: string;
  initial_data?: {
    category_type: string; // division enum (e.g. "NOTICE")
    category: string; // boardCategory name (e.g. "전체")
    target: string; // target enum (e.g. "ALL")
    title: string;
    body: string;
  };
  manager_type: "ga" | "sa";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor_ref: React.RefObject<any>;
  is_editor_ready: boolean;
  editor_content: string;
  force_check: number;
}

// 드롭다운 옵션 (한글 레이블 표시, value는 enum)
const CATEGORY_TYPE_OPTIONS = Object.entries(BOARD_DIVISION_LABEL_MAP).map(([, label]) => label);
const TARGET_OPTIONS = Object.entries(BOARD_TARGET_LABEL_MAP).map(([, label]) => label);

export { CATEGORY_TYPE_OPTIONS, TARGET_OPTIONS };

// 한글 → enum 역매핑
const divisionLabelToEnum: Record<string, BoardDivision> = {};
for (const [k, v] of Object.entries(BOARD_DIVISION_LABEL_MAP)) {
  divisionLabelToEnum[v] = k as BoardDivision;
}
const targetLabelToEnum: Record<string, BoardTarget> = {};
for (const [k, v] of Object.entries(BOARD_TARGET_LABEL_MAP)) {
  targetLabelToEnum[v] = k as BoardTarget;
}

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
  const router = useRouter();
  const base_path =
    manager_type === "ga" ? "/manager_ga/community/posts" : "/manager_sa/community/posts";
  const page_title = mode === "create" ? "게시글 등록" : "게시글 수정";
  const button_text = mode === "create" ? "등록" : "저장";
  const form_aria_label = mode === "create" ? "게시글 등록 폼" : "게시글 수정 폼";

  const is_sa = manager_type === "sa";

  // 폼 옵션 API 조회 (GA/SA 모두 호출 — React 규칙)
  const gaFormOptions = useBoardFormOptions();
  const saFormOptions = useSABoardFormOptions();
  const formOptions = is_sa ? saFormOptions.data?.data : gaFormOptions.data?.data;

  // GA 뮤테이션
  const gaCreateBoard = useCreateBoard();
  const gaUpdateBoard = useUpdateBoard();

  // SA 뮤테이션
  const saCreateBoard = useSACreateBoard();
  const saUpdateBoard = useSAUpdateBoard();

  // initial_data의 division/target은 enum 값으로 올 수 있음 → 한글 레이블로 변환
  const toLabel = (val: string, map: Record<string, string>) => map[val] || val;

  // 폼 상태 (한글 레이블로 관리)
  const [category_type, setCategoryType] = useState(
    initial_data?.category_type
      ? toLabel(initial_data.category_type, BOARD_DIVISION_LABEL_MAP)
      : mode === "create"
        ? "공지사항"
        : ""
  );
  const [category, setCategory] = useState(initial_data?.category || "");
  const [target, setTarget] = useState(
    initial_data?.target
      ? toLabel(initial_data.target, BOARD_TARGET_LABEL_MAP)
      : mode === "create"
        ? "전체"
        : ""
  );
  const [title, setTitle] = useState(initial_data?.title || "");
  const [show_toast, set_show_toast] = useState(false);
  const is_initial_mount = useRef(true);

  const is_faq_type = category_type === "자주 묻는 질문";

  // initial_data 동기화 (수정 모드)
  useEffect(() => {
    if (mode === "edit" && initial_data) {
      if (initial_data.category_type)
        setCategoryType(toLabel(initial_data.category_type, BOARD_DIVISION_LABEL_MAP));
      if (initial_data.category) setCategory(initial_data.category);
      if (initial_data.target) setTarget(toLabel(initial_data.target, BOARD_TARGET_LABEL_MAP));
      if (initial_data.title) setTitle(initial_data.title);
    }
  }, [mode, initial_data]);

  // 구분 변경 핸들러
  const handleCategoryTypeChange = (new_type: string) => {
    setCategoryType(new_type);
    if (!is_initial_mount.current) {
      setCategory("");
    }
  };

  // 카테고리 옵션 필터링 (API formOptions 기반)
  const category_options = useMemo(() => {
    if (!category_type || !formOptions?.boardCategories) return [];
    const divisionEnum = divisionLabelToEnum[category_type];
    if (!divisionEnum) return [];
    return formOptions.boardCategories
      .filter((c: BoardCategoryOption) => c.division === divisionEnum)
      .map((c: BoardCategoryOption) => c.categoryName)
      .sort((a: string, b: string) => a.localeCompare(b, "ko-KR"));
  }, [category_type, formOptions]);

  // boardCategoryId 가져오기 (GA용)
  const getBoardCategoryId = (catName: string, divLabel: string): number => {
    if (!formOptions?.boardCategories) return 0;
    const divEnum = divisionLabelToEnum[divLabel];
    const found = formOptions.boardCategories.find(
      (c: BoardCategoryOption) => c.categoryName === catName && c.division === divEnum
    );
    return found?.boardCategoryId || 0;
  };

  // SA: 카테고리명 → 카테고리 코드 변환
  const getCategoryCode = (catName: string, divLabel: string): string => {
    if (!formOptions?.boardCategories) return "";
    const divEnum = divisionLabelToEnum[divLabel];
    const found = formOptions.boardCategories.find(
      (c: BoardCategoryOption) => c.categoryName === catName && c.division === divEnum
    );
    // SA 훅에서 categoryCode를 추가 (useSABoardFormOptions)
    return (found as BoardCategoryOption & { categoryCode?: string })?.categoryCode || "";
  };

  // 작성 모드: 카테고리 기본 선택
  useEffect(() => {
    if (mode !== "create" || category_options.length === 0) return;
    if (category === "" || !category_options.includes(category)) {
      setCategory(category_options[0]);
    }
  }, [mode, category_options, category]);

  // 초기 마운트 플래그 해제
  useEffect(() => {
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

    const divisionEnum = divisionLabelToEnum[category_type] || "NOTICE";
    const targetEnum = targetLabelToEnum[target] || "ALL";

    try {
      if (is_sa) {
        // SA: category code 기반 등록/수정
        const categoryCode = getCategoryCode(category, category_type);
        if (mode === "create") {
          await saCreateBoard.mutateAsync({
            division: divisionEnum,
            category: categoryCode,
            target: targetEnum,
            title: title.trim(),
            content,
          });
        } else {
          if (!post_id) {
            alert("게시글 ID가 없습니다.");
            return;
          }
          await saUpdateBoard.mutateAsync({
            boardId: Number(post_id),
            body: {
              division: divisionEnum,
              boardCategory: categoryCode,
              target: targetEnum,
              title: title.trim(),
              content,
            },
          });
        }
      } else {
        // GA: boardCategoryId 기반 등록/수정
        const boardCategoryId = getBoardCategoryId(category, category_type);
        if (mode === "create") {
          await gaCreateBoard.mutateAsync({
            division: divisionEnum,
            boardCategoryId,
            target: targetEnum,
            title: title.trim(),
            content,
          });
        } else {
          if (!post_id) {
            alert("게시글 ID가 없습니다.");
            return;
          }
          await gaUpdateBoard.mutateAsync({
            boardId: Number(post_id),
            body: {
              division: divisionEnum,
              boardCategoryId,
              target: targetEnum,
              title: title.trim(),
              content,
            },
          });
        }
      }

      set_show_toast(true);
      setTimeout(() => {
        router.push(base_path);
      }, 2000);
    } catch (error) {
      console.error("게시글 저장 실패:", error);
      alert("게시글 저장에 실패했습니다.");
    }
  };

  return {
    category_type,
    category,
    setCategory,
    target,
    setTarget,
    title,
    setTitle,
    show_toast,
    set_show_toast,
    base_path,
    page_title,
    button_text,
    form_aria_label,
    is_faq_type,
    category_options,
    is_button_disabled,
    handleCategoryTypeChange,
    handle_submit,
  };
}
