"use client";

import {
  useEffect,
  type Dispatch,
  type MutableRefObject,
  type RefObject,
  type SetStateAction,
  type ComponentType,
} from "react";
import dynamic from "next/dynamic";
import "@toast-ui/editor/dist/toastui-editor.css";
import styles from "@/styles/manager_ga/community/posts/post_edit_page.module.css";

type ToastEditorProps = {
  initialValue?: string;
  initialEditType?: "markdown" | "wysiwyg";
  previewStyle?: "tab" | "vertical";
  height?: string;
  usageStatistics?: boolean;
  placeholder?: string;
  autofocus?: boolean;
  ref?: any;
};

const ToastEditor = dynamic<ToastEditorProps>(
  () =>
    import("@toast-ui/react-editor").then(
      (mod) => mod.Editor as unknown as ComponentType<ToastEditorProps>
    ),
  {
    ssr: false,
    loading: () => <div className={styles.editor_skeleton}>에디터 로딩중…</div>,
  }
);

interface PostEditorFieldProps {
  is_mounted: boolean;
  is_editor_ready: boolean;
  setIsEditorReady: Dispatch<SetStateAction<boolean>>;
  is_editor_unlocked: boolean;
  setIsEditorUnlocked: Dispatch<SetStateAction<boolean>>;
  mode: "create" | "edit";
  initial_data?: {
    body: string;
  } | null;
  editor_instance_ref: MutableRefObject<any>;
  title_input_ref: RefObject<HTMLInputElement | null>;
  body_label: string;
}

export function PostEditorField({
  is_mounted,
  is_editor_ready,
  setIsEditorReady,
  is_editor_unlocked,
  setIsEditorUnlocked,
  mode,
  initial_data,
  editor_instance_ref,
  title_input_ref,
  body_label,
}: PostEditorFieldProps) {
  // ----------------------------------------
  // 에디터 영역 렌더링
  // - 작성/수정 모드별 초기화
  // - 로딩 스켈레톤 / 클릭 가드 처리
  // ----------------------------------------
  return (
    <div className={styles.form_field}>
      <label className={styles.input_label} htmlFor="body">
        {body_label}
      </label>
      <div
        className={`${styles.editor_container} ${
          !is_editor_unlocked ? styles.editor_disabled : ""
        }`}
      >
        {is_mounted ? (
          <>
            <div
              style={{
                display:
                  mode === "create" && !is_editor_ready ? "none" : "block",
              }}
            >
              <ToastEditor
                ref={(editor: any) => {
                  if (!editor) return;
                  try {
                    if (editor.getInstance) {
                      editor_instance_ref.current = editor.getInstance();
                    } else if (editor.getRootElement) {
                      const rootElement = editor.getRootElement();
                      if (rootElement) {
                        editor_instance_ref.current = (
                          rootElement as any
                        ).__editor__;
                      }
                    }
                  } catch (e) {
                    // ignore
                  }
                  setIsEditorReady(true);
                }}
                initialValue={initial_data?.body ?? "  "}
                initialEditType="wysiwyg"
                previewStyle="vertical"
                height="340px"
                usageStatistics={false}
                placeholder=""
                autofocus={false}
              />
            </div>
            {mode === "create" && !is_editor_ready && (
              <div className={styles.editor_skeleton}>에디터 로딩중…</div>
            )}
            {is_editor_ready && !is_editor_unlocked && (
              <div
                className={styles.editor_click_guard}
                onClick={() => setIsEditorUnlocked(true)}
                aria-label="에디터 활성화"
              />
            )}
          </>
        ) : (
          <div className={styles.editor_skeleton}>에디터 로딩중…</div>
        )}
      </div>
    </div>
  );
}
