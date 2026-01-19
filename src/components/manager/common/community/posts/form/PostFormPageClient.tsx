"use client";
/* ========================================
   📝 게시글 작성/수정 페이지 컴포넌트 (공통)
   ======================================== */

/**
 * 게시글 작성/수정 페이지 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 게시글 작성 및 수정 페이지에서 공통으로 사용하는 게시글 폼 컴포넌트입니다.
 *       ToastUI Editor를 사용하여 게시글을 작성하거나 수정할 수 있습니다.
 *
 * 사용 페이지:
 * - /manager_ga/community/posts/create (GA 관리자 게시글 작성 페이지)
 * - /manager_sa/community/posts/create (SA 관리자 게시글 작성 페이지)
 * - /manager_ga/community/posts/[id]/edit (GA 관리자 게시글 수정 페이지)
 * - /manager_sa/community/posts/[id]/edit (SA 관리자 게시글 수정 페이지)
 */

import { useEffect, useMemo, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import styles from "@/styles/manager/common/community/posts/post_edit_page.module.css";
import { CustomDropdown } from "@/components/partner/campaign_create_form/common/selectors/CustomDropdown";
import { PostEditorField } from "@/components/manager/common/community/posts/form/PostEditorField";
// 카테고리 데이터를 가져와서 구분에 따라 필터링된 카테고리 목록을 표시하기 위해 import
import {
  categories_data,
  initialize_categories_data,
  type CategoryDivision,
} from "@/data/manager_ga/community/categoriesData";
import {
  posts_data,
  add_post,
  update_post,
  initialize_posts_data,
  type PostItem,
  type PostTarget,
  type PostDivision,
} from "@/data/manager_ga/community/postsData";
import { useRouter } from "next/navigation";

// 컴포넌트 Props 타입 정의
interface PostFormPageClientProps {
  // 모드: "create" (작성) 또는 "edit" (수정)
  mode: "create" | "edit";
  // 게시글 ID (수정 모드에서만 사용)
  post_id?: string;
  // 초기 폼 데이터 (수정 모드에서 사용)
  initial_data?: {
    category_type: string;
    category: string;
    target: string;
    title: string;
    body: string;
  };
  // 관리자 타입 ('ga' | 'sa')
  manager_type: "ga" | "sa";
}

// 사이드바 메뉴 데이터
const side_menu_items = [
  { label: "홈", isActive: false },
  { label: "캠페인", isActive: false },
  { label: "정산", isActive: false },
  { label: "회원", isActive: false },
  { label: "커뮤니티", isActive: false },
  { label: "대시보드", isActive: false },
  { label: "진행 현황", isActive: false },
  { label: "출금 현황", isActive: false },
  { label: "출금 요청", isActive: false },
  { label: "결제 내역", isActive: false },
  { label: "리뷰어 목록", isActive: false },
  { label: "파트너 목록", isActive: false },
  { label: "관리자 목록", isActive: false },
  { label: "차단 내역", isActive: false },
  { label: "게시글 목록", isActive: true },
  { label: "카테고리 관리", isActive: false },
];

// 드롭다운 옵션 데이터
// 구분 옵션: 공지사항, 자주 묻는 질문
const category_type_options = ["공지사항", "자주 묻는 질문"];
// 대상 옵션
const target_options = ["전체", "리뷰어", "파트너", "관리자"];

/**
 * 카테고리 목록은 구분(category_type)에 따라 동적으로 필터링됩니다.
 * 카테고리 관리 페이지(/manager_sa/community/categories)에서 등록한 카테고리 중
 * 선택된 구분과 일치하는 카테고리만 표시됩니다.
 */

export default function PostFormPageClient({
  mode,
  post_id,
  initial_data,
  manager_type,
}: PostFormPageClientProps) {
  // Next.js 라우터 사용
  const router = useRouter();

  // manager_type에 따른 base path 설정
  const base_path =
    manager_type === "ga"
      ? "/manager_ga/community/posts"
      : "/manager_sa/community/posts";
  // 🧭 클라이언트에서만 에디터를 그리기 위해 마운트 여부를 체크합니다.
  const [is_mounted, setIsMounted] = useState(false);
  const [is_editor_ready, setIsEditorReady] = useState(false);
  const [is_editor_unlocked, setIsEditorUnlocked] = useState(false);
  const editor_ref = useState<any>(null)[0];
  const editor_instance_ref = useRef<any>(null);
  const title_input_ref = useRef<HTMLInputElement>(null);

  // 폼 상태 관리
  // mode가 "create"이면 빈 값, "edit"이면 initial_data 사용
  const [category_type, setCategoryType] = useState(
    initial_data?.category_type || ""
  );
  const [category, setCategory] = useState(initial_data?.category || "");
  const [target, setTarget] = useState(initial_data?.target || "");
  const [title, setTitle] = useState(initial_data?.title || "");

  // 초기 마운트 여부를 추적하는 ref
  const is_initial_mount = useRef(true);

  /**
   * 구분(category_type)이 변경되면 카테고리도 초기화
   * useEffect: 컴포넌트의 상태가 변경될 때 실행되는 React Hook입니다.
   * category_type이 변경되면 category를 빈 문자열로 초기화합니다.
   * 단, 초기 마운트 시에는 초기화하지 않습니다 (수정 모드에서 initial_data가 설정된 경우를 위해).
   */
  useEffect(() => {
    // 초기 마운트 시에는 초기화하지 않음 (수정 모드에서 initial_data가 설정된 경우)
    if (is_initial_mount.current) {
      is_initial_mount.current = false;
      return;
    }

    // 구분이 변경되면 카테고리 선택을 초기화
    setCategory("");
  }, [category_type]);

  /**
   * 선택된 구분에 따라 카테고리 목록을 필터링
   * useMemo: 계산 비용이 큰 값을 메모이제이션하여 성능을 최적화합니다.
   * category_type이 변경될 때만 다시 계산됩니다.
   *
   * 필터링 로직:
   * 1. category_type이 선택되지 않았으면 빈 배열 반환
   * 2. categories_data에서 division이 category_type과 일치하는 항목만 필터링
   * 3. category_name만 추출하여 배열로 반환
   */
  const category_options = useMemo(() => {
    // 구분이 선택되지 않았으면 빈 배열 반환
    if (!category_type) {
      return [];
    }

    // 카테고리 데이터에서 선택된 구분과 일치하는 카테고리만 필터링
    // filter: 배열에서 조건에 맞는 요소만 추출하는 JavaScript 배열 메서드입니다.
    const filtered_categories = categories_data.filter(
      (item) => item.division === (category_type as CategoryDivision)
    );

    // map: 배열의 각 요소를 변환하여 새로운 배열을 만드는 JavaScript 배열 메서드입니다.
    // category_name만 추출하여 카테고리 옵션 배열 생성
    return filtered_categories.map((item) => item.category_name);
  }, [category_type]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 에디터가 언락되면 포커스를 설정
  useEffect(() => {
    if (is_editor_unlocked && editor_instance_ref.current) {
      try {
        setTimeout(() => {
          editor_instance_ref.current?.focus?.();
        }, 100);
      } catch (e) {
        // ignore
      }
    }
  }, [is_editor_unlocked]);

  // ToastEditor 툴바 버튼 마진 조정 및 기본 콘텐츠 제거를 위한 스타일 주입
  useEffect(() => {
    if (!is_mounted) return;

    const style = document.createElement("style");
    style.id = "toast-editor-button-margin";
    style.textContent = `
      .toastui-editor-defaultUI-toolbar button,
      .toastui-editor-toolbar button,
      .toastui-editor-toolbar-button {
        margin: 5px 2px !important;
      }
      /* 기본 콘텐츠 제거 - 작성 모드일 때만 */
      .toastui-editor-contents p:empty:before {
        content: "" !important;
      }
      .toastui-editor-contents p:first-child:empty:before {
        content: "" !important;
      }
      /* 초기 로드 시 기본 텍스트 숨기기 */
      .toastui-editor-contents p:contains("Write"),
      .toastui-editor-contents p:contains("Preview"),
      .toastui-editor-contents p:contains("Markdown"),
      .toastui-editor-contents p:contains("WYSIWYG") {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const styleElement = document.getElementById(
        "toast-editor-button-margin"
      );
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, [is_mounted]);

  // 작성 모드일 때 에디터가 로드되기 전에 준비 상태 설정
  useEffect(() => {
    if (is_mounted && mode === "create") {
      // 에디터가 로드되기 전에 미리 준비 상태로 설정하여 스켈레톤을 계속 표시
      // 실제 에디터는 ref 콜백에서 준비 완료 처리
    } else if (is_mounted && mode === "edit") {
      // 수정 모드일 때는 즉시 준비 완료
      setIsEditorReady(true);
    }
  }, [is_mounted, mode]);

  // mode에 따라 페이지 제목과 버튼 텍스트 결정
  const page_title = mode === "create" ? "게시글 작성" : "게시글 수정";
  const button_text = mode === "create" ? "등록" : "수정";
  const form_aria_label =
    mode === "create" ? "게시글 작성 폼" : "게시글 수정 폼";

  // 카테고리 타입이 "자주 묻는 질문"인지 여부에 따라 라벨 텍스트 변경
  const is_faq_type = category_type === "자주 묻는 질문";

  /**
   * 카테고리 목록 업데이트 (localStorage에서 최신 데이터 불러오기)
   * - 컴포넌트가 마운트될 때 카테고리 데이터를 초기화합니다
   */
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    initialize_categories_data();
  }, []);

  /**
   * 게시글 등록/수정 핸들러
   * - 에디터에서 HTML 내용을 가져와서 게시글을 저장합니다
   * - localStorage에 저장하고 게시글 목록 페이지로 이동합니다
   */
  const handle_submit = () => {
    // 필수 필드 검증
    if (!category_type || !category || !target || !title.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 에디터에서 HTML 내용 가져오기
    let content = "";
    try {
      if (editor_instance_ref.current) {
        // ToastUI Editor에서 HTML 내용 가져오기
        content = editor_instance_ref.current.getHTML() || "";
      }
    } catch (error) {
      console.error("에디터 내용 가져오기 실패:", error);
      alert("에디터 내용을 가져오는데 실패했습니다.");
      return;
    }

    // 게시글 데이터 생성
    const now = new Date();
    const date_string = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const time_string = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const registered_date = `${date_string} ${time_string}`;

    if (mode === "create") {
      // 등록 모드: 새로운 게시글 생성
      // 새로운 ID 생성
      const max_id = Math.max(...posts_data.map((item) => Number(item.id)), 0);
      const new_id = String(max_id + 1);

      // 새로운 번호 생성
      const max_number = Math.max(
        ...posts_data.map((item) => Number(item.number)),
        0
      );
      const new_number = String(max_number + 1).padStart(6, "0");

      // 게시글 데이터 생성
      const new_post: PostItem = {
        id: new_id,
        number: new_number,
        division: category_type as PostDivision,
        category: category,
        target: target as PostTarget,
        title: title.trim(),
        view_count: 0,
        registered_date: registered_date,
        registered_by: "관리자", // TODO: 실제 로그인한 관리자 정보 사용
        is_pinned: false,
      };

      // 게시글 등록 및 localStorage 저장
      add_post(new_post, content);
      console.log("게시글 등록:", new_post);

      // 게시글 목록 페이지로 이동
      router.push(base_path);
    } else {
      // 수정 모드: 기존 게시글 수정
      if (!post_id) {
        alert("게시글 ID가 없습니다.");
        return;
      }

      // 기존 게시글 찾기
      const existing_post = posts_data.find((p) => p.id === post_id);
      if (!existing_post) {
        alert("수정할 게시글을 찾을 수 없습니다.");
        return;
      }

      // 수정된 게시글 데이터 생성
      const updated_post: PostItem = {
        ...existing_post,
        division: category_type as PostDivision,
        category: category,
        target: target as PostTarget,
        title: title.trim(),
      };

      // 게시글 수정 및 localStorage 저장
      update_post(post_id, updated_post, content);
      console.log("게시글 수정:", updated_post);

      // 게시글 목록 페이지로 이동
      router.push(base_path);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header_bar} aria-label="상단 헤더">
        <div className={styles.header_logo} aria-label="로고 영역">
          로고
        </div>
        <div className={styles.header_actions}>
          <span className={styles.header_action_button} aria-hidden />
          <span className={styles.header_action_button} aria-hidden />
        </div>
      </header>

      <aside className={styles.sidebar} aria-label="관리자 메뉴">
        {/* 배열 map 메서드를 사용하여 메뉴 아이템을 렌더링합니다. */}
        {side_menu_items.map((item) => (
          <p
            key={item.label}
            className={`${styles.sidebar_item} ${
              item.isActive ? styles.sidebar_item_active : ""
            }`}
          >
            {item.label}
          </p>
        ))}
      </aside>

      <section className={styles.main_content}>
        <div className={styles.page_header}>
          <h1 className={styles.page_title}>{page_title}</h1>
        </div>

        <div className={styles.form_card} aria-label={form_aria_label}>
          <div className={styles.form_field}>
            <label className={styles.input_label} htmlFor="categoryType">
              구분
            </label>
            <CustomDropdown
              value={category_type}
              options={category_type_options}
              onChange={setCategoryType}
              placeholder="구분을 선택하세요"
            />
          </div>

          <div className={styles.form_field}>
            <label className={styles.input_label} htmlFor="category">
              카테고리
            </label>
            <CustomDropdown
              value={category}
              options={category_options}
              onChange={setCategory}
              placeholder="카테고리를 선택하세요"
            />
          </div>

          <div className={styles.form_field}>
            <label className={styles.input_label} htmlFor="target">
              대상
            </label>
            <CustomDropdown
              value={target}
              options={target_options}
              onChange={setTarget}
              placeholder="대상을 선택하세요"
            />
          </div>

          <div className={styles.form_field}>
            <label className={styles.input_label} htmlFor="title">
              {is_faq_type ? "질문" : "제목"}
            </label>
            <input
              id="title"
              className={styles.input_box}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
              ref={title_input_ref}
              aria-label="게시글 제목"
              placeholder="제목을 입력하세요"
            />
          </div>

          <PostEditorField
            is_mounted={is_mounted}
            is_editor_ready={is_editor_ready}
            setIsEditorReady={setIsEditorReady}
            is_editor_unlocked={is_editor_unlocked}
            setIsEditorUnlocked={setIsEditorUnlocked}
            mode={mode}
            initial_data={initial_data}
            editor_instance_ref={editor_instance_ref}
            title_input_ref={title_input_ref}
            body_label={is_faq_type ? "답변" : "내용"}
          />

          <button
            type="button"
            className={styles.save_button}
            onClick={handle_submit}
            aria-label={`${button_text} 버튼`}
          >
            {button_text}
          </button>
        </div>
      </section>
    </main>
  );
}
