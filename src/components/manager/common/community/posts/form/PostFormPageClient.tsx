/* ========================================
   게시글 작성/수정 페이지 컴포넌트 (공통)
   ======================================== */

/**
 * PostFormPageClient
 *
 * 목적: GA/SA 관리자 게시글 작성·수정 공통 폼 (ToastUI Editor 사용)
 *
 * 사용 페이지:
 * - /manager_ga/community/posts/create, /manager_ga/community/posts/[id]/edit
 * - /manager_sa/community/posts/create, /manager_sa/community/posts/[id]/edit
 */

"use client";

import { useEffect, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import styles from "@/styles/manager/common/community/posts/post_edit_page.module.css";
import { CustomDropdown } from "@/components/partner/campaign_create_form/common/selectors/CustomDropdown";
import { PostEditorField } from "@/components/manager/common/community/posts/form/PostEditorField";
import Toast from "@/components/common/toast/Toast";
import usePostForm, {
  CATEGORY_TYPE_OPTIONS,
  TARGET_OPTIONS,
} from "@/hooks/manager/common/community/usePostForm";

// 컴포넌트 Props 타입 정의
interface PostFormPageClientProps {
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

export default function PostFormPageClient({
  mode,
  post_id,
  initial_data,
  manager_type,
}: PostFormPageClientProps) {
  // 에디터 관련 상태
  const [is_mounted, setIsMounted] = useState(false);
  const [is_editor_ready, setIsEditorReady] = useState(false);
  const [is_editor_unlocked, setIsEditorUnlocked] = useState(false);
  const [editor_content, setEditorContent] = useState("");
  const [force_check, setForceCheck] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor_instance_ref = useRef<any>(null);
  const title_input_ref = useRef<HTMLInputElement>(null);

  // 폼 로직 훅
  const {
    category_type,
    category,
    setCategory,
    target,
    setTarget,
    title,
    setTitle,
    show_toast,
    set_show_toast,
    page_title,
    button_text,
    form_aria_label,
    is_faq_type,
    category_options,
    is_button_disabled,
    handleCategoryTypeChange,
    handle_submit,
  } = usePostForm({
    mode,
    post_id,
    initial_data,
    manager_type,
    editor_ref: editor_instance_ref,
    is_editor_ready,
    editor_content,
    force_check,
  });

  // --- 에디터 관련 effects ---

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 에디터 언락 시 포커스
  useEffect(() => {
    if (is_editor_unlocked && editor_instance_ref.current) {
      try {
        setTimeout(() => {
          editor_instance_ref.current?.focus?.();
        }, 100);
      } catch (_e) {
        // ignore
      }
    }
  }, [is_editor_unlocked]);

  // ToastEditor 툴바 스타일 주입
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
      .toastui-editor-contents p:empty:before {
        content: "" !important;
      }
      .toastui-editor-contents p:first-child:empty:before {
        content: "" !important;
      }
      .toastui-editor-contents p:contains("Write"),
      .toastui-editor-contents p:contains("Preview"),
      .toastui-editor-contents p:contains("Markdown"),
      .toastui-editor-contents p:contains("WYSIWYG") {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById("toast-editor-button-margin");
      if (el) document.head.removeChild(el);
    };
  }, [is_mounted]);

  // 에디터 준비 상태
  useEffect(() => {
    if (is_mounted && mode === "edit") {
      setIsEditorReady(true);
    }
  }, [is_mounted, mode]);

  // 에디터 내용 변경 추적
  useEffect(() => {
    if (!is_editor_ready || !editor_instance_ref.current) return;
    try {
      const editor = editor_instance_ref.current;
      const handleChange = () => {
        try {
          setEditorContent(editor.getHTML() || "");
        } catch (_error) {}
      };
      if (editor.on) editor.on("change", handleChange);
      if (editor.addHook) editor.addHook("change", handleChange);
      setEditorContent(editor.getHTML() || "");

      const interval_id = setInterval(() => {
        try {
          if (editor_instance_ref.current) {
            const content = editor_instance_ref.current.getHTML() || "";
            setEditorContent((prev) => (prev !== content ? content : prev));
            setForceCheck((prev) => prev + 1);
          }
        } catch (_error) {}
      }, 300);

      return () => {
        if (editor.off) editor.off("change", handleChange);
        if (editor.removeHook) editor.removeHook("change", handleChange);
        clearInterval(interval_id);
      };
    } catch (_error) {}
  }, [is_editor_ready]);

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
        {side_menu_items.map((item) => (
          <p
            key={item.label}
            className={`${styles.sidebar_item} ${item.isActive ? styles.sidebar_item_active : ""}`}
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
              options={CATEGORY_TYPE_OPTIONS}
              onChange={handleCategoryTypeChange}
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
              options={TARGET_OPTIONS}
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
            className={`${styles.save_button} ${
              is_button_disabled ? styles.save_button_disabled : ""
            }`}
            onClick={handle_submit}
            disabled={is_button_disabled}
            aria-label={`${button_text} 버튼`}
          >
            {button_text}
          </button>
        </div>
      </section>

      <Toast
        message={mode === "create" ? "등록되었습니다." : "저장되었습니다."}
        isOpen={show_toast}
        onClose={() => set_show_toast(false)}
        duration={2000}
      />
    </main>
  );
}
