/* ========================================
   관리자 폼 로직 훅
   ======================================== */

/**
 * useAdminForm
 *
 * 목적: AdminForm 컴포넌트의 폼 상태, 검증, 제출 로직을 관리하는 훅
 *
 * 사용 페이지:
 * - /manager_sa/member/admins/create (관리자 등록)
 * - /manager_sa/member/admins/[id]/edit (관리자 수정)
 */

import { useState, useEffect, useMemo } from "react";
import type { AdminItem } from "@/data/manager_sa/member/admins";
import {
  add_admin,
  update_admin,
  get_admin_list_from_storage,
} from "@/data/manager_sa/member/admins";
import { formatPhoneNumber } from "@/utils/formatting/phone";

// 폼 입력값 타입
export type AdminFormData = {
  id: string;
  password: string;
  password_confirm: string;
  name: string;
  phone: string;
};

interface UseAdminFormConfig {
  mode: "create" | "edit";
  initial_data?: AdminItem;
  admin_id?: string;
}

// --- 순수 검증 함수 ---

const is_valid_id = (id: string): boolean => {
  return /^[A-Za-z0-9]{4,20}$/.test(id);
};

const is_valid_password = (password: string): boolean => {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+])[A-Za-z\d!@#$%^&*()\-_=+]{8,16}$/.test(
    password
  );
};

const is_valid_phone = (phone: string): boolean => {
  return /^010-?\d{4}-?\d{4}$/.test(phone);
};

/**
 * 폼 전체 유효성을 순수 함수로 검사 (validate_form과 is_button_disabled 중복 제거)
 */
function check_form_validity(
  form_data: AdminFormData,
  error_messages: Record<string, string | undefined>,
  is_edit_mode: boolean
): boolean {
  const trimmed = {
    id: form_data.id.trim(),
    password: form_data.password.trim(),
    password_confirm: form_data.password_confirm.trim(),
    name: form_data.name.trim(),
    phone: form_data.phone.trim(),
  };

  // 에러 메시지가 있으면 무효
  if (
    error_messages.id ||
    error_messages.password ||
    error_messages.password_confirm ||
    error_messages.phone
  ) {
    return false;
  }

  // 필수 필드 체크
  if (!is_edit_mode && !trimmed.id) return false;
  if (!trimmed.password || !trimmed.password_confirm) return false;
  if (!trimmed.name || !trimmed.phone) return false;

  // 형식 검증
  if (trimmed.phone && !is_valid_phone(trimmed.phone)) return false;
  if (!is_edit_mode && trimmed.id && !is_valid_id(trimmed.id)) return false;
  if (trimmed.password && !is_valid_password(trimmed.password)) return false;

  // 비밀번호 일치 검증
  if (trimmed.password !== trimmed.password_confirm) return false;

  return true;
}

