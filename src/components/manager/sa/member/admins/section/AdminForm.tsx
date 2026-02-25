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

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/manager_sa/member/admins/admin_create_page.module.css";
import type { AdminItem } from "@/data/manager_sa/member/admins";
import {
  add_admin,
  update_admin,
  get_admin_list_from_storage,
} from "@/data/manager_sa/member/admins";
import ErrorText from "@/components/common/error_text/ErrorText";
import { formatPhoneNumber } from "@/utils/formatting/phone";
import Toast from "@/components/common/toast/Toast";

interface AdminFormProps {
  // mode: "create" | "edit" - 등록 모드 또는 수정 모드
  mode: "create" | "edit";
  // initial_data: 수정 모드일 때 기존 관리자 데이터 (선택적)
  initial_data?: AdminItem;
  // admin_id: 수정 모드일 때 관리자 ID (선택적)
  admin_id?: string;
}

export default function AdminForm({ mode, initial_data, admin_id }: AdminFormProps) {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
  // useRouter: Next.js에서 제공하는 클라이언트 사이드 라우팅 훅입니다
  const router = useRouter();

  // 폼 입력값 타입
  type AdminFormData = {
    id: string;
    password: string;
    password_confirm: string;
    name: string;
    phone: string;
  };

  // 폼 입력값 상태 관리
  // useState: React Hook으로 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] = useState(초기값)
  const [form_data, set_form_data] = useState<AdminFormData>({
    id: "",
    password: "",
    password_confirm: "",
    name: "",
    phone: "",
  });

  // 에러 메시지 상태 관리 (각 필드별 에러 메시지, 없으면 undefined)
  const [error_messages, set_error_messages] = useState<Record<string, string | undefined>>({});

  // 필수값 에러(빈 값)에 대한 테두리 표시 여부
  const [show_required_errors, set_show_required_errors] = useState<boolean>(false);

  // 토스트 메시지 표시 상태 관리
  const [show_toast, set_show_toast] = useState<boolean>(false);

  // 수정 모드일 때 localStorage에서 데이터 확인 및 폼에 로드
  const [is_loading, set_is_loading] = useState(mode === "edit");
  const [edit_admin_data, set_edit_admin_data] = useState<AdminItem | null>(null);

  // 수정 모드일 때 localStorage에서 관리자 데이터 가져오기 및 폼에 채우기
  // useEffect: 컴포넌트가 렌더링된 후 실행되는 훅입니다
  // 의존성 배열 [mode, admin_id, initial_data]가 변경될 때마다 실행됩니다
  useEffect(() => {
    if (mode === "edit") {
      // localStorage에서 관리자 데이터 가져오기
      const stored_admin_list = get_admin_list_from_storage();
      const admin_data = admin_id
        ? stored_admin_list.find((admin) => admin.id === admin_id)
        : initial_data;

      if (admin_data) {
        // 관리자 데이터를 상태에 저장
        set_edit_admin_data(admin_data);

        // 수정 모드이고 관리자 데이터가 있으면 폼에 채웁니다
        set_form_data({
          id: admin_data.id,
          password: "", // 비밀번호는 보안상 빈 값으로 시작
          password_confirm: "",
          name: admin_data.name,
          phone: admin_data.phone || "", // localStorage에서 가져온 휴대폰 번호
        });
      }
      set_is_loading(false);
    }
  }, [mode, admin_id, initial_data]);

  // 아이디 형식 검증 함수
  // 4~20자 영문+숫자 조합인지 확인합니다
  const is_valid_id = (id: string): boolean => {
    // 4~20자, 영문 + 숫자 조합
    const id_regex = /^[A-Za-z0-9]{4,20}$/;
    return id_regex.test(id);
  };

  // 아이디 중복 체크 함수
  // localStorage에 저장된 관리자 목록에서 동일한 아이디가 있는지 확인합니다
  const is_id_duplicate = (id: string): boolean => {
    // 수정 모드이고 현재 관리자의 아이디와 같으면 중복이 아님
    if (mode === "edit" && admin_id) {
      const stored_admin_list = get_admin_list_from_storage();
      const current_admin = stored_admin_list.find((admin) => admin.id === admin_id);
      if (current_admin && current_admin.id === id) {
        return false;
      }
    }

    // localStorage에서 관리자 목록 가져오기
    const stored_admin_list = get_admin_list_from_storage();
    // 동일한 아이디가 있는지 확인
    return stored_admin_list.some((admin) => admin.id === id);
  };

  // 휴대폰 번호 중복 체크 함수
  // localStorage에 저장된 관리자 목록에서 동일한 휴대폰 번호가 있는지 확인합니다
  const is_phone_duplicate = (phone: string): boolean => {
    // 수정 모드이고 현재 관리자의 휴대폰 번호와 같으면 중복이 아님
    if (mode === "edit" && admin_id) {
      const stored_admin_list = get_admin_list_from_storage();
      const current_admin = stored_admin_list.find((admin) => admin.id === admin_id);
      if (current_admin && current_admin.phone === phone) {
        return false;
      }
    }

    // localStorage에서 관리자 목록 가져오기
    const stored_admin_list = get_admin_list_from_storage();
    // 동일한 휴대폰 번호가 있는지 확인
    return stored_admin_list.some((admin) => admin.phone === phone);
  };

  // 아이디 유효성 검증 함수
  const validate_id_field = (id: string) => {
    const trimmed_id = id.trim();
    let id_error_message: string | undefined;

    // 등록 모드일 때만 아이디 검증
    if (mode === "create" && trimmed_id.length > 0) {
      // 아이디 형식 검증
      if (!is_valid_id(trimmed_id)) {
        // 형식이 맞지 않으면 에러 메시지 표시하지 않음
        // (placeholder에 안내가 있으므로 형식 에러는 표시하지 않음)
        // 형식이 맞지 않으면 중복 체크를 하지 않음
        id_error_message = undefined;
      } else {
        // 형식이 맞는 경우에만 중복 체크
        if (is_id_duplicate(trimmed_id)) {
          id_error_message = "이미 사용 중인 아이디입니다.";
        }
      }
    }

    set_error_messages((prev) => ({
      ...prev,
      id: id_error_message,
    }));
  };

  // 휴대폰 번호 형식 검증 함수
  const is_valid_phone = (phone: string): boolean => {
    // 010-1234-5678 형식 또는 01012345678 형식 (11자리)
    const phone_regex = /^010-?\d{4}-?\d{4}$/;
    return phone_regex.test(phone);
  };

  // 휴대폰 번호 유효성 검증 함수
  const validate_phone_field = (phone: string) => {
    const trimmed_phone = phone.trim();
    let phone_error_message: string | undefined;

    // 휴대폰 번호가 입력되어 있을 때만 검증
    if (trimmed_phone.length > 0) {
      // 휴대폰 번호 형식 검증
      if (!is_valid_phone(trimmed_phone)) {
        phone_error_message = "올바른 휴대폰 번호를 입력해 주세요.";
      } else {
        // 형식이 맞는 경우에만 중복 체크
        if (is_phone_duplicate(trimmed_phone)) {
          phone_error_message = "이미 가입된 휴대폰 번호입니다.";
        }
      }
    }

    set_error_messages((prev) => ({
      ...prev,
      phone: phone_error_message,
    }));
  };

  // 비밀번호 관련 필드 실시간 validation
  const validate_password_fields = (data: AdminFormData) => {
    const trimmed_password = data.password.trim();
    const trimmed_password_confirm = data.password_confirm.trim();

    const has_password = trimmed_password.length > 0;
    const has_password_confirm = trimmed_password_confirm.length > 0;

    let password_error_message: string | undefined;
    let password_confirm_error_message: string | undefined;

    // 비밀번호 형식 - 값이 있을 때만 검사
    if (has_password && !is_valid_password(trimmed_password)) {
      password_error_message =
        "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.";
    }

    // 비밀번호 확인 에러는 비밀번호 확인 필드에 입력이 시작되었을 때만 표시
    // 사용자가 비밀번호 확인 필드에 입력을 시작했을 때만 검증합니다
    if (has_password_confirm) {
      // 비밀번호 확인 필드에 값이 입력된 경우
      if (!has_password) {
        // 비밀번호가 입력되지 않은 경우
        password_confirm_error_message = "비밀번호가 일치하지 않습니다.";
      } else if (trimmed_password !== trimmed_password_confirm) {
        // 비밀번호와 비밀번호 확인이 일치하지 않는 경우
        password_confirm_error_message = "비밀번호가 일치하지 않습니다.";
      }
    }
    // 비밀번호 확인 필드에 입력이 없으면 에러 메시지를 표시하지 않음

    set_error_messages((prev) => ({
      ...prev,
      password: password_error_message,
      password_confirm: password_confirm_error_message,
    }));
  };

  // 휴대폰 번호 포맷팅 함수
  // 숫자만 추출하여 010-1234-5678 형식으로 포맷팅합니다
  const format_phone_input = (value: string): string => {
    // formatPhoneNumber 유틸리티 함수 사용
    return formatPhoneNumber(value);
  };

  // 입력값 변경 핸들러
  // 이벤트 핸들러 함수로, 사용자가 입력 필드를 변경할 때 호출됩니다
  // e.target.name: 입력 필드의 name 속성 (예: "id", "password")
  // e.target.value: 입력 필드의 현재 값
  const handle_input_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    set_form_data((prev) => {
      let processed_value = value;

      // 휴대폰 번호 필드는 자동 포맷팅 적용
      if (name === "phone") {
        // 숫자만 추출하여 포맷팅
        processed_value = format_phone_input(value);
      }

      const updated: AdminFormData = {
        ...prev,
        [name]: processed_value,
      };

      // 각 필드별 실시간 검증
      if (name === "id") {
        // 아이디 필드: 형식 및 중복 체크
        validate_id_field(value);
      } else if (name === "password" || name === "password_confirm") {
        // 비밀번호 / 비밀번호 확인 필드: 입력 즉시 검증
        validate_password_fields(updated);
      } else if (name === "phone") {
        // 휴대폰 번호 필드: 중복 체크 (포맷팅된 값으로 검증)
        validate_phone_field(processed_value);
      } else if (error_messages[name]) {
        // 그 외 필드는 입력 시 해당 필드 에러만 제거
        set_error_messages((prev_errors) => ({
          ...prev_errors,
          [name]: undefined,
        }));
      }

      return updated;
    });
  };

  // 휴대폰 번호 키 입력 핸들러
  // 숫자와 특정 키만 입력 가능하도록 제한합니다
  const handle_phone_key_down = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 허용할 키들 (커서 이동, 삭제 등)
    const allowed_keys = [
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

    // Ctrl, Cmd 키와 함께 사용되는 키 (복사, 붙여넣기 등)
    const is_ctrl_key = e.ctrlKey || e.metaKey;
    const is_allowed_key_with_ctrl = ["a", "c", "v", "x"].includes(e.key.toLowerCase());

    // 입력된 키가 숫자인지 확인
    const is_numeric = /^[0-9]$/.test(e.key);

    // 허용된 키가 아니면 입력 방지
    if (
      !is_numeric &&
      !allowed_keys.includes(e.key) &&
      !(is_ctrl_key && is_allowed_key_with_ctrl)
    ) {
      e.preventDefault();
    }
  };

  // 비밀번호 형식 검증 함수
  const is_valid_password = (password: string): boolean => {
    // 8~16자, 영문 + 숫자 + 특수문자(!@#$%^&*()-_=+) 조합
    const password_regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+])[A-Za-z\d!@#$%^&*()\-_=+]{8,16}$/;
    return password_regex.test(password);
  };

  // 폼 validation 함수
  // 제출 시 모든 필드의 유효성을 검사하고 에러 메시지를 설정합니다
  const validate_form = (): boolean => {
    const trimmed_id = form_data.id.trim();
    const trimmed_password = form_data.password.trim();
    const trimmed_password_confirm = form_data.password_confirm.trim();
    const trimmed_name = form_data.name.trim();
    const trimmed_phone = form_data.phone.trim();

    // 모든 필드의 유효성 검사 실행 (에러 메시지 설정)
    if (mode === "create") {
      validate_id_field(trimmed_id);
    }
    validate_password_fields(form_data);
    validate_phone_field(trimmed_phone);

    // 에러 메시지가 있는지 확인
    const has_id_error = !!error_messages.id;
    const has_password_error = !!error_messages.password;
    const has_password_confirm_error = !!error_messages.password_confirm;
    const has_phone_error = !!error_messages.phone;

    // 필수 필드 체크
    let has_required_error = false;

    // 등록 모드일 때만 아이디 필수
    if (!is_edit_mode && !trimmed_id) {
      has_required_error = true;
    }

    // 비밀번호/비밀번호 확인 필수 (등록/수정 모드 모두)
    if (!trimmed_password) {
      has_required_error = true;
    }
    if (!trimmed_password_confirm) {
      has_required_error = true;
    }

    // 이름은 항상 필수
    if (!trimmed_name) {
      has_required_error = true;
    }

    // 휴대폰 번호는 항상 필수
    if (!trimmed_phone) {
      has_required_error = true;
    }

    // 휴대폰 번호 형식 검증 (값이 있을 때만)
    if (trimmed_phone && !is_valid_phone(trimmed_phone)) {
      has_required_error = true;
    }

    // 등록 모드일 때 아이디 형식 검증
    if (!is_edit_mode && trimmed_id && !is_valid_id(trimmed_id)) {
      has_required_error = true;
    }

    // 비밀번호 형식 검증 (등록/수정 공통, 값이 있을 때만)
    const has_password = trimmed_password.length > 0;
    if (has_password && !is_valid_password(trimmed_password)) {
      has_required_error = true;
    }

    // 비밀번호 확인: 둘 중 하나라도 입력되어 있으면 일치 여부 확인
    const has_password_confirm = trimmed_password_confirm.length > 0;
    if (has_password || has_password_confirm) {
      if (!trimmed_password || !trimmed_password_confirm) {
        // 하나만 입력된 경우도 에러 처리
        has_required_error = true;
      } else if (trimmed_password !== trimmed_password_confirm) {
        has_required_error = true;
      }
    }

    // 에러가 있으면 false 반환
    return (
      !has_id_error &&
      !has_password_error &&
      !has_password_confirm_error &&
      !has_phone_error &&
      !has_required_error
    );
  };

  // 폼 제출 핸들러
  // 폼이 제출될 때 호출되는 함수입니다
  // e.preventDefault(): 기본 폼 제출 동작을 막아서 페이지 새로고침을 방지합니다
  const handle_submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 필수값 에러 테두리 표시 시작
    set_show_required_errors(true);

    // validation 체크
    if (!validate_form()) {
      return;
    }

    if (mode === "create") {
      // 등록 모드: localStorage에 관리자 추가
      // add_admin 함수를 사용하여 새로운 관리자를 추가합니다
      const new_admin = add_admin({
        id: form_data.id.trim(), // 사용자가 입력한 아이디 저장
        name: form_data.name,
        phone: form_data.phone, // 휴대폰 번호 저장
      });

      console.log("등록된 관리자:", new_admin);
      // Toast 메시지 표시
      set_show_toast(true);
      // Toast 메시지가 표시된 후 목록 페이지로 이동
      setTimeout(() => {
        window.location.href = "/manager_sa/member/admins";
      }, 2000); // Toast가 2초 동안 표시된 후 이동
    } else {
      // 수정 모드: localStorage에 저장된 관리자 정보 업데이트
      if (!admin_id) {
        console.error("관리자 ID가 없습니다.");
        return;
      }

      // update_admin 함수를 사용하여 관리자 정보를 수정합니다
      const updated_admin = update_admin(admin_id, {
        name: form_data.name,
        phone: form_data.phone, // 휴대폰 번호 수정
      });

      if (!updated_admin) {
        console.error("관리자를 찾을 수 없습니다.");
        return;
      }

      console.log("수정된 관리자:", updated_admin);
      // Toast 메시지 표시
      set_show_toast(true);
      // Toast 메시지가 표시된 후 목록 페이지로 이동
      setTimeout(() => {
        window.location.href = "/manager_sa/member/admins";
      }, 2000); // Toast가 2초 동안 표시된 후 이동
    }
  };

  // 등록 모드인지 수정 모드인지에 따라 다른 값 설정
  // 삼항 연산자: 조건 ? 값1 : 값2 형태로 조건에 따라 다른 값을 반환합니다
  const is_edit_mode = mode === "edit";
  const button_text = is_edit_mode ? "저장" : "등록";
  const form_class_name = is_edit_mode
    ? styles.edit_form || styles.register_form
    : styles.register_form;

  // 버튼 비활성화 여부 계산
  // useMemo: 계산 비용이 큰 값을 메모이제이션하여 성능을 최적화합니다
  // form_data와 error_messages가 변경될 때마다 버튼 활성화 여부를 재계산합니다
  // ⚠️ 중요: React Hooks 규칙에 따라 조건부 렌더링 이전에 모든 hooks를 호출해야 합니다
  const is_button_disabled = useMemo(() => {
    const trimmed_id = form_data.id.trim();
    const trimmed_password = form_data.password.trim();
    const trimmed_password_confirm = form_data.password_confirm.trim();
    const trimmed_name = form_data.name.trim();
    const trimmed_phone = form_data.phone.trim();

    const has_password = trimmed_password.length > 0;
    const has_password_confirm = trimmed_password_confirm.length > 0;

    // 에러 메시지가 있는지 확인
    const has_id_error = !!error_messages.id;
    const has_password_error = !!error_messages.password;
    const has_password_confirm_error = !!error_messages.password_confirm;
    const has_phone_error = !!error_messages.phone;

    // 필수 필드 체크
    let has_required_error = false;

    // 등록 모드일 때만 아이디 필수
    if (!is_edit_mode && !trimmed_id) {
      has_required_error = true;
    }

    // 비밀번호/비밀번호 확인 필수 (등록/수정 모드 모두)
    if (!trimmed_password) {
      has_required_error = true;
    }
    if (!trimmed_password_confirm) {
      has_required_error = true;
    }

    // 이름은 항상 필수
    if (!trimmed_name) {
      has_required_error = true;
    }

    // 휴대폰 번호는 항상 필수
    if (!trimmed_phone) {
      has_required_error = true;
    }

    // 휴대폰 번호 형식 검증 (값이 있을 때만)
    if (trimmed_phone && !is_valid_phone(trimmed_phone)) {
      has_required_error = true;
    }

    // 등록 모드일 때 아이디 형식 검증
    if (!is_edit_mode && trimmed_id && !is_valid_id(trimmed_id)) {
      has_required_error = true;
    }

    // 비밀번호 형식 검증 (등록/수정 공통, 값이 있을 때만)
    if (has_password && !is_valid_password(trimmed_password)) {
      has_required_error = true;
    }

    // 비밀번호 확인: 둘 중 하나라도 입력되어 있으면 일치 여부 확인
    if (has_password || has_password_confirm) {
      if (!trimmed_password || !trimmed_password_confirm) {
        // 하나만 입력된 경우도 에러 처리
        has_required_error = true;
      } else if (trimmed_password !== trimmed_password_confirm) {
        has_required_error = true;
      }
    }

    // 모든 검사를 통과했는지 확인
    const is_valid =
      !has_id_error &&
      !has_password_error &&
      !has_password_confirm_error &&
      !has_phone_error &&
      !has_required_error;

    // 등록/수정 모드 모두 검증 결과에 따라 비활성화
    return !is_valid;
  }, [form_data, error_messages, is_edit_mode]);

  // 수정 모드이고 데이터가 없으면 에러 메시지 표시
  // ⚠️ 중요: 조건부 렌더링은 모든 hooks 호출 이후에 수행해야 합니다
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
      {/* Toast 메시지 */}
      <Toast
        message={mode === "create" ? "등록되었습니다." : "저장되었습니다."}
        isOpen={show_toast}
        onClose={() => set_show_toast(false)}
        duration={2000}
      />
      <form className={form_class_name} onSubmit={handle_submit} noValidate>
        {/* 아이디 입력 필드 */}
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
            disabled={is_edit_mode} // 수정 모드일 때 비활성화
            readOnly={is_edit_mode} // 수정 모드일 때 읽기 전용
            className={`${styles.form_input} ${
              is_edit_mode ? styles.form_input_disabled || "" : ""
            } ${
              show_required_errors && !is_edit_mode && !form_data.id.trim()
                ? styles.form_input_error
                : ""
            }`}
            placeholder={is_edit_mode ? "" : ""}
            minLength={4}
            maxLength={20} // 시스템 아이디 규칙: 4자 이상 20자 이내
          />
          {/* 아이디 에러 메시지 표시 */}
          {!is_edit_mode && <ErrorText message={error_messages.id} />}
        </div>

        {/* 비밀번호 입력 필드 */}
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

        {/* 비밀번호 확인 입력 필드 */}
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

        {/* 이름 입력 필드 */}
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

        {/* 휴대폰 번호 입력 필드 */}
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
            maxLength={13} // 010-1234-5678 (13자)
          />
          {/* 휴대폰 번호 에러 메시지 표시 */}
          <ErrorText message={error_messages.phone} />
        </div>

        {/* 등록/저장 버튼 */}
        {/* disabled 속성: 버튼을 비활성화합니다. 모든 유효성 검사를 통과해야 활성화됩니다 */}
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
