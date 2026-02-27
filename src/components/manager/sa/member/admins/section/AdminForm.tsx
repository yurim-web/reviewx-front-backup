/* ========================================
   관리자 등록/수정 폼 컴포넌트 (통합)
   ======================================== */

/**
 * AdminForm
 *
 * 목적: 관리자 등록 및 수정 페이지에서 공통으로 사용하는 폼 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/admins/create (관리자 등록 페이지)
 * - /manager_sa/member/admins/[id]/edit (관리자 수정 페이지)
 */

"use client";

import styles from "@/styles/manager_sa/member/admins/admin_create_page.module.css";
import type { AdminItem } from "@/data/manager_sa/member/admins";
import ErrorText from "@/components/common/error_text/ErrorText";
import Toast from "@/components/common/toast/Toast";
import useAdminForm from "@/hooks/manager/sa/member/useAdminForm";

interface AdminFormProps {
  mode: "create" | "edit";
  initial_data?: AdminItem;
  admin_id?: string;
}

export default function AdminForm({ mode, initial_data, admin_id }: AdminFormProps) {
  const {
    form_data,
    error_messages,
    show_required_errors,
    show_toast,
    set_show_toast,
    is_loading,
    edit_admin_data,
    is_edit_mode,
    is_button_disabled,
    button_text,
    handle_input_change,
    handle_phone_key_down,
    handle_submit,
  } = useAdminForm({ mode, initial_data, admin_id });

  const form_class_name = is_edit_mode
    ? styles.edit_form || styles.register_form
    : styles.register_form;

  // 수정 모드: 로딩/에러 상태 처리
  if (mode === "edit") {
    if (is_loading) {
      return <div className={styles.error_message || ""}>로딩 중...</div>;
    }
    if (!edit_admin_data && !initial_data) {
      return <div className={styles.error_message || ""}>관리자를 찾을 수 없습니다.</div>;
    }
  }

  return (
    <>
      <Toast
        message={mode === "create" ? "등록되었습니다." : "저장되었습니다."}
        isOpen={show_toast}
        onClose={() => set_show_toast(false)}
        duration={2000}
      />
      <form className={form_class_name} onSubmit={handle_submit} noValidate>
        {/* 아이디 */}
        <div className={styles.form_field}>
          <label htmlFor="id" className={styles.form_label}>
            아이디
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={form_data.id}
            onChange={handle_input_change}
            disabled={is_edit_mode}
            readOnly={is_edit_mode}
            className={`${styles.form_input} ${
              is_edit_mode ? styles.form_input_disabled || "" : ""
            } ${
              show_required_errors && !is_edit_mode && !form_data.id.trim()
                ? styles.form_input_error
                : ""
            }`}
            placeholder=""
            minLength={4}
            maxLength={20}
          />
          {!is_edit_mode && <ErrorText message={error_messages.id} />}
        </div>

        {/* 비밀번호 */}
        <div className={styles.form_field}>
          <label htmlFor="password" className={styles.form_label}>
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form_data.password}
            onChange={handle_input_change}
            className={`${styles.form_input} ${
              show_required_errors && !is_edit_mode && !form_data.password.trim()
                ? styles.form_input_error
                : ""
            }`}
            placeholder={
              is_edit_mode
                ? "변경 시 8~16자 영문, 숫자, 특수문자 조합 입력"
                : "변경 시 8~16자 영문, 숫자, 특수문자 조합 입력"
            }
          />
          <ErrorText message={error_messages.password} />
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles.form_field}>
          <label htmlFor="password_confirm" className={styles.form_label}>
            비밀번호 확인
          </label>
          <input
            type="password"
            id="password_confirm"
            name="password_confirm"
            value={form_data.password_confirm}
            onChange={handle_input_change}
            className={`${styles.form_input} ${
              show_required_errors && !is_edit_mode && !form_data.password_confirm.trim()
                ? styles.form_input_error
                : ""
            }`}
            placeholder={is_edit_mode ? "변경 시 비밀번호 재입력" : "비밀번호 재입력"}
          />
          <ErrorText message={error_messages.password_confirm} />
        </div>

        {/* 이름 */}
        <div className={styles.form_field}>
          <label htmlFor="name" className={styles.form_label}>
            이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form_data.name}
            onChange={handle_input_change}
            className={`${styles.form_input} ${
              show_required_errors && !form_data.name.trim() ? styles.form_input_error : ""
            }`}
            placeholder=""
          />
        </div>

        {/* 휴대폰 번호 */}
        <div className={styles.form_field}>
          <label htmlFor="phone" className={styles.form_label}>
            휴대폰 번호
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form_data.phone}
            onChange={handle_input_change}
            onKeyDown={handle_phone_key_down}
            className={`${styles.form_input} ${
              show_required_errors && !form_data.phone.trim() ? styles.form_input_error : ""
            }`}
            placeholder="- 제외 입력"
            maxLength={13}
          />
          <ErrorText message={error_messages.phone} />
        </div>

        {/* 등록/저장 버튼 */}
        <button
          type="submit"
          className={`${styles.submit_button} ${
            is_button_disabled ? styles.submit_button_disabled : ""
          }`}
          disabled={is_button_disabled}
        >
          {button_text}
        </button>
      </form>
    </>
  );
}