export default function useAdminForm({ mode, initial_data, admin_id }: UseAdminFormConfig) {
  const is_edit_mode = mode === "edit";

  // 폼 상태
  const [form_data, set_form_data] = useState<AdminFormData>({
    id: "",
    password: "",
    password_confirm: "",
    name: "",
    phone: "",
  });
  const [error_messages, set_error_messages] = useState<Record<string, string | undefined>>({});
  const [show_required_errors, set_show_required_errors] = useState(false);
  const [show_toast, set_show_toast] = useState(false);
  const [is_loading, set_is_loading] = useState(mode === "edit");
  const [edit_admin_data, set_edit_admin_data] = useState<AdminItem | null>(null);

  // 수정 모드: 기존 데이터 로드
  useEffect(() => {
    if (mode === "edit") {
      const stored_admin_list = get_admin_list_from_storage();
      const admin_data = admin_id
        ? stored_admin_list.find((admin) => admin.id === admin_id)
        : initial_data;

      if (admin_data) {
        set_edit_admin_data(admin_data);
        set_form_data({
          id: admin_data.id,
          password: "",
          password_confirm: "",
          name: admin_data.name,
          phone: admin_data.phone || "",
        });
      }
      set_is_loading(false);
    }
  }, [mode, admin_id, initial_data]);

  // --- 필드별 검증 (에러 메시지 설정 포함) ---

  const is_id_duplicate = (id: string): boolean => {
    const stored = get_admin_list_from_storage();
    if (mode === "edit" && admin_id) {
      const current = stored.find((a) => a.id === admin_id);
      if (current && current.id === id) return false;
    }
    return stored.some((a) => a.id === id);
  };

  const is_phone_duplicate = (phone: string): boolean => {
    const stored = get_admin_list_from_storage();
    if (mode === "edit" && admin_id) {
      const current = stored.find((a) => a.id === admin_id);
      if (current && current.phone === phone) return false;
    }
    return stored.some((a) => a.phone === phone);
  };

  const validate_id_field = (id: string) => {
    const trimmed = id.trim();
    let msg: string | undefined;
    if (
      mode === "create" &&
      trimmed.length > 0 &&
      is_valid_id(trimmed) &&
      is_id_duplicate(trimmed)
    ) {
      msg = "이미 사용 중인 아이디입니다.";
    }
    set_error_messages((prev) => ({ ...prev, id: msg }));
  };

  const validate_phone_field = (phone: string) => {
    const trimmed = phone.trim();
    let msg: string | undefined;
    if (trimmed.length > 0) {
      if (!is_valid_phone(trimmed)) {
        msg = "올바른 휴대폰 번호를 입력해 주세요.";
      } else if (is_phone_duplicate(trimmed)) {
        msg = "이미 가입된 휴대폰 번호입니다.";
      }
    }
    set_error_messages((prev) => ({ ...prev, phone: msg }));
  };

  const validate_password_fields = (data: AdminFormData) => {
    const pw = data.password.trim();
    const pwc = data.password_confirm.trim();
    let pw_msg: string | undefined;
    let pwc_msg: string | undefined;

    if (pw.length > 0 && !is_valid_password(pw)) {
      pw_msg = "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.";
    }
    if (pwc.length > 0) {
      if (!pw.length || pw !== pwc) {
        pwc_msg = "비밀번호가 일치하지 않습니다.";
      }
    }
    set_error_messages((prev) => ({ ...prev, password: pw_msg, password_confirm: pwc_msg }));
  };

  // --- 핸들러 ---

  const handle_input_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    set_form_data((prev) => {
      const processed = name === "phone" ? formatPhoneNumber(value) : value;
      const updated: AdminFormData = { ...prev, [name]: processed };

      if (name === "id") validate_id_field(value);
      else if (name === "password" || name === "password_confirm")
        validate_password_fields(updated);
      else if (name === "phone") validate_phone_field(processed);
      else if (error_messages[name]) {
        set_error_messages((prev_errors) => ({ ...prev_errors, [name]: undefined }));
      }

      return updated;
    });
  };

  const handle_phone_key_down = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];
    const is_ctrl = e.ctrlKey || e.metaKey;
    const is_ctrl_combo = ["a", "c", "v", "x"].includes(e.key.toLowerCase());
    if (!/^[0-9]$/.test(e.key) && !allowed.includes(e.key) && !(is_ctrl && is_ctrl_combo)) {
      e.preventDefault();
    }
  };

  const handle_submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_show_required_errors(true);

    // 에러 메시지 설정 side-effects 실행
    if (mode === "create") validate_id_field(form_data.id.trim());
    validate_password_fields(form_data);
    validate_phone_field(form_data.phone.trim());

    if (!check_form_validity(form_data, error_messages, is_edit_mode)) return;

    if (mode === "create") {
      add_admin({ id: form_data.id.trim(), name: form_data.name, phone: form_data.phone });
    } else {
      if (!admin_id) return;
      const updated = update_admin(admin_id, { name: form_data.name, phone: form_data.phone });
      if (!updated) return;
    }

    set_show_toast(true);
    setTimeout(() => {
      window.location.href = "/manager_sa/member/admins";
    }, 2000);
  };

  // 버튼 비활성화 여부 (중복 로직 → check_form_validity 재사용)
  const is_button_disabled = useMemo(
    () => !check_form_validity(form_data, error_messages, is_edit_mode),
    [form_data, error_messages, is_edit_mode]
  );

  return {
    form_data,
    error_messages,
    show_required_errors,
    show_toast,
    set_show_toast,
    is_loading,
    edit_admin_data,
    is_edit_mode,
    is_button_disabled,
    button_text: is_edit_mode ? "저장" : "등록",
    handle_input_change,
    handle_phone_key_down,
    handle_submit,
  };
}
