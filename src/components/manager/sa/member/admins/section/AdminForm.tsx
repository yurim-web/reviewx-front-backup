/* ========================================
   📝 관리자 등록/수정 폼 컴포넌트 (통합)
   ======================================== */

/**
 * 관리자 등록/수정 폼 컴포넌트 (통합)
 *
 * 목적: 관리자 등록 및 수정 페이지에서 공통으로 사용하는 폼 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_sa/member/admins/create (관리자 등록 페이지)
 * - /manager_sa/member/admins/[id]/edit (관리자 수정 페이지)
 *
 * 주요 기능:
 * - 아이디 입력 (등록 모드) / 표시 (수정 모드, 비활성화)
 * - 비밀번호 입력 및 확인
 * - 이름 입력
 * - 휴대폰 번호 입력
 * - 등록/저장 버튼
 *
 * React 핵심 개념:
 * - useState: 폼 입력값 상태 관리
 * - useEffect: 수정 모드일 때 기존 데이터 불러오기
 * - 이벤트 핸들러: onChange로 입력값 변경 처리
 * - 폼 제출: onSubmit으로 등록/수정 처리
 * - 조건부 렌더링: mode prop에 따라 다른 동작 수행
 *
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/manager_sa/member/admins/admin_register_form.module.css";
import type { AdminItem } from "@/data/manager_sa/member/admins";

interface AdminFormProps {
  // mode: "create" | "edit" - 등록 모드 또는 수정 모드
  mode: "create" | "edit";
  // initial_data: 수정 모드일 때 기존 관리자 데이터 (선택적)
  initial_data?: AdminItem;
  // admin_id: 수정 모드일 때 관리자 ID (선택적)
  admin_id?: string;
}

export default function AdminForm({
  mode,
  initial_data,
  admin_id,
}: AdminFormProps) {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
  // useRouter: Next.js에서 제공하는 클라이언트 사이드 라우팅 훅입니다
  const router = useRouter();

  // 폼 입력값 상태 관리
  // useState: React Hook으로 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] = useState(초기값)
  const [form_data, set_form_data] = useState({
    id: "",
    password: "",
    password_confirm: "",
    name: "",
    phone: "",
  });

  // 수정 모드일 때 기존 데이터를 폼에 로드
  // useEffect: 컴포넌트가 렌더링된 후 실행되는 훅입니다
  // 의존성 배열 [initial_data, mode]가 변경될 때마다 실행됩니다
  useEffect(() => {
    if (mode === "edit" && initial_data) {
      // 수정 모드이고 초기 데이터가 있으면 폼에 채웁니다
      set_form_data({
        id: initial_data.id,
        password: "", // 비밀번호는 보안상 빈 값으로 시작
        password_confirm: "",
        name: initial_data.name,
        phone: "010-1234-5678", // TODO: 실제 데이터에서 가져오기
      });
    }
  }, [mode, initial_data]);

  // 입력값 변경 핸들러
  // 이벤트 핸들러 함수로, 사용자가 입력 필드를 변경할 때 호출됩니다
  // e.target.name: 입력 필드의 name 속성 (예: "id", "password")
  // e.target.value: 입력 필드의 현재 값
  const handle_input_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    set_form_data((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  // 폼이 제출될 때 호출되는 함수입니다
  // e.preventDefault(): 기본 폼 제출 동작을 막아서 페이지 새로고침을 방지합니다
  const handle_submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "create") {
      // 등록 모드: 관리자 등록 API 호출
      // TODO: 관리자 등록 API 호출
      console.log("등록 데이터:", form_data);
      // 등록 성공 후 관리자 목록 페이지로 이동
      router.push("/manager_sa/member/admins");
    } else {
      // 수정 모드: 관리자 수정 API 호출
      // TODO: 관리자 수정 API 호출
      console.log("수정 데이터:", { admin_id, ...form_data });
      // 수정 성공 후 관리자 목록 페이지로 이동
      router.push("/manager_sa/member/admins");
    }
  };

  // 수정 모드이고 데이터가 없으면 에러 메시지 표시
  if (mode === "edit" && !initial_data) {
    return (
      <div className={styles.error_message || ""}>
        관리자를 찾을 수 없습니다.
      </div>
    );
  }

  // 등록 모드인지 수정 모드인지에 따라 다른 값 설정
  // 삼항 연산자: 조건 ? 값1 : 값2 형태로 조건에 따라 다른 값을 반환합니다
  const is_edit_mode = mode === "edit";
  const button_text = is_edit_mode ? "저장" : "등록";
  const form_class_name = is_edit_mode
    ? styles.edit_form || styles.register_form
    : styles.register_form;

  return (
    <form className={form_class_name} onSubmit={handle_submit}>
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
          }`}
          placeholder={is_edit_mode ? "" : "8~16자 영문, 숫자 조합 입력"}
          required={!is_edit_mode} // 등록 모드일 때만 필수
        />
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
          className={styles.form_input}
          placeholder={
            is_edit_mode
              ? "변경 시 8~16자 영문, 숫자, 특수문자 조합 입력"
              : "변경 시 8~16자 영문, 숫자, 특수문자 조합 입력"
          }
          required={!is_edit_mode} // 등록 모드일 때만 필수
        />
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
          className={styles.form_input}
          placeholder={
            is_edit_mode ? "변경 시 비밀번호 재입력" : "비밀번호 재입력"
          }
          required={!is_edit_mode} // 등록 모드일 때만 필수
        />
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
          className={styles.form_input}
          placeholder="이름 입력"
          required
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
          className={styles.form_input}
          placeholder="- 제외 입력"
          pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
          required
        />
      </div>

      {/* 등록/저장 버튼 */}
      <button type="submit" className={styles.submit_button}>
        {button_text}
      </button>
    </form>
  );
}
