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
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { AdminItem } from "@/data/manager_sa/member/admins";
import { createSAAdmin, updateSAAdmin } from "@/lib/api/admin";
import { useSAAdminList } from "@/hooks/manager/sa/member/useSAAdminList";
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
  const queryClient = useQueryClient();
  const router = useRouter();

  // SA API 훅으로 관리자 목록 조회 (중복 검증용)
  const { adminMembers } = useSAAdminList();

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

  // 수정 모드: initial_data로 폼 초기화
  useEffect(() => {
    if (mode === "edit" && initial_data) {
      set_edit_admin_data(initial_data);
      set_form_data({
        id: initial_data.id,
        password: "",
        password_confirm: "",
        name: initial_data.name,
        phone: initial_data.phone || "",
      });
      set_is_loading(false);
    } else if (mode === "edit" && !initial_data) {
      set_is_loading(false);
    }
  }, [mode, initial_data]);

  // --- 필드별 검증 (API 데이터 기반) ---

  const is_id_duplicate = (id: string): boolean => {
    if (mode === "edit" && admin_id) {
      const current = adminMembers.find((a) => a.id === admin_id);
      if (current && current.id === id) return false;
    }
    return adminMembers.some((a) => a.id === id);
  };

  const is_phone_duplicate = (phone: string): boolean => {
    if (mode === "edit" && admin_id) {
      const current = adminMembers.find((a) => a.id === admin_id);
      if (current && current.phone === phone) return false;
    }
    return adminMembers.some((a) => a.phone === phone);
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

  const handle_submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_show_required_errors(true);

    // 동기적으로 에러를 계산하여 race condition 방지
    const new_errors: Record<string, string | undefined> = {};

    // ID 검증
    if (mode === "create") {
      const trimmed_id = form_data.id.trim();
      if (trimmed_id.length > 0 && is_valid_id(trimmed_id) && is_id_duplicate(trimmed_id)) {
        new_errors.id = "이미 사용 중인 아이디입니다.";
      }
    }

    // 비밀번호 검증
    const pw = form_data.password.trim();
    const pwc = form_data.password_confirm.trim();
    if (pw.length > 0 && !is_valid_password(pw)) {
      new_errors.password = "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.";
    }
    if (pwc.length > 0 && (!pw.length || pw !== pwc)) {
      new_errors.password_confirm = "비밀번호가 일치하지 않습니다.";
    }

    // 전화번호 검증
    const trimmed_phone = form_data.phone.trim();
    if (trimmed_phone.length > 0) {
      if (!is_valid_phone(trimmed_phone)) {
        new_errors.phone = "올바른 휴대폰 번호를 입력해 주세요.";
      } else if (is_phone_duplicate(trimmed_phone)) {
        new_errors.phone = "이미 가입된 휴대폰 번호입니다.";
      }
    }

    // 에러 state 업데이트
    set_error_messages(new_errors);

    // 동기적으로 계산한 에러로 유효성 검사
    if (!check_form_validity(form_data, new_errors, is_edit_mode)) return;

    try {
      if (mode === "create") {
        await createSAAdmin({
          email: form_data.id.trim(),
          password: form_data.password,
          passwordConfirm: form_data.password_confirm,
          name: form_data.name,
          phone: form_data.phone,
        });
      } else {
        if (!admin_id) return;
        const updateBody: {
          name: string;
          phone: string;
          password?: string;
          passwordConfirm?: string;
        } = {
          name: form_data.name,
          phone: form_data.phone,
        };
        if (form_data.password.trim()) {
          updateBody.password = form_data.password;
          updateBody.passwordConfirm = form_data.password_confirm;
        }
        await updateSAAdmin(Number(admin_id), updateBody);
      }

      // React Query 캐시 무효화 → 목록 페이지에서 최신 데이터 반영
      await queryClient.invalidateQueries({ queryKey: ["saAdminList"] });

      set_show_toast(true);
      setTimeout(() => {
        router.push("/manager_sa/member/admins");
      }, 2000);
    } catch (_error) {
      alert("처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
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
